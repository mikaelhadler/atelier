"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Breakdown } from "@/components/precificacao/breakdown";
import { calculatePrice, type Material } from "@/lib/pricing";
import { formatBRL } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function PrecificarPage() {
  const hourlyRate = useStore((s) => s.hourlyRate);
  const marginPercent = useStore((s) => s.marginPercent);
  const setSettings = useStore((s) => s.setSettings);

  const [materials, setMaterials] = useState<Material[]>([
    { label: "Linha", value: 0 },
  ]);
  const [hours, setHours] = useState(1);

  const result = calculatePrice({ materials, hours, hourlyRate, marginPercent });
  const profit = result.suggestedPrice - result.subtotal;

  const updateMat = (i: number, patch: Partial<Material>) =>
    setMaterials((m) => m.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-3xl">Precificação</h1>
        <p className="text-sm text-muted-foreground">
          Calcule o preço justo do seu trabalho
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Materiais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {materials.map((m, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Item"
                value={m.label}
                onChange={(e) => updateMat(i, { label: e.target.value })}
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0,00"
                value={m.value || ""}
                onChange={(e) =>
                  updateMat(i, { value: parseFloat(e.target.value) || 0 })
                }
                className="w-28"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setMaterials((mm) => mm.filter((_, idx) => idx !== i))
                }
                aria-label="Remover item"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMaterials((m) => [...m, { label: "", value: 0 }])}
          >
            <Plus className="size-4" /> Adicionar item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mão de obra</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="hours">Horas</Label>
            <Input
              id="hours"
              type="number"
              inputMode="decimal"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rate">Valor/hora</Label>
            <Input
              id="rate"
              type="number"
              inputMode="decimal"
              value={hourlyRate}
              onChange={(e) =>
                setSettings({ hourlyRate: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Margem de lucro: {marginPercent}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            value={[marginPercent]}
            min={0}
            max={100}
            step={5}
            onValueChange={(v) => {
              const next = Array.isArray(v) ? v[0] : v;
              setSettings({ marginPercent: next });
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="space-y-4 pt-6">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">
              Preço sugerido
            </p>
            <p className="font-serif text-4xl">
              {formatBRL(result.suggestedPrice)}
            </p>
          </div>
          <div className="rounded-xl bg-background/10 p-3">
            <Breakdown
              materials={result.materialsTotal}
              labor={result.laborTotal}
              profit={profit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
