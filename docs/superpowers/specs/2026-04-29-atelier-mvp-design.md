# Atelier — MVP Design Spec

**Data:** 2026-04-29
**Status:** Aprovado pelo Mikael (responsável de produto / dono do Cabritin)
**Autor:** Cabritin (assistente do Mikael)
**Cliente final:** Bela (Bem Bordado)

---

## Contexto

Bela vende um curso (Bem Bordado, ticket R$800, 19k leads/ciclo, audiência 35-45 anos, 80% mobile) que ensina pessoas a bordar do zero e monetizar como artesãs. As duas entregáveis mais amadas do curso são planilhas: uma de **precificação** e outra de **organização/CRM de clientes**.

Ela quer transformar essas planilhas em um SaaS-companion do curso (modelo Bumper / Vendo Todo Santo Dia) — um app que agrega valor ao curso atual e abre nova receita recorrente. O produto deve ser **desvinculado da palavra "bordado"** desde o nome/identidade pra escalar pra outros artesanatos no futuro.

Esta MVP é um **protótipo visual interativo** (zero backend, dados mockados, deploy Vercel) pra validar UX/proposta de valor com a Bela antes de construir o sistema real.

## Goals

1. Demonstrar visualmente as 4 features mais valiosas + 1 card de feature futura (agente IA)
2. UX mobile-first (80% do público usa celular)
3. Estética acolhedora artesanal (terracota/creme/marrom-suave + serif acolhedor)
4. Persistência local via `localStorage` (Zustand persist) — usuário pode usar e voltar com os dados
5. Deploy público numa URL Vercel pra Bela testar do celular dela

## Non-Goals

- ❌ Login / autenticação
- ❌ Backend / banco de dados / API
- ❌ Multi-usuário / acessos
- ❌ Gateway de pagamento / abacate pay
- ❌ Integração WhatsApp API
- ❌ Agente IA real (só o card visual da feature)
- ❌ App nativo iOS/Android (PWA via navegador)

## Features (escopo)

### 1. Calculadora de Precificação (hero)

**Por quê:** o Biel disse na call que essa é a feature pela qual as pessoas se apaixonam. É a porta de entrada visual do app.

**Inputs:**
- Custo dos materiais (R$, com lista editável "linha + valor")
- Tempo estimado de trabalho (em horas, ou via Timer da feature 3)
- Valor-hora desejado da artesã (R$/h)
- Margem de lucro % (slider, default 30%)

**Output:**
- Preço sugerido com **breakdown visual** (barra horizontal mostrando: material / mão-de-obra / lucro)
- Botão "Salvar como modelo" — vira um preset reutilizável

### 2. Mini-CRM de Clientes / Pedidos

**Por quê:** segunda entregável mais amada do curso (planilha de organização).

**Telas:**
- Lista de pedidos em formato de cards, ordenada por data de entrega
- Cada card tem: nome cliente, telefone (clicável → `tel:`), status (a fazer / em produção / entregue), data de entrega, valor
- Filtros rápidos por status (chips em cima da lista)
- "+ Novo pedido" → modal com form (cliente, telefone, descrição, data, valor)
- Tap no card → drawer com detalhes editáveis

### 3. Timer de Trabalho

**Por quê:** o Biel falou que ele viu um gringo fazendo isso pra lavagem de carro e faz muito sentido pra artesanato (custo principal é mão de obra).

