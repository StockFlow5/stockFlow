"use client";

import { useAccount, useReadContracts } from "wagmi";
import { formatEther, type Address } from "viem";
import {
  ADDRESSES,
  BORROW_ABI,
  MOCKERC20_ABI,
  SFLOCK_ABI,
  STAKINGVAULT_ABI,
  TESTNET_CHAIN_ID,
  type StockSymbol,
} from "./contracts";

const chainId = TESTNET_CHAIN_ID;
const ZERO = "0x0000000000000000000000000000000000000000" as Address;
const toNum = (v: unknown) => (typeof v === "bigint" ? Number(formatEther(v)) : 0);

export const STOCK_SYMBOLS = Object.keys(ADDRESSES.stocks) as StockSymbol[];

export interface StockStats {
  symbol: StockSymbol;
  address: Address;
  price: number;
  locked: number;
  lockedValue: number;
  maxLTV: number;
  liqThreshold: number;
}

export function useProtocolStats() {
  const { address, isConnected, chainId: current } = useAccount();
  const live = isConnected && current === chainId && !!address;
  const user = (address ?? ZERO) as Address;

  const supply = (a: Address) =>
    ({ address: a, abi: MOCKERC20_ABI, functionName: "totalSupply", chainId }) as const;
  const balance = (a: Address, who: Address) =>
    ({ address: a, abi: MOCKERC20_ABI, functionName: "balanceOf", args: [who], chainId }) as const;

  const globalReads = [
    supply(ADDRESSES.sUSD),
    supply(ADDRESSES.ssUSD),
    supply(ADDRESSES.SF),
    { address: ADDRESSES.StakingVault, abi: STAKINGVAULT_ABI, functionName: "totalDeposited", chainId } as const,
    { address: ADDRESSES.SFLock, abi: SFLOCK_ABI, functionName: "totalLocked", chainId } as const,
    balance(ADDRESSES.USDC, ADDRESSES.PSM),
    balance(ADDRESSES.USDG, ADDRESSES.PSM),
  ];
  const G = globalReads.length;

  const stockReads = STOCK_SYMBOLS.flatMap((s) => {
    const a = ADDRESSES.stocks[s];
    return [
      balance(a, ADDRESSES.Borrow),
      { address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName: "getAssetPrice", args: [a], chainId } as const,
      { address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName: "assetParams", args: [a], chainId } as const,
    ];
  });
  const S = G + stockReads.length;

  const userReads = [
    { address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName: "healthFactor", args: [user], chainId } as const,
    { address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName: "debt", args: [user], chainId } as const,
    { address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName: "getCollateralValue", args: [user], chainId } as const,
    balance(ADDRESSES.ssUSD, user),
    { address: ADDRESSES.SFLock, abi: SFLOCK_ABI, functionName: "locked", args: [user], chainId } as const,
    balance(ADDRESSES.sUSD, user),
  ];

  const reads = useReadContracts({
    contracts: [...globalReads, ...stockReads, ...userReads],
    query: { refetchInterval: 15_000 },
  });

  const r = reads.data ?? [];
  const res = (i: number) => r[i]?.result;

  const stocks: StockStats[] = STOCK_SYMBOLS.map((symbol, i) => {
    const base = G + i * 3;
    const locked = toNum(res(base));
    const priceRaw = res(base + 1);
    const price = typeof priceRaw === "bigint" ? Number(priceRaw) / 1e8 : 0;
    const params = res(base + 2) as readonly [boolean, bigint, bigint] | undefined;
    return {
      symbol,
      address: ADDRESSES.stocks[symbol],
      price,
      locked,
      lockedValue: locked * price,
      maxLTV: params ? Number(params[1]) / 100 : 0,
      liqThreshold: params ? Number(params[2]) / 100 : 0,
    };
  });

  const susdSupply = toNum(res(0));
  const ssusdSupply = toNum(res(1));
  const sfSupply = toNum(res(2));
  const vaultDeposits = toNum(res(3));
  const sfLocked = toNum(res(4));
  const psmUsdc = toNum(res(5));
  const psmUsdg = toNum(res(6));
  const psmReserves = psmUsdc + psmUsdg;
  const collateralValue = stocks.reduce((a, s) => a + s.lockedValue, 0);
  const tvl = psmReserves + collateralValue + vaultDeposits;
  const backingRatio = susdSupply > 0 ? ((psmReserves + collateralValue) / susdSupply) * 100 : 0;

  const hfRaw = res(S);
  const MAX = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  const healthFactor =
    typeof hfRaw === "bigint" ? (hfRaw === MAX ? Infinity : Number(formatEther(hfRaw))) : Infinity;

  const userStats = {
    healthFactor,
    debt: toNum(res(S + 1)),
    collateralValue: toNum(res(S + 2)),
    ssusd: toNum(res(S + 3)),
    sfLocked: toNum(res(S + 4)),
    susd: toNum(res(S + 5)),
  };

  return {
    live,
    loading: reads.isLoading,
    error: reads.isError,
    refetch: reads.refetch,
    susdSupply,
    ssusdSupply,
    sfSupply,
    vaultDeposits,
    sfLocked,
    psmUsdc,
    psmUsdg,
    psmReserves,
    collateralValue,
    tvl,
    backingRatio,
    stocks,
    user: userStats,
  };
}
