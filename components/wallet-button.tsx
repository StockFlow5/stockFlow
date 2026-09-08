"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletButtonProps {
  className?: string;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
}

export function WalletButton({
  className,
  size = "md",
  variant = "primary",
}: WalletButtonProps) {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal, openAccountModal, mounted }) => {
        const connected = mounted && !!account;
        return (
          <button
            type="button"
            disabled={!mounted}
            onClick={connected ? openAccountModal : openConnectModal}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
              size === "sm"
                ? "h-9 px-4 text-xs"
                : "h-11 px-5 text-sm",
              connected
                ? "border border-border bg-card/80 text-foreground hover:bg-card"
                : variant === "outline"
                ? "border border-primary text-primary hover:bg-primary/10"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
              className
            )}
          >
            <Wallet className="h-4 w-4" />
            {connected ? (
              <span className="max-w-[8rem] truncate sm:max-w-[10rem]">
                {account.displayName}
              </span>
            ) : (
              "Connect Wallet"
            )}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
