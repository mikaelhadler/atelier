"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_HISTORY, MOCK_ORDERS, MOCK_SESSIONS } from "./mock-data";
import type { MonthlyRevenue, Order, TimerSession } from "./types";

type Store = {
  orders: Order[];
  sessions: TimerSession[];
  history: MonthlyRevenue[];
  hourlyRate: number;
  marginPercent: number;

  addOrder: (o: Omit<Order, "id" | "createdAt">) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  addSession: (s: Omit<TimerSession, "id">) => void;
  setSettings: (patch: Partial<Pick<Store, "hourlyRate" | "marginPercent">>) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      orders: MOCK_ORDERS,
      sessions: MOCK_SESSIONS,
      history: MOCK_HISTORY,
      hourlyRate: 25,
      marginPercent: 30,

      addOrder: (o) =>
        set((s) => ({
          orders: [
            { ...o, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
            ...s.orders,
          ],
        })),
      updateOrder: (id, patch) =>
        set((s) => ({
          orders: s.orders.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      removeOrder: (id) =>
        set((s) => ({ orders: s.orders.filter((x) => x.id !== id) })),
      addSession: (sess) =>
        set((s) => ({
          sessions: [{ ...sess, id: crypto.randomUUID() }, ...s.sessions],
        })),
      setSettings: (patch) => set((s) => ({ ...s, ...patch })),
    }),
    { name: "atelier-store-v1" },
  ),
);
