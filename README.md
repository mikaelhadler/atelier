# Atelier

Companion digital do curso **Vivendo de Bordado** (Bella). Protótipo MVP visual pra alunas — artesãs de 35–55 anos, com baixa familiaridade técnica — calcularem o preço justo de suas peças, organizarem pedidos e cronometrarem a produção.

> Esta é a primeira versão (MVP). Roda 100% no navegador, **sem backend**, com dados mockados e estado persistido em `localStorage`.

## Features

| Feature | O que faz |
|---|---|
| 🧮 **Calculadora** | Materiais + horas × valor/hora + margem + impostos + frete → preço sugerido com breakdown visual |
| 📋 **CRM de Pedidos** | Cliente, telefone (link WhatsApp), endereço, status, valor, forma de pagamento |
| ⏱ **Timer de Produção** | Cronômetro vinculado a um pedido. Mostra quanto valeu a sessão de bordado e atualiza o preço da peça |
| 👋 **Onboarding** | 4 passos didáticos no primeiro acesso |

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Zustand** (com `persist` em localStorage)
- **Vitest** (testes das funções puras)
- **Vercel** (hosting)

## Rodando local

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # roda vitest
npm run build    # build de produção
```

## Estrutura

```
app/                  # páginas (App Router)
├── page.tsx          # Painel inicial
├── precificar/       # Calculadora
├── pedidos/          # CRM
└── timer/            # Timer

components/
├── ui/               # shadcn components
├── nav/              # bottom navigation
├── precificacao/     # breakdown visual
├── pedidos/          # cards e form
└── onboarding/       # modal didático

lib/
├── store.ts          # Zustand store
├── pricing.ts        # cálculo de preço (pura, testada)
├── format.ts         # BRL e horas
├── mock-data.ts      # dataset inicial
└── types.ts          # tipos compartilhados
```

## Design

Paleta acolhedora **terracota / creme / sálvia** em OKLCH, tipografia **Fraunces** (serif acolhedor) + **Geist Sans**, mobile-first (público é 80% celular).

## Próximos passos (fora do MVP)

- Backend real (Postgres + Auth)
- Multi-usuário com sync entre dispositivos
- Integração WhatsApp Business API
- Agente IA pra escrever bio do Instagram
- Gamificação (badges, conquistas)

## Licença

Privado — uso interno do projeto Vivendo de Bordado.
