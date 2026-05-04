"use client";

import { useLiveLogistics } from "@/hooks/use-live-logistics";
import { ActivityFeed } from "./ActivityFeed";
import { HeaderBar } from "./HeaderBar";
import { HubLoadPanel } from "./HubLoadPanel";
import { KpiGrid } from "./KpiGrid";
import { OrdersTable } from "./OrdersTable";

export function DashboardShell() {
  const { snapshot, connected, refresh } = useLiveLogistics();

  if (!snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="text-sm text-[var(--muted)]">Loading live operations…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
      <HeaderBar
        serverTime={snapshot.serverTime}
        connected={connected}
        onRefresh={() => void refresh()}
      />
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <KpiGrid kpis={snapshot.kpis} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <OrdersTable orders={snapshot.orders} />
            <HubLoadPanel hubs={snapshot.hubs} />
          </div>
          <ActivityFeed items={snapshot.activity} />
        </div>
      </main>
    </div>
  );
}
