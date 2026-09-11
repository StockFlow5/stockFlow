import { network } from "hardhat";
import { readFileSync } from "node:fs";

const addrs = JSON.parse(readFileSync(new URL("../deployed-addresses.json", import.meta.url), "utf8"));

async function main() {
  const { ethers } = await network.create();
  const [signer] = await ethers.getSigners();
  const me = await signer.getAddress();
  const log = (label: string, tx: { hash: string }) => console.log(label, tx.hash);

  const faucet = await ethers.getContractAt("MockFaucet", addrs.Faucet);
  const usdc = await ethers.getContractAt("MockERC20", addrs.USDC);
  const spyx = await ethers.getContractAt("MockERC20", addrs.stocks.SPYx);
  const sf = await ethers.getContractAt("MockERC20", addrs.SF);
  const susd = await ethers.getContractAt("sUSD", addrs.sUSD);
  const ssusd = await ethers.getContractAt("ssUSD", addrs.ssUSD);
  const psm = await ethers.getContractAt("PSM", addrs.PSM);
  const borrow = await ethers.getContractAt("Borrow", addrs.Borrow);
  const vault = await ethers.getContractAt("StakingVault", addrs.StakingVault);
  const lock = await ethers.getContractAt("SFLock", addrs.SFLock);

  if ((await faucet.lastDrip(me)) === 0n) log("faucet.drip", await (await faucet.drip()).wait());
  log("sf.mint", await (await sf.mint(me, ethers.parseEther("10000"))).wait());
  console.log("USDC:", ethers.formatUnits(await usdc.balanceOf(me), 18), "SPYx:", ethers.formatEther(await spyx.balanceOf(me)));

  const usdcAmt = ethers.parseEther("100");
  await (await usdc.approve(addrs.PSM, usdcAmt)).wait();
  log("psm.mint", await (await psm.mint(addrs.USDC, usdcAmt)).wait());
  console.log("sUSD after PSM mint:", ethers.formatEther(await susd.balanceOf(me)));

  const spyAmt = ethers.parseEther("1");
  await (await spyx.approve(addrs.Borrow, spyAmt)).wait();
  log("borrow.depositCollateral", await (await borrow.depositCollateral(addrs.stocks.SPYx, spyAmt)).wait());
  const maxDebt = await borrow.getMaxDebt(me);
  console.log("maxDebt:", ethers.formatEther(maxDebt));
  log("borrow.mintStable", await (await borrow.mintStable(maxDebt / 2n)).wait());
  console.log("sUSD after borrow:", ethers.formatEther(await susd.balanceOf(me)), "HF:", (await borrow.healthFactor(me)).toString());

  const stakeAmt = ethers.parseEther("50");
  await (await susd.approve(addrs.StakingVault, stakeAmt)).wait();
  log("vault.deposit", await (await vault.deposit(stakeAmt)).wait());
  console.log("ssUSD:", ethers.formatEther(await ssusd.balanceOf(me)));

  const sfAmt = ethers.parseEther("100");
  await (await sf.approve(addrs.SFLock, sfAmt)).wait();
  log("sflock.lock", await (await lock.lock(sfAmt)).wait());
  console.log("votingPower:", ethers.formatEther(await lock.votingPower(me)));

  console.log("ETH left:", ethers.formatEther(await ethers.provider.getBalance(me)));
}

main().catch((e) => { console.error(e); process.exit(1); });
