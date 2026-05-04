"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveSnapshot } from "@/lib/logistics-types";
import { initialSnapshot, tickSnapshot } from "@/lib/logistics-simulator";

const TICK_MS = 2500;

export function useLiveLogistics() {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [connected, setConnected] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const seedFromApi = useCallback(async () => {
    try {
      const res = await fetch("/api/live", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as LiveSnapshot;
      setSnapshot(data);
      setConnected(true);
    } catch {
      setSnapshot(initialSnapshot());
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    void seedFromApi();
  }, [seedFromApi]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSnapshot((prev) => (prev ? tickSnapshot(prev) : prev));
    }, TICK_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { snapshot, connected, refresh: seedFromApi };
}
