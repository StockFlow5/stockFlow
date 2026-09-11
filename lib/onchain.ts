"use client";

import { useCallback, useState } from "react";
import { useAccount, useConfig, useReadContracts } from "wagmi";
import { readContract, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { formatEther, parseEther, type Address, type Hash } from "viem";
import {
  ADDRESSES,
  BORROW_ABI,
  MOCKERC20_ABI,
  MOCKFAUCET_ABI,
  PSM_ABI,
  SFLOCK_ABI,
  STAKINGVAULT_ABI,
  TESTNET_CHAIN_ID,
  type StockSymbol,
} from "./contracts";

export const EXPLORER = "https://explorer.testnet.chain.robinhood.com";
export const txUrl = (hash: Hash) => `${EXPLORER}/tx/${hash}`;

const chainId = TESTNET_CHAIN_ID;
const toNum = (v: bigint | undefined) => (v === undefined ? 0 : Number(formatEther(v)));

export type OnchainAction =
  | { kind: "psmMint"; amount: string }
  | { kind: "psmRedeem"; amount: string }
  | { kind: "borrow"; stock: StockSymbol; collateral: string; amount: string }
  | { kind: "stake"; amount: string }
  | { kind: "unstake"; amount: string }
  | { kind: "lock"; amount: string }
  | { kind: "unlock"; amount: string }
  | { kind: "faucet" };

export type TxState =
  | { status: "idle" }
  | { status: "approving" }
  | { status: "pending"; hash?: Hash }
  | { status: "success"; hash: Hash }
  | { status: "error"; message: string };

export function useOnchain() {
  const { address, isConnected, chainId: current } = useAccount();
  const config = useConfig();
  const live = isConnected && current === chainId && !!address;
  const user = (address ?? "0x0000000000000000000000000000000000000000") as Address;

  const erc20 = (a: Address) =>
    ({ address: a, abi: MOCKERC20_ABI, functionName: "balanceOf", args: [user], chainId }) as const;

  const stockSymbols = Object.keys(ADDRESSES.stocks) as StockSymbol[];

  const borrowRead = (functionName: "getCollateralValue" | "debt" | "getMaxDebt") =>
    ({ address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName, args: [user], chainId }) as const;

  const contracts = [
    erc20(ADDRESSES.USDC),
    erc20(ADDRESSES.sUSD),
    erc20(ADDRESSES.ssUSD),
    erc20(ADDRESSES.SF),
    { address: ADDRESSES.SFLock, abi: SFLOCK_ABI, functionName: "locked", args: [user], chainId } as const,
    borrowRead("getCollateralValue"),
    borrowRead("debt"),
    borrowRead("getMaxDebt"),
    ...stockSymbols.map((s) => erc20(ADDRESSES.stocks[s])),
  ];

  const reads = useReadContracts({
    contracts,
    query: { enabled: live, refetchInterval: 15_000 },
  });

  const r = reads.data ?? [];
  const val = (i: number) => toNum(r[i]?.result as bigint | undefined);
  const stockBalances = Object.fromEntries(
    stockSymbols.map((s, i) => [s, val(8 + i)])
  ) as Record<StockSymbol, number>;

  const balances = {
    usdc: val(0),
    susd: val(1),
    ssusd: val(2),
    sf: val(3),
    sfLocked: val(4),
    collateralValue: val(5),
    debt: val(6),
    maxDebt: val(7),
    stocks: stockBalances,
  };

  const [tx, setTx] = useState<TxState>({ status: "idle" });

  const approveIfNeeded = useCallback(
    async (token: Address, spender: Address, amount: bigint) => {
      const allowance = await readContract(config, {
        address: token,
        abi: MOCKERC20_ABI,
        functionName: "allowance",
        args: [user, spender],
        chainId,
      });
      if (allowance >= amount) return;
      setTx({ status: "approving" });
      const hash = await writeContract(config, {
        address: token,
        abi: MOCKERC20_ABI,
        functionName: "approve",
        args: [spender, amount],
        chainId,
      });
      await waitForTransactionReceipt(config, { hash, chainId });
    },
    [config, user]
  );

  const send = useCallback(
    async (hash: Hash) => {
      setTx({ status: "pending", hash });
      await waitForTransactionReceipt(config, { hash, chainId });
      setTx({ status: "success", hash });
      await reads.refetch();
      return hash;
    },
    [config, reads]
  );

  const run = useCallback(
    async (action: OnchainAction): Promise<Hash | null> => {
      if (!live) return null;
      try {
        setTx({ status: "pending" });
        switch (action.kind) {
          case "psmMint": {
            const amt = parseEther(action.amount);
            await approveIfNeeded(ADDRESSES.USDC, ADDRESSES.PSM, amt);
            return await send(
              await writeContract(config, { address: ADDRESSES.PSM, abi: PSM_ABI, functionName: "mint", args: [ADDRESSES.USDC, amt], chainId })
            );
          }
          case "psmRedeem": {
            const amt = parseEther(action.amount);
            await approveIfNeeded(ADDRESSES.sUSD, ADDRESSES.PSM, amt);
            return await send(
              await writeContract(config, { address: ADDRESSES.PSM, abi: PSM_ABI, functionName: "redeem", args: [ADDRESSES.USDC, amt], chainId })
            );
          }
          case "borrow": {
            const col = parseEther(action.collateral);
            const token = ADDRESSES.stocks[action.stock];
            if (col > BigInt(0)) {
              await approveIfNeeded(token, ADDRESSES.Borrow, col);
              setTx({ status: "pending" });
              const h = await writeContract(config, { address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName: "depositCollateral", args: [token, col], chainId });
              await waitForTransactionReceipt(config, { hash: h, chainId });
            }
            return await send(
              await writeContract(config, { address: ADDRESSES.Borrow, abi: BORROW_ABI, functionName: "mintStable", args: [parseEther(action.amount)], chainId })
            );
          }
          case "stake": {
            const amt = parseEther(action.amount);
            await approveIfNeeded(ADDRESSES.sUSD, ADDRESSES.StakingVault, amt);
            return await send(
              await writeContract(config, { address: ADDRESSES.StakingVault, abi: STAKINGVAULT_ABI, functionName: "deposit", args: [amt], chainId })
            );
          }
          case "unstake": {
            const amt = parseEther(action.amount);
            await approveIfNeeded(ADDRESSES.ssUSD, ADDRESSES.StakingVault, amt);
            return await send(
              await writeContract(config, { address: ADDRESSES.StakingVault, abi: STAKINGVAULT_ABI, functionName: "withdraw", args: [amt], chainId })
            );
          }
          case "lock": {
            const amt = parseEther(action.amount);
            await approveIfNeeded(ADDRESSES.SF, ADDRESSES.SFLock, amt);
            return await send(
              await writeContract(config, { address: ADDRESSES.SFLock, abi: SFLOCK_ABI, functionName: "lock", args: [amt], chainId })
            );
          }
          case "unlock":
            return await send(
              await writeContract(config, { address: ADDRESSES.SFLock, abi: SFLOCK_ABI, functionName: "unlock", args: [parseEther(action.amount)], chainId })
            );
          case "faucet": {
            const h = await writeContract(config, { address: ADDRESSES.Faucet, abi: MOCKFAUCET_ABI, functionName: "drip", chainId });
            await waitForTransactionReceipt(config, { hash: h, chainId });
            return await send(
              await writeContract(config, { address: ADDRESSES.SF, abi: MOCKERC20_ABI, functionName: "mint", args: [user, parseEther("10000")], chainId })
            );
          }
        }
      } catch (e) {
        const raw = e instanceof Error ? e.message : String(e);
        const short = raw.split("\n")[0].slice(0, 160);
        setTx({ status: "error", message: short });
        return null;
      }
    },
    [live, config, user, approveIfNeeded, send]
  );

  const resetTx = useCallback(() => setTx({ status: "idle" }), []);

  return { live, isConnected, wrongNetwork: isConnected && current !== chainId, address, balances, tx, run, resetTx, refetch: reads.refetch };
}
