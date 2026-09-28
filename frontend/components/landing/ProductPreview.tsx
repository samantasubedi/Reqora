import { Reveal } from "./Reveal";

const bars = [
  { label: "Laptops", value: 82 },
  { label: "Monitors", value: 64 },
  { label: "Licenses", value: 48 },
  { label: "Desks", value: 35 },
];

const donut = [
  { label: "Available", value: 38, color: "bg-emerald-500" },
  { label: "In use", value: 52, color: "bg-sky-500" },
  { label: "Maintenance", value: 10, color: "bg-amber-500" },
];

export function ProductPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            Live visibility
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            See what you own, who holds it, and what&apos;s next
          </h2>
          <p className="mt-3 font-medium text-muted-foreground">
            The same analytics your admins and managers use every day —
            distribution by type, status breakdown, and team load — without
            exporting a single spreadsheet.
          </p>
          <ul className="mt-6 space-y-3 text-sm font-medium text-foreground/90">
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              Resource distribution by type, updated as items move
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              Status health at a glance: available vs in use vs maintenance
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              Request load by priority, so urgent needs surface first
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border bg-card p-5 shadow-xl shadow-primary/10 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-card-foreground">
                Resource overview
              </p>
              <p className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                LIVE
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>{bar.label}</span>
                    <span>{bar.value}% stocked</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                      style={{ width: `${bar.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-5 rounded-xl border bg-background p-4">
              <div
                aria-hidden
                className="size-20 shrink-0 rounded-full p-2"
                style={{
                  background:
                    "conic-gradient(var(--chart-1) 0 38%, var(--chart-2) 38% 90%, var(--chart-3) 90% 100%)",
                }}
              >
                <div className="flex size-full items-center justify-center rounded-full bg-background text-sm font-bold">
                  100
                </div>
              </div>
              <ul className="space-y-2 text-sm font-medium">
                {donut.map((d) => (
                  <li key={d.label} className="flex items-center gap-2 text-foreground/90">
                    <span className={`size-2.5 rounded-full ${d.color}`} />
                    {d.label}
                    <span className="font-bold">{d.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
