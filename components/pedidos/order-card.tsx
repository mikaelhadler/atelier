"use client";
import { MessageCircle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/types";

const STATUS: Record<
  Order["status"],
  { label: string; className: string }
> = {
  "a-fazer": {
    label: "A fazer",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  "em-producao": {
    label: "Produzindo",
    className: "bg-primary/15 text-primary border-primary/20",
  },
  entregue: {
    label: "Entregue",
    className: "bg-accent/20 text-accent-foreground border-accent/30",
  },
};

function daysUntil(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00").getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d - today.getTime()) / 86_400_000);
}

export function OrderCard({ order }: { order: Order }) {
  const days = daysUntil(order.dueDate);
  const due =
    order.status === "entregue"
      ? null
      : days < 0
        ? `Atrasado ${Math.abs(days)}d`
        : days === 0
          ? "Entrega hoje"
          : days === 1
            ? "Entrega amanhã"
            : `Entrega em ${days}d`;
  const status = STATUS[order.status];
  const waLink = `https://wa.me/55${order.phone.replace(/\D/g, "")}`;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-serif text-lg leading-tight">
              {order.clientName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {order.description}
            </p>
          </div>
          <Badge className={cn("border", status.className)}>{status.label}</Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-accent hover:underline"
          >
            <MessageCircle className="size-3.5" /> WhatsApp
          </a>
          <span className="font-medium">{formatBRL(order.value)}</span>
        </div>

        {order.address && (
          <p className="flex items-start gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0 translate-y-0.5" />
            <span className="truncate">
              {order.address.street}, {order.address.number} —{" "}
              {order.address.neighborhood}, {order.address.city}
            </span>
          </p>
        )}

        {due && (
          <p
            className={cn(
              "text-xs",
              days <= 1 && order.status !== "entregue"
                ? "font-medium text-destructive"
                : "text-muted-foreground",
            )}
          >
            {due} ·{" "}
            {new Date(order.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
