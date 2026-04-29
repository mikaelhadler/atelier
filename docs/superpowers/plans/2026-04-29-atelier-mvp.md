# Atelier MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir e fazer deploy de um protótipo visual do Atelier (companion SaaS de artesãs) em Next.js 15 + shadcn, mockado, na Vercel.

**Architecture:** Next App Router, estado client-side em Zustand+persist (localStorage), zero backend, mobile-first. Cada feature em sua própria rota; componentes pequenos e focados.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, shadcn/ui, Zustand 5, Recharts, Vitest, Vercel.

---

## File Structure (locked-in)

| Caminho | Responsabilidade |
|---|---|
| `app/layout.tsx` | Root layout, fontes, providers, BottomNav |
| `app/page.tsx` | Painel de Ganhos (rota `/`) |
| `app/precificar/page.tsx` | Calculadora |
| `app/pedidos/page.tsx` | Mini-CRM (lista + form) |
| `app/timer/page.tsx` | Timer |
| `app/globals.css` | Reset + variáveis CSS de cor + shadcn theme |
| `components/ui/*` | shadcn components (button, card, dialog, input, label, slider, drawer, dropdown-menu, badge, tabs, sheet) |
| `components/nav/bottom-nav.tsx` | Tab bar fixo bottom |
| `components/precificacao/breakdown.tsx` | Barra horizontal de breakdown material/MO/lucro |
| `components/pedidos/order-card.tsx` | Card individual de pedido |
| `components/pedidos/order-form.tsx` | Form/dialog de novo/edit pedido |
| `components/timer/big-timer.tsx` | Display + start/pause/stop |
| `components/ganhos/badge-row.tsx` | Linha de badges desbloqueadas/locked |
| `components/ganhos/ai-feature-card.tsx` | Card "agente IA em breve" |
| `components/ganhos/revenue-chart.tsx` | Gráfico Recharts |
| `lib/store.ts` | Zustand store (orders, sessions, pricingPresets, settings) |
| `lib/mock-data.ts` | Dataset inicial |
| `lib/pricing.ts` | `calculatePrice(input)` — função pura |
| `lib/badges.ts` | `getUnlockedBadges(totalRevenue)` — função pura |
| `lib/format.ts` | `formatBRL`, `formatHours` — utilitários |
| `lib/__tests__/pricing.test.ts` | Testes de `calculatePrice` |
| `lib/__tests__/badges.test.ts` | Testes de `getUnlockedBadges` |
| `vitest.config.ts` | Config dos testes |
| `tailwind.config.ts` | Cores customizadas + plugin tailwindcss-animate |
| `components.json` | shadcn config |
| `package.json` | Deps |
| `tsconfig.json` | TS config |
| `next.config.ts` | Next config |

---

## Task 1: Scaffold Next.js + Tailwind + TS

**Files:**
- Create: estrutura inicial via `create-next-app`

- [ ] **Step 1: Rodar create-next-app**

```bash
cd /opt/cabritin/workspace/atelier
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --use-npm --turbopack=false --yes
```

Expected: cria `app/`, `package.json`, `tailwind.config.ts`, `tsconfig.json`. Sobrescreve `.gitignore`.

- [ ] **Step 2: Restaurar .gitignore custom**

```bash
cat > .gitignore <<'EOF'
node_modules
.next
.env*
!.env.example
.vercel
*.log
.DS_Store
coverage
EOF
```

- [ ] **Step 3: Smoke test build**

```bash
npm run build
```

