import type { Order, OrderStatus } from "@/lib/logistics-types";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30",
  picked_up: "bg-sky-500/15 text-sky-200 ring-sky-500/30",
  in_transit: "bg-blue-500/15 text-blue-200 ring-blue-500/30",
  out_for_delivery: "bg-violet-500/15 text-violet-200 ring-violet-500/30",
  delivered: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30",
  exception: "bg-rose-500/15 text-rose-200 ring-rose-500/30",
};

const priorityLabel: Record<Order["priority"], string> = {
  standard: "STD",
  express: "EXP",
  cold_chain: "COLD",
};

function StatusPill({ status }: { status: OrderStatus }) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const sorted = [...orders].sort((a, b) => {
    if (a.status === "exception" && b.status !== "exception") return -1;
    if (b.status === "exception" && a.status !== "exception") return 1;
    return a.etaMinutes - b.etaMinutes;
  });

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold">Live orders</h2>
          <p className="text-xs text-[var(--muted)]">Sorted by ETA, exceptions first</p>
        </div>
        <span className="rounded-md bg-[var(--bg)] px-2 py-1 font-mono text-xs text-[var(--muted)]">
          {orders.length} rows
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--bg)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-5">Ref</th>
              <th className="px-4 py-3 font-medium sm:px-5">Customer</th>
              <th className="px-4 py-3 font-medium sm:px-5">Lane</th>
              <th className="px-4 py-3 font-medium sm:px-5">Carrier</th>
              <th className="px-4 py-3 font-medium sm:px-5">Priority</th>
              <th className="px-4 py-3 font-medium sm:px-5">ETA</th>
              <th className="px-4 py-3 font-medium sm:px-5">Progress</th>
              <th className="px-4 py-3 font-medium sm:px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sorted.map((o) => (
              <tr key={o.id} className="hover:bg-[var(--bg)]/60">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs sm:px-5">
                  {o.ref}
                </td>
                <td className="max-w-[140px] truncate px-4 py-3 sm:max-w-[180px] sm:px-5">
                  {o.customer}
                </td>
                <td className="max-w-[200px] px-4 py-3 text-xs text-[var(--muted)] sm:px-5">
                  <span className="text-[var(--text)]">{o.origin.split(",")[0]}</span>
                  <span className="mx-1">→</span>
                  <span className="text-[var(--text)]">{o.destination.split(",")[0]}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs sm:px-5">{o.carrier}</td>
                <td className="px-4 py-3 sm:px-5">
                  <span className="rounded bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                    {priorityLabel[o.priority]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs tabular-nums sm:px-5">
                  {o.status === "delivered" ? "—" : `${o.etaMinutes}m`}
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--bg)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                        style={{ width: `${o.progressPct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[var(--muted)]">
                      {o.progressPct}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <StatusPill status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
