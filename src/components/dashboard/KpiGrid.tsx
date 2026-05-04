import type { Kpis } from "@/lib/logistics-types";

type CardDef = {
  label: string;
  key: keyof Kpis;
  suffix?: string;
  format?: "int" | "pct";
  display?: (k: Kpis) => string;
};

const cards: CardDef[] = [
  { label: "Active orders", key: "activeOrders", format: "int" },
  { label: "On-time (rolling)", key: "onTimePct", suffix: "%", format: "pct" },
  { label: "Avg. delay", key: "avgDelayMin", suffix: " min" },
  {
    label: "Fleet active",
    key: "fleetActive",
    display: (k) => `${k.fleetActive} / ${k.fleetTotal}`,
  },
  { label: "Exceptions (24h)", key: "exceptions24h", format: "int" },
  { label: "Throughput", key: "throughputPerHour", suffix: " / hr" },
];

export function KpiGrid({ kpis }: { kpis: Kpis }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => {
        const raw = kpis[c.key];
        const display = c.display
          ? c.display(kpis)
          : c.format === "pct"
            ? Number(raw).toFixed(1)
            : c.format === "int"
              ? Math.round(Number(raw)).toString()
              : String(raw);
        return (
          <div
            key={c.key}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              {c.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
              {display}
              {c.suffix && c.format === "pct" ? (
                <span className="text-lg font-normal text-[var(--muted)]">{c.suffix}</span>
              ) : null}
              {c.suffix && !c.display && c.format !== "pct" ? (
                <span className="text-lg font-normal text-[var(--muted)]">{c.suffix}</span>
              ) : null}
            </p>
          </div>
        );
      })}
    </section>
  );
}
