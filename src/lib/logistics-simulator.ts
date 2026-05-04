import type {
  ActivityItem,
  HubLoad,
  Kpis,
  LiveSnapshot,
  Order,
  OrderStatus,
} from "./logistics-types";

const CUSTOMERS = [
  "Northwind Traders",
  "Contoso Foods",
  "Fabrikam Retail",
  "Adventure Works",
  "Litware Medical",
  "Tailspin Toys",
  "Wide World Importers",
];

const ROUTES: { origin: string; destination: string }[] = [
  { origin: "Chicago, IL", destination: "Detroit, MI" },
  { origin: "Dallas, TX", destination: "Houston, TX" },
  { origin: "Los Angeles, CA", destination: "Phoenix, AZ" },
  { origin: "Atlanta, GA", destination: "Miami, FL" },
  { origin: "Seattle, WA", destination: "Portland, OR" },
  { origin: "Memphis, TN", destination: "Nashville, TN" },
  { origin: "Newark, NJ", destination: "Boston, MA" },
];

const CARRIERS = ["Linehaul Express", "Metro Freight", "ColdChain Co.", "Atlas LTL"];

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function formatRef(): string {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `ORD-${n}`;
}

export function createInitialOrders(count: number): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const route = pick(ROUTES);
    const status = pick([
      "pending",
      "picked_up",
      "in_transit",
      "out_for_delivery",
    ] as OrderStatus[]);
    orders.push({
      id: randomId(),
      ref: formatRef(),
      customer: pick(CUSTOMERS),
      origin: route.origin,
      destination: route.destination,
      status,
      etaMinutes: 15 + Math.floor(Math.random() * 240),
      carrier: pick(CARRIERS),
      updatedAt: new Date().toISOString(),
      priority: pick(["standard", "standard", "express", "cold_chain"] as const),
      progressPct: progressForStatus(status),
    });
  }
  return orders;
}

function progressForStatus(s: OrderStatus): number {
  const map: Record<OrderStatus, number> = {
    pending: 5 + Math.floor(Math.random() * 15),
    picked_up: 25,
    in_transit: 55,
    out_for_delivery: 85,
    delivered: 100,
    exception: 40,
  };
  return map[s];
}

function computeKpis(orders: Order[]): Kpis {
  const active = orders.filter((o) => o.status !== "delivered");
  const exceptions = orders.filter((o) => o.status === "exception").length;
  const onTrack = active.filter((o) => o.etaMinutes <= 45).length;
  const onTimePct =
    active.length === 0
      ? 100
      : Math.round((onTrack / active.length) * 100 + Math.random() * 4 - 2);

  return {
    activeOrders: active.length,
    onTimePct: Math.min(99, Math.max(82, onTimePct)),
    avgDelayMin: Math.round(8 + Math.random() * 12),
    fleetActive: 42 + Math.floor(Math.random() * 8),
    fleetTotal: 58,
    exceptions24h: exceptions + Math.floor(Math.random() * 3),
    throughputPerHour: 180 + Math.floor(Math.random() * 40),
  };
}

function defaultHubs(): HubLoad[] {
  return [
    { code: "MDW", name: "Chicago Midway", loadPct: 72, inQueue: 14 },
    { code: "DFW", name: "Dallas Fort Worth", loadPct: 64, inQueue: 11 },
    { code: "LAX", name: "Los Angeles", loadPct: 81, inQueue: 19 },
    { code: "ATL", name: "Atlanta", loadPct: 58, inQueue: 9 },
    { code: "EWR", name: "Newark", loadPct: 69, inQueue: 12 },
  ];
}

export function initialSnapshot(): LiveSnapshot {
  const orders = createInitialOrders(14);
  const activity: ActivityItem[] = [
    {
      id: randomId(),
      ts: new Date().toISOString(),
      message: "Control tower: all hubs reporting green capacity.",
      type: "success",
    },
    {
      id: randomId(),
      ts: new Date(Date.now() - 120000).toISOString(),
      message: "Cold chain lane MEM→BNA within temperature band.",
      type: "info",
    },
  ];
  return {
    serverTime: new Date().toISOString(),
    kpis: computeKpis(orders),
    orders,
    activity,
    hubs: defaultHubs(),
  };
}

function nextStatus(current: OrderStatus): OrderStatus {
  if (current === "exception") {
    return Math.random() > 0.7 ? "in_transit" : "exception";
  }
  if (current === "delivered") return "delivered";
  const idx = STATUS_FLOW.indexOf(current);
  if (idx < 0 || idx >= STATUS_FLOW.length - 1) {
    return pick(["in_transit", "out_for_delivery"] as OrderStatus[]);
  }
  if (Math.random() > 0.55) {
    return STATUS_FLOW[Math.min(STATUS_FLOW.length - 1, idx + 1)]!;
  }
  return current;
}

export function tickSnapshot(prev: LiveSnapshot): LiveSnapshot {
  const orders = prev.orders.map((o) => {
    if (o.status === "delivered" && Math.random() > 0.92) {
      const route = pick(ROUTES);
      return {
        ...o,
        id: randomId(),
        ref: formatRef(),
        customer: pick(CUSTOMERS),
        origin: route.origin,
        destination: route.destination,
        status: "pending" as OrderStatus,
        etaMinutes: 20 + Math.floor(Math.random() * 200),
        updatedAt: new Date().toISOString(),
        priority: pick(["standard", "express", "cold_chain"] as const),
        progressPct: progressForStatus("pending"),
      };
    }

    let status = nextStatus(o.status);
    if (status !== "exception" && Math.random() > 0.97) {
      status = "exception";
    }

    let etaMinutes = Math.max(5, o.etaMinutes + (Math.random() > 0.5 ? -3 : 2));
    if (status === "delivered") etaMinutes = 0;
    const progressPct =
      status === "exception"
        ? Math.min(o.progressPct, 45)
        : Math.min(100, progressForStatus(status) + Math.floor(Math.random() * 6));

    return {
      ...o,
      status,
      etaMinutes,
      updatedAt: new Date().toISOString(),
      progressPct,
    };
  });

  let activity = [...prev.activity];
  const changed = orders.filter(
    (o, i) => o.status !== prev.orders[i]?.status || o.ref !== prev.orders[i]?.ref,
  );
  if (changed.length && Math.random() > 0.4) {
    const o = pick(changed);
    const msg =
      o.status === "delivered"
        ? `${o.ref} delivered to ${o.destination.split(",")[0]}`
        : o.status === "exception"
          ? `Exception on ${o.ref} — ops notified`
          : `${o.ref} → ${o.status.replace(/_/g, " ")}`;
    activity = [
      {
        id: randomId(),
        ts: new Date().toISOString(),
        message: msg,
        type:
          o.status === "exception" ? "warning" : o.status === "delivered" ? "success" : "info",
      },
      ...activity,
    ].slice(0, 40);
  }

  const hubs = prev.hubs.map((h) => ({
    ...h,
    loadPct: Math.min(95, Math.max(35, h.loadPct + Math.floor(Math.random() * 7) - 3)),
    inQueue: Math.max(0, h.inQueue + Math.floor(Math.random() * 3) - 1),
  }));

  return {
    serverTime: new Date().toISOString(),
    kpis: computeKpis(orders),
    orders,
    activity,
    hubs,
  };
}
