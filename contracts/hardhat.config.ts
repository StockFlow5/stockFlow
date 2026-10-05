import { defineConfig, configVariable } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import "dotenv/config";

export default defineConfig({
  plugins: [hardhatEthers, hardhatVerify],
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  verify: {
    etherscan: { enabled: false },
    blockscout: { enabled: true },
  },
  chainDescriptors: {
    4663: {
      name: "Robinhood Chain",
      blockExplorers: {
        blockscout: {
          name: "Robinhood Chain Explorer",
          url: "https://robinhoodchain.blockscout.com",
          apiUrl: "https://robinhoodchain.blockscout.com/api",
        },
      },
    },
    46630: {
      name: "Robinhood Chain Testnet",
      blockExplorers: {
        blockscout: {
          name: "Robinhood Testnet Explorer",
          url: "https://explorer.testnet.chain.robinhood.com",
          apiUrl: "https://explorer.testnet.chain.robinhood.com/api",
        },
      },
    },
  },
  networks: {
    robinhoodMainnet: {
      type: "http",
      chainType: "l1",
      chainId: 4663,
      url: configVariable("RH_MAINNET_RPC"),
      accounts: [configVariable("DEPLOYER_KEY")],
      ethers: {
        waitForTransactionReceipt: true,
      },
    },
    robinhoodTestnet: {
      type: "http",
      chainType: "l1",
      chainId: 46630,
      url: configVariable("RH_TESTNET_RPC"),
      accounts: [configVariable("DEPLOYER_KEY")],
      ethers: {
        waitForTransactionReceipt: true,
      },
    },
  },
});
