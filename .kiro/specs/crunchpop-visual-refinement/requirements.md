# Requirements Document

## Introduction

Refinamento visual e de experiência da página de vendas da CrunchPop. O site já existe como uma Single Page Application em Next.js com TypeScript e Tailwind CSS. O objetivo é evoluir a interface para uma estética sofisticada, editorial e premium — referenciada por marcas como Bacio di Latte, Dengo, Apple e Aesop — sem alterar a identidade da marca nem o fluxo de compra existente. A prioridade é que o produto seja sempre o protagonista, que a hierarquia visual conduza o usuário de forma fluida até a compra, e que a conversão seja mantida ou melhorada.

---

## Glossary

- **Page**: a página principal da CrunchPop (`crunch-pop-page.tsx`)
- **Hero**: seção de abertura da página, acima da dobra
- **ChoiceSection**: seção "Escolha sua CrunchPop", com os dois caminhos de compra
- **ChoiceCard**: card visual que representa cada caminho de compra (Clássicos / Monte a sua)
- **ClassicCard**: card de produto clássico na grade de produtos
- **Configurator**: formulário de configuração do baldinho personalizado
- **CartDrawer**: painel lateral de carrinho e checkout
- **ConfirmationModal**: modal de revisão do pedido antes do envio ao WhatsApp
- **WhatsAppMessage**: mensagem de texto enviada ao WhatsApp ao finalizar o pedido
- **Header**: barra de navegação fixa no topo
- **DesignSystem**: conjunto de classes CSS definidas no projeto (`.luxury-shell`, `.luxury-core`, `.luxury-eyebrow`, `.luxury-cta`, `.luxury-motion`)
- **BrandPalette**: paleta exclusiva do projeto — cream `#F7F3EE`, warm `#FFFDF8`, chocolate `#4A342C`, coffee `#7A5A45`, caramel `#B78946`
- **Typography**: Cormorant Garamond (display) para títulos, Poppins (sans) para corpo de texto

---

## Requirements

### Requirement 1: Hero com título forte e CTA visível

**User Story:** Como visitante, quero ver imediatamente o que é a CrunchPop e ter um caminho claro para comprar, para que eu não precise rolar a página para entender o produto ou agir.

#### Acceptance Criteria

1. THE Hero SHALL exibir a logo, uma foto do produto em destaque, um título principal em Cormorant Garamond, um subtítulo curto em Poppins e um botão de call-to-action primário, todos visíveis sem scroll em telas móveis de 375px de largura.
2. WHEN o usuário visualiza o Hero em qualquer dispositivo, THE Hero SHALL apresentar a foto do produto ocupando pelo menos 60% da área visual da seção.
3. THE Hero SHALL usar somente cores da BrandPalette.
4. THE Hero SHALL aplicar a classe `animate-fade` na entrada da seção para suavizar o carregamento.
5. WHEN o usuário clica no botão CTA do Hero, THE Page SHALL realizar scroll suave até a ChoiceSection.

---

### Requirement 2: ChoiceSection com cards de produto reais

**User Story:** Como visitante, quero escolher entre "Assinaturas Clássicas" e "Monte a sua" por meio de cards visualmente ricos que pareçam produtos reais, para que a decisão seja intuitiva e apetitosa.

#### Acceptance Criteria

1. THE ChoiceSection SHALL apresentar os dois caminhos de compra (Clássicos e Monte a sua) como ChoiceCards em lugar de tabs/botões de alternância simples.
2. THE ChoiceCard SHALL conter foto do produto, título em Cormorant Garamond, descrição curta em Poppins e um botão de ação primário.
3. WHEN o usuário clica em um ChoiceCard, THE Page SHALL rolar suavemente até a seção de produtos correspondente e ativar o `purchasePath` correto.
4. THE ChoiceSection SHALL usar espaçamento generoso (padding vertical mínimo de `py-16` em mobile, `lg:py-24` em desktop) e fundo cream ou warm da BrandPalette.
5. THE ChoiceSection SHALL aplicar a classe `animate-rise` nos ChoiceCards ao entrar na viewport.

---

### Requirement 3: ClassicCards com hierarquia visual refinada

**User Story:** Como comprador, quero ver os produtos clássicos com fotos grandes e tipografia clara, para que eu consiga decidir rapidamente qual sabor quero sem esforço visual.

#### Acceptance Criteria

