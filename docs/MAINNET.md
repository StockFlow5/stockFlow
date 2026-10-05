# Mainnet readiness checklist

Target: **Robinhood Chain** (chainId `4663`, RPC `https://rpc.mainnet.chain.robinhood.com`, explorer `https://robinhoodchain.blockscout.com`).

Nothing below has been executed yet. The current deployment is **testnet-only mock contracts** (chainId `46630`). Do not deploy to mainnet until every item is checked.

## 1. Contracts (blockers found in current code)
- [ ] **PSM decimals** — `PSM` mints sUSD 1:1 with the reserve amount and assumes 18-decimal reserves. Real USDC has 6 decimals; add decimal normalisation before any mainnet PSM.
- [ ] **Borrow decimals** — `Borrow` assumes 18-decimal collateral and 8-decimal Chainlink-style feeds. Verify every xStock token and feed.
- [ ] **Oracle** — replace `MockPriceFeed` (anyone can `setPrice`) with real Chainlink/Pyth-compatible feeds for each xStock; add staleness and sequencer checks in `Borrow.getAssetPrice`.
- [ ] **Liquidations** — `Borrow` tracks `healthFactor` but has no liquidation path; undercollateralised debt can't be closed.
- [ ] **Pause / emergency** — add `Pausable` to PSM, Borrow, StakingVault.
- [ ] **Access control** — `MINTER_ROLE` on sUSD/ssUSD and `Ownable` on PSM/Borrow/Vault/SFLock must end up at a multisig (deploy script does the hand-off, verify after).
- [ ] **Audit** — external audit of all core contracts after the fixes above; publish report in `docs/`.
- [ ] **Tests** — unit + fork tests for PSM mint/redeem, borrow/repay, vault, lock, admin paths.

## 2. External dependencies on Robinhood Chain
- [ ] Canonical **USDC** (and/or USDG) address.
- [ ] **xStock** token addresses to accept as collateral, with per-asset `maxLTV` / `liqThreshold` (bps).
- [ ] **Price feed** address per xStock.
- [ ] **$SF** governance token: deploy real token (fixed supply, vesting) — the mock `SF` is not for mainnet.
- [ ] **Multisig** (Safe) address as protocol owner.

## 3. Deployer & gas
- [ ] Fresh deployer key (hardware wallet or isolated signer), never the testnet key.
- [ ] Fund deployer with ETH on Robinhood Chain for ~15 transactions.
- [ ] `RH_MAINNET_RPC` + `DEPLOYER_KEY` in `contracts/.env` (never committed).

## 4. Deploy
```bash
cd contracts
cp mainnet.config.example.json mainnet.config.json   # fill real addresses
npm run deploy:mainnet:dry   # validates config, code presence, decimals, feed freshness — no tx
npm run deploy:mainnet       # deploys core only (no mocks/faucet), hands ownership to multisig
```
Output: `deployed-addresses.mainnet.json` (gitignored). Then verify sources:
```bash
npx hardhat verify --network robinhoodMainnet <address> [constructor args]
```

## 5. Frontend
- [ ] Copy addresses from `deployed-addresses.mainnet.json` into `lib/addresses.mainnet.json`.
- [ ] Build with `NEXT_PUBLIC_NETWORK=mainnet` (explorer links, chain switch, copy and faucet button follow the env automatically).
- [ ] Reown/WalletConnect project allowlist still includes `https://stockflowapp.fun`.
- [ ] Smoke test with a real wallet and small amounts: PSM mint/redeem, deposit + borrow + repay, stake/unstake, lock/unlock.

## 6. Launch
- [ ] Monitoring: alerts on backing ratio, oracle staleness, large borrows.
- [ ] Incident runbook (pause, who signs, comms channel).
- [ ] Update README network table, docs page and roadmap; announce on X.