Expected: build OK sem erros.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next 15 + TS + Tailwind"
```

---

## Task 2: Configurar shadcn/ui

**Files:**
- Create: `components.json`, `components/ui/*`, `lib/utils.ts`

- [ ] **Step 1: Init shadcn**

```bash
npx shadcn@latest init -y --base-color stone --css-variables
```

- [ ] **Step 2: Adicionar components básicos**

```bash
npx shadcn@latest add button card input label dialog drawer badge tabs sheet slider dropdown-menu separator
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

Expected: zero erros.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add shadcn/ui components"
```

---

## Task 3: Aplicar paleta Atelier + fontes

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`

- [ ] **Step 1: Importar fontes em layout**

```tsx
// app/layout.tsx
import { Fraunces, Geist } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata = {
  title: "Atelier",
  description: "Seu ateliê na palma da mão",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${geist.variable}`}>
      <body className="bg-background text-foreground font-sans min-h-screen pb-20">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Sobrescrever variáveis de cor em globals.css**

Adicionar dentro de `:root`:

```css
:root {
  --background: 36 50% 97%;        /* #FBF7F2 */
  --foreground: 22 35% 13%;        /* #2C1F18 */
  --card: 0 0% 100%;
  --card-foreground: 22 35% 13%;
  --primary: 13 53% 47%;            /* #B8553A terracota */
  --primary-foreground: 36 50% 97%;
  --accent: 86 21% 45%;             /* #7A8B5C sálvia */
  --accent-foreground: 36 50% 97%;
  --muted: 36 30% 92%;
  --muted-foreground: 22 20% 35%;
  --border: 22 20% 88%;
  --input: 22 20% 88%;
  --ring: 13 53% 47%;
  --radius: 1rem;
}
```

- [ ] **Step 3: Estender Tailwind com font families**

Em `tailwind.config.ts` dentro de `theme.extend`:

```ts
fontFamily: {
  serif: ["var(--font-fraunces)", "ui-serif"],
  sans: ["var(--font-geist)", "ui-sans-serif"],
},
```

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add -A && git commit -m "style: apply Atelier palette and fonts"
```

---

## Task 4: Funções puras + testes (`pricing.ts`, `badges.ts`, `format.ts`)

**Files:**
- Create: `lib/pricing.ts`, `lib/badges.ts`, `lib/format.ts`, `lib/__tests__/pricing.test.ts`, `lib/__tests__/badges.test.ts`, `vitest.config.ts`
- Modify: `package.json` (deps + scripts)

- [ ] **Step 1: Instalar Vitest**

```bash
npm i -D vitest @vitejs/plugin-react jsdom
```

- [ ] **Step 2: vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

Adicionar em `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 3: Test for pricing (TDD red)**

`lib/__tests__/pricing.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculatePrice } from "../pricing";

describe("calculatePrice", () => {
  it("soma material + mão de obra + margem", () => {
    const result = calculatePrice({
      materials: [{ label: "linha", value: 10 }, { label: "tecido", value: 20 }],
      hours: 2,
      hourlyRate: 25,
      marginPercent: 30,
    });
    expect(result.materialsTotal).toBe(30);
    expect(result.laborTotal).toBe(50);
    expect(result.subtotal).toBe(80);
    expect(result.suggestedPrice).toBeCloseTo(104, 2);
  });

  it("retorna zero quando inputs vazios", () => {
    const result = calculatePrice({ materials: [], hours: 0, hourlyRate: 0, marginPercent: 0 });
    expect(result.suggestedPrice).toBe(0);
  });

  it("ignora itens com value não-finito", () => {
    const result = calculatePrice({
      materials: [{ label: "x", value: NaN }, { label: "y", value: 5 }],
      hours: 0, hourlyRate: 0, marginPercent: 0,
    });
    expect(result.materialsTotal).toBe(5);
  });
});
```

- [ ] **Step 4: Run test → fail**

```bash
npm test
```

Expected: FAIL "Cannot find module '../pricing'".

- [ ] **Step 5: Implementar pricing.ts**

```ts
export type Material = { label: string; value: number };
export type PricingInput = {
  materials: Material[];
  hours: number;
  hourlyRate: number;
  marginPercent: number;
};
export type PricingResult = {
  materialsTotal: number;
  laborTotal: number;
  subtotal: number;
  suggestedPrice: number;
};

export function calculatePrice(input: PricingInput): PricingResult {
  const materialsTotal = input.materials.reduce(
    (acc, m) => acc + (Number.isFinite(m.value) ? m.value : 0),
    0
  );
  const laborTotal = (input.hours || 0) * (input.hourlyRate || 0);
  const subtotal = materialsTotal + laborTotal;
  const suggestedPrice = subtotal * (1 + (input.marginPercent || 0) / 100);
  return { materialsTotal, laborTotal, subtotal, suggestedPrice };
}
```

- [ ] **Step 6: Test passa**

```bash
npm test
```

Expected: 3 PASS.

- [ ] **Step 7: Test for badges (TDD red)**

`lib/__tests__/badges.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getUnlockedBadges, BADGES } from "../badges";

