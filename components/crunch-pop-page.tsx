"use client";

import Image from "next/image";
import {
  Check,
  Home,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  ShoppingBag,
  Star,
  Trash2,
  X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { formatCurrency } from "@/lib/format";
import {
  classicProducts,
  customFlavors,
  sizeOptions,
  type ClassicProduct,
  type SizeOption
} from "@/lib/products";
import {
  STORE_INSTAGRAM,
  STORE_LOCATION,
  STORE_WHATSAPP
} from "@/lib/store";

type CartItem = {
  id: string;
  name: string;
  sizeName: string;
  price: number;
  flavors: string[];
  kind: "classic" | "custom";
  quantity: number;
};

type PurchasePath = "classic" | "custom";

type ReceiveMode = "Retirada no local" | "Moto Uber / Uber Flash";

type CheckoutData = {
  name: string;
  whatsapp: string;
  receiveMode: ReceiveMode;
  address: string;
  number: string;
  complement: string;
  reference: string;
  notes: string;
};

const initialCheckout: CheckoutData = {
  name: "",
  whatsapp: "",
  receiveMode: "Retirada no local",
  address: "",
  number: "",
  complement: "",
  reference: "",
  notes: ""
};

export function CrunchPopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutData>(initialCheckout);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");
  const [purchasePath, setPurchasePath] = useState<PurchasePath>("classic");
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedFlavorIds, setSelectedFlavorIds] = useState<string[]>([]);
  const [addedCartItemId, setAddedCartItemId] = useState<string | null>(null);

  const selectedSize =
    sizeOptions.find((size) => size.id === selectedSizeId) ?? null;

  const selectedFlavors = customFlavors.filter((flavor) =>
    selectedFlavorIds.includes(flavor.id)
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast("");
      setAddedCartItemId(null);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [toast]);

  function updateSelectedSize(sizeId: string) {
    const nextSize = sizeOptions.find((size) => size.id === sizeId);

    if (!nextSize) {
      return;
    }

    setSelectedSizeId(sizeId);
    setSelectedFlavorIds((current) => current.slice(0, nextSize.maxFlavors));
  }

  function selectPurchasePath(path: PurchasePath) {
    setPurchasePath(path);

    if (path !== "custom") {
      setSelectedSizeId(null);
      setSelectedFlavorIds([]);
      return;
    }

    setSelectedSizeId(null);
    setSelectedFlavorIds([]);
  }

  function toggleFlavor(flavorId: string) {
    setSelectedFlavorIds((current) => {
      if (current.includes(flavorId)) {
        return current.filter((id) => id !== flavorId);
      }

      if (!selectedSize) {
        const message = "Escolha um tamanho primeiro.";
        setStatus(message);
        setToast(message);
        return current;
      }

      if (current.length >= selectedSize.maxFlavors) {
        const message = `${selectedSize.name} permite até ${selectedSize.maxFlavors} sabores.`;
        setStatus(message);
        setToast(message);
        return current;
      }

      return [...current, flavorId];
    });
  }

  function addClassicToCart(product: ClassicProduct, size: SizeOption) {
    const cartItemId = `${product.id}-${size.id}`;

    setCart((current) => {
      const existing = current.find((item) => item.id === cartItemId);

      if (existing) {
        return current.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          id: cartItemId,
          name: product.name,
          sizeName: size.name,
          price: size.price,
          flavors: product.flavors,
          kind: "classic",
          quantity: 1
        }
      ];
    });

    const message = "Boa escolha.";
    setStatus(message);
    setToast(message);
    setAddedCartItemId(cartItemId);
  }

  function addCustomToCart() {
    if (!selectedSize) {
      const message = "Escolha um tamanho.";
      setStatus(message);
      setToast(message);
      return;
    }

    if (selectedFlavors.length === 0) {
      const message = "Escolha pelo menos um sabor.";
      setStatus(message);
      setToast(message);
      return;
    }

    const cartItemId = `${selectedSize.id}-${selectedFlavorIds
      .slice()
      .sort()
      .join("-")}`;

    setCart((current) => {
      const existing = current.find((item) => item.id === cartItemId);

      if (existing) {
        return current.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          id: cartItemId,
          name: `CrunchPop ${selectedSize.name}`,
          sizeName: selectedSize.name,
          price: selectedSize.price,
          flavors: selectedFlavors.map((flavor) => flavor.name),
          kind: "custom",
          quantity: 1
        }
      ];
    });

    const message = "Boa escolha.";
    setStatus(message);
    setToast(message);
    setAddedCartItemId(cartItemId);
  }

  function updateQuantity(productId: string, nextQuantity: number) {
    setCart((current) =>
      nextQuantity <= 0
        ? current.filter((item) => item.id !== productId)
        : current.map((item) =>
            item.id === productId ? { ...item, quantity: nextQuantity } : item
          )
    );
  }

  function removeItem(productId: string) {
    setCart((current) => current.filter((item) => item.id !== productId));
  }

  function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0) {
      setStatus("Monte sua CrunchPop antes de enviar.");
      return;
    }

    setIsConfirmationOpen(true);
  }

  function formatDeliveryAddress() {
    const addressParts = [checkout.address, checkout.number]
      .filter((part) => part.trim())
      .join(", ");
    const details = [addressParts];

    if (checkout.complement.trim()) {
      details.push(`Complemento: ${checkout.complement.trim()}`);
    }

    if (checkout.reference.trim()) {
      details.push(`Referência: ${checkout.reference.trim()}`);
    }

    return details.filter(Boolean).join("\n");
  }

  function buildWhatsappMessage() {
    const orderLines = cart
      .map((item) => {
        const itemTitle = `• ${item.quantity} CrunchPop ${item.sizeName}`;

        if (item.kind === "classic") {
          return `${itemTitle}\n${item.name}`;
        }

        const flavorLines = item.flavors
          .map((flavor) => `- ${flavor}`)
          .join("\n");

        return `${itemTitle}\nSabores:\n${flavorLines}`;
      })
      .join("\n\n");

    const receivingText =
      checkout.receiveMode === "Retirada no local"
        ? "Vou retirar no local."
        : `Vou enviar um Moto Uber / Uber Flash para buscar o pedido.\n\nEndereço:\n${formatDeliveryAddress()}`;

    const sections = [
      "Olá! 😊",
      `Gostaria de pedir:\n\n${orderLines}`,
      `Total: ${formatCurrency(total)}`,
      receivingText,
      `Meu nome é ${checkout.name}.\nWhatsApp: ${checkout.whatsapp}`,
      checkout.notes.trim() ? `Observações:\n${checkout.notes.trim()}` : ""
    ].filter(Boolean);

    return sections.join("\n\n");
  }

  function sendToWhatsapp() {
    const message = buildWhatsappMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <main className="relative overflow-hidden">
      <Header totalItems={totalItems} onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      <ProductsSection
        addedCartItemId={addedCartItemId}
        purchasePath={purchasePath}
        selectedFlavorIds={selectedFlavorIds}
        selectedSize={selectedSize}
        selectedSizeId={selectedSizeId}
        onAddClassic={addClassicToCart}
        onAddCustom={addCustomToCart}
        onSelectPath={selectPurchasePath}
        onSelectSize={updateSelectedSize}
        onToggleFlavor={toggleFlavor}
      />
      <HowItWorks />
      <Footer />

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 min-w-14 items-center justify-center rounded-full bg-chocolate px-5 text-warm shadow-soft transition hover:bg-coffee focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream md:hidden"
        aria-label="Abrir carrinho"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        {totalItems > 0 && (
          <span className="ml-2 text-sm font-semibold">{totalItems}</span>
        )}
      </button>

      <Toast message={toast} />

      <OrderConfirmationModal
        address={formatDeliveryAddress()}
        cart={cart}
        checkout={checkout}
        isOpen={isConfirmationOpen}
        total={total}
        onEdit={() => {
          setIsConfirmationOpen(false);
          setIsCartOpen(true);
        }}
        onSend={sendToWhatsapp}
      />

      <CartDrawer
        cart={cart}
        checkout={checkout}
        isOpen={isCartOpen}
        status={status}
        total={total}
        totalItems={totalItems}
        onCheckoutChange={setCheckout}
        onClose={() => setIsCartOpen(false)}
        onContinueShopping={() => setIsCartOpen(false)}
        onRemove={removeItem}
        onSubmit={handleCheckout}
        onUpdateQuantity={updateQuantity}
      />
    </main>
  );
}

