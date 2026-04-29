"use client";
import Link from "next/link";
import { Calculator, ListChecks, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Onboarding } from "@/components/onboarding/onboarding";
import { useStore } from "@/lib/store";
import { formatBRL, formatHours } from "@/lib/format";

const QUICK_LINKS = [
  {
    href: "/precificar",
    icon: Calculator,
    title: "Calcular preço",
    body: "Materiais + suas horas → preço justo",
  },
  {
    href: "/pedidos",
    icon: ListChecks,
    title: "Pedidos",
    body: "Suas encomendas, sem caderninho",
  },
  {
    href: "/timer",
    icon: Timer,
    title: "Cronometrar",
    body: "Conte o tempo da sua peça",
  },
];

export default function HomePage() {
  const orders = useStore((s) => s.orders);
  const sessions = useStore((s) => s.sessions);
  const history = useStore((s) => s.history);

  const monthRevenue = history[history.length - 1]?.revenue ?? 0;
  const openOrders = orders.filter((o) => o.status !== "entregue").length;
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);

  const upcoming = [...orders]
    .filter((o) => o.status !== "entregue")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <Onboarding />

      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Bem-vinda ✨</p>
        <h1 className="font-serif text-3xl">Seu ateliê</h1>
        <p className="text-xs text-muted-foreground">
          Uma extensão do curso{" "}
          <span className="italic">Vivendo de Bordado</span> da Bella, no seu
          celular.
        </p>
      </header>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <p className="text-xs uppercase tracking-wide opacity-80">
            Faturamento de abril
          </p>
          <p className="font-serif text-4xl">{formatBRL(monthRevenue)}</p>
          <p className="mt-1 text-xs opacity-80">
            {openOrders} {openOrders === 1 ? "pedido aberto" : "pedidos abertos"} ·{" "}
            {formatHours(totalSeconds)} bordando
          </p>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="font-serif text-lg">Como o app pode te ajudar</h2>
        <div className="grid gap-2.5">
          {QUICK_LINKS.map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.href} href={q.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-3 pt-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-serif text-base leading-tight">
                        {q.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{q.body}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-lg">Próximas entregas</h2>
          <div className="space-y-2">
            {upcoming.map((o) => (
              <Card key={o.id}>
                <CardContent className="flex items-center justify-between pt-5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{o.clientName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.description}
                    </p>
                  </div>
                  <p className="ml-3 shrink-0 text-xs text-muted-foreground">
                    {new Date(o.dueDate + "T00:00:00").toLocaleDateString(
                      "pt-BR",
                      { day: "2-digit", month: "short" },
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-6 pb-2 text-center">
        <p className="text-xs text-muted-foreground">
          Feito pra alunas do{" "}
          <span className="italic">Vivendo de Bordado</span>
        </p>
      </footer>
    </div>
  );
}
