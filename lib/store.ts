"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_HISTORY, MOCK_ORDERS, MOCK_SESSIONS } from "./mock-data";
import type { MonthlyRevenue, Order, TimerSession } from "./types";

type SettingsKeys = "hourlyRate" | "marginPercent" | "taxPercent" | "defaultShipping";

type Store = {
  orders: Order[];
  sessions: TimerSession[];
  history: MonthlyRevenue[];
  hourlyRate: number;
  marginPercent: number;
  taxPercent: number;
  defaultShipping: number;
  hasSeenOnboarding: boolean;

  addOrder: (o: Omit<Order, "id" | "createdAt">) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  addSession: (s: Omit<TimerSession, "id">) => void;
  setSettings: (patch: Partial<Pick<Store, SettingsKeys>>) => void;
  markOnboardingSeen: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      orders: MOCK_ORDERS,
      sessions: MOCK_SESSIONS,
      history: MOCK_HISTORY,
      hourlyRate: 25,
      marginPercent: 30,
      taxPercent: 6,
      defaultShipping: 0,
      hasSeenOnboarding: false,

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
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
    }),
    { name: "atelier-store-v2" },
  ),
);