describe("getUnlockedBadges", () => {
  it("desbloqueia primeira-venda quando > 0", () => {
    const u = getUnlockedBadges(1);
    expect(u.find(b => b.id === "primeira-venda")?.unlocked).toBe(true);
  });

  it("desbloqueia 1k em 1000", () => {
    const u = getUnlockedBadges(1000);
    expect(u.find(b => b.id === "1k")?.unlocked).toBe(true);
    expect(u.find(b => b.id === "5k")?.unlocked).toBe(false);
  });

  it("retorna lista do tamanho de BADGES", () => {
    expect(getUnlockedBadges(0)).toHaveLength(BADGES.length);
  });
});
```

- [ ] **Step 8: Implementar badges.ts**

```ts
export type Badge = {
  id: string;
  label: string;
  threshold: number;
  emoji: string;
};

export const BADGES: Badge[] = [
  { id: "primeira-venda", label: "Primeira venda", threshold: 1, emoji: "🎉" },
  { id: "1k", label: "R$1.000 mensal", threshold: 1000, emoji: "🌱" },
  { id: "5k", label: "R$5.000 mensal", threshold: 5000, emoji: "🌟" },
  { id: "10k", label: "R$10.000 mensal", threshold: 10000, emoji: "🏆" },
];

export function getUnlockedBadges(totalMonthlyRevenue: number) {
  return BADGES.map(b => ({ ...b, unlocked: totalMonthlyRevenue >= b.threshold }));
}
```

- [ ] **Step 9: format.ts**

```ts
export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatHours = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(n => String(n).padStart(2, "0")).join(":");
};
```

- [ ] **Step 10: Run all tests + commit**

```bash
npm test
git add -A && git commit -m "feat(lib): pure functions for pricing, badges, format with tests"
```

Expected: 6 tests PASS.

---

## Task 5: Mock data + Zustand store

**Files:**
- Create: `lib/mock-data.ts`, `lib/store.ts`
- Modify: `package.json`

- [ ] **Step 1: Instalar Zustand**

```bash
npm i zustand
```

- [ ] **Step 2: lib/mock-data.ts**

```ts
import type { Order, TimerSession, MonthlyRevenue } from "./store";

export const MOCK_ORDERS: Order[] = [
  { id: "o1", clientName: "Joana Almeida", phone: "11999990001", description: "Toalhinha bordada com flores",   dueDate: "2026-05-04", value: 180, status: "em-producao", createdAt: "2026-04-25" },
  { id: "o2", clientName: "Fernanda Costa",  phone: "11999990002", description: "Quadro 30x40 nome do bebê",     dueDate: "2026-05-08", value: 220, status: "em-producao", createdAt: "2026-04-26" },
  { id: "o3", clientName: "Camila Ribeiro",  phone: "11999990003", description: "Pano de prato com monograma",  dueDate: "2026-05-15", value:  85, status: "a-fazer",     createdAt: "2026-04-28" },
];

export const MOCK_SESSIONS: TimerSession[] = [
  { id: "s1", orderId: "o1", durationSeconds: 5400, endedAt: "2026-04-26T18:00:00Z" },
  { id: "s2", orderId: "o1", durationSeconds: 3600, endedAt: "2026-04-27T20:00:00Z" },
];

export const MOCK_HISTORY: MonthlyRevenue[] = [
  { month: "Nov", revenue: 1200 },
  { month: "Dez", revenue: 1850 },
  { month: "Jan", revenue: 2100 },
  { month: "Fev", revenue: 2750 },
  { month: "Mar", revenue: 3200 },
  { month: "Abr", revenue: 3850 },
];
```

- [ ] **Step 3: lib/store.ts**

```ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_HISTORY, MOCK_ORDERS, MOCK_SESSIONS } from "./mock-data";

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

type Store = {
  orders: Order[];
  sessions: TimerSession[];
  history: MonthlyRevenue[];
  hourlyRate: number;
  marginPercent: number;

  addOrder: (o: Omit<Order, "id" | "createdAt">) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  addSession: (s: Omit<TimerSession, "id">) => void;
  setSettings: (patch: Partial<Pick<Store, "hourlyRate" | "marginPercent">>) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      orders: MOCK_ORDERS,
      sessions: MOCK_SESSIONS,
      history: MOCK_HISTORY,
      hourlyRate: 25,
      marginPercent: 30,

      addOrder: (o) => set((s) => ({
        orders: [{ ...o, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...s.orders],
      })),
      updateOrder: (id, patch) => set((s) => ({
        orders: s.orders.map((x) => x.id === id ? { ...x, ...patch } : x),
      })),
      removeOrder: (id) => set((s) => ({ orders: s.orders.filter((x) => x.id !== id) })),
      addSession: (sess) => set((s) => ({
        sessions: [{ ...sess, id: crypto.randomUUID() }, ...s.sessions],
      })),
      setSettings: (patch) => set((s) => ({ ...s, ...patch })),
    }),
    { name: "atelier-store-v1" }
  )
);
```

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add -A && git commit -m "feat(state): zustand store + mock data"
```

