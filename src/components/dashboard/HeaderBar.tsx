"use client";

type Props = {
  serverTime: string;
  connected: boolean;
  onRefresh: () => void;
};

export function HeaderBar({ serverTime, connected, onRefresh }: Props) {
  const t = new Date(serverTime);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-elevated)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
            Logistics control tower
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            Live operations
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Orders, hubs, and fleet signals update every few seconds (demo simulation).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium"
            title={connected ? "Synced with /api/live" : "Using local simulation"}
          >
            <span
              className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`}
            />
            {connected ? "Live sync" : "Local fallback"}
          </div>
          <time
            dateTime={t.toISOString()}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-xs text-[var(--muted)]"
          >
            {t.toLocaleString(undefined, {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </time>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90"
          >
            Resync
          </button>
        </div>
      </div>
    </header>
  );
}
