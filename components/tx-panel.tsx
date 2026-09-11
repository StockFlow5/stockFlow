"use client";

import { useSwitchChain } from "wagmi";
import { Droplets, ExternalLink, AlertTriangle, Radio } from "lucide-react";
import { useOnchain, txUrl } from "@/lib/onchain";
import { TESTNET_CHAIN_ID } from "@/lib/contracts";

type Onchain = ReturnType<typeof useOnchain>;

export function ModeNote({ live }: { live: boolean }) {
  return (
    <p className="text-center text-xs text-muted">
      {live
        ? "Live on Robinhood Chain Testnet — transactions are real (testnet only)."
        : "No real transaction is executed — this is a UI simulation. Connect a wallet on Robinhood Testnet for live mode."}
    </p>
  );
}

export function TxStatus({ tx }: { tx: Onchain["tx"] }) {
  if (tx.status === "idle") return null;
  const hash = "hash" in tx ? tx.hash : undefined;
  return (
    <div
      className={`rounded-xl border p-3 text-xs ${
        tx.status === "error"
          ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
          : "border-border/60 bg-background/60 text-muted"
      }`}
    >
      {tx.status === "approving" && "Approving token spend in wallet..."}
      {tx.status === "pending" && (hash ? "Waiting for confirmation..." : "Confirm in wallet...")}
      {tx.status === "success" && "Transaction confirmed."}
      {tx.status === "error" && (
        <span className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {tx.message}
        </span>
      )}
      {hash && (
        <a
          href={txUrl(hash)}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
        >
          View on explorer <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

export function TestnetPanel({ onchain }: { onchain: Onchain }) {
  const { switchChain, isPending } = useSwitchChain();
  const { live, wrongNetwork, run, tx } = onchain;
  const busy = tx.status === "pending" || tx.status === "approving";

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Radio className={`h-4 w-4 ${live ? "text-emerald-400" : "text-muted"}`} />
        {live ? "Testnet live" : "Testnet mode"}
      </h3>
      <p className="mt-2 text-xs text-muted">
        {live
          ? "Balances and actions read/write real StockFlow mock contracts on Robinhood Chain Testnet."
          : wrongNetwork
          ? "Switch your wallet to Robinhood Chain Testnet to use live contracts."
          : "Connect a wallet on Robinhood Chain Testnet to use live contracts."}
      </p>
      {wrongNetwork && (
        <button
          onClick={() => switchChain({ chainId: TESTNET_CHAIN_ID })}
          disabled={isPending}
          className="mt-3 w-full rounded-xl border border-primary/40 bg-primary/10 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
        >
          {isPending ? "Switching..." : "Switch to Robinhood Testnet"}
        </button>
      )}
      {live && (
        <button
          onClick={() => run({ kind: "faucet" })}
          disabled={busy}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
        >
          <Droplets className="h-3.5 w-3.5" />
          Get test tokens (USDC, xStocks, SF)
        </button>
      )}
    </div>
  );
}
