# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind CSS; Next.js API Routes for the backend; PostgreSQL + Prisma ORM; Docker + Nginx + GitHub Actions CI/CD. Specified explicitly by the user in the original brief, not delegated.

## Users

- **Compradores** de veículos 0km e seminovos navegando no site para pesquisar, filtrar, comparar e entrar em contato sobre veículos anunciados (via WhatsApp, formulário de financiamento, ou formulário de contato). Chegam via busca orgânica, redes sociais ou indicação, em desktop e mobile.
- **Vendedores de veículo próprio** que querem avaliar e vender seu carro através do formulário "Venda seu veículo".
- **Equipe da loja (admin)** que cadastra, edita e remove veículos do estoque através de um painel administrativo protegido por login.

## Product Purpose

Vitrine digital e ferramenta de conversão para uma revenda de veículos seminovos e 0km: apresentar o estoque de forma clara e vendável, permitir que o visitante encontre o carro certo rapidamente (busca e filtros), e converter esse interesse em contato direto (WhatsApp) ou lead qualificado (financiamento, venda do próprio veículo, contato geral). Sucesso = tempo até encontrar um veículo relevante é baixo, e a taxa de visitante→lead/contato é alta.

## Positioning

Referência declarada pelo usuário: inspirado nas maiores plataformas do mercado brasileiro (WebMotors, OLX Autos, iCarros, Meu Carro Novo) mas para uma revenda única (não um marketplace multi-lojista), e deliberadamente superior em execução ao site de referência analisado (descomplicandosite.com/mmautos). O mecanismo diferenciador é a combinação, num site de revenda só, de: busca/filtro no nível de um marketplace grande, calculadora de financiamento embutida na página do veículo, comparador de até 3 veículos, e um painel admin simples para manter o estoque sempre atualizado sem depender de terceiros.

## Operating Context

- Site público consumido majoritariamente em mobile (padrão do setor) e desktop.
- Painel admin (`/admin`) protegido por login simples (usuário/senha via variável de ambiente + cookie de sessão), usado internamente pela equipe da loja para o CRUD de veículos, incluindo upload de fotos com preview e reordenação.
- Contato de venda acontece majoritariamente por WhatsApp: qualquer "tenho interesse" deve abrir o WhatsApp com mensagem pré-preenchida citando o veículo específico.
- Dados de veículos (mínimo 20 registros) são mockados/seed para esta entrega, prontos para serem substituídos por dados reais via o próprio painel admin ou API, sem exigir mudança de código.

## Capabilities and Constraints

- CRUD completo de veículos via admin (marca, modelo, versão, ano, KM, câmbio, combustível, cor, portas, final de placa, RENAVAM, preço, opcionais, fotos, badges destaque/novo).
- Busca e filtros avançados (marca, modelo, ano, faixa de preço, KM, câmbio, cor, combustível, tipo de veículo), ordenação e paginação/scroll infinito no estoque.
- Favoritos persistentes (localStorage) e comparador de até 3 veículos lado a lado.
- Calculadora de financiamento com taxa de juros configurável (simulação local, não uma integração bancária real).
- SEO dinâmico por veículo (meta tags, Schema.org Product/Vehicle, sitemap.xml), Analytics (GA4 + Meta Pixel) deixados prontos para ativação (placeholders de IDs), não conectados a contas reais.
- Sem gateway de pagamento, sem integração real com bancos/financeiras — parceiros financeiros exibidos são apenas logotipos ilustrativos, claramente não uma cotação real.
- Sem fotos reais de veículos disponíveis nesta entrega: imagens de placeholder identificadas como tal, substituíveis via admin.

## Brand Commitments

- Nome: **AutoPrime Veículos** — nome fictício escolhido para esta entrega (não é uma concessionária real), fácil de trocar centralizadamente. Usuário pode renomear a qualquer momento.
- Paleta comprometida: fundo branco premium (#ffffff) com primária vermelha (#D32F2F), textos #111/#555 — escolhida pelo usuário entre as opções do brief original.
- Tipografia: Inter ou Poppins (títulos em bold, preço sempre na cor primária).
- WhatsApp como canal de conversão principal; botão flutuante (FAB) obrigatório em todas as páginas.

## Evidence on Hand

Nenhuma foto real de veículo, depoimento real de cliente, número real de "anos no mercado"/"veículos vendidos", endereço real ou logotipo de banco/financeira foi fornecido. Todo conteúdo desse tipo nesta entrega é sintético e sinalizado como placeholder/mock, para substituição via admin ou edição direta de conteúdo antes de publicar em produção.

## Product Principles

1. Encontrar o carro certo deve ser rápido: busca, filtros e ordenação sempre visíveis e responsivos, nunca escondidos atrás de passos extras.
2. Toda intenção de compra tem um caminho de um clique até o WhatsApp com contexto do veículo já preenchido.
3. O painel admin é a fonte de verdade do estoque — nenhum dado de veículo fica hardcoded fora do banco/seed.
4. Confiança é construída com clareza (preço, KM, documentação, condições) nunca com ilusão — dados sintéticos são sempre rotulados como tal internamente.
5. Mobile é o caso comum, não o caso extra: toda página é desenhada mobile-first e verificada em 375/414/768px antes de desktop.

## Accessibility & Inclusion

Nenhum requisito de acessibilidade específico foi levantado pelo usuário além do padrão do brief (contraste, responsividade). Aplicar o piso de acessibilidade padrão do skill (contraste ≥4.5:1 em texto de corpo, foco de teclado, estados de erro/vazio claros) como baseline.
