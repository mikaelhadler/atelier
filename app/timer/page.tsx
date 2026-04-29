"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatBRL, formatHours } from "@/lib/format";

export default function TimerPage() {
  const orders = useStore((s) => s.orders);
  const sessions = useStore((s) => s.sessions);
  const addSession = useStore((s) => s.addSession);
  const hourlyRate = useStore((s) => s.hourlyRate);

  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
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
    const inProduction = orders.find((o) => o.status === "em-producao");
    addSession({
      orderId: inProduction?.id ?? null,
      durationSeconds: seconds,
      endedAt: new Date().toISOString(),
    });
    setSeconds(0);
    setRunning(false);
  };

  const earned = (seconds / 3600) * hourlyRate;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-3xl">Timer</h1>
        <p className="text-sm text-muted-foreground">
          Conte cada minuto do seu trabalho
        </p>
      </header>

      <Card className="bg-foreground text-background">
        <CardContent className="flex flex-col items-center gap-6 pb-8 pt-10">
          <p className="font-serif text-6xl tabular-nums">
            {formatHours(seconds)}
          </p>
          <p className="text-sm opacity-70">~ {formatBRL(earned)} ganhos</p>
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

      <div>
        <h2 className="mb-3 font-serif text-xl">Histórico</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma sessão ainda</p>
        ) : (
          <ul className="space-y-2">
            {sessions.slice(0, 10).map((s) => (
              <li key={s.id} className="flex justify-between text-sm">
                <span>
                  {new Date(s.endedAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
                <span className="tabular-nums">
                  {formatHours(s.durationSeconds)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
