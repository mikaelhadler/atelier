"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "@/components/pedidos/order-card";
import { OrderForm } from "@/components/pedidos/order-form";
import { useStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

const FILTERS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "a-fazer", label: "A fazer" },
  { key: "em-producao", label: "Produção" },
  { key: "entregue", label: "Entregue" },
];

export default function PedidosPage() {
  const orders = useStore((s) => s.orders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const sorted = [...filtered].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="font-serif text-3xl">Pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Tudo aqui, no seu celular. Sem caderno, sem pedido esquecido.
          </p>
        </div>
        <OrderForm />
      </header>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="grid w-full grid-cols-4">
          {FILTERS.map((f) => (
            <TabsTrigger key={f.key} value={f.key}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Nada aqui ainda. Toque em <strong>+ Novo</strong> pra registrar seu
            primeiro pedido.
          </p>
        ) : (
          sorted.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}
