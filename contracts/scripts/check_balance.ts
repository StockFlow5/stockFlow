import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create();
  for (const a of [
    "0x309257Ca0550DA95E81C6FD05fF93E7229D2A8e3",
    "0x21B9aa9C04799426B19E1657EC1d9d003EB8831A",
  ]) {
    const bal = await ethers.provider.getBalance(a);
    console.log(a, bal.toString());
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
