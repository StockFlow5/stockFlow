#!/usr/bin/env bash
# Verifies all deployed contracts on the Robinhood Chain Testnet Blockscout explorer.
set -euo pipefail
cd "$(dirname "$0")/.."

A=deployed-addresses.json
j() { node -p "const d=require('./$A'); $1"; }
v() { npx hardhat verify --network robinhoodTestnet "$@" || true; }

v "$(j d.sUSD)"
v "$(j d.ssUSD)"
v "$(j d.SF)" "StockFlow Governance" "SF" 18
v "$(j d.USDC)" "Mock USDC" "mUSDC" 18
v "$(j d.USDG)" "Mock USDG" "mUSDG" 18
v "$(j d.stocks.SPYx)" "S&P 500 ETF Token" "SPYx" 18
v "$(j d.stocks.QQQx)" "Invesco QQQ Trust Token" "QQQx" 18
v "$(j d.stocks.AAPLx)" "Apple Inc. Token" "AAPLx" 18
v "$(j d.stocks.MSFTx)" "Microsoft Corp. Token" "MSFTx" 18
v "$(j d.stocks.GOOGLx)" "Alphabet Inc. Token" "GOOGLx" 18
v "$(j d.stocks.NVDAx)" "NVIDIA Corp. Token" "NVDAx" 18
v "$(j d.stocks.TSLAx)" "Tesla Inc. Token" "TSLAx" 18
for s in SPYx QQQx AAPLx MSFTx GOOGLx NVDAx TSLAx; do v "$(j d.priceFeeds.$s)"; done
v "$(j d.PSM)" "$(j d.sUSD)"
v "$(j d.Borrow)" "$(j d.sUSD)"
v "$(j d.StakingVault)" "$(j d.sUSD)" "$(j d.ssUSD)"
v "$(j d.SFLock)" "$(j d.SF)"
v "$(j d.Faucet)" --constructor-args-path scripts/faucet-args.ts
