import type { MonthlyRevenue, Order, TimerSession } from "./types";

export const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    clientName: "Joana Almeida",
    phone: "11999990001",
    description: "Toalhinha bordada com flores do campo",
    dueDate: "2026-05-04",
    value: 180,
    status: "em-producao",
    createdAt: "2026-04-25",
  },
  {
    id: "o2",
    clientName: "Fernanda Costa",
    phone: "11999990002",
    description: "Quadro 30x40 com nome do bebê",
    dueDate: "2026-05-08",
    value: 220,
    status: "em-producao",
    createdAt: "2026-04-26",
  },
  {
    id: "o3",
    clientName: "Camila Ribeiro",
    phone: "11999990003",
    description: "Pano de prato com monograma",
    dueDate: "2026-05-15",
    value: 85,
    status: "a-fazer",
    createdAt: "2026-04-28",
  },
  {
    id: "o4",
    clientName: "Letícia Souza",
    phone: "11999990004",
    description: "Kit de 3 guardanapos personalizados",
    dueDate: "2026-04-22",
    value: 145,
    status: "entregue",
    createdAt: "2026-04-10",
  },
  {
    id: "o5",
    clientName: "Patrícia Mendes",
    phone: "11999990005",
    description: "Bordado em camisa polo masculina",
    dueDate: "2026-05-20",
    value: 95,
    status: "a-fazer",
    createdAt: "2026-04-29",
  },
];

export const MOCK_SESSIONS: TimerSession[] = [
  { id: "s1", orderId: "o1", durationSeconds: 5400, endedAt: "2026-04-26T18:00:00Z" },
  { id: "s2", orderId: "o1", durationSeconds: 3600, endedAt: "2026-04-27T20:00:00Z" },
  { id: "s3", orderId: "o2", durationSeconds: 7200, endedAt: "2026-04-28T16:30:00Z" },
];

export const MOCK_HISTORY: MonthlyRevenue[] = [
  { month: "Nov", revenue: 1200 },
  { month: "Dez", revenue: 1850 },
  { month: "Jan", revenue: 2100 },
  { month: "Fev", revenue: 2750 },
  { month: "Mar", revenue: 3200 },
  { month: "Abr", revenue: 3850 },
];
