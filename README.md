# AutoPrime Veículos

Loja digital de veículos seminovos e 0km — Next.js 14 (App Router) + TypeScript + Tailwind CSS,
PostgreSQL + Prisma, painel administrativo com CRUD completo de estoque (incluindo marcar veículos
como vendidos), dashboard de vendas, financiamento simulado, favoritos e comparador. Ver
[PRODUCT.md](./PRODUCT.md) para o contexto de produto completo, incluindo o que nesta entrega é
dado real vs. placeholder.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (Node.js)
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Formulários:** React Hook Form + Zod
- **Deploy:** Docker + Nginx + GitHub Actions

## Pré-requisitos

- Node.js 20+
- Docker (para o Postgres local e/ou o stack completo)

## Rodando localmente

1. **Instale as dependências**

   ```bash
   npm install
   ```

2. **Configure o ambiente**

   ```bash
   cp .env.example .env
   ```

   Gere um `ADMIN_SESSION_SECRET` aleatório (ex: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
   mínimo 32 caracteres), defina `ADMIN_EMAIL` e gere o `ADMIN_PASSWORD_HASH` a partir da senha
   real que vai usar — **nunca** coloque a senha em texto plano no `.env`:

   ```bash
   npm run admin:hash-password -- "sua-senha-forte-aqui"
   ```

   O comando imprime a linha `ADMIN_PASSWORD_HASH="salt:hash"` pronta para colar no `.env`.

3. **Suba um Postgres local**

   ```bash
   docker run -d --name autoprime-db \
     -e POSTGRES_USER=autoprime -e POSTGRES_PASSWORD=autoprime -e POSTGRES_DB=autoprime \
     -p 5435:5432 postgres:16-alpine
   ```

   > Se a porta padrão 5432 (ou 5433) já estiver em uso na sua máquina (comum quando há um
   > Postgres nativo instalado), ajuste a porta do `-p` e o `DATABASE_URL` no `.env` de acordo.

4. **Rode as migrations e o seed**

   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```

   Isso cria o schema e popula **28 veículos** (15 ativos no estoque + 13 já marcados como
   vendidos, distribuídos em 2 meses, para o dashboard de vendas já nascer com dados reais), com
   fotos placeholder e opcionais variados, além de 6 depoimentos de clientes.

5. **Suba o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Painel administrativo

Acesse `/admin/login` com o `ADMIN_EMAIL` e a senha usada para gerar o `ADMIN_PASSWORD_HASH` no
`.env`. O painel permite:

- **Cadastrar, editar e remover veículos** (CRUD completo), com upload de fotos (preview +
  reordenação por setas) e definição da foto de capa.
- **Marcar um veículo como "Vendido"** (no formulário completo ou com um clique na listagem, via
  "Marcar vendido"/"Reativar"). Um veículo vendido some automaticamente do site público (Home,
  estoque, busca, veículos similares) mas continua contado no histórico — quem acessar o link
  direto do anúncio vê um aviso "Este veículo já foi vendido" no lugar do botão de compra.
- **Dashboard de vendas** (`/admin/vendas`): filtro por mês, total de veículos vendidos, total
  faturado, categoria (tipo de veículo) líder em vendas, e ranking de modelos com o mais e o menos
  vendido no período selecionado.

> **Segurança:** a autenticação é de conta única via cookie de sessão assinado (JWT/`jose`, cookie
> `httpOnly` + `SameSite=Lax`), pensada para uma equipe pequena administrar o próprio estoque — não
> é um sistema multiusuário/RBAC. A senha nunca fica em texto plano: `ADMIN_PASSWORD_HASH` guarda um
> hash scrypt com salt, comparado em tempo constante. O login tem rate limit (5 tentativas / 10 min
> por IP, reforçado no Nginx em produção) e cada tentativa é logada (sem senha/token). Gere um
> `ADMIN_PASSWORD_HASH` novo (`npm run admin:hash-password`) antes de qualquer deploy público — não
> reaproveite o valor de desenvolvimento deste repositório.

## Scripts disponíveis

| Script                  | Descrição                                      |
| ------------------------ | ----------------------------------------------- |
| `npm run dev`            | Servidor de desenvolvimento                     |
| `npm run build`          | Build de produção                               |
| `npm run start`          | Roda o build de produção                        |
| `npm run lint`           | ESLint                                          |
| `npm run typecheck`      | Checagem de tipos TypeScript                    |
| `npm run prisma:migrate` | Cria/aplica migrations em desenvolvimento       |
| `npm run prisma:seed`    | Popula o banco com os 28 veículos de exemplo (ativos + vendidos) |
| `npm run prisma:studio`  | Abre o Prisma Studio para inspecionar o banco   |
| `npm run admin:hash-password -- "senha"` | Gera o valor de `ADMIN_PASSWORD_HASH` a partir de uma senha em texto plano |

## Rodando com Docker (stack completo)

```bash
cp .env.example .env
npm run admin:hash-password -- "sua-senha-forte-aqui"   # cole o resultado em ADMIN_PASSWORD_HASH
# preencha também ADMIN_SESSION_SECRET (≥32 caracteres), ADMIN_EMAIL, POSTGRES_PASSWORD etc. no .env
docker compose up --build -d
docker compose exec app npx prisma migrate deploy
docker compose exec app npx tsx prisma/seed.ts   # opcional, para dados de exemplo
```

O Nginx expõe a aplicação em `http://localhost` (porta 80), proxeando para o container Next.js e
servindo `/uploads/*` (fotos enviadas pelo admin) diretamente do volume `uploads_data`. Só o Nginx
publica uma porta no host — o Postgres e o app Next.js ficam acessíveis apenas pela rede interna do
Docker Compose, nunca diretamente pela internet.

