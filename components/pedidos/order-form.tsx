"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { PaymentMethod } from "@/lib/types";

const PAY_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "pix", label: "Pix" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao", label: "Cartão" },
  { value: "boleto", label: "Boleto" },
];

const initial = {
  clientName: "",
  phone: "",
  description: "",
  dueDate: "",
  value: 0,
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  paymentMethod: "pix" as PaymentMethod,
};

export function OrderForm() {
  const addOrder = useStore((s) => s.addOrder);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);

  const submit = () => {
    if (!form.clientName) return;
    addOrder({
      clientName: form.clientName,
      phone: form.phone,
      description: form.description,
      dueDate: form.dueDate,
      value: form.value,
      status: "a-fazer",
      paymentMethod: form.paymentMethod,
      address: form.street
        ? {
            cep: form.cep,
            street: form.street,
            number: form.number,
            neighborhood: form.neighborhood,
            city: form.city,
          }
        : undefined,
    });
    setOpen(false);
    setForm(initial);
  };

  const setField = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="size-4" /> Novo
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo pedido</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Anote já pra não esquecer. Você pode preencher só os campos essenciais
            agora e completar depois.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Cliente
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="clientName">Nome</Label>
              <Input
                id="clientName"
                value={form.clientName}
                onChange={(e) => setField("clientName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">WhatsApp (com DDD)</Label>
              <Input
                id="phone"
                placeholder="11999999999"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pedido
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="description">O que vai fazer</Label>
              <Input
                id="description"
                placeholder="Ex: tapete redondo cor terracota"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Entrega em</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setField("dueDate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">Valor (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  inputMode="decimal"
                  value={form.value || ""}
                  onChange={(e) =>
                    setField("value", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Pagamento</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {PAY_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setField("paymentMethod", p.value)}
                    className={`rounded-md border px-2 py-1.5 text-xs transition-colors ${
                      form.paymentMethod === p.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Endereço de entrega <span className="opacity-60">(opcional)</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5 col-span-1">
                <Label htmlFor="cep" className="text-xs">CEP</Label>
                <Input
                  id="cep"
                  value={form.cep}
                  onChange={(e) => setField("cep", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="street" className="text-xs">Rua</Label>
                <Input
                  id="street"
                  value={form.street}
                  onChange={(e) => setField("street", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="number" className="text-xs">Nº</Label>
                <Input
                  id="number"
                  value={form.number}
                  onChange={(e) => setField("number", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="neighborhood" className="text-xs">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={form.neighborhood}
                  onChange={(e) => setField("neighborhood", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs">Cidade</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
            </div>
          </section>

          <Button onClick={submit} className="w-full" size="lg">
            Salvar pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
