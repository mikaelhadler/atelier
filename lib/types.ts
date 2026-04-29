export type OrderStatus = "a-fazer" | "em-producao" | "entregue";

export type PaymentMethod = "pix" | "dinheiro" | "cartao" | "boleto";

export type Address = {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
};

export type Order = {
  id: string;
  clientName: string;
  phone: string;
  description: string;
  dueDate: string;
  value: number;
  status: OrderStatus;
  createdAt: string;
  address?: Address;
  paymentMethod?: PaymentMethod;
  installments?: number;
};

export type TimerSession = {
  id: string;
  orderId: string | null;
  durationSeconds: number;
  endedAt: string;
};

export type MonthlyRevenue = { month: string; revenue: number };
