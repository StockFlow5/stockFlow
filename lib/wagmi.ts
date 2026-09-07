import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  network: "robinhood",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.chain.robinhood.com"],
      webSocket: ["wss://feed.mainnet.chain.robinhood.com"],
    },
    public: {
      http: ["https://rpc.mainnet.chain.robinhood.com"],
      webSocket: ["wss://feed.mainnet.chain.robinhood.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://robinhoodchain.blockscout.com",
    },
  },
  testnet: false,
});

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  network: "robinhood-testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.chain.robinhood.com"],
    },
    public: {
      http: ["https://rpc.testnet.chain.robinhood.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.testnet.chain.robinhood.com",
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "StockFlow",
  projectId:
    process.env.NEXT_PUBLIC_WC_PROJECT_ID ||
    "REPLACE_WITH_YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [robinhoodChain, robinhoodTestnet],
  ssr: true,
});
