1 - Backend

Atue como um Arquiteto de Software Sênior e Especialista em E-commerce Enterprise. Sua tarefa é projetar e codificar a API REST base para um E-commerce de Eletrônicos de alta performance, utilizando a arquitetura Headless e princípios MACH (Microservices, API-first, Cloud-native, Headless).

**CONTEXTO DO PROJETO:**
O sistema deve suportar um volume massivo de acessos, picos de tráfego (como Black Friday) e gerenciar um catálogo complexo de eletrônicos. Além da venda tradicional, o projeto possui um diferencial central: um programa de "Trade-in" (Recommerce), onde clientes enviam seus aparelhos usados (logística reversa) em troca de créditos (cash rebates) para compra de produtos novos. O sistema operará de forma omnichannel, integrando estoques de Centros de Distribuição (RDC) e Lojas Físicas (MEC) para permitir retiradas no mesmo dia (BOPIS - Buy Online, Pick Up In-Store).

**STACK TECNOLÓGICA E PADRÕES:**
- Backend: Node.js com NestJS (TypeScript) ou Go (Golang) para rotas de altíssimo throughput.
- Banco de Dados Relacional: PostgreSQL (com Prisma ou Drizzle ORM).
- Cache e Sessões: Redis.
- Mensageria/Eventos: Apache Kafka ou RabbitMQ (para arquitetura orientada a eventos, ex: processamento assíncrono de pedidos e baixa de estoque).
- Integrações Externas Previstas: PIM (Akeneo/Pimcore para catálogo), CMS (Strapi para conteúdo), Algolia/Elasticsearch (para busca semântica) e Gateways de Pagamento (Stripe).

**MODELAGEM DE DADOS AVANÇADA (Entidades e Relacionamentos):**
1. `User`: id, name, email, password_hash, role, trade_in_credits (saldo dinâmico), mfa_enabled (booleano para segurança), consent_gdpr (booleano).
2. `Product`: id, pim_id (referência ao Akeneo/Pimcore), name, slug, base_price, dynamic_price (calculado via IA/demanda), specs (JSONB), is_refurbished.
3. `Inventory`: id, product_id, location_id (RDC ou Loja Física), quantity, reserved_quantity.
4. `Order`: id, user_id, total_amount, discount_applied (incluindo créditos de trade-in), status, fulfillment_method (SHIPPING ou BOPIS), tracking_status.
5. `TradeInProgram`: id, user_id, device_category, device_model, condition_grade (A, B, C), estimated_rebate_value, reverse_logistics_tracking, inspection_status (PENDING, RECEIVED, EVALUATED, CREDITED).

**ROTAS E LÓGICA DE NEGÓCIO (Priorizando Impacto e Conversão):**
- **Autenticação & Segurança (`/auth`):**
  - Implementar login seguro com JWT, Refresh Tokens e suporte a Multi-Factor Authentication (MFA) para mitigar roubo de contas. Rate limiting estrito para evitar brute-force.
- **Catálogo & Busca (`/catalog`):**
  - Rota de listagem com suporte a filtros facetados complexos (preço, marca, especificações do JSONB) e paginação otimizada.
  - Endpoints preparados para receber webhooks do sistema PIM e atualizar o banco de dados local.
- **Carrinho & Checkout (`/checkout`):**
  - Validação transacional rigorosa: Checagem dupla de estoque (Inventory) em tempo real, aplicação de lógica de precificação dinâmica e abatimento seguro do saldo de `trade_in_credits`.
  - Emissão de evento no Kafka (`OrderCreated`) após pagamento para que o serviço de inventário processe a reserva de forma assíncrona.
- **Programa de Trade-in (`/trade-in`):**
  - Rota de cotação (`/trade-in/quote`): Recebe os dados do aparelho do usuário e utiliza uma regra de precificação para retornar o valor estimado de desconto.
  - Rota de status (`/trade-in/:id/status`): Atualiza a jornada do aparelho usado desde o envio (logística reversa) até a inspeção e liberação do crédito na carteira do usuário.
- **Omnichannel & Estoque (`/inventory`):**
  - Consulta de disponibilidade por localização (CEP/Zipcode) para informar ao frontend se o produto está elegível para retirada em loja física próxima (BOPIS) ou entrega no mesmo dia.

**REQUISITOS NÃO FUNCIONAIS & ARQUITETURA:**
- **Segurança:** Implementar Guards/Middlewares globais de autenticação, validação de DTOs rigorosa com `class-validator`, Helmet para segurança de headers e sanitização contra injeção SQL/NoSQL.
- **Performance:** Configurar interceptors de cache para rotas de produtos usando Redis. Implementar paginação em todas as queries de listagem.
- **Observabilidade:** Estruturar logs formatados e preparar rastreamento de requisições (tracing) para monitorar o tempo de resposta do banco de dados e APIs externas.