---

## Task 6: BottomNav + layout final

**Files:**
- Create: `components/nav/bottom-nav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: BottomNav**

```tsx
// components/nav/bottom-nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calculator, ListChecks, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/",            label: "Início",   icon: LayoutDashboard },
  { href: "/precificar",  label: "Preço",    icon: Calculator },
  { href: "/pedidos",     label: "Pedidos",  icon: ListChecks },
  { href: "/timer",       label: "Timer",    icon: Timer },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur border-t border-border">
      <ul className="grid grid-cols-4 max-w-md mx-auto">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-xs",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Adicionar BottomNav no layout**

Modificar `app/layout.tsx` body:

```tsx
<body className="bg-background text-foreground font-sans min-h-screen pb-20">
  <main className="max-w-md mx-auto px-4 pt-6 pb-24">{children}</main>
  <BottomNav />
</body>
```

(import: `import { BottomNav } from "@/components/nav/bottom-nav";`)

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add -A && git commit -m "feat(nav): bottom navigation + container layout"
```

---

## Task 7: Página de Precificação

**Files:**
- Create: `app/precificar/page.tsx`, `components/precificacao/breakdown.tsx`

- [ ] **Step 1: Breakdown component**

```tsx
// components/precificacao/breakdown.tsx
"use client";
import { formatBRL } from "@/lib/format";

