import type { HubLoad } from "@/lib/logistics-types";

export function HubLoadPanel({ hubs }: { hubs: HubLoad[] }) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">Hub load</h2>
        <p className="text-xs text-[var(--muted)]">Sort capacity vs. inbound queue (demo)</p>
      </div>
      <ul className="space-y-4">
        {hubs.map((h) => (
          <li key={h.code}>
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <div>
                <span className="font-mono text-[var(--accent)]">{h.code}</span>
                <span className="ml-2 text-[var(--muted)]">{h.name}</span>
              </div>
              <span className="tabular-nums text-[var(--muted)]">
                {h.loadPct}% · {h.inQueue} queued
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--bg)]">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ${
                  h.loadPct > 80
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-cyan-500 to-[var(--accent)]"
                }`}
                style={{ width: `${h.loadPct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