Gere a arquitetura inicial do projeto em NestJS, os schemas de banco de dados (Prisma schema), e implemente as classes principais (Controllers e Services) para os módulos de Checkout (com mensageria), Trade-in e Autenticação. Todo o código deve seguir princípios SOLID e Clean Architecture.

2 - Frontend

Atue como um Engenheiro de Frontend Sênior e Especialista em UX/UI (Conversion Rate Optimization). Sua tarefa é criar a interface de um E-commerce Enterprise de Eletrônicos, construído sob a arquitetura Headless Commerce. O frontend consumirá uma API REST robusta que já foi desenhada.

**CONTEXTO DE NEGÓCIOS E EXPERIÊNCIA DO USUÁRIO (UX):**
Este não é apenas um e-commerce; é um ecossistema de "Experiência Total". O público-alvo são consumidores tech-savvy (entusiastas de tecnologia) que exigem navegação fluida, carregamento instantâneo e design premium. 
Diferenciais que devem transparecer na interface:
1. Omnichannel (BOPIS): O usuário deve poder ver o estoque em lojas físicas próximas para retirada no mesmo dia.
2. Recommerce (Trade-In): Uma jornada visual sem atritos onde o usuário cota seu aparelho velho para usar como desconto.
3. Descoberta Generativa: A interface deve parecer inteligente, guiando o cliente para a melhor compra técnica.

**STACK TECNOLÓGICA:**
- Framework Core: Next.js (App Router, focando em Server-Side Rendering para SEO).
- Linguagem: TypeScript estrito.
- Estilização: Tailwind CSS + shadcn/ui (para componentes acessíveis).
- Estado Global: Zustand.
- Animações: Framer Motion (para micro-interações e transições de página).

**DIRETRIZES DE DESIGN SYSTEM E UI (TENDÊNCIAS 2025):**
- Paleta "Midnight Opulence": Fundo em tons escuros de ardósia/marinho (#1a1a2e, #16213e) para transmitir luxo tecnológico, com botões de conversão e destaques em dourado metálico (#efc07b). Suporte total a alternância Light/Dark Mode.
- Estilo "Bento Box": Use grids modulares estilo "Bento" para agrupar as densas especificações técnicas dos eletrônicos de forma limpa, minimizando a carga cognitiva.
- Minimalismo e "Glassmorphism": Fundos translúcidos e sombras suaves nos menus flutuantes e modais de carrinho.

**DESENVOLVIMENTO DE COMPONENTES CHAVE:**
1. **Header & Navegação:** Barra fixa (sticky) contendo pesquisa inteligente com suporte visual a "Voice UI" (ícone de microfone) e Carrinho (Side drawer).
2. **Página de Produto (PDP) - Foco Obsessivo em Conversão:**
   - **Galeria:** Otimizada para mobile com suporte a gestos (swipe/pinch) e integração de visualização 360º/AR (botão "Ver no seu espaço").
   - **Buy Box (Acima da Dobra):** Título descritivo, preço claro, parcelamento, selos de confiança (garantia, frete grátis) e botão CTA "Adicionar ao Carrinho" (Sticky no mobile). Include uma opção secundária: "Dar meu usado na troca" (aciona o modal de Trade-in).
   - **Especificações Técnicas (Acessibilidade):** Tabela HTML estritamente semântica (usando tags `<table>`, `<thead>`, `<th>` com atributo `scope="col"` ou `scope="row"`) para garantir a leitura perfeita por leitores de tela. Nunca use tabelas apenas para layout.
3. **Fluxo de Trade-In (Recommerce):**
   - Um componente "Wizard" (passo a passo) moderno onde o usuário seleciona a marca, modelo e condição do aparelho usado, exibindo dinamicamente o crédito estimado em tempo real.
4. **Listagem de Produtos (PLP):**
   - Implementar "Lazy Loading" para paginação infinita controlada.
   - Filtros laterais colapsáveis (facets) e badges em produtos (ex: "Recondicionado", "Mais Vendido").

**PERFORMANCE, SEO E CORE WEB VITALS:**
- **Imagens Next-Gen:** Use exclusivamente o componente `<Image>` do Next.js. Implemente a tag `<picture>` para servir formatos modernos (WebP e AVIF com fallback para JPEG). Garanta que não haja "Layout Shift" (CLS) definindo width e height.
- **Micro-interações:** Adicione feedback visual instantâneo (ex: botão muda de cor ao passar o mouse, ícone de loading ao adicionar ao carrinho).

Gere a arquitetura inicial do projeto Next.js (`layout.tsx`, `page.tsx`), a configuração do Tailwind (cores personalizadas), e codifique os componentes cruciais: a Página de Produto (PDP) completa, o componente de cotação do "Trade-In", e a Tabela Semântica de Especificações Técnicas. O código deve ser modular, componentizado e comentado.
