import type { ActivityItem } from "@/lib/logistics-types";

const typeDot: Record<ActivityItem["type"], string> = {
  info: "bg-sky-400",
  warning: "bg-amber-400",
  success: "bg-emerald-400",
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold">Activity</h2>
        <p className="text-xs text-[var(--muted)]">Latest operational events</p>
      </div>
      <ul className="max-h-[min(70vh,520px)] divide-y divide-[var(--border)] overflow-y-auto">
        {items.map((item) => {
          const t = new Date(item.ts);
          return (
            <li key={item.id} className="flex gap-3 px-4 py-3 sm:px-5">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeDot[item.type]}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{item.message}</p>
                <time
                  className="mt-1 block font-mono text-[10px] text-[var(--muted)]"
                  dateTime={t.toISOString()}
                >
                  {t.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </time>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