export function Breakdown({ materials, labor, profit }: {
  materials: number; labor: number; profit: number;
}) {
  const total = Math.max(materials + labor + profit, 1);
  const pct = (n: number) => `${(n / total) * 100}%`;
  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className="bg-primary"  style={{ width: pct(materials) }} />
        <div className="bg-accent"   style={{ width: pct(labor) }} />
        <div className="bg-foreground" style={{ width: pct(profit) }} />
      </div>
      <ul className="text-sm grid grid-cols-3 gap-2">
        <li><span className="block text-xs text-muted-foreground">Material</span>{formatBRL(materials)}</li>
        <li><span className="block text-xs text-muted-foreground">Mão de obra</span>{formatBRL(labor)}</li>
        <li><span className="block text-xs text-muted-foreground">Lucro</span>{formatBRL(profit)}</li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Page**

```tsx
// app/precificar/page.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import { Breakdown } from "@/components/precificacao/breakdown";
import { calculatePrice, type Material } from "@/lib/pricing";
import { formatBRL } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function PrecificarPage() {
  const { hourlyRate, marginPercent, setSettings } = useStore();
  const [materials, setMaterials] = useState<Material[]>([{ label: "Linha", value: 0 }]);
  const [hours, setHours] = useState(1);
  const result = calculatePrice({ materials, hours, hourlyRate, marginPercent });
  const profit = result.suggestedPrice - result.subtotal;

  const updateMat = (i: number, patch: Partial<Material>) =>
    setMaterials(m => m.map((it, idx) => idx === i ? { ...it, ...patch } : it));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-3xl">Precificação</h1>
        <p className="text-muted-foreground text-sm">Calcule o preço justo do seu trabalho</p>
      </header>

      <Card>
        <CardHeader><CardTitle className="text-base">Materiais</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {materials.map((m, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="Item" value={m.label} onChange={(e) => updateMat(i, { label: e.target.value })} />
              <Input type="number" inputMode="decimal" placeholder="0,00" value={m.value || ""}
                onChange={(e) => updateMat(i, { value: parseFloat(e.target.value) || 0 })} className="w-28" />
              <Button variant="ghost" size="icon" onClick={() => setMaterials(mm => mm.filter((_, idx) => idx !== i))}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setMaterials(m => [...m, { label: "", value: 0 }])}>
            <Plus className="size-4" /> Adicionar item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Mão de obra</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Horas</Label>
              <Input type="number" inputMode="decimal" value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Valor/hora</Label>
              <Input type="number" inputMode="decimal" value={hourlyRate}
                onChange={(e) => setSettings({ hourlyRate: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Margem de lucro: {marginPercent}%</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider value={[marginPercent]} min={0} max={100} step={5}
            onValueChange={([v]) => setSettings({ marginPercent: v })} />
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">Preço sugerido</p>
            <p className="font-serif text-4xl">{formatBRL(result.suggestedPrice)}</p>
          </div>
          <div className="bg-background/10 rounded-xl p-3">
            <Breakdown materials={result.materialsTotal} labor={result.laborTotal} profit={profit} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add -A && git commit -m "feat(pricing): precificação page with live breakdown"
```

---

## Task 8: Página de Pedidos (CRM)

**Files:**
- Create: `app/pedidos/page.tsx`, `components/pedidos/order-card.tsx`, `components/pedidos/order-form.tsx`

- [ ] **Step 1: OrderCard**

```tsx
// components/pedidos/order-card.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import type { Order } from "@/lib/store";
import { formatBRL } from "@/lib/format";

const STATUS_LABEL: Record<Order["status"], string> = {
  "a-fazer": "A fazer",
  "em-producao": "Em produção",
  "entregue": "Entregue",
};

export function OrderCard({ order, onClick }: { order: Order; onClick?: () => void }) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="pt-5 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-serif text-lg leading-tight">{order.clientName}</p>
            <p className="text-xs text-muted-foreground">{order.description}</p>
          </div>
          <Badge variant="secondary">{STATUS_LABEL[order.status]}</Badge>
        </div>
        <div className="flex justify-between items-center text-sm">
          <a href={`tel:${order.phone}`} onClick={(e) => e.stopPropagation()}
             className="flex items-center gap-1 text-muted-foreground">
            <Phone className="size-3" /> {order.phone}
          </a>
          <span className="font-medium">{formatBRL(order.value)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Entrega: {new Date(order.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: OrderForm (dialog)**

```tsx
// components/pedidos/order-form.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export function OrderForm() {
  const addOrder = useStore((s) => s.addOrder);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ clientName: "", phone: "", description: "", dueDate: "", value: 0 });

  const submit = () => {
    if (!form.clientName) return;
    addOrder({ ...form, status: "a-fazer" });
    setOpen(false);
    setForm({ clientName: "", phone: "", description: "", dueDate: "", value: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4" /> Novo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo pedido</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Cliente</Label><Input value={form.clientName} onChange={(e) => setForm(f => ({ ...f, clientName: e.target.value }))} /></div>
          <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          <div><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Data de entrega</Label><Input type="date" value={form.dueDate} onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
            <div><Label>Valor</Label><Input type="number" value={form.value || ""} onChange={(e) => setForm(f => ({ ...f, value: parseFloat(e.target.value) || 0 }))} /></div>
          </div>
          <Button onClick={submit} className="w-full">Salvar pedido</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Pedidos page**

```tsx
// app/pedidos/page.tsx
"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "@/components/pedidos/order-card";
import { OrderForm } from "@/components/pedidos/order-form";
import { useStore, type OrderStatus } from "@/lib/store";

const FILTERS: ({ key: "all" | OrderStatus; label: string })[] = [
  { key: "all",          label: "Todos" },
  { key: "a-fazer",      label: "A fazer" },
  { key: "em-producao",  label: "Em produção" },
  { key: "entregue",     label: "Entregue" },
];

export default function PedidosPage() {
  const orders = useStore((s) => s.orders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const sorted = [...filtered].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Pedidos</h1>
          <p className="text-muted-foreground text-sm">{orders.length} no total</p>
        </div>
        <OrderForm />
      </header>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="w-full grid grid-cols-4">
          {FILTERS.map(f => <TabsTrigger key={f.key} value={f.key}>{f.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {sorted.length === 0
          ? <p className="text-center text-muted-foreground py-8">Nenhum pedido por aqui</p>
          : sorted.map((o) => <OrderCard key={o.id} order={o} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add -A && git commit -m "feat(pedidos): mini CRM with cards, filters, new-order form"
```

---

## Task 9: Página do Timer

**Files:**
- Create: `app/timer/page.tsx`, `components/timer/big-timer.tsx`

- [ ] **Step 1: BigTimer + page**

```tsx
// app/timer/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatHours, formatBRL } from "@/lib/format";

export default function TimerPage() {
  const { orders, sessions, addSession, hourlyRate } = useStore();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const stop = () => {
    if (seconds === 0) { setRunning(false); return; }
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
        <p className="text-muted-foreground text-sm">Conte cada minuto do seu trabalho</p>
      </header>

      <Card className="bg-foreground text-background">
        <CardContent className="pt-10 pb-8 flex flex-col items-center gap-6">
          <p className="font-serif text-6xl tabular-nums">{formatHours(seconds)}</p>
          <p className="text-sm opacity-70">~ {formatBRL(earned)} ganhos</p>
          <div className="flex gap-3">
            {!running ? (
              <Button size="lg" onClick={() => setRunning(true)}><Play className="size-5" /> Iniciar</Button>
            ) : (
              <Button size="lg" variant="secondary" onClick={() => setRunning(false)}><Pause className="size-5" /> Pausar</Button>
            )}
            <Button size="lg" variant="destructive" onClick={stop}><Square className="size-5" /> Parar</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-serif text-xl mb-3">Histórico</h2>
        {sessions.length === 0
          ? <p className="text-muted-foreground text-sm">Nenhuma sessão ainda</p>
          : <ul className="space-y-2">
              {sessions.slice(0, 10).map((s) => (
                <li key={s.id} className="flex justify-between text-sm">
                  <span>{new Date(s.endedAt).toLocaleString("pt-BR")}</span>
                  <span className="tabular-nums">{formatHours(s.durationSeconds)}</span>
                </li>
              ))}
            </ul>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add -A && git commit -m "feat(timer): work timer with session history"
```

---

## Task 10: Painel de Ganhos (página inicial `/`)

**Files:**
- Create: `components/ganhos/badge-row.tsx`, `components/ganhos/ai-feature-card.tsx`, `components/ganhos/revenue-chart.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: BadgeRow**

```tsx
// components/ganhos/badge-row.tsx
"use client";
import { cn } from "@/lib/utils";
import type { Badge } from "@/lib/badges";

export function BadgeRow({ badges }: { badges: (Badge & { unlocked: boolean })[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {badges.map((b) => (
        <div key={b.id}
             className={cn(
               "min-w-[6.5rem] flex-shrink-0 rounded-2xl border p-3 text-center",
               b.unlocked ? "bg-accent/15 border-accent/30" : "bg-muted/40 border-border opacity-50"
             )}>
          <p className="text-2xl">{b.unlocked ? b.emoji : "🔒"}</p>
          <p className="text-xs leading-tight mt-1">{b.label}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: RevenueChart**

```tsx
// components/ganhos/revenue-chart.tsx
"use client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { MonthlyRevenue } from "@/lib/store";
import { formatBRL } from "@/lib/format";

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip formatter={(v: number) => formatBRL(v)} cursor={{ fill: "transparent" }} />
        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8,8,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 3: AIFeatureCard**

```tsx
// components/ganhos/ai-feature-card.tsx
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export function AIFeatureCard() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <>
      <Card className="border-dashed border-accent/40 bg-accent/5">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <Sparkles className="size-6 text-accent shrink-0" />
            <Badge variant="secondary">Em breve</Badge>
          </div>
          <div>
            <h3 className="font-serif text-xl">Sua bio do Instagram em 30s</h3>
            <p className="text-sm text-muted-foreground">Um assistente que escreve a bio perfeita pro seu negócio artesanal</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Quero testar quando lançar</Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setDone(false); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{done ? "Anotado!" : "Avise-me quando lançar"}</DialogTitle></DialogHeader>
          {done
            ? <p className="text-sm">Vamos te avisar assim que estiver pronto.</p>
            : <div className="space-y-3">
                <Input type="email" placeholder="seu@email.com" />
                <Button className="w-full" onClick={() => setDone(true)}>Quero ser avisada</Button>
              </div>}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

- [ ] **Step 4: app/page.tsx**

```tsx
// app/page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { formatBRL, formatHours } from "@/lib/format";
import { getUnlockedBadges } from "@/lib/badges";
import { BadgeRow } from "@/components/ganhos/badge-row";
import { RevenueChart } from "@/components/ganhos/revenue-chart";
import { AIFeatureCard } from "@/components/ganhos/ai-feature-card";

export default function HomePage() {
  const { orders, sessions, history } = useStore();
  const monthRevenue = history[history.length - 1]?.revenue ?? 0;
  const openOrders = orders.filter((o) => o.status !== "entregue").length;
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const ticketMedio = orders.length ? orders.reduce((a, o) => a + o.value, 0) / orders.length : 0;
  const badges = getUnlockedBadges(monthRevenue);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-muted-foreground">Bem-vinda, Bela ✨</p>
        <h1 className="font-serif text-3xl">Seu ateliê</h1>
      </header>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <p className="text-xs uppercase tracking-wide opacity-80">Faturamento do mês</p>
          <p className="font-serif text-4xl">{formatBRL(monthRevenue)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Últimos 6 meses</CardTitle></CardHeader>
        <CardContent><RevenueChart data={history} /></CardContent>
      </Card>

      <div>
        <h2 className="font-serif text-lg mb-2">Conquistas</h2>
        <BadgeRow badges={badges} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-5 text-center">
          <p className="font-serif text-2xl">{openOrders}</p>
          <p className="text-xs text-muted-foreground">Pedidos abertos</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <p className="font-serif text-xl tabular-nums">{formatHours(totalSeconds)}</p>
          <p className="text-xs text-muted-foreground">Horas trabalhadas</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <p className="font-serif text-2xl">{formatBRL(ticketMedio)}</p>
          <p className="text-xs text-muted-foreground">Ticket médio</p>
        </CardContent></Card>
      </div>

      <AIFeatureCard />
    </div>
  );
}
```

- [ ] **Step 5: Adicionar recharts**

```bash
npm i recharts
```

- [ ] **Step 6: Build + commit**

```bash
npm run build
git add -A && git commit -m "feat(home): painel de ganhos with chart, badges and AI teaser"
```

---

## Task 11: Polish + verify everything

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: 6/6 PASS.

- [ ] **Step 2: Build production**

```bash
npm run build
```

Expected: build OK, sem warnings críticos.

- [ ] **Step 3: Smoke navigate**

```bash
npm run start &
sleep 3
curl -s http://localhost:3000/ | grep -i "atelier"
curl -s http://localhost:3000/precificar | grep -i "precificação"
curl -s http://localhost:3000/pedidos | grep -i "pedidos"
curl -s http://localhost:3000/timer | grep -i "timer"
kill %1
```

Expected: cada `curl` encontra a string esperada.

---

## Task 12: Deploy Vercel

- [ ] **Step 1: Login Vercel via token**

```bash
source /opt/cabritin/.secrets/vercel.env
cd /opt/cabritin/workspace/atelier
vercel link --yes --token "$VERCEL_TOKEN" --project atelier 2>&1
```

- [ ] **Step 2: Deploy**

```bash
vercel deploy --prod --yes --token "$VERCEL_TOKEN" 2>&1 | tail -10
```

Expected: URL `https://atelier-<hash>.vercel.app` impressa.

- [ ] **Step 3: Verify URL responds 200**

```bash
URL=$(vercel ls atelier --token "$VERCEL_TOKEN" 2>&1 | head -3)
echo "$URL"
```

- [ ] **Step 4: Notificar Mikael via outbox**

JSON em `/opt/cabritin-bot/outbox/` com `chat_id 882605028` e a URL final.

---

## Self-Review Checklist

- [x] Todos os arquivos têm caminho exato
- [x] Cada step tem código completo
- [x] Tipos batem entre arquivos (`Material`, `Order`, `OrderStatus`, `MonthlyRevenue`, `TimerSession`)
- [x] Spec coverage: precificação ✓, CRM ✓, timer ✓, painel ✓, agente IA card ✓
- [x] Mobile-first ✓ (max-w-md container, bottom nav)
- [x] Dados mockados ✓ (`MOCK_ORDERS`, `MOCK_SESSIONS`, `MOCK_HISTORY`)
- [x] Persistência localStorage via Zustand persist
- [x] Deploy Vercel coberto na Task 12

---

## Execution mode

Ordem das tasks é sequencial mas tasks 6-10 (BottomNav + 4 páginas) podem ser delegadas em paralelo a subagents diferentes — cada um trabalha em arquivos isolados.

**Plano:**
- Cabritin (controlador) executa Tasks 1-5 inline (pré-requisitos: scaffold, shadcn, paleta, lib, store) — são bloqueantes pra todo mundo.
- Tasks 6-10 (UI das páginas) → 1 subagent `general-purpose` por task em paralelo.
- Cabritin junta na Task 11 (polish) e dispara Task 12 (deploy).
