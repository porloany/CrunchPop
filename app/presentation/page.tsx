import type { Metadata } from "next";
import Image from "next/image";
import {
  Check,
  Home,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  X
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { formatCurrency } from "@/lib/format";
import { classicProducts, customFlavors, sizeOptions } from "@/lib/products";
import { STORE_INSTAGRAM, STORE_LOCATION } from "@/lib/store";

export const metadata: Metadata = {
  title: "CrunchPop | Apresentação",
  description: "Revisão visual de UX e branding da CrunchPop."
};

const mockCart = [
  {
    name: "Leite em pó",
    sizeName: "500 ml",
    flavors: ["Leite em pó"],
    quantity: 1,
    price: 23,
    kind: "classic"
  },
  {
    name: "CrunchPop 1 litro",
    sizeName: "1 litro",
    flavors: ["Avelã", "Kinder Bueno", "Ovomaltine"],
    quantity: 1,
    price: 38,
    kind: "custom"
  }
];

const total = mockCart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

export default function PresentationPage() {
  return (
    <main className="bg-cream text-chocolate">
      <PresentationNav />
      <PresentationSection label="Hero" index="01">
        <HeroPreview />
      </PresentationSection>
      <PresentationSection label="Manifesto" index="02" tone="dark">
        <ManifestoPreview />
      </PresentationSection>
      <PresentationSection label="Sabores" index="03">
        <FlavorsPreview />
      </PresentationSection>
      <PresentationSection label="Cards" index="04">
        <CardsPreview />
      </PresentationSection>
      <PresentationSection label="Checkout" index="05">
        <CheckoutPreview />
      </PresentationSection>
      <PresentationSection label="Modal" index="06" tone="dark">
        <ModalPreview />
      </PresentationSection>
      <PresentationSection label="Carrinho" index="07">
        <CartPreview />
      </PresentationSection>
      <PresentationSection label="Rodapé" index="08">
        <FooterPreview />
      </PresentationSection>
    </main>
  );
}

function PresentationNav() {
  const items = [
    "Hero",
    "Manifesto",
    "Sabores",
    "Cards",
    "Checkout",
    "Modal",
    "Carrinho",
    "Rodapé"
  ];

  return (
    <header className="fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 rounded-full border border-chocolate/10 bg-warm/85 px-3 py-2 shadow-card backdrop-blur-xl lg:block">
      <nav aria-label="Seções da apresentação">
        <ul className="flex items-center gap-1">
          {items.map((item, index) => (
            <li key={item}>
              <a
                href={`#section-${index + 1}`}
                className="rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-coffee transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-cream hover:text-chocolate"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function PresentationSection({
  children,
  index,
  label,
  tone = "light"
}: {
  children: React.ReactNode;
  index: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const sectionNumber = Number(index);

  return (
    <section
      id={`section-${sectionNumber}`}
      className={`min-h-[100dvh] px-5 py-24 sm:px-8 lg:px-10 lg:py-32 ${
        tone === "dark"
          ? "bg-chocolate text-warm"
          : "bg-gradient-to-b from-warm to-cream text-chocolate"
      }`}
    >
      <div className="mx-auto grid min-h-[calc(100dvh-12rem)] max-w-7xl gap-10 lg:grid-cols-[220px_1fr] lg:items-center">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${
              tone === "dark" ? "text-caramel" : "text-caramel"
            }`}
          >
            {index}
          </p>
          <h1
            className={`mt-3 font-display text-5xl font-semibold leading-none ${
              tone === "dark" ? "text-warm" : "text-chocolate"
            }`}
          >
            {label}
          </h1>
          <p
            className={`mt-5 max-w-xs text-sm leading-7 ${
              tone === "dark" ? "text-warm/72" : "text-coffee"
            }`}
          >
            Revisão visual de UX e branding. Esta tela é apenas demonstrativa.
          </p>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <BrandLogo
      compact={compact}
      className={
        compact
          ? "h-10 w-[170px] sm:h-11 sm:w-[188px]"
          : "h-[188px] w-[340px] max-w-full sm:h-[216px] sm:w-[390px]"
      }
    />
  );
}

function HeroPreview() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
      <div>
        <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-caramel">
          Sobremesa artesanal em Curitiba
        </p>
        <h2 className="max-w-3xl font-display text-[3.55rem] font-semibold leading-[0.94] text-chocolate sm:text-7xl lg:text-8xl">
          Monte sua CrunchPop.
        </h2>
        <p className="mt-7 max-w-xl text-base leading-8 text-coffee sm:text-lg">
          Escolha um clássico da casa ou crie sua combinação. Finalize pelo
          WhatsApp em poucos toques.
        </p>
        <div className="mt-8 max-w-xl border-y border-chocolate/10">
          {sizeOptions.map((size) => (
            <div
              key={size.id}
              className="flex items-baseline justify-between gap-4 border-b border-chocolate/10 py-3 last:border-b-0"
            >
              <div>
                <p className="font-display text-3xl font-semibold text-chocolate">
                  {size.name}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-coffee">
                  Até {size.maxFlavors} sabores
                </p>
              </div>
              <p className="text-sm font-semibold text-caramel">
                {formatCurrency(size.price)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="luxury-cta group w-full sm:w-auto">
            <span>Montar agora</span>
            <span className="luxury-cta-mark" aria-hidden="true">
              →
            </span>
          </span>
          <p className="text-sm font-medium leading-6 text-coffee">
            Comece por <span className="text-chocolate">R$ 23,00</span>. Sem
            cadastro.
          </p>
        </div>
      </div>

      <ProductImageFrame />
    </div>
  );
}

function ProductImageFrame() {
  return (
    <div className="relative mx-auto max-w-[580px] lg:ml-auto">
      <div
        className="absolute -bottom-5 -right-5 h-[82%] w-[72%] rounded-[2rem] bg-chocolate"
        aria-hidden="true"
      />
      <div className="luxury-shell relative">
        <div className="luxury-core overflow-hidden">
          <Image
            src="/crunchpop-hero.png"
            alt="Pote elegante com sobremesa CrunchPop coberta de chocolate e caramelo"
            width={1024}
            height={1024}
            priority
            className="aspect-[4/5] h-auto w-full object-cover"
          />
        </div>
      </div>
      <div className="absolute bottom-5 left-5 rounded-full border border-caramel/25 bg-warm/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-chocolate shadow-card">
        Produção diária
      </div>
    </div>
  );
}

function ManifestoPreview() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="luxury-shell bg-warm/10">
        <div className="luxury-core bg-chocolate p-8 text-warm sm:p-12 lg:p-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-caramel">
            Nossa essência
          </p>
          <h2 className="mt-6 max-w-2xl font-display text-5xl font-semibold leading-tight sm:text-6xl">
            Feita para transformar pipoca em sobremesa.
          </h2>
          <div className="mt-10 max-w-2xl space-y-6 text-base leading-8 text-warm/78">
            <p>
              A CrunchPop existe para elevar um momento simples a uma
              experiência de confeitaria: textura, creme e crocância na mesma
              mordida.
            </p>
            <p>
              Cada receita nasce em pequenos lotes, com preparo artesanal e uma
              apresentação pensada para deixar o produto falar primeiro.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {["Artesanal", "Cremosa", "Crocante"].map((item) => (
          <div
            key={item}
            className="rounded-[2rem] border border-warm/10 bg-warm/8 p-6"
          >
            <p className="font-display text-4xl font-semibold text-warm">
              {item}
            </p>
            <p className="mt-3 text-sm leading-7 text-warm/68">
              Um detalhe essencial da experiência premium CrunchPop.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlavorsPreview() {
  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <p className="luxury-eyebrow">Fluxo de escolha</p>
        <h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-chocolate sm:text-6xl">
          Escolha sua CrunchPop
        </h2>
        <p className="mt-5 text-sm leading-7 text-coffee">
          Uma decisão por vez: clássicos da casa ou combinação personalizada.
        </p>
      </div>

      <div className="grid border-y border-chocolate/10 md:grid-cols-2 md:divide-x md:divide-chocolate/10">
        <DecisionPreview
          Icon={Star}
          eyebrow="Clássicos CrunchPop"
          note="Mais rápido"
          title="Clássicos CrunchPop"
          text="Nossas combinações favoritas, criadas para entregar a experiência perfeita."
          actionLabel="Escolher"
        />
        <DecisionPreview
          Icon={Sparkles}
          eyebrow="Personalizada"
          note="Do seu jeito"
          title="Crie sua combinação"
          text="Escolha seus sabores favoritos e monte sua CrunchPop do seu jeito."
          actionLabel="Personalizar"
        />
      </div>
    </div>
  );
}

function DecisionPreview({
  actionLabel,
  eyebrow,
  Icon,
  note,
  text,
  title
}: {
  actionLabel: string;
  eyebrow: string;
  Icon: typeof ShoppingBag;
  note: string;
  text: string;
  title: string;
}) {
  return (
    <article className="group border-b border-chocolate/10 py-7 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0">
      <div className="flex h-full flex-col">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-caramel">
            {eyebrow}
          </p>
          <Icon className="h-5 w-5 text-caramel" aria-hidden="true" />
        </div>
        <h3 className="font-display text-3xl font-semibold leading-tight text-chocolate sm:text-4xl">
          {title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-6 text-coffee">{text}</p>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-caramel">
          {note}
        </p>
        <span className="group mt-7 inline-flex min-h-11 w-full items-center justify-between rounded-full bg-chocolate py-1.5 pl-6 pr-1.5 text-sm font-semibold text-warm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:w-auto sm:min-w-44">
          <span>{actionLabel}</span>
          <span className="luxury-cta-mark" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </article>
  );
}

function CardsPreview() {
  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <p className="luxury-eyebrow">Componentes</p>
        <h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-chocolate sm:text-6xl">
          Cards, estados e escolhas.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {classicProducts.map((product, index) => {
          const size = sizeOptions[index % sizeOptions.length];

          return (
            <article key={product.id} className="luxury-shell relative">
              <div className="luxury-core flex min-h-full flex-col p-3">
                {product.badge && (
                  <span className="absolute right-5 top-5 z-10 rounded-full bg-warm/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-caramel shadow-card">
                    {product.badge}
                  </span>
                )}
                <div className="mb-5 overflow-hidden rounded-xl bg-warm">
                  <Image
                    src="/crunchpop-hero.png"
                    alt={`CrunchPop clássico ${product.name}`}
                    width={640}
                    height={420}
                    className="aspect-[4/3] w-full object-cover"
                    style={{ objectPosition: product.imagePosition }}
                  />
                </div>
                <h3 className="font-display text-3xl font-semibold text-chocolate">
                  {product.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-coffee">
                  {product.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {sizeOptions.map((option) => (
                    <span
                      key={option.id}
                      className={`grid min-h-11 place-items-center rounded-full border px-3 py-2 text-xs font-semibold ${
                        option.id === size.id
                          ? "border-chocolate bg-chocolate text-warm"
                          : "border-chocolate/10 bg-warm text-chocolate"
                      }`}
                    >
                      {option.name}
                    </span>
                  ))}
                </div>
                <div className="mt-5 border-t border-chocolate/10 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-coffee">
                    {size.name}
                  </p>
                  <p className="mt-1 font-display text-3xl font-semibold text-chocolate">
                    {formatCurrency(size.price)}
                  </p>
                  <span className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-chocolate px-5 py-2 text-sm font-semibold text-warm">
                    Adicionar
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CheckoutPreview() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="luxury-eyebrow">Finalização</p>
        <h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-chocolate sm:text-6xl">
          Poucos campos. Nenhuma conta.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-coffee">
          O checkout existe apenas para montar uma mensagem clara para o
          WhatsApp.
        </p>
      </div>

      <div className="luxury-shell">
        <div className="luxury-core p-5 sm:p-7">
          <CheckoutProgressPreview />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FieldPreview label="Nome" value="Alexandre" />
            <FieldPreview label="WhatsApp" value="+55 21 99018-1745" />
          </div>
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
              Como deseja receber sua CrunchPop?
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <span className="rounded-full border border-chocolate bg-chocolate px-4 py-3 text-center text-sm font-semibold text-warm">
                Retirada no local
              </span>
              <span className="rounded-full border border-chocolate/10 bg-warm px-4 py-3 text-center text-sm font-semibold text-chocolate">
                Moto Uber / Uber Flash
              </span>
            </div>
          </div>
          <p className="mt-5 rounded-2xl border border-caramel/25 bg-warm px-4 py-3 text-xs leading-6 text-coffee">
            Após confirmar o pedido, enviaremos o endereço e o horário em que
            sua CrunchPop estará pronta para retirada.
          </p>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
              Observações
            </span>
            <span className="block min-h-24 rounded-2xl border border-chocolate/10 bg-warm px-4 py-3 text-sm text-coffee/70">
              Ex.: sem canela
            </span>
          </label>
          <span className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-6 py-3 text-sm font-semibold text-warm shadow-soft">
            Revisar pedido
          </span>
        </div>
      </div>
    </div>
  );
}

function CheckoutProgressPreview() {
  return (
    <div className="rounded-2xl border border-chocolate/10 bg-warm px-4 py-4">
      <div className="grid grid-cols-3 gap-2">
        {["Escolha", "Contato", "Conferir"].map((step, index) => (
          <div key={step} className="min-w-0">
            <div
              className={`h-1.5 rounded-full ${
                index < 2 ? "bg-chocolate" : "bg-chocolate/12"
              }`}
              aria-hidden="true"
            />
            <p
              className={`mt-2 truncate text-[10px] font-semibold uppercase tracking-[0.14em] ${
                index < 2 ? "text-chocolate" : "text-coffee"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldPreview({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
        {label} <span className="text-caramel">*</span>
      </p>
      <p className="min-h-12 rounded-full border border-chocolate/10 bg-warm px-4 py-3 text-sm text-chocolate">
        {value}
      </p>
    </div>
  );
}

function ModalPreview() {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-warm/12 bg-cream text-chocolate shadow-drawer">
      <div className="border-b border-chocolate/10 px-5 py-5 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-caramel">
          Conferência
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-chocolate">
          Confira seu pedido
        </h2>
      </div>
      <div className="space-y-5 px-5 py-5 sm:px-7">
        {mockCart.map((item) => (
          <article
            key={`${item.name}-${item.sizeName}`}
            className="rounded-2xl border border-chocolate/10 bg-warm p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl font-semibold text-chocolate">
                  CrunchPop • {item.sizeName}
                </h3>
              </div>
              <span className="rounded-full border border-caramel/25 px-3 py-1 text-xs font-semibold text-chocolate">
                {item.quantity}x
              </span>
            </div>
            <div className="mt-4 text-sm leading-6 text-coffee">
              {item.kind === "classic" ? (
                <p className="font-semibold text-chocolate">{item.name}</p>
              ) : (
                <>
                  <p className="font-semibold text-chocolate">Sabores:</p>
                  <ul className="mt-1 space-y-1">
                    {item.flavors.map((flavor) => (
                      <li key={flavor}>• {flavor}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </article>
        ))}

        <ReviewLinePreview label="Total" value={formatCurrency(total)} strong />
        <ReviewLinePreview label="Recebimento" value="Retirada no local" />
        <ReviewLinePreview label="Cliente" value="Alexandre" />
        <ReviewLinePreview label="WhatsApp" value="+55 21 99018-1745" />
      </div>
      <div className="space-y-4 border-t border-chocolate/10 bg-warm/85 px-5 py-5 sm:px-7">
        <div className="rounded-2xl border border-caramel/25 bg-cream px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
            Importante
          </p>
          <p className="mt-3 text-xs leading-6 text-coffee">
            Após enviar seu pedido pelo WhatsApp, confirmaremos a
            disponibilidade, informaremos o tempo estimado de preparo e
            enviaremos a chave Pix.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-chocolate/10 bg-cream px-6 py-3 text-sm font-semibold text-chocolate">
            Editar pedido
          </span>
          <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-chocolate px-6 py-3 text-sm font-semibold text-warm shadow-soft">
            Enviar para WhatsApp
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewLinePreview({
  label,
  strong,
  value
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-chocolate/10 pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
        {label}
      </p>
      <p
        className={`text-right ${
          strong
            ? "font-display text-3xl font-semibold text-chocolate"
            : "text-sm font-semibold text-chocolate"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CartPreview() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="luxury-eyebrow">Drawer</p>
        <h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-chocolate sm:text-6xl">
          Carrinho sempre acessível.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-coffee">
          O drawer concentra resumo, ajustes de quantidade e próximo passo.
        </p>
      </div>

      <div className="ml-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-chocolate/10 bg-cream shadow-drawer">
        <div className="flex items-center justify-between border-b border-chocolate/10 px-5 py-5 sm:px-7">
          <div>
            <h3 className="font-display text-3xl font-semibold text-chocolate">
              Quase lá.
            </h3>
            <p className="mt-1 max-w-xs text-xs leading-5 text-coffee">
              Falta só mais um passo para preparar sua CrunchPop.
            </p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-chocolate/10 bg-warm text-chocolate">
            <X className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="space-y-3 px-5 py-5 sm:px-7">
          {mockCart.map((item) => (
            <div
              key={`${item.name}-${item.sizeName}-cart`}
              className="rounded-2xl border border-chocolate/10 bg-warm p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-display text-2xl font-semibold text-chocolate">
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
                    {item.sizeName}
                  </p>
                </div>
                <Trash2 className="h-4 w-4 text-coffee" aria-hidden="true" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center rounded-full border border-chocolate/10 bg-cream">
                  <span className="grid h-10 w-10 place-items-center rounded-full text-chocolate">
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="grid h-10 min-w-10 place-items-center text-sm font-semibold text-chocolate">
                    {item.quantity}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full text-chocolate">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="text-sm font-semibold text-chocolate">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
          ))}
          <CheckoutProgressPreview />
        </div>

        <div className="border-t border-chocolate/10 bg-warm/92 px-5 py-5 sm:px-7">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-coffee">2 itens</span>
            <strong className="font-display text-3xl font-semibold text-chocolate">
              {formatCurrency(total)}
            </strong>
          </div>
          <span className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-6 py-3 text-sm font-semibold text-warm shadow-soft">
            Revisar pedido
          </span>
        </div>
      </div>
    </div>
  );
}

function FooterPreview() {
  return (
    <div className="flex min-h-[60dvh] flex-col justify-between gap-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="luxury-eyebrow">Encerramento</p>
          <h2 className="mt-4 max-w-3xl font-display text-6xl font-semibold leading-none text-chocolate sm:text-7xl">
            Feita artesanalmente em Curitiba.
          </h2>
        </div>
        <div className="luxury-shell">
          <div className="luxury-core p-8">
            <BrandLockup />
            <div className="mt-10 grid gap-4 text-sm font-medium uppercase tracking-[0.18em] text-caramel">
              <p>{STORE_INSTAGRAM}</p>
              <p>{STORE_LOCATION}</p>
              <p>crunch-pop.vercel.app</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-chocolate/10 pt-8">
        <div className="grid gap-6 text-sm text-coffee md:grid-cols-[1fr_auto_1fr] md:items-center">
          <BrandLockup compact />
          <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-chocolate">
            Feita artesanalmente em Curitiba.
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-caramel md:text-right">
            {STORE_INSTAGRAM} · {STORE_LOCATION}
          </p>
        </div>
      </footer>
    </div>
  );
}