function Header({
  totalItems,
  onCartClick
}: {
  totalItems: number;
  onCartClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-chocolate/10 bg-cream/88 px-5 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-2">
        <a
          href="#top"
          className="text-chocolate"
          aria-label="CrunchPop, início"
        >
          <BrandLockup compact />
        </a>
        <button
          type="button"
          onClick={onCartClick}
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-chocolate py-1.5 pl-4 pr-1.5 text-sm font-semibold text-warm shadow-card transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Carrinho
          {totalItems > 0 && (
            <span className="grid h-8 min-w-8 place-items-center rounded-full bg-caramel px-2 text-xs text-chocolate transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
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

function Hero() {
  const highlights = [
    "500 ml - R$ 23",
    "1 litro - R$ 38",
    "Pix após confirmação"
  ];

  return (
    <section id="top" className="px-5 pb-16 pt-10 sm:px-8 lg:pb-24 lg:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="animate-rise">
          <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.28em] text-caramel">
            Sobremesa artesanal em Curitiba
          </p>
          <h1 className="max-w-3xl font-display text-[3.65rem] font-semibold leading-[0.94] tracking-normal text-chocolate sm:text-7xl lg:text-8xl">
            Monte sua CrunchPop.
          </h1>
          <p className="mt-7 max-w-lg text-base leading-8 text-coffee sm:text-lg">
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
            <a
              href="#sabores"
              className="luxury-cta group w-full sm:w-auto"
            >
              <span>Ver cardÃ¡pio</span>
              <span className="luxury-cta-mark" aria-hidden="true">
                →
              </span>
            </a>
            <p className="text-sm font-medium leading-6 text-coffee">
              Comece por <span className="text-chocolate">R$ 23,00</span>.
              Sem cadastro.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-3 border-y border-chocolate/10 py-4">
            {highlights.map((item) => (
              <p
                key={item}
                className="px-2 text-center text-[11px] font-semibold uppercase leading-5 tracking-[0.16em] text-coffee first:pl-0 last:pr-0"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="animate-fade">
          <div className="relative mx-auto max-w-[580px] lg:ml-auto">
            <div
              className="absolute -bottom-5 -right-5 h-[82%] w-[72%] rounded-[2rem] bg-chocolate"
              aria-hidden="true"
            />
            <div
              className="absolute -left-3 top-8 h-28 w-px bg-caramel/50"
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
                  className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.015]"
                />
              </div>
            </div>
            <div className="absolute bottom-5 left-5 rounded-full border border-caramel/25 bg-warm/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-chocolate shadow-card backdrop-blur">
              Produção diária
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection({
  addedCartItemId,
  purchasePath,
  selectedFlavorIds,
  selectedSize,
  selectedSizeId,
  onAddClassic,
  onAddCustom,
  onSelectPath,
  onSelectSize,
  onToggleFlavor
}: {
  addedCartItemId: string | null;
  purchasePath: PurchasePath;
  selectedFlavorIds: string[];
  selectedSize: SizeOption | null;
  selectedSizeId: string | null;
  onAddClassic: (product: ClassicProduct, size: SizeOption) => void;
  onAddCustom: () => void;
  onSelectPath: (path: PurchasePath) => void;
  onSelectSize: (sizeId: string) => void;
  onToggleFlavor: (flavorId: string) => void;
}) {
  const [classicSizeIds, setClassicSizeIds] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        classicProducts.map((product) => [product.id, sizeOptions[0].id])
      )
  );

  const selectedCartItemId = selectedSize
    ? `${selectedSize.id}-${selectedFlavorIds.slice().sort().join("-")}`
    : "";
  const canAddCustom = Boolean(selectedSize && selectedFlavorIds.length > 0);
  const flavorCounter = selectedSize
    ? `${selectedFlavorIds.length} de ${selectedSize.maxFlavors} sabores`
    : "";

  function selectClassicSize(productId: string, sizeId: string) {
    setClassicSizeIds((current) => ({ ...current, [productId]: sizeId }));
  }

  function getClassicSize(productId: string) {
    return (
      sizeOptions.find((size) => size.id === classicSizeIds[productId]) ??
      sizeOptions[0]
    );
  }

  return (
    <section id="sabores" className="bg-warm px-5 py-14 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-5 border-b border-chocolate/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-caramel">
              CardÃ¡pio
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-chocolate sm:text-5xl">
              Escolha sua CrunchPop
            </h2>
          </div>
          <div
            className="flex overflow-hidden rounded-full border border-chocolate/10 bg-cream p-1"
            role="tablist"
            aria-label="Tipo de pedido"
          >
            <button
              type="button"
              role="tab"
              aria-selected={purchasePath === "classic"}
              onClick={() => onSelectPath("classic")}
              className={`min-h-10 flex-1 rounded-full px-5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:flex-none ${
                purchasePath === "classic"
                  ? "bg-chocolate text-warm"
                  : "text-coffee hover:text-chocolate"
              }`}
            >
              ClÃ¡ssicos
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={purchasePath === "custom"}
              onClick={() => onSelectPath("custom")}
              className={`min-h-10 flex-1 rounded-full px-5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:flex-none ${
                purchasePath === "custom"
                  ? "bg-chocolate text-warm"
                  : "text-coffee hover:text-chocolate"
              }`}
            >
              Monte a sua
            </button>
          </div>
        </div>

        {!purchasePath && (
          <div className="animate-rise">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-caramel">
                Escolha
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-chocolate sm:text-5xl">
                Escolha sua CrunchPop
              </h2>
              <p className="mt-5 text-sm leading-7 text-coffee">
                Você prefere uma combinação criada por nós ou montar a sua?
              </p>
            </div>

            <div className="grid border-y border-chocolate/10 md:grid-cols-2 md:divide-x md:divide-chocolate/10">
              <DecisionCard
                eyebrow="Clássicos CrunchPop"
                Icon={Star}
                note="Mais rápido"
                text="Nossas combinações favoritas, criadas para entregar a experiência perfeita."
                title="Clássicos CrunchPop"
                actionLabel="Escolher"
                onClick={() => onSelectPath("classic")}
              />
              <DecisionCard
                eyebrow="Personalizada"
                Icon={Sparkles}
                note="Do seu jeito"
                text="Escolha seus sabores favoritos e monte sua CrunchPop do seu jeito."
                title="Crie sua combinação"
                actionLabel="Personalizar"
                onClick={() => onSelectPath("custom")}
              />
            </div>
          </div>
        )}

        {purchasePath === "classic" && (
          <div className="animate-rise">
            <SectionHeader
              eyebrow="Clássicos CrunchPop"
              title="Nossos Clássicos"
              subtitle="Combinações criadas para entregar a experiência perfeita."
              onBack={() => onSelectPath("custom")}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              {classicProducts.map((product, index) => {
                const selectedClassicSize = getClassicSize(product.id);
                const cartItemId = `${product.id}-${selectedClassicSize.id}`;

                return (
                  <article
                    key={product.id}
                    className="group relative rounded-2xl border border-chocolate/10 bg-cream p-4 shadow-card transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex min-h-full flex-col">
                    {product.badge && (
                      <span className="absolute right-5 top-5 z-10 rounded-full bg-warm/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-caramel shadow-card">
                        {product.badge}
                      </span>
                    )}
                    <div className="mb-4 overflow-hidden rounded-xl bg-warm">
                      <Image
                        src="/crunchpop-hero.png"
                        alt={`CrunchPop clássico ${product.name}`}
                        width={640}
                        height={420}
                        className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                        style={{ objectPosition: product.imagePosition }}
                      />
                    </div>
                    <h3 className="font-display text-3xl font-semibold text-chocolate">
                      {product.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-coffee">
                      {product.description}
                    </p>

                    <div className="mt-4 flex gap-2">
                      {sizeOptions.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => selectClassicSize(product.id, size.id)}
                          aria-pressed={selectedClassicSize.id === size.id}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                            selectedClassicSize.id === size.id
                              ? "border-chocolate bg-chocolate text-warm"
                              : "border-chocolate/10 bg-warm text-chocolate hover:border-caramel"
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-chocolate/10 pt-4">
                      <p className="font-display text-2xl font-semibold text-chocolate">
                        {formatCurrency(selectedClassicSize.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          onAddClassic(product, selectedClassicSize)
                        }
                        className="inline-flex min-h-10 items-center justify-center rounded-full bg-chocolate px-5 py-2 text-sm font-semibold text-warm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream"
                      >
                        {addedCartItemId === cartItemId
                          ? "Adicionado"
                          : "Adicionar"}
                      </button>
                    </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {purchasePath === "custom" && (
          <div className="animate-rise">
            <SectionHeader
              eyebrow="Personalizada"
              title="Crie sua combinação"
              subtitle="Escolha o tamanho e combine seus sabores favoritos."
              onBack={() => onSelectPath("classic")}
            />

            <div className="luxury-shell mx-auto max-w-3xl">
              <div className="luxury-core p-4 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coffee">
                  1. Escolha o tamanho
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => onSelectSize(size.id)}
                      aria-pressed={selectedSizeId === size.id}
                      className={`min-h-36 rounded-2xl border p-5 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        selectedSizeId === size.id
                          ? "border-chocolate bg-chocolate text-warm shadow-card"
                          : "border-chocolate/10 bg-warm text-chocolate hover:border-caramel/45"
                      }`}
                    >
                      <span className="block font-display text-4xl font-semibold">
                        {size.name}
                      </span>
                      <span
                        className={`mt-3 block text-sm font-semibold ${
                          selectedSizeId === size.id
                            ? "text-warm"
                            : "text-coffee"
                        }`}
                      >
                        Até {size.maxFlavors} sabores
                      </span>
                      <span
                        className={`mt-2 block text-base font-semibold ${
                          selectedSizeId === size.id
                            ? "text-warm"
                            : "text-chocolate"
                        }`}
                      >
                        {formatCurrency(size.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedSize && (
                <div className="mt-8 border-t border-chocolate/10 pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coffee">
                      2. Selecione os sabores
                    </p>
                    <p className="rounded-full border border-caramel/25 bg-warm px-3 py-1 text-xs font-semibold text-chocolate">
                      {flavorCounter}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {customFlavors.map((flavor) => {
                      const isSelected = selectedFlavorIds.includes(flavor.id);
                      const isDisabled =
                        !isSelected &&
                        selectedFlavorIds.length >= selectedSize.maxFlavors;

                      return (
                        <button
                          key={flavor.id}
                          type="button"
                          onClick={() => onToggleFlavor(flavor.id)}
                          disabled={isDisabled}
                          aria-pressed={isSelected}
                          className={`flex min-h-20 items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                            isSelected
                              ? "border-chocolate bg-warm shadow-card"
                              : "border-chocolate/10 bg-warm hover:border-caramel/45"
                          } ${isDisabled ? "opacity-45" : ""}`}
                        >
                          <span>
                            <span className="block font-display text-3xl font-semibold text-chocolate">
                              {flavor.name}
                            </span>
                            <span
                              className={`block overflow-hidden text-xs leading-5 text-coffee transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                                isSelected
                                  ? "mt-1 max-h-12 opacity-100"
                                  : "mt-0 max-h-0 opacity-0"
                              }`}
                            >
                              {flavor.description}
                            </span>
                          </span>
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded border text-xs font-semibold ${
                              isSelected
                                ? "border-chocolate bg-chocolate text-warm"
                                : "border-caramel/35 text-caramel"
                            }`}
                            aria-hidden="true"
                          >
                            {isSelected && (
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={onAddCustom}
                    disabled={!canAddCustom}
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-7 py-3 text-sm font-semibold text-warm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] disabled:opacity-45 focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream"
                  >
                    {!canAddCustom
                      ? "Escolha seus sabores"
                      : addedCartItemId === selectedCartItemId
                        ? "Adicionado"
                        : "Adicionar ao carrinho"}
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DecisionCard({
  actionLabel,
  eyebrow,
  Icon,
  note,
  onClick,
  text,
  title
}: {
  actionLabel: string;
  eyebrow: string;
  Icon: typeof ShoppingBag;
  note: string;
  onClick: () => void;
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
        <button
          type="button"
          onClick={onClick}
          className="group mt-7 inline-flex min-h-11 w-full items-center justify-between rounded-full bg-chocolate py-1.5 pl-6 pr-1.5 text-sm font-semibold text-warm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-warm sm:w-auto sm:min-w-44"
        >
          <span>{actionLabel}</span>
          <span className="luxury-cta-mark" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  onBack,
  subtitle,
  title
}: {
  eyebrow: string;
  onBack: () => void;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="luxury-eyebrow">
          {eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-chocolate sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-coffee">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="hidden min-h-10 items-center justify-center rounded-full border border-chocolate/10 bg-cream px-5 py-2 text-sm font-semibold text-chocolate transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-caramel hover:text-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel"
      >
        Voltar
      </button>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Monte sua CrunchPop",
      icon: ShoppingBag
    },
    {
      title: "Envie pelo WhatsApp",
      icon: MessageCircle
    },
    {
      title: "Combine o recebimento",
      icon: Home
    }
  ];

  return (
    <section id="pedido" className="px-5 py-8 sm:px-8 lg:py-10">
      <div className="mx-auto grid max-w-6xl gap-5 border-y border-chocolate/10 py-5 md:grid-cols-[0.55fr_1.45fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-caramel">
            Fluxo
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-chocolate sm:text-4xl">
            Como pedir
          </h2>
        </div>

        <div className="grid divide-y divide-chocolate/10 border-y border-chocolate/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex items-center gap-3 py-4 sm:px-5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center text-caramel">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-caramel">
                    0{index + 1}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-chocolate">
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OrderConfirmationModal({
  address,
  cart,
  checkout,
  isOpen,
  onEdit,
  onSend,
  total
}: {
  address: string;
  cart: CartItem[];
  checkout: CheckoutData;
  isOpen: boolean;
  onEdit: () => void;
  onSend: () => void;
  total: number;
}) {
  const showAddress =
    checkout.receiveMode === "Moto Uber / Uber Flash" && address.trim();
  const notes = checkout.notes.trim();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] grid place-items-end bg-chocolate/35 p-0 transition-opacity sm:place-items-center sm:p-5 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-chocolate/10 bg-cream shadow-drawer transition duration-500 focus:outline-none sm:max-w-2xl sm:rounded-2xl ${
          isOpen ? "translate-y-0" : "translate-y-6"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
      >
        <div className="border-b border-chocolate/10 px-5 py-5 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-caramel">
            Conferência
          </p>
          <h2
            id="confirmation-title"
            className="mt-2 font-display text-4xl font-semibold text-chocolate"
          >
            Confira seu pedido
          </h2>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-7">
          <div className="space-y-3">
            {cart.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-chocolate/10 bg-warm p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl font-semibold text-chocolate">
                      CrunchPop • {item.sizeName}
                    </h3>
                  </div>
                  {item.quantity > 1 && (
                    <span className="rounded-full border border-caramel/25 px-3 py-1 text-xs font-semibold text-chocolate">
                      {item.quantity}x
                    </span>
                  )}
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
          </div>

          <ReviewLine label="Total" value={formatCurrency(total)} strong />
          <ReviewLine label="Recebimento" value={checkout.receiveMode} />
          {showAddress && <ReviewBlock label="Endereço" value={address} />}
          <ReviewLine label="Cliente" value={checkout.name} />
          <ReviewLine label="WhatsApp" value={checkout.whatsapp} />
          {notes && <ReviewBlock label="Observações" value={notes} />}
        </div>

        <div className="space-y-4 border-t border-chocolate/10 bg-warm/85 px-5 py-5 sm:px-7">
          <div className="rounded-2xl border border-caramel/25 bg-cream px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
              Importante
            </p>
            <div className="mt-3 space-y-3 text-xs leading-6 text-coffee">
              <p>
                Após enviar seu pedido pelo WhatsApp, confirmaremos a
                disponibilidade, informaremos o tempo estimado de preparo e
                enviaremos a chave Pix, além das orientações para retirada ou
                envio por Moto Uber.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-chocolate/10 bg-cream px-6 py-3 text-sm font-semibold text-chocolate transition hover:border-caramel hover:text-coffee focus:outline-none focus:ring-2 focus:ring-caramel"
            >
              ← Editar pedido
            </button>
            <button
              type="button"
              onClick={onSend}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-chocolate px-6 py-3 text-sm font-semibold text-warm shadow-soft transition hover:bg-coffee focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-warm"
            >
              Enviar para WhatsApp →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewLine({
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

function ReviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-chocolate/10 pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-chocolate">
        {value}
      </p>
    </div>
  );
}

function CheckoutProgress({ activeStep }: { activeStep: number }) {
  const steps = ["Escolha", "Contato", "Conferir"];

  return (
    <div className="mt-5 rounded-2xl border border-chocolate/10 bg-warm px-4 py-4">
      <p className="sr-only">
        Etapas da finalização: escolha, contato e conferência.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="min-w-0">
            <div
              className={`h-1.5 rounded-full ${
                index <= activeStep ? "bg-chocolate" : "bg-chocolate/12"
              }`}
              aria-hidden="true"
            />
            <p
              className={`mt-2 truncate text-[10px] font-semibold uppercase tracking-[0.14em] ${
                index <= activeStep ? "text-chocolate" : "text-coffee"
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

function CartDrawer({
  cart,
  checkout,
  isOpen,
  status,
  total,
  totalItems,
  onCheckoutChange,
  onClose,
  onContinueShopping,
  onRemove,
  onSubmit,
  onUpdateQuantity
}: {
  cart: CartItem[];
  checkout: CheckoutData;
  isOpen: boolean;
  status: string;
  total: number;
  totalItems: number;
  onCheckoutChange: (checkout: CheckoutData) => void;
  onClose: () => void;
  onContinueShopping: () => void;
  onRemove: (productId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}) {
  const isFlash = checkout.receiveMode === "Moto Uber / Uber Flash";
  const hasCustomerInfo = Boolean(
    checkout.name.trim() && checkout.whatsapp.trim()
  );
  const hasReceivingInfo =
    !isFlash || Boolean(checkout.address.trim() && checkout.number.trim());
  const isReadyToReview = cart.length > 0 && hasCustomerInfo && hasReceivingInfo;
  const checkoutHint = !hasCustomerInfo
    ? "Preencha nome e WhatsApp para revisar."
    : !hasReceivingInfo
      ? "Informe o endereço para Moto Uber."
      : "Tudo pronto para conferir antes do WhatsApp.";
  const progressStep = isReadyToReview ? 2 : cart.length > 0 ? 1 : 0;

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={onClose}
        className={`absolute inset-0 bg-chocolate/35 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-cream shadow-drawer transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrinho e checkout"
      >
        <div className="flex items-center justify-between border-b border-chocolate/10 px-5 py-5 sm:px-7">
          <div>
            <h2 className="font-display text-3xl font-semibold text-chocolate">
              Quase lá.
            </h2>
            <p className="mt-1 max-w-xs text-xs leading-5 text-coffee">
              Falta só mais um passo para preparar sua CrunchPop.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full border border-chocolate/10 bg-warm text-chocolate transition hover:border-caramel hover:text-coffee focus:outline-none focus:ring-2 focus:ring-caramel"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <p className="sr-only" aria-live="polite">
            {status}
          </p>

          {cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-caramel/40 bg-warm p-6 text-center">
              <ShoppingBag
                className="mx-auto mb-4 h-7 w-7 text-caramel"
                aria-hidden="true"
              />
              <p className="font-display text-2xl font-semibold text-chocolate">
                Sua próxima CrunchPop começa aqui.
              </p>
              <p className="mt-2 text-sm leading-6 text-coffee">
                Escolha o tamanho e combine seus sabores favoritos.
              </p>
              <a
                href="#sabores"
                onClick={onContinueShopping}
                className="luxury-cta group mt-5 w-full"
              >
                <span>Montar minha CrunchPop</span>
                <span className="luxury-cta-mark" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-chocolate/10 bg-warm p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-chocolate">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
                        {item.sizeName}
                      </p>
                      <div className="mt-3 text-xs leading-5 text-coffee">
                        <p className="font-semibold text-chocolate">
                          Sabores:
                        </p>
                        <ul className="mt-1 space-y-1">
                          {item.flavors.map((flavor) => (
                            <li key={flavor}>• {flavor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-coffee transition hover:bg-cream hover:text-chocolate focus:outline-none focus:ring-2 focus:ring-caramel"
                      aria-label={`Remover ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-chocolate/10 bg-cream">
                      <QuantityButton
                        label={`Diminuir ${item.name}`}
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </QuantityButton>
                      <span className="grid h-10 min-w-10 place-items-center text-sm font-semibold text-chocolate">
                        {item.quantity}
                      </span>
                      <QuantityButton
                        label={`Aumentar ${item.name}`}
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </QuantityButton>
                    </div>
                    <p className="text-sm font-semibold text-chocolate">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <>
              <CheckoutProgress activeStep={progressStep} />

              <p className="mt-5 rounded-2xl border border-caramel/20 bg-warm px-4 py-3 text-xs leading-6 text-coffee">
                Confirmamos disponibilidade e horário pelo WhatsApp antes de
                qualquer pagamento.
              </p>

              <form id="checkout" onSubmit={onSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Nome"
                value={checkout.name}
                required
                autoComplete="name"
                onChange={(value) =>
                  onCheckoutChange({ ...checkout, name: value })
                }
              />
              <TextField
                label="WhatsApp"
                value={checkout.whatsapp}
                required
                inputMode="tel"
                type="tel"
                autoComplete="tel"
                onChange={(value) =>
                  onCheckoutChange({ ...checkout, whatsapp: value })
                }
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
                Como deseja receber sua CrunchPop?
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["Retirada no local", "Moto Uber / Uber Flash"] as const).map(
                  (mode) => (
                    <label
                      key={mode}
                      className={`flex min-h-12 cursor-pointer items-center justify-center rounded-full border px-4 py-3 text-center text-sm font-semibold transition ${
                        checkout.receiveMode === mode
                          ? "border-chocolate bg-chocolate text-warm"
                          : "border-chocolate/10 bg-warm text-chocolate hover:border-caramel"
                      }`}
                    >
                      <input
                        type="radio"
                        name="receiveMode"
                        value={mode}
                        checked={checkout.receiveMode === mode}
                        onChange={() =>
                          onCheckoutChange({ ...checkout, receiveMode: mode })
                        }
                        className="sr-only"
                      />
                      {mode}
                    </label>
                  )
                )}
              </div>
            </fieldset>

            {isFlash ? (
              <div className="space-y-4">
                <TextField
                  label="Endereço completo"
                  value={checkout.address}
                  required
                  autoComplete="street-address"
                  onChange={(value) =>
                    onCheckoutChange({ ...checkout, address: value })
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Número"
                    value={checkout.number}
                    required
                    inputMode="numeric"
                    autoComplete="address-line2"
                    onChange={(value) =>
                      onCheckoutChange({ ...checkout, number: value })
                    }
                  />
                  <TextField
                    label="Complemento"
                    value={checkout.complement}
                    autoComplete="address-line3"
                    onChange={(value) =>
                      onCheckoutChange({ ...checkout, complement: value })
                    }
                  />
                </div>
                <TextField
                  label="Ponto de referência"
                  value={checkout.reference}
                  onChange={(value) =>
                    onCheckoutChange({ ...checkout, reference: value })
                  }
                />
                <p className="rounded-2xl border border-caramel/25 bg-warm px-4 py-3 text-xs leading-6 text-coffee">
                  O cliente fica responsável por solicitar o transporte após a
                  confirmação do pedido.
                </p>
              </div>
            ) : (
              <p className="rounded-2xl border border-caramel/25 bg-warm px-4 py-3 text-xs leading-6 text-coffee">
                Após confirmar o pedido, enviaremos o endereço e o horário em
                que sua CrunchPop estará pronta para retirada.
              </p>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
                Observações
              </span>
              <textarea
                value={checkout.notes}
                onChange={(event) =>
                  onCheckoutChange({ ...checkout, notes: event.target.value })
                }
                className="min-h-24 w-full resize-none rounded-2xl border border-chocolate/10 bg-warm px-4 py-3 text-sm text-chocolate outline-none transition placeholder:text-coffee/55 focus:border-caramel focus:ring-2 focus:ring-caramel/20"
                placeholder="Ex.: sem canela"
              />
            </label>
              </form>
            </>
          )}
        </div>

        <div className="border-t border-chocolate/10 bg-warm/92 px-5 py-5 backdrop-blur sm:px-7">
          {cart.length === 0 ? (
            <a
              href="#sabores"
              onClick={onContinueShopping}
              className="luxury-cta group w-full"
            >
              <span>Escolher minha CrunchPop</span>
              <span className="luxury-cta-mark" aria-hidden="true">
                →
              </span>
            </a>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-coffee">
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </span>
                <strong className="font-display text-3xl font-semibold text-chocolate">
                  {formatCurrency(total)}
                </strong>
              </div>
              <button
                type="submit"
                form="checkout"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-6 py-3 text-sm font-semibold text-warm shadow-soft transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-warm"
              >
                Revisar pedido
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-coffee">
                {checkoutHint}
              </p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function QuantityButton({
  children,
  label,
  onClick
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full text-chocolate transition hover:bg-warm focus:outline-none focus:ring-2 focus:ring-caramel"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function TextField({
  autoComplete,
  inputMode,
  label,
  onChange,
  required,
  type = "text",
  value
}: {
  autoComplete?: string;
  inputMode?: "text" | "tel" | "numeric";
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "tel";
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
        {label}
        {required && <span className="text-caramel"> *</span>}
      </span>
      <input
        value={value}
        required={required}
        aria-required={required}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-full border border-chocolate/10 bg-warm px-4 py-3 text-sm text-chocolate outline-none transition placeholder:text-coffee/55 focus:border-caramel focus:ring-2 focus:ring-caramel/20"
      />
    </label>
  );
}

function Footer() {
  return (
    <footer className="px-5 pb-10 pt-6 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 border-t border-chocolate/10 pt-8 text-sm text-coffee md:grid-cols-[1fr_auto_1fr] md:items-center">
        <BrandLockup compact />
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-chocolate">
          Feita artesanalmente em Curitiba.
        </p>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-caramel md:text-right">
          {STORE_INSTAGRAM} · {STORE_LOCATION}
        </p>
      </div>
    </footer>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div
      className={`fixed bottom-24 left-5 right-5 z-40 mx-auto max-w-sm rounded-full border border-caramel/25 bg-warm/95 px-5 py-3 text-center text-sm font-semibold text-chocolate shadow-soft backdrop-blur transition duration-500 md:bottom-8 md:left-auto md:right-8 ${
        message
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      {message || "Boa escolha."}
    </div>
  );
}
