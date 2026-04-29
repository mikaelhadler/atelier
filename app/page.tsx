"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { formatBRL, formatHours } from "@/lib/format";
import { getUnlockedBadges } from "@/lib/badges";
import { BadgeRow } from "@/components/ganhos/badge-row";
import { RevenueChart } from "@/components/ganhos/revenue-chart";
import { AIFeatureCard } from "@/components/ganhos/ai-feature-card";

export default function HomePage() {
  const orders = useStore((s) => s.orders);
  const sessions = useStore((s) => s.sessions);
  const history = useStore((s) => s.history);

  const monthRevenue = history[history.length - 1]?.revenue ?? 0;
  const openOrders = orders.filter((o) => o.status !== "entregue").length;
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const ticketMedio = orders.length
    ? orders.reduce((a, o) => a + o.value, 0) / orders.length
    : 0;
  const badges = getUnlockedBadges(monthRevenue);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-muted-foreground">Bem-vinda, Bela ✨</p>
        <h1 className="font-serif text-3xl">Seu ateliê</h1>
      </header>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <p className="text-xs uppercase tracking-wide opacity-80">
            Faturamento do mês
          </p>
          <p className="font-serif text-4xl">{formatBRL(monthRevenue)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={history} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-2 font-serif text-lg">Conquistas</h2>
        <BadgeRow badges={badges} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="font-serif text-2xl">{openOrders}</p>
            <p className="text-xs text-muted-foreground">Pedidos abertos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="font-serif text-xl tabular-nums">
              {formatHours(totalSeconds)}
            </p>
            <p className="text-xs text-muted-foreground">Horas trabalhadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="font-serif text-2xl">{formatBRL(ticketMedio)}</p>
            <p className="text-xs text-muted-foreground">Ticket médio</p>
          </CardContent>
        </Card>
      </div>

      <AIFeatureCard />
    </div>
  );
}
