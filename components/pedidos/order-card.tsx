"use client";
import { Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/format";
import type { Order } from "@/lib/types";

const STATUS_LABEL: Record<Order["status"], string> = {
  "a-fazer": "A fazer",
  "em-producao": "Em produção",
  entregue: "Entregue",
};

const STATUS_VARIANT: Record<
  Order["status"],
  "default" | "secondary" | "outline"
> = {
  "a-fazer": "outline",
  "em-producao": "default",
  entregue: "secondary",
};

export function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-2 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-serif text-lg leading-tight">
              {order.clientName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {order.description}
            </p>
          </div>
          <Badge variant={STATUS_VARIANT[order.status]}>
            {STATUS_LABEL[order.status]}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <a
            href={`tel:${order.phone}`}
            className="flex items-center gap-1 text-muted-foreground"
          >
            <Phone className="size-3" /> {order.phone}
          </a>
          <span className="font-medium">{formatBRL(order.value)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Entrega:{" "}
          {new Date(order.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      </CardContent>
    </Card>
  );
}
