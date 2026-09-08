import { Check, Minus } from "lucide-react";

const rows = [
  { label: "Backed by", stockflow: "Tokenized equities + reserves", usdc: "Fiat / treasuries" },
  { label: "Yield to holder", stockflow: "ssUSD staking revenue", usdc: "Issuer retained" },
  { label: "Exit mechanism", stockflow: "PSM 1:1 when reserves available", usdc: "Circle redemption" },
  { label: "Issuer", stockflow: "Permissionless protocol", usdc: "Circle Inc" },
  { label: "Transparency", stockflow: "Live on chain", usdc: "Monthly attestation" },
];

export function Comparison() {
  return (
    <section id="compare" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Comparison
          </p>
          <h2 className="mt-3 font-sans text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Compared to other stable dollars
          </h2>
          <p className="mt-4 text-lg text-muted">
            sUSD keeps collateral on chain and returns protocol revenue to holders.
          </p>
        </div>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur">
          <table className="w-full text-left">
            <thead className="bg-card/80">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-muted"></th>
                <th className="px-6 py-4 text-sm font-semibold text-primary">
                  sUSD
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted">
                  USDC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr key={row.label} className="transition hover:bg-card/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-primary">
                    <span className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      {row.stockflow}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    <span className="flex items-center gap-2">
                      <Minus className="h-3.5 w-3.5 text-muted" />
                      {row.usdc}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