1. THE ClassicCard SHALL exibir a foto do produto com proporção mínima de 1:1 e largura que ocupe pelo menos 40% do card em mobile e 35% em desktop.
2. THE ClassicCard SHALL apresentar o nome do produto em Cormorant Garamond com tamanho mínimo de `text-3xl`, o badge (quando existir) como pill acima do nome, e a descrição em Poppins abaixo do nome.
3. THE ClassicCard SHALL exibir o preço em Cormorant Garamond com tamanho mínimo de `text-2xl` e o botão "Adicionar" com destaque visual, ambos na borda inferior do card separados por um divisor.
4. WHEN o usuário seleciona um tamanho e clica em "Adicionar", THE ClassicCard SHALL fornecer feedback visual imediato (texto do botão muda para "Adicionado") por pelo menos 1.600ms.
5. THE ClassicCard SHALL usar somente cores da BrandPalette e respeitar o DesignSystem existente (classes `luxury-shell`, `luxury-core` quando aplicável).
6. THE ClassicCard SHALL ter espaçamento interno mínimo de `p-5` para garantir respiro adequado.

---

### Requirement 4: Configurador personalizado fluido e elegante

**User Story:** Como comprador que quer um baldinho personalizado, quero um configurador com fluxo claro e progressivo, para que eu entenda cada etapa e conclua minha combinação sem confusão.

#### Acceptance Criteria

1. THE Configurator SHALL apresentar os steps numerados (1. Tamanho, 2. Sabores) com separação visual clara entre etapas.
2. WHEN o usuário não selecionou um tamanho, THE Configurator SHALL exibir apenas o step de tamanho, ocultando o step de sabores.
3. WHEN o usuário seleciona um tamanho, THE Configurator SHALL revelar o step de sabores com animação `animate-rise`.
4. THE Configurator SHALL mostrar um contador de sabores selecionados/disponíveis em pill estilizado (ex.: "1 de 2 sabores") próximo ao título do step de sabores.
5. WHEN o usuário tenta selecionar mais sabores do que o limite do tamanho escolhido, THE Configurator SHALL exibir uma mensagem de feedback inline sem interromper o fluxo com modal ou alert.
6. THE Configurator SHALL usar o DesignSystem (`luxury-shell`, `luxury-core`) e a BrandPalette exclusivamente.
7. WHEN o usuário pode adicionar ao carrinho (tamanho e pelo menos um sabor selecionados), THE Configurator SHALL ativar o botão "Adicionar ao carrinho" com destaque visual pleno (sem `opacity-45`).

---

### Requirement 5: Tipografia com hierarquia editorial

**User Story:** Como visitante, quero ler a página com facilidade e sentir que a marca é sofisticada, para que eu confie no produto e me sinta motivado a comprar.

#### Acceptance Criteria

1. THE Page SHALL usar Cormorant Garamond (`font-display`) para todos os títulos de seção (`h1`, `h2`) e nomes de produtos.
2. THE Page SHALL usar Poppins (`font-sans`) para todos os textos de corpo, descrições, labels e textos de interface.
3. THE Page SHALL aplicar eyebrows (labels em uppercase com letter-spacing) usando a classe `luxury-eyebrow` antes de cada título de seção principal.
4. THE Page SHALL garantir contraste mínimo de 4.5:1 entre texto e fundo em todas as combinações de cores da BrandPalette utilizadas.
5. WHILE o usuário navega em viewport mobile (max-width 767px), THE Page SHALL apresentar títulos de seção com tamanho mínimo de `text-3xl` e textos de corpo com tamanho mínimo de `text-sm` com `leading-6`.

---

### Requirement 6: Espaçamento generoso em toda a página

**User Story:** Como visitante, quero que a página respire com espaços generosos entre seções e elementos, para que o produto pareça premium e a leitura seja confortável.

#### Acceptance Criteria

1. THE Page SHALL aplicar padding vertical mínimo de `py-14` em seções de conteúdo em mobile e `lg:py-20` em desktop.
2. THE Page SHALL garantir gap mínimo de `gap-5` entre cards em grades de produtos.
3. THE Page SHALL usar margens internas mínimas de `p-5` em todos os cards e containers de conteúdo.
4. THE Page SHALL respeitar a BrandPalette usando apenas os fundos cream (`#F7F3EE`) e warm (`#FFFDF8`) para seções de conteúdo, alternando-os para criar ritmo visual sem poluição.

