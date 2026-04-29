"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatBRL, formatHours } from "@/lib/format";

export default function TimerPage() {
  const orders = useStore((s) => s.orders);
  const sessions = useStore((s) => s.sessions);
  const addSession = useStore((s) => s.addSession);
  const updateOrder = useStore((s) => s.updateOrder);
  const hourlyRate = useStore((s) => s.hourlyRate);

  const ordersOpen = orders.filter((o) => o.status !== "entregue");
  const [orderId, setOrderId] = useState<string | null>(
    ordersOpen[0]?.id ?? null,
  );
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    seconds: number;
    cost: number;
    orderId: string | null;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const stop = () => {
    if (seconds === 0) {
      setRunning(false);
      return;
    }
    const cost = (seconds / 3600) * hourlyRate;
    addSession({
      orderId,
      durationSeconds: seconds,
      endedAt: new Date().toISOString(),
    });
    setLastResult({ seconds, cost, orderId });
    setSeconds(0);
    setRunning(false);
  };

  const earned = (seconds / 3600) * hourlyRate;
  const sessionsByOrder = sessions.reduce<Record<string, number>>((acc, s) => {
    if (!s.orderId) return acc;
    acc[s.orderId] = (acc[s.orderId] || 0) + s.durationSeconds;
    return acc;
  }, {});

  const updatePriceForLastResult = () => {
    if (!lastResult?.orderId) return;
    const order = orders.find((o) => o.id === lastResult.orderId);
    if (!order) return;
    const totalSeconds =
      (sessionsByOrder[order.id] || 0) + 0;
    const laborCost = (totalSeconds / 3600) * hourlyRate;
    updateOrder(order.id, { value: Math.max(order.value, laborCost) });
    setLastResult(null);
  };

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl">Timer</h1>
        <p className="text-sm text-muted-foreground">
          Aperte play quando começar a bordar e pausa quando parar. No fim,
          você sabe exatamente quanto aquela peça custou pra fazer.
        </p>
      </header>

      {ordersOpen.length > 0 && (
        <Card>
          <CardContent className="pt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Trabalhando em
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ordersOpen.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOrderId(o.id)}
                  disabled={running}
                  className={`truncate rounded-full border px-3 py-1.5 text-xs transition-colors max-w-full ${
                    orderId === o.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:bg-muted disabled:opacity-50"
                  }`}
                >
                  {o.clientName}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-foreground text-background">
        <CardContent className="flex flex-col items-center gap-6 pb-8 pt-10">
          <p className="font-serif text-6xl tabular-nums">
            {formatHours(seconds)}
          </p>
          <p className="text-sm opacity-70">~ {formatBRL(earned)}</p>
          <div className="flex gap-3">
            {!running ? (
              <Button size="lg" onClick={() => setRunning(true)}>
                <Play className="size-5" /> Iniciar
              </Button>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setRunning(false)}
              >
                <Pause className="size-5" /> Pausar
              </Button>
            )}
            <Button size="lg" variant="destructive" onClick={stop}>
              <Square className="size-5" /> Parar
            </Button>
          </div>
        </CardContent>
      </Card>

      {lastResult && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="space-y-3 pt-5">
            <p className="font-serif text-lg">
              Você bordou {formatHours(lastResult.seconds)} ·{" "}
              <span className="text-primary">{formatBRL(lastResult.cost)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Esse é o valor da sua mão de obra nessa sessão (a R${" "}
              {hourlyRate}/hora).
            </p>
            {lastResult.orderId && (
              <Button onClick={updatePriceForLastResult} size="sm">
                Atualizar preço deste pedido <ArrowRight className="size-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-3 font-serif text-xl">Histórico</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma sessão ainda. Toque em <strong>Iniciar</strong> pra contar
            seu primeiro tempo.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.slice(0, 10).map((s) => {
              const order = orders.find((o) => o.id === s.orderId);
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate">
                      {order ? order.clientName : "Sessão livre"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.endedAt).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <span className="tabular-nums">
                    {formatHours(s.durationSeconds)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
