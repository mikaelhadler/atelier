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

export function OrderForm() {
  const addOrder = useStore((s) => s.addOrder);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    description: "",
    dueDate: "",
    value: 0,
  });

  const submit = () => {
    if (!form.clientName) return;
    addOrder({ ...form, status: "a-fazer" });
    setOpen(false);
    setForm({ clientName: "", phone: "", description: "", dueDate: "", value: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="size-4" /> Novo
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo pedido</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="clientName">Cliente</Label>
            <Input
              id="clientName"
              value={form.clientName}
              onChange={(e) =>
                setForm((f) => ({ ...f, clientName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Data</Label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                type="number"
                value={form.value || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    value: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
          <Button onClick={submit} className="w-full">
            Salvar pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
