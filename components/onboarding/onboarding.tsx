"use client";
import { useEffect, useState } from "react";
import { Calculator, ListChecks, Sparkles, Timer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const STEPS = [
  {
    icon: Sparkles,
    title: "Oi! Bem-vinda ao seu ateliê digital",
    body: "Esse aplicativo é uma extensão do curso Vivendo de Bordado. Cada feature aqui dentro foi pensada pra te ajudar a vender melhor o que você já aprendeu com a Bella.",
  },
  {
    icon: Calculator,
    title: "Calcule o preço justo",
    body: "Coloque seus materiais, suas horas, escolha sua margem de lucro — e o app te diz o preço. Aquela planilha que a Bella mostra nas aulas, agora aqui dentro do celular.",
  },
  {
    icon: ListChecks,
    title: "Organize seus pedidos",
    body: "Anote o nome da cliente, telefone, endereço e o que ela pediu. Tudo num lugar só. Acabou aquele papelzinho que some.",
  },
  {
    icon: Timer,
    title: "Cronometre o seu trabalho",
    body: "Aperte play quando começar a bordar. Quando parar, o app calcula quanto vale o seu tempo — e atualiza o preço daquela peça na hora.",
  },
];

export function Onboarding() {
  const seen = useStore((s) => s.hasSeenOnboarding);
  const markSeen = useStore((s) => s.markOnboardingSeen);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!seen) setOpen(true);
  }, [seen]);

  const close = () => {
    markSeen();
    setOpen(false);
    setStep(0);
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? close() : null)}>
      <DialogContent className="sm:max-w-sm">
        <DialogTitle className="sr-only">{current.title}</DialogTitle>
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Passo {step + 1} de {STEPS.length}
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-tight">
              {current.title}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {current.body}
          </p>

          <div className="flex gap-1.5 pt-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`size-1.5 rounded-full transition-colors ${
                  i === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="mt-2 flex w-full gap-2">
            {!isLast && (
              <Button variant="ghost" className="flex-1" onClick={close}>
                Pular
              </Button>
            )}
            <Button
              className="flex-1"
              size="lg"
              onClick={() => (isLast ? close() : setStep(step + 1))}
            >
              {isLast ? "Começar a usar" : "Próximo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