**Comportamento:**
- Botão grande Start/Pause/Stop
- Display do tempo decorrido em formato `HH:MM:SS`
- Ao parar, abre prompt: "Vincular a um pedido?" (lista os pedidos em-produção do CRM)
- Tempo registrado vai pro pedido (alimenta a calculadora #1)
- Histórico de sessões na parte de baixo

### 4. Painel de Ganhos (dashboard de boas-vindas)

**Por quê:** gamificação leve que a Bela pediu, estilo Hotmart "faturou X, ganhou plaquinha".

**Conteúdo:**
- Card grande: "Você faturou R$ X,XX este mês" (mock crescente)
- Gráfico de barras simples (últimos 6 meses, mockados)
- Linha de badges/conquistas: "Primeira venda", "R$1k mensal", "R$5k mensal", "R$10k mensal" — algumas conquistadas (coloridas), outras locked (cinzas)
- Micro-cards: "Pedidos abertos", "Horas trabalhadas no mês", "Ticket médio"

### 5. Card "Agente IA" (futura — apenas visual)

**Por quê:** a Bela quer um agente IA tipo o do Ladeirinha pra ajudar a artesã a montar a bio do Instagram. No MVP é só uma vitrine pra ver reação.

**Implementação:**
- Card destacado no Painel de Ganhos com badge "Em breve"
- Título: "Sua bio do Instagram em 30 segundos"
- Botão "Quero testar" → abre dialog "Avise-me quando estiver pronto" + email field (não envia nada, só fake-toast "Anotado!")

## Arquitetura

### Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | Pedido pelo Mikael, deploy nativo Vercel |
| UI | shadcn/ui + Tailwind v4 | Pedido pelo Mikael, coerência visual |
| Estado | Zustand + persist middleware (localStorage) | Simula "banco" sem backend, sobrevive a refresh |
| Charts | Recharts (já compatível com shadcn) | Pra o gráfico do Painel |
| Ícones | lucide-react (default shadcn) | — |
| Fonts | Fraunces (serif acolhedor) + Geist Sans (corpo) | Tom artesanal feminino |
| Hosting | Vercel | Pedido pelo Mikael |

### Estrutura de pastas

```
atelier/
├── app/
│   ├── layout.tsx            # Bottom nav + theme
│   ├── page.tsx              # Painel de Ganhos (rota /)
│   ├── precificar/page.tsx   # Calculadora
│   ├── pedidos/page.tsx      # CRM
│   └── timer/page.tsx        # Timer
├── components/
│   ├── ui/                   # shadcn (button, card, dialog, ...)
│   ├── nav/bottom-nav.tsx    # Tab bar mobile
│   ├── precificacao/breakdown.tsx
│   ├── pedidos/order-card.tsx
│   ├── pedidos/order-form.tsx
│   ├── timer/big-timer.tsx
│   ├── ganhos/badge-row.tsx
│   └── ganhos/ai-feature-card.tsx
├── lib/
│   ├── store.ts              # Zustand store (orders, timer sessions, settings)
│   ├── mock-data.ts          # Dados iniciais (5 clientes, 3 pedidos, histórico)
│   ├── pricing.ts            # Função pura: calcula preço
│   └── badges.ts             # Função pura: quais badges desbloqueadas
├── public/                   # Logo, favicon
├── tailwind.config.ts
├── components.json           # shadcn config
└── package.json
```

### Data flow

1. App inicializa → Zustand store hidrata do `localStorage`
2. Se vazio → carrega `mock-data.ts` (Bela vê o app já populado, não precisa cadastrar nada pra "ver"
3. Toda mutação (novo pedido, timer parado, pricing salvo) passa pelo store → autosalva em localStorage
4. Componentes leem direto do store via hooks (`useOrders()`, `useTimer()`, `useStats()`)

### Paleta / Tom visual

- **Background:** `#FBF7F2` (creme quente)
- **Primary:** `#B8553A` (terracota)
- **Accent:** `#7A8B5C` (sálvia esfumada)
- **Text:** `#2C1F18` (marrom muito escuro)
- **Cards:** `#FFFFFF` com sombra suave
- Border radius xl em tudo (16-24px) — sensação acolhedora, não corporativa
- Microinterações: spring animations no Framer Motion onde fizer sentido (entrada de cards, badge desbloqueada)

## Routing / Navegação

Bottom tab bar fixa (mobile-first). 4 tabs:

| Ícone | Label | Rota |
|---|---|---|
| LayoutDashboard | Início | `/` (Painel) |
| Calculator | Preço | `/precificar` |
| ListChecks | Pedidos | `/pedidos` |
| Timer | Timer | `/timer` |

Header em cada página com nome curto + ação contextual (ex: `+` em Pedidos).

## Mock data inicial

5 clientes / 3 pedidos com nomes brasileiros plausíveis (ex: Joana Almeida, Fernanda Costa, Camila Ribeiro), ticket entre R$80 e R$220, datas de entrega espalhadas nas próximas 3 semanas, dois com status "em produção" e um "a fazer". Histórico fake de 6 meses pra dashboard mostrar gráfico já populado (R$1.2k → R$3.8k crescente).

## Deploy

- Repositório local em `/opt/cabritin/workspace/atelier` (git init main)
- Push opcional pra GitHub (decidir na execução; Vercel também aceita CLI direto)
- `vercel deploy --prod --token $VERCEL_TOKEN` (token salvo em `/opt/cabritin/.secrets/vercel.env`)
- Domínio: `atelier-<hash>.vercel.app` (default Vercel) — ok pro MVP

## Riscos / Decisões pendentes pra fase 2 (fora do MVP)

- Como vai ser o login/multi-usuário (Auth.js + Postgres? Supabase?)
- Backup/sync entre dispositivos (a Bela usa do celular E desktop?)
- Integração WhatsApp pro CRM (Biel já alertou que vira complexo rápido)
- Real-time pricing com IA (gerar 100 variações de bio sem token, igual o Biel sugeriu)
- Pricing/billing do SaaS-companion (mensalidade? incluído no curso?)

---

## Critérios de aceitação do MVP

- [ ] Roda em produção numa URL `*.vercel.app` acessível
- [ ] Funciona em mobile (testado em viewport 375x812 = iPhone SE/13 mini)
- [ ] As 4 features são navegáveis e interativas
- [ ] Card do agente IA aparece com badge "em breve"
- [ ] Dados mockados aparecem no primeiro acesso
- [ ] Mutações persistem em refresh (localStorage)
- [ ] Lighthouse mobile > 85 em performance
