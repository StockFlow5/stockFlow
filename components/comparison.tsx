const rows = [
  { label: "Backed by", stockflow: "Tokenized equities + reserves", usdc: "Fiat / treasuries" },
  { label: "Yield to holder", stockflow: "ssUSD staking revenue", usdc: "Issuer retained" },
  { label: "Exit mechanism", stockflow: "PSM 1:1 when reserves available", usdc: "Circle redemption" },
  { label: "Issuer", stockflow: "Permissionless protocol", usdc: "Circle Inc" },
  { label: "Transparency", stockflow: "Live on chain", usdc: "Monthly attestation" },
];

export function Comparison() {
  return (
    <section id="compare" className="bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Compared to other stable dollars
          </h2>
          <p className="mt-4 text-lg text-muted">
            sUSD keeps collateral on chain and returns protocol revenue to
            holders.
          </p>
        </div>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left">
            <thead className="bg-card">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-muted"></th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">
                  sUSD
                </th>
                <th className="px-6 py-4 text-sm font-medium text-muted">
                  USDC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-accent">
                    {row.stockflow}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{row.usdc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
