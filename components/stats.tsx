const stats = [
  { label: "Total TVL", value: "$—" },
  { label: "sUSD circulating", value: "$—" },
  { label: "ssUSD target APR", value: "—" },
  { label: "Stock tokens supported", value: "—" },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-semibold text-foreground sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
