"use client";
import { formatBRL } from "@/lib/format";

export function Breakdown({
  materials,
  labor,
  margin,
  tax,
  shipping,
}: {
  materials: number;
  labor: number;
  margin: number;
  tax: number;
  shipping: number;
}) {
  const total = Math.max(materials + labor + margin + tax + shipping, 1);
  const pct = (n: number) => `${(n / total) * 100}%`;
  const items = [
    { label: "Material", value: materials, color: "bg-primary" },
    { label: "Trabalho", value: labor, color: "bg-accent" },
    { label: "Lucro", value: margin, color: "bg-foreground" },
    { label: "Imposto", value: tax, color: "bg-chart-3" },
    { label: "Frete", value: shipping, color: "bg-chart-4" },
  ];
  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {items.map((it) => (
          <div key={it.label} className={it.color} style={{ width: pct(it.value) }} />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it.label} className="flex justify-between">
            <span className="opacity-70">{it.label}</span>
            <span>{formatBRL(it.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
