"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function AIFeatureCard() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <>
      <Card className="border-dashed border-accent/40 bg-accent/5">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-start justify-between gap-3">
            <Sparkles className="size-6 shrink-0 text-accent" />
            <Badge variant="secondary">Em breve</Badge>
          </div>
          <div>
            <h3 className="font-serif text-xl">Sua bio do Instagram em 30s</h3>
            <p className="text-sm text-muted-foreground">
              Um assistente que escreve a bio perfeita pro seu negócio
              artesanal
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Quero testar quando lançar
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setDone(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {done ? "Anotado!" : "Avise-me quando lançar"}
            </DialogTitle>
          </DialogHeader>
          {done ? (
            <p className="text-sm">
              Vamos te avisar assim que estiver pronto.
            </p>
          ) : (
            <div className="space-y-3">
              <Input type="email" placeholder="seu@email.com" />
              <Button className="w-full" onClick={() => setDone(true)}>
                Quero ser avisada
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
