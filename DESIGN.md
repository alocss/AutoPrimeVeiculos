# Design

<!-- impeccable:design-doc 1 -->

Sistema visual efetivamente construído para o AutoPrime Veículos, registrado a partir do código
(não é uma especificação prévia). Ver [PRODUCT.md](./PRODUCT.md) para o contexto de produto.

## Modo por superfície

- **Persuade:** Home (`/`) — hero, prova social, condições especiais.
- **Operate:** Estoque, página do veículo, Financiamento, Venda seu veículo, Favoritos, Admin —
  tarefa e escaneabilidade acima de expressão.
- **Read:** Sobre nós, FAQ de financiamento.

## Paleta

Estratégia **Restrained** (neutros + um acento): fundo branco premium, vermelho como único acento
comprometido, reservado para preço, CTA primário, badges e estados ativos — nunca decorativo.

| Token | Valor | Uso |
|---|---|---|
| `surface` | `#ffffff` | Fundo padrão |
| `surface-muted` | `#f7f7f8` | Seções alternadas, inputs de filtro |
| `surface-border` | `#e7e7ea` | Bordas de card, divisores |
| `ink-900` | `#111111` | Texto principal |
| `ink-600` | `#555555` | Texto secundário |
| `ink-400` | `#8a8a8a` | Legendas, rótulos uppercase |
| `primary-500` | `#D32F2F` | CTA primário, preço, badge "Destaque" |
| `primary-600` | `#b52424` | Hover de CTA |
| `success` | `#1e8e5a` | WhatsApp, badge "Novo", confirmações |
| `ink-900` (sólido) | `#111111` | Footer, header do painel admin, hero |

Contraste verificado: texto de corpo `ink-600` sobre `surface`/`surface-muted` ≥ 4.5:1; texto
sobre `ink-900` usa branco/`white/70`, nunca cinza puro.

## Tipografia

- **Display (`--font-poppins`):** títulos, preço em destaque — peso 600–800.
- **Corpo (`--font-inter`):** parágrafos, formulários, tabelas — peso 400–600.
- Corpo de leitura (descrições, inputs, texto do hero) em `text-base` (16px) mínimo; metadados de
  UI (badges, rótulos de filtro, células de tabela) podem ser menores por serem funcionais, não
  prosa.
- `tracking-tighter` (-0.03em) em headlines display; números (preço, KM, ano, parcelas) sempre com
  `tabular-nums` para não "pular" ao atualizar.

## Componentes-chave

- **VehicleCard / VehicleListRow:** foto com overlay no hover, badge (Destaque/Novo) + condição,
  coração de favorito, checkbox de comparação, preço em `primary-600` tabular.
- **SearchBar:** duas variantes — `hero` (card flutuante na Home) e `compact` (sticky no header
  após 420px de scroll na Home), com `datalist` de modelos reais do estoque para autocomplete.
- **FiltersSidebar / EstoqueToolbar:** filtros server-driven via querystring (compartilhável),
  tags de filtro ativo removíveis, toggle grade/lista, ordenação.
- **VehicleGallery:** grid 1+4 com lightbox teclado-navegável (setas/Esc).
- **FinancingCalculator:** sliders de entrada/prazo com resultado tabular em tempo real; taxa e
  parceiros claramente rotulados como ilustrativos.
- **CompareModal:** tabela comparativa de até 3 veículos, sticky na primeira coluna.
- **WhatsAppFAB:** botão flutuante verde fixo, oculto no painel admin.

## Superfícies do browser

Scrollbar, seleção de texto e foco de teclado são temados a partir da paleta (`globals.css`), não
deixados no padrão do sistema operacional.

## Bans respeitados

Sem kicker/eyebrow acima de headline, sem texto em gradiente, sem sombra dura tipo neobrutalista,
sem ícone via emoji. Cards de "3 blocos" (Condições especiais) e numeração 01/02/03 (Venda seu
veículo) são intencionais: pedidos explicitamente pelo briefing e, no caso da numeração, a
sequência carrega informação real (ordem do processo).

## O que ainda não foi verificado visualmente

Este ambiente de build não tem ferramenta de captura de tela/browser automatizado. A verificação
foi feita via `tsc --noEmit`, `eslint`, `next build` completo (46 rotas) e testes funcionais de
API (login, CRUD, leads) — não por inspeção visual em viewports reais. Recomenda-se um passe manual
em 375px, 414px e 768px antes de publicar.
