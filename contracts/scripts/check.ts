import { network } from "hardhat";

async function main() {
  const { ethers, networkName } = await network.create();
  const [deployer] = await ethers.getSigners();
  console.log("network:", networkName);
  console.log("deployer:", await deployer.getAddress());
  console.log("balance:", (await deployer.provider.getBalance(await deployer.getAddress())).toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
