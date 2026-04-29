export type OrderStatus = "a-fazer" | "em-producao" | "entregue";

export type Order = {
  id: string;
  clientName: string;
  phone: string;
  description: string;
  dueDate: string;
  value: number;
  status: OrderStatus;
  createdAt: string;
};

export type TimerSession = {
  id: string;
  orderId: string | null;
  durationSeconds: number;
  endedAt: string;
};

export type MonthlyRevenue = { month: string; revenue: number };