---

### Requirement 7: WhatsApp message natural e conversacional

**User Story:** Como comprador, quero receber uma mensagem de pedido no WhatsApp que pareça natural e amigável, para que a experiência de finalização seja agradável e não pareça um relatório técnico.

#### Acceptance Criteria

1. THE WhatsAppMessage SHALL iniciar com uma saudação breve e informal (ex.: "Olá! 😊").
2. THE WhatsAppMessage SHALL listar cada item do pedido com nome do produto, tamanho e sabores de forma legível, usando bullet points ou emojis sutis.
3. THE WhatsAppMessage SHALL incluir o total do pedido de forma destacada mas simples (ex.: "Total: R$ 38,00").
4. THE WhatsAppMessage SHALL informar o modo de recebimento de forma coloquial (ex.: "Vou retirar no local." ou "Quero receber via Moto Uber.").
5. THE WhatsAppMessage SHALL incluir o nome e WhatsApp do cliente de forma integrada ao texto, não como campos de formulário.
6. IF o cliente preencheu observações, THEN THE WhatsAppMessage SHALL incluir as observações de forma natural ao final da mensagem.
7. THE WhatsAppMessage SHALL ter comprimento total menor que 600 caracteres para um pedido de item único sem endereço e sem observações.

---

### Requirement 8: Header refinado e funcional

**User Story:** Como usuário navegando no site, quero um header claro e acessível que me dê acesso rápido ao carrinho, para que eu possa gerenciar meu pedido a qualquer momento sem perder contexto.

#### Acceptance Criteria

1. THE Header SHALL ser sticky no topo da página com `backdrop-blur` e fundo semi-transparente cream.
2. THE Header SHALL exibir a logo à esquerda e o botão de carrinho à direita.
3. WHEN o carrinho possui pelo menos um item, THE Header SHALL exibir a contagem de itens de forma visualmente destacada no botão de carrinho.
4. THE Header SHALL usar somente cores da BrandPalette e manter contraste mínimo de 4.5:1 entre elementos interativos e fundo.
5. THE Header SHALL ter altura máxima de 64px em mobile para não consumir espaço visual excessivo.

---

### Requirement 9: CartDrawer acessível e elegante

**User Story:** Como comprador, quero um carrinho lateral claro e organizado que me guie pelo checkout de forma progressiva, para que eu complete meu pedido com confiança e sem erros.

#### Acceptance Criteria

1. THE CartDrawer SHALL apresentar os itens do carrinho com nome do produto, tamanho, sabores, preço e controles de quantidade visíveis.
2. THE CartDrawer SHALL exibir um indicador de progresso do checkout com três etapas: Escolha, Contato e Conferir.
3. WHEN o carrinho está vazio, THE CartDrawer SHALL exibir uma mensagem encorajadora com um botão de ação que direciona o usuário de volta à seção de produtos.
4. THE CartDrawer SHALL permitir ao usuário preencher nome, WhatsApp e modo de recebimento antes da revisão final.
5. IF o modo de recebimento é "Moto Uber / Uber Flash", THEN THE CartDrawer SHALL exibir campos de endereço completo (rua, número, complemento, referência).
6. THE CartDrawer SHALL usar fundo cream, BrandPalette exclusivamente, e aplicar `shadow-drawer` na sombra lateral.

---

### Requirement 10: ConfirmationModal claro e confiável

**User Story:** Como comprador, quero revisar meu pedido completo antes de enviar ao WhatsApp, para que eu não cometa erros e me sinta seguro com a compra.

#### Acceptance Criteria

1. THE ConfirmationModal SHALL listar todos os itens do carrinho com produto, tamanho, sabores e quantidade.
2. THE ConfirmationModal SHALL exibir o total do pedido em Cormorant Garamond com destaque visual.
3. THE ConfirmationModal SHALL mostrar o modo de recebimento e, quando aplicável, o endereço de entrega.
4. THE ConfirmationModal SHALL apresentar dois botões de ação: "Editar pedido" (secondary) e "Enviar para WhatsApp" (primary).
5. THE ConfirmationModal SHALL incluir uma nota informativa sobre o processo pós-pedido (confirmação de disponibilidade, chave Pix, etc.) de forma concisa.
6. WHEN o ConfirmationModal está aberto, THE Page SHALL bloquear scroll do fundo e manter foco dentro do modal para acessibilidade.
