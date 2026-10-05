import { network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

/**
 * Mainnet deploy: core protocol only (sUSD, ssUSD, PSM, Borrow, StakingVault, SFLock).
 * No mock tokens, no faucet, no mock price feeds, no seeded reserves.
 * Reads real asset/oracle addresses from mainnet.config.json and transfers ownership to `owner`.
 * Run with DRY_RUN=1 to validate config and estimate without sending transactions.
 */

const MAINNET_CHAIN_ID = 4663n;
const BPS = 10_000;

interface CollateralCfg { token: string; priceFeed: string; maxLTV: number; liqThreshold: number }
interface Cfg {
  owner: string;
  sfToken: string;
  reserves: Record<string, string>;
  collateral: Record<string, CollateralCfg>;
}

const isAddr = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a);

function loadConfig(): Cfg {
  const p = path.join(process.cwd(), "mainnet.config.json");
  if (!fs.existsSync(p)) throw new Error("mainnet.config.json missing (copy mainnet.config.example.json)");
  const cfg = JSON.parse(fs.readFileSync(p, "utf8")) as Cfg;
  const bad: string[] = [];
  if (!isAddr(cfg.owner)) bad.push("owner");
  if (!isAddr(cfg.sfToken)) bad.push("sfToken");
  for (const [k, v] of Object.entries(cfg.reserves ?? {})) if (!isAddr(v)) bad.push(`reserves.${k}`);
  for (const [k, c] of Object.entries(cfg.collateral ?? {})) {
    if (!isAddr(c.token)) bad.push(`collateral.${k}.token`);
    if (!isAddr(c.priceFeed)) bad.push(`collateral.${k}.priceFeed`);
    if (!(c.maxLTV > 0 && c.maxLTV < c.liqThreshold && c.liqThreshold < BPS)) bad.push(`collateral.${k}.ltv/liq`);
  }
  if (!Object.keys(cfg.reserves ?? {}).length) bad.push("reserves (empty)");
  if (!Object.keys(cfg.collateral ?? {}).length) bad.push("collateral (empty)");
  if (bad.length) throw new Error(`Invalid mainnet.config.json fields: ${bad.join(", ")}`);
  return cfg;
}

async function main() {
  const dry = process.env.DRY_RUN === "1";
  const cfg = loadConfig();
  const { ethers } = await network.create();
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const net = await deployer.provider.getNetwork();
  if (net.chainId !== MAINNET_CHAIN_ID) throw new Error(`Wrong chain ${net.chainId}, expected ${MAINNET_CHAIN_ID}`);

  // Sanity-check external contracts exist on-chain
  for (const [label, a] of [
    ["sfToken", cfg.sfToken],
    ...Object.entries(cfg.reserves).map(([k, v]) => [`reserve ${k}`, v]),
    ...Object.entries(cfg.collateral).flatMap(([k, c]) => [[`collateral ${k}`, c.token], [`feed ${k}`, c.priceFeed]]),
  ] as [string, string][]) {
    const code = await deployer.provider.getCode(a);
    if (code === "0x") throw new Error(`${label} ${a} has no code on mainnet`);
  }
  for (const [k, a] of Object.entries(cfg.reserves)) {
    const dec: bigint = await (await ethers.getContractAt("MockERC20", a)).decimals();
    if (dec !== 18n) throw new Error(`reserve ${k} has ${dec} decimals; PSM assumes 18 (1:1). Fix PSM before mainnet.`);
  }
  for (const [k, c] of Object.entries(cfg.collateral)) {
    const dec: bigint = await (await ethers.getContractAt("MockERC20", c.token)).decimals();
    if (dec !== 18n) throw new Error(`collateral ${k} has ${dec} decimals; Borrow assumes 18.`);
    const feed = await ethers.getContractAt("MockPriceFeed", c.priceFeed);
    const fdec: bigint = await feed.decimals();
    if (fdec !== 8n) throw new Error(`feed ${k} has ${fdec} decimals; Borrow assumes 8.`);
    const [, answer, , updatedAt] = await feed.latestRoundData();
    if (answer <= 0n) throw new Error(`feed ${k} returned non-positive price`);
    const age = BigInt(Math.floor(Date.now() / 1000)) - updatedAt;
    if (age > 86400n) throw new Error(`feed ${k} stale (${age}s old)`);
  }

  const balance = await deployer.provider.getBalance(deployerAddress);
  console.log(`Deployer ${deployerAddress} balance ${ethers.formatEther(balance)} ETH on chain ${net.chainId}`);
  console.log(`Owner -> ${cfg.owner}`);
  console.log(`Reserves: ${Object.keys(cfg.reserves).join(", ")}`);
  console.log(`Collateral: ${Object.keys(cfg.collateral).join(", ")}`);
  if (dry) {
    console.log("DRY_RUN=1: config valid, no transactions sent.");
    return;
  }
  if (balance === 0n) throw new Error("Deployer has no ETH");

  const susd = await (await (await ethers.getContractFactory("sUSD")).deploy()).waitForDeployment();
  const ssusd = await (await (await ethers.getContractFactory("ssUSD")).deploy()).waitForDeployment();
  const psm = await (await (await ethers.getContractFactory("PSM")).deploy(await susd.getAddress())).waitForDeployment();
  const borrow = await (await (await ethers.getContractFactory("Borrow")).deploy(await susd.getAddress())).waitForDeployment();
  const vault = await (
    await (await ethers.getContractFactory("StakingVault")).deploy(await susd.getAddress(), await ssusd.getAddress())
  ).waitForDeployment();
  const sfLock = await (await (await ethers.getContractFactory("SFLock")).deploy(cfg.sfToken)).waitForDeployment();

  const MINTER = await susd.MINTER_ROLE();
  await (await susd.grantRole(MINTER, await psm.getAddress())).wait();
  await (await susd.grantRole(MINTER, await borrow.getAddress())).wait();
  await (await ssusd.grantRole(await ssusd.MINTER_ROLE(), await vault.getAddress())).wait();

  for (const a of Object.values(cfg.reserves)) await (await psm.addReserve(a)).wait();
  for (const c of Object.values(cfg.collateral)) {
    await (await borrow.setAsset(c.token, c.maxLTV, c.liqThreshold, c.priceFeed)).wait();
  }

  // Hand over control
  const ADMIN = await susd.DEFAULT_ADMIN_ROLE();
  for (const t of [susd, ssusd]) {
    await (await t.grantRole(ADMIN, cfg.owner)).wait();
    await (await t.renounceRole(ADMIN, deployerAddress)).wait();
  }
  for (const c of [psm, borrow, vault, sfLock]) await (await c.transferOwnership(cfg.owner)).wait();

  const out = {
    chainId: Number(MAINNET_CHAIN_ID),
    sUSD: await susd.getAddress(),
    ssUSD: await ssusd.getAddress(),
    SF: cfg.sfToken,
    PSM: await psm.getAddress(),
    Borrow: await borrow.getAddress(),
    StakingVault: await vault.getAddress(),
    SFLock: await sfLock.getAddress(),
    reserves: cfg.reserves,
    stocks: Object.fromEntries(Object.entries(cfg.collateral).map(([k, c]) => [k, c.token])),
    priceFeeds: Object.fromEntries(Object.entries(cfg.collateral).map(([k, c]) => [k, c.priceFeed])),
  };
  const outPath = path.join(process.cwd(), "deployed-addresses.mainnet.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log("Saved", outPath);
  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
