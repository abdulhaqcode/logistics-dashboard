export type OrderStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export type Priority = "standard" | "express" | "cold_chain";

export interface Order {
  id: string;
  ref: string;
  customer: string;
  origin: string;
  destination: string;
  status: OrderStatus;
  etaMinutes: number;
  carrier: string;
  updatedAt: string;
  priority: Priority;
  progressPct: number;
}

export interface Kpis {
  activeOrders: number;
  onTimePct: number;
  avgDelayMin: number;
  fleetActive: number;
  fleetTotal: number;
  exceptions24h: number;
  throughputPerHour: number;
}

export type ActivityType = "info" | "warning" | "success";

export interface ActivityItem {
  id: string;
  ts: string;
  message: string;
  type: ActivityType;
}

export interface HubLoad {
  code: string;
  name: string;
  loadPct: number;
  inQueue: number;
}

export interface LiveSnapshot {
  serverTime: string;
  kpis: Kpis;
  orders: Order[];
  activity: ActivityItem[];
  hubs: HubLoad[];
}
