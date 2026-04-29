"use client";
import { formatBRL } from "@/lib/format";

export function Breakdown({
  materials,
  labor,
  profit,
}: {
  materials: number;
  labor: number;
  profit: number;
}) {
  const total = Math.max(materials + labor + profit, 1);
  const pct = (n: number) => `${(n / total) * 100}%`;
  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className="bg-primary" style={{ width: pct(materials) }} />
        <div className="bg-accent" style={{ width: pct(labor) }} />
        <div className="bg-foreground" style={{ width: pct(profit) }} />
      </div>
      <ul className="grid grid-cols-3 gap-2 text-sm">
        <li>
          <span className="block text-xs opacity-70">Material</span>
          {formatBRL(materials)}
        </li>
        <li>
          <span className="block text-xs opacity-70">Mão de obra</span>
          {formatBRL(labor)}
        </li>
        <li>
          <span className="block text-xs opacity-70">Lucro</span>
          {formatBRL(profit)}
        </li>
      </ul>
    </div>
  );
}
