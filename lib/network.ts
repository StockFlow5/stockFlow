import type { Address } from "viem";
import { ADDRESSES as TESTNET_ADDRESSES, TESTNET_CHAIN_ID, type StockSymbol } from "./contracts";
import mainnetJson from "./addresses.mainnet.json";

export const MAINNET_CHAIN_ID = 4663 as const;

export type ProtocolAddresses = {
  sUSD: Address;
  ssUSD: Address;
  SF: Address;
  PSM: Address;
  Borrow: Address;
  StakingVault: Address;
  SFLock: Address;
  Faucet: Address;
  USDC: Address;
  USDG: Address;
  stocks: Partial<Record<StockSymbol, Address>>;
  priceFeeds: Partial<Record<StockSymbol, Address>>;
};

const NETWORKS = {
  testnet: {
    chainId: TESTNET_CHAIN_ID,
    name: "Robinhood Chain Testnet",
    shortName: "Robinhood Testnet",
    explorer: "https://explorer.testnet.chain.robinhood.com",
    isTestnet: true,
    addresses: TESTNET_ADDRESSES as unknown as ProtocolAddresses,
  },
  mainnet: {
    chainId: MAINNET_CHAIN_ID,
    name: "Robinhood Chain",
    shortName: "Robinhood Chain",
    explorer: "https://robinhoodchain.blockscout.com",
    isTestnet: false,
    addresses: mainnetJson as unknown as ProtocolAddresses,
  },
} as const;

type NetworkKey = keyof typeof NETWORKS;

const key: NetworkKey =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "mainnet" : "testnet";

export const NETWORK = NETWORKS[key];
export const CHAIN_ID: 4663 | 46630 = NETWORK.chainId;
export const EXPLORER = NETWORK.explorer;
export const IS_TESTNET = NETWORK.isTestnet;
export const ADDRESSES: ProtocolAddresses = NETWORK.addresses;
export const STOCK_SYMBOLS = Object.keys(ADDRESSES.stocks) as StockSymbol[];
export const stockAddress = (s: StockSymbol): Address =>
  ADDRESSES.stocks[s] ?? "0x0000000000000000000000000000000000000000";
