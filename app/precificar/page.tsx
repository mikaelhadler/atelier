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
  const taxPercent = useStore((s) => s.taxPercent);
  const setSettings = useStore((s) => s.setSettings);

  const [materials, setMaterials] = useState<Material[]>([
    { label: "Linha", value: 0 },
  ]);
  const [hours, setHours] = useState(2);
  const [shipping, setShipping] = useState(0);

  const result = calculatePrice({
    materials,
    hours,
    hourlyRate,
    marginPercent,
    taxPercent,
    shipping,
  });

  const updateMat = (i: number, patch: Partial<Material>) =>
    setMaterials((m) => m.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const onSlider = (
    key: "marginPercent" | "taxPercent",
    raw: number | readonly number[],
  ) => {
    const v = Array.isArray(raw) ? raw[0] : (raw as number);
    setSettings({ [key]: v });
  };

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl">Calculadora</h1>
        <p className="text-sm text-muted-foreground">
          Aqui você descobre o preço justo da sua peça — sem trabalhar de graça.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Quanto custou o material</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Adicione cada item: linha, agulha, tecido, botão... tudo que você comprou pra fazer essa peça.
          </p>
          {materials.map((m, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Item (ex: linha azul)"
                value={m.label}
                onChange={(e) => updateMat(i, { label: e.target.value })}
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={m.value || ""}
                onChange={(e) => updateMat(i, { value: parseFloat(e.target.value) || 0 })}
                className="w-28"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMaterials((mm) => mm.filter((_, idx) => idx !== i))}
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
          <CardTitle className="text-base">2. Seu trabalho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Quantas horas você levou pra fazer essa peça? Se ainda não sabe, use o Timer e ele preenche pra você.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="hours">Horas trabalhadas</Label>
              <Input
                id="hours"
                type="number"
                inputMode="decimal"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rate">Sua hora vale</Label>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            3. Margem de lucro: {marginPercent}%
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Esse é o valor que sobra pra você crescer: investir em material novo, comprar uma agulha melhor, separar pro mês difícil. A Bella sugere começar com 30%.
          </p>
          <Slider
            value={[marginPercent]}
            min={0}
            max={100}
            step={5}
            onValueChange={(v) => onSlider("marginPercent", v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            4. Impostos: {taxPercent}%
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Se você tem MEI, normalmente é 6%. Se ainda não emite nota, deixe em 0%.
          </p>
          <Slider
            value={[taxPercent]}
            min={0}
            max={20}
            step={1}
            onValueChange={(v) => onSlider("taxPercent", v)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">5. Frete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Vai entregar em casa? Coloque o valor do frete aqui. Se for retirada, deixe 0.
          </p>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="R$ 0,00"
            value={shipping || ""}
            onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
          />
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="space-y-4 pt-6">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">
              Preço justo da sua peça
            </p>
            <p className="font-serif text-4xl">
              {formatBRL(result.suggestedPrice)}
            </p>
            <p className="mt-1 text-xs opacity-80">
              Não cobre menos que isso. Esse valor respeita você e o seu tempo.
            </p>
          </div>
          <div className="rounded-xl bg-background/15 p-3">
            <Breakdown
              materials={result.materialsTotal}
              labor={result.laborTotal}
              margin={result.marginValue}
              tax={result.taxValue}
              shipping={result.shipping}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