> **TLS antes de produção:** este `docker-compose.yml` serve a aplicação em HTTP puro (porta 80).
> Antes de expor publicamente, termine TLS na frente do Nginx — com um proxy gerenciado (Cloudflare,
> um Load Balancer com certificado) ou adicionando um `server` block HTTPS com Certbot/Let's Encrypt
> ao `nginx/nginx.conf`. Sem isso, o login do admin e os formulários trafegam sem criptografia.

## CI/CD

`.github/workflows/ci.yml` roda em todo push/PR para `main`: instala dependências, lint, type
check, aplica as migrations contra um Postgres de serviço e faz o build de produção; em pushes,
também valida que a imagem Docker builda. Não há deploy automático configurado — plugue o passo de
publish da sua infraestrutura (registry + host) ao final do job `docker-build` quando for usar em
produção.

## Estrutura do projeto

```
src/
  app/                # Rotas (App Router): páginas públicas, /admin, API routes
  components/
    layout/            # Header, Footer, WhatsApp FAB
    home/               # Seções da Home
    search/             # Busca e filtros
    vehicle/            # Card, galeria, calculadora, comparador, etc.
    forms/              # Formulários (contato, financiamento, venda)
    admin/              # Painel administrativo
    ui/                 # Primitivos (Button, Badge, Modal, Skeleton...)
  lib/                 # Prisma client, validações Zod, auth, utils
  types/               # Tipos compartilhados
prisma/
  schema.prisma         # Modelo de dados
  seed.ts                # 28 veículos (ativos + vendidos) + depoimentos de exemplo
```

## O que é real vs. placeholder nesta entrega

Esta entrega vem com **dados mockados prontos para serem substituídos** por dados reais via o
próprio painel admin (ou diretamente via API/seed), sem necessidade de alterar código:

- **Fotos de veículos e da equipe:** geradas via [placehold.co](https://placehold.co) com o nome
  do veículo/ângulo no lugar da imagem real — substitua fazendo upload das fotos reais no admin.
- **Nome da loja, endereço, telefone:** "AutoPrime Veículos" é um nome fictício — edite
  `src/lib/constants.ts` (`SITE`) para os dados reais.
- **Depoimentos, avatares e números da seção "Sobre nós"** (anos de mercado, veículos vendidos):
  ilustrativos — substitua por dados reais antes de publicar.
- **Parceiros financeiros e taxa de juros:** nomes e taxa de simulação são ilustrativos
  (`src/lib/constants.ts` → `FINANCING`); não representam uma cotação real de banco algum.
- **Google Analytics / Meta Pixel:** os `<script>` só são injetados quando `NEXT_PUBLIC_GA4_ID` /
  `NEXT_PUBLIC_META_PIXEL_ID` estão preenchidos no `.env` — deixados em branco por padrão.

## SEO e performance

- Meta tags dinâmicas por veículo (`generateMetadata`) e dados estruturados `schema.org/Vehicle`
  em cada página de veículo.
- `sitemap.xml` e `robots.txt` gerados dinamicamente a partir do estoque (`src/app/sitemap.ts`).
- Imagens servidas via `next/image` (lazy loading, otimização automática).
- Páginas de veículo pré-renderizadas estaticamente (`generateStaticParams`) com revalidação
  incremental a cada 5 minutos; Home com ISR de 60s.

Para validar Core Web Vitals e o score do Lighthouse, rode o build de produção (`npm run build && npm start`)
e audite localmente — os placeholders de imagem remota (`placehold.co`) têm latência de rede que
não existirá com fotos reais servidas do seu storage/CDN.
