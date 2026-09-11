import { network } from "hardhat";
async function main() {
  // override network to use mainnet RPC for balance check
  const { ethers } = await network.create();
  const [deployer] = await ethers.getSigners();
  const addrs = ['0x21B9aa9C04799426B19E1657EC1d9d003EB8831A', '0x309257Ca0550DA95E81C6FD05fF93E7229D2A8e3', '0x31143B4170C0fd281d8963Ad12a72cDAB212f64d'];
  for (const a of addrs) {
    const bal = await ethers.provider.getBalance(a);
    console.log(a, bal.toString());
  }
}
main().catch(e=>{console.error(e);process.exit(1)});
