import { network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

function addr(a: { getAddress(): Promise<string> }) {
  return a.getAddress();
}

async function main() {
  const { ethers } = await network.create();
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("Deploying with:", deployerAddress);

  const balance = await deployer.provider.getBalance(deployerAddress);
  if (balance === 0n) {
    console.error("Deployer balance is 0. Fund the address with testnet ETH first.");
    process.exit(1);
  }

  // Core stablecoins
  const sUSD = await ethers.getContractFactory("sUSD");
  const susd = await (await sUSD.deploy()).waitForDeployment();
  console.log("sUSD deployed:", await addr(susd));

  const ssUSD = await ethers.getContractFactory("ssUSD");
  const ssusd = await (await ssUSD.deploy()).waitForDeployment();
  console.log("ssUSD deployed:", await addr(ssusd));

  const SF = await ethers.getContractFactory("MockERC20");
  const sf = await (await SF.deploy("StockFlow Governance", "SF", 18)).waitForDeployment();
  console.log("SF deployed:", await addr(sf));

  // Reserve tokens for PSM
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const usdc = await (await MockERC20.deploy("Mock USDC", "mUSDC", 18)).waitForDeployment();
  const usdg = await (await MockERC20.deploy("Mock USDG", "mUSDG", 18)).waitForDeployment();
  console.log("USDC reserve:", await addr(usdc));
  console.log("USDG reserve:", await addr(usdg));

  // Tokenized stock tokens for Borrow collateral
  const stocks = {
    SPYx: await (await MockERC20.deploy("S&P 500 ETF Token", "SPYx", 18)).waitForDeployment(),
    QQQx: await (await MockERC20.deploy("Invesco QQQ Trust Token", "QQQx", 18)).waitForDeployment(),
    AAPLx: await (await MockERC20.deploy("Apple Inc. Token", "AAPLx", 18)).waitForDeployment(),
    MSFTx: await (await MockERC20.deploy("Microsoft Corp. Token", "MSFTx", 18)).waitForDeployment(),
    GOOGLx: await (await MockERC20.deploy("Alphabet Inc. Token", "GOOGLx", 18)).waitForDeployment(),
    NVDAx: await (await MockERC20.deploy("NVIDIA Corp. Token", "NVDAx", 18)).waitForDeployment(),
    TSLAx: await (await MockERC20.deploy("Tesla Inc. Token", "TSLAx", 18)).waitForDeployment(),
  };
  for (const [sym, c] of Object.entries(stocks)) {
    console.log(`${sym}:`, await addr(c));
  }

  // Price feeds
  const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
  const stockPrices: Record<string, bigint> = {
    SPYx: 550_00000000n,
    QQQx: 490_00000000n,
    AAPLx: 220_00000000n,
    MSFTx: 420_00000000n,
    GOOGLx: 170_00000000n,
    NVDAx: 130_00000000n,
    TSLAx: 240_00000000n,
  };
  const priceFeeds: Record<string, any> = {};
  for (const [sym, price] of Object.entries(stockPrices)) {
    const feed = await (await MockPriceFeed.deploy()).waitForDeployment();
    await feed.setPrice(price);
    priceFeeds[sym] = feed;
    console.log(`PriceFeed ${sym}:`, await addr(feed), "price", price.toString());
  }

  // PSM
  const PSM = await ethers.getContractFactory("PSM");
  const psm = await (await PSM.deploy(await addr(susd))).waitForDeployment();
  console.log("PSM deployed:", await addr(psm));

  // Borrow
  const Borrow = await ethers.getContractFactory("Borrow");
  const borrow = await (await Borrow.deploy(await addr(susd))).waitForDeployment();
  console.log("Borrow deployed:", await addr(borrow));

  // Staking vault
  const StakingVault = await ethers.getContractFactory("StakingVault");
  const vault = await (await StakingVault.deploy(await addr(susd), await addr(ssusd))).waitForDeployment();
  console.log("StakingVault deployed:", await addr(vault));

  // SFLock
  const SFLock = await ethers.getContractFactory("SFLock");
  const sfLock = await (await SFLock.deploy(await addr(sf))).waitForDeployment();
  console.log("SFLock deployed:", await addr(sfLock));

  // Faucet (includes reserves and stock tokens for convenience)
  const faucetTokenList = [usdc, usdg, ...Object.values(stocks)];
  const faucetTokenAddrs = await Promise.all(faucetTokenList.map((c) => addr(c)));
  const MockFaucet = await ethers.getContractFactory("MockFaucet");
  const faucet = await (await MockFaucet.deploy(faucetTokenAddrs)).waitForDeployment();
  console.log("MockFaucet deployed:", await addr(faucet));

  // Permissions
  const MINTER_ROLE = await susd.MINTER_ROLE();
  await (await susd.grantRole(MINTER_ROLE, await addr(psm))).wait();
  await (await susd.grantRole(MINTER_ROLE, await addr(borrow))).wait();
  await (await ssusd.grantRole(await ssusd.MINTER_ROLE(), await addr(vault))).wait();

  // PSM reserves
  await (await psm.addReserve(await addr(usdc))).wait();
  await (await psm.addReserve(await addr(usdg))).wait();

  // Seed PSM reserves so redeem is possible
  for (const c of [usdc, usdg]) {
    await (await c.mint(await addr(psm), 1_000_000n * 10n ** 18n)).wait();
  }

  // Borrow assets & price feeds
  for (const [sym, c] of Object.entries(stocks)) {
    const ltv = 7000n; // 70%
    const liq = 8000n; // 80%
    await (await borrow.setAsset(await addr(c), ltv, liq, await addr(priceFeeds[sym]))).wait();
  }

  // Save addresses
  const addresses = {
    sUSD: await addr(susd),
    ssUSD: await addr(ssusd),
    SF: await addr(sf),
    PSM: await addr(psm),
    Borrow: await addr(borrow),
    StakingVault: await addr(vault),
    SFLock: await addr(sfLock),
    Faucet: await addr(faucet),
    USDC: await addr(usdc),
    USDG: await addr(usdg),
    stocks: Object.fromEntries(await Promise.all(Object.entries(stocks).map(async ([k, v]) => [k, await addr(v)]))),
    priceFeeds: Object.fromEntries(await Promise.all(Object.entries(priceFeeds).map(async ([k, v]) => [k, await addr(v)]))),
  };

  const outPath = path.join(process.cwd(), "deployed-addresses.json");
  fs.writeFileSync(outPath, JSON.stringify(addresses, null, 2));
  console.log("Addresses saved to", outPath);
  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
