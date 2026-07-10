"use client";

import Image from "next/image";
import {
  Check,
  Home,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { formatCurrency } from "@/lib/format";
import {
  classicProducts,
  customFlavors,
  sizeOptions,
  type ClassicProduct,
  type SizeOption,
} from "@/lib/products";
import {
  STORE_INSTAGRAM,
  STORE_WHATSAPP,
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

type CheckoutData = {
  name: string;
  notes: string;
};

const initialCheckout: CheckoutData = {
  name: "",
  notes: "",
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
    selectedFlavorIds.includes(flavor.id),
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast("");
      setAddedCartItemId(null);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function updateSelectedSize(sizeId: string) {
    const nextSize = sizeOptions.find((size) => size.id === sizeId);
    if (!nextSize) return;
    setSelectedSizeId(sizeId);
    setSelectedFlavorIds((current) => current.slice(0, nextSize.maxFlavors));
  }

  function selectPurchasePath(path: PurchasePath) {
    setPurchasePath(path);
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
            : item,
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
          quantity: 1,
        },
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
    const cartItemId = `${selectedSize.id}-${selectedFlavorIds.slice().sort().join("-")}`;
    setCart((current) => {
      const existing = current.find((item) => item.id === cartItemId);
      if (existing) {
        return current.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        {
          id: cartItemId,
          name: `Baldinho CrunchPop ${selectedSize.name}`,
          sizeName: selectedSize.name,
          price: selectedSize.price,
          flavors: selectedFlavors.map((flavor) => flavor.name),
          kind: "custom",
          quantity: 1,
        },
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
            item.id === productId ? { ...item, quantity: nextQuantity } : item,
          ),
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
    if (!checkout.name.trim()) {
      setStatus("Informe seu nome para continuar.");
      setToast("Informe seu nome para continuar.");
      return;
    }
    setIsConfirmationOpen(true);
  }

  function buildWhatsappMessage() {
    const orderLines = cart
      .map((item) => {
        const itemTitle = `• ${item.quantity} CrunchPop ${item.sizeName}`;
        const flavors =
          item.flavors.length === 1
            ? item.flavors[0]
            : ["Sabores:", ...item.flavors.map((flavor) => `- ${flavor}`)].join(
                "\n",
              );
        return `${itemTitle}\n${flavors}`;
      })
      .join("\n\n");

    const parts = [
      "Olá! Gostaria de pedir:",
      orderLines,
      `Total: ${formatCurrency(total)}`,
      `Meu nome é ${checkout.name.trim()}.`,
    ];

    if (checkout.notes.trim()) {
      parts.push(`Observação:\n${checkout.notes.trim()}`);
    }

    return parts.join("\n\n");
  }

  function sendToWhatsapp() {
    const message = buildWhatsappMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${STORE_WHATSAPP}?text=${encodedMessage}`,
      "_blank",
    );
  }

  return (
    <main
      className={`relative overflow-hidden transition-[padding] duration-500 ${totalItems > 0 ? "pb-[72px]" : ""}`}
    >
      <Header totalItems={totalItems} onCartClick={() => setIsCartOpen(true)} />
      <ChoiceSection
        purchasePath={purchasePath}
        onSelectPath={selectPurchasePath}
      />
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
      <StoreInfo />

      {/* Sticky checkout bar — appears when cart has items */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          totalItems > 0
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 bg-chocolate px-5 py-4 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-medium text-warm/60">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </span>
            <strong className="font-display text-xl font-semibold italic text-caramel sm:text-2xl">
              {formatCurrency(total)}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="rounded-full bg-caramel px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-chocolate transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-warm focus:ring-offset-2 focus:ring-offset-chocolate"
          >
            Finalizar pedido
          </button>
        </div>
      </div>

      <Toast message={toast} />

      <OrderConfirmationModal
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

// ─── Header ─────────────────────────────────────────────────────────────────

function Header({
  totalItems,
  onCartClick,
}: {
  totalItems: number;
  onCartClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-chocolate/10 bg-cream/90 px-5 backdrop-blur-xl sm:px-8">
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
          aria-label={`Abrir carrinho${totalItems > 0 ? `, ${totalItems > 99 ? "99+" : totalItems} ${totalItems === 1 ? "item" : "itens"}` : ""}`}
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-chocolate py-1.5 pl-5 pr-1.5 text-sm font-semibold text-warm shadow-card transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream"
        >
          Meu baldinho
          <span
            aria-hidden="true"
            className="grid h-8 min-w-8 place-items-center rounded-full bg-caramel px-2 text-xs text-chocolate transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
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

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[88svh] flex-col items-center justify-center px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="animate-fade mx-auto w-full max-w-4xl text-center">
        {/* Brand name as hero */}
        <h1 className="font-display font-semibold leading-[0.95] text-[clamp(3rem,13vw,7rem)]">
          <span className="text-chocolate">Crunch</span>
          <em className="italic text-caramel">Pop</em>
        </h1>

        {/* Tagline */}
        <p className="mx-auto mt-6 max-w-sm font-display text-base italic leading-relaxed text-coffee sm:max-w-md sm:text-lg lg:text-xl">
          O som que antecede o prazer —<br className="sm:hidden" /> preparado
          diariamente.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#escolha"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("escolha")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-chocolate px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-warm shadow-soft transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream"
          >
            Ver sabores
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Choice Section ──────────────────────────────────────────────────────────

function ChoiceSection({
  purchasePath,
  onSelectPath,
}: {
  purchasePath: PurchasePath;
  onSelectPath: (path: PurchasePath) => void;
}) {
  function handleChoice(path: PurchasePath) {
    onSelectPath(path);
    setTimeout(() => {
      document
        .getElementById("sabores")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <section id="escolha" className="px-5 pb-16 pt-20 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center sm:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-caramel">
            Escolha seu baldinho
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[2rem] font-semibold leading-[1.08] text-chocolate sm:text-5xl lg:text-6xl">
            Quatro sabores. Um ritual.
          </h2>
          <p className="mx-auto mt-6 max-w-[24rem] text-sm leading-7 text-coffee sm:max-w-lg sm:text-base sm:leading-8">
            Cada baldinho é preparado na hora, com o mesmo caramelo feito em
            pequenos lotes. Escolha um — ou monte sua combinação.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Classic card */}
          <button
            type="button"
            onClick={() => handleChoice("classic")}
            className={`group relative overflow-hidden rounded-[2rem] border text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream ${
              purchasePath === "classic"
                ? "border-chocolate bg-chocolate shadow-soft"
                : "border-chocolate/10 bg-warm hover:border-chocolate/30 hover:shadow-card"
            }`}
          >
            <div className="overflow-hidden rounded-[calc(2rem-1px)]">
              <Image
                src="/crunchpop-baldinho.png"
                alt="Baldinho CrunchPop clássico"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>
            <div className="p-6 sm:p-7">
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${purchasePath === "classic" ? "text-caramel" : "text-caramel"}`}
              >
                Combinações prontas
              </span>
              <h3
                className={`mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl ${purchasePath === "classic" ? "text-warm" : "text-chocolate"}`}
              >
                Clássicos
              </h3>
              <p
                className={`mt-2 text-sm leading-6 ${purchasePath === "classic" ? "text-warm/70" : "text-coffee"}`}
              >
                Quatro receitas desenvolvidas para não precisar de nada mais.
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${purchasePath === "classic" ? "bg-warm text-chocolate" : "bg-chocolate text-warm group-hover:bg-coffee"}`}
              >
                Ver clássicos <span aria-hidden="true">→</span>
              </span>
            </div>
          </button>

          {/* Custom card */}
          <button
            type="button"
            onClick={() => handleChoice("custom")}
            className={`group relative overflow-hidden rounded-[2rem] border text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream ${
              purchasePath === "custom"
                ? "border-chocolate bg-chocolate shadow-soft"
                : "border-chocolate/10 bg-warm hover:border-chocolate/30 hover:shadow-card"
            }`}
          >
            <div className="overflow-hidden rounded-[calc(2rem-1px)]">
              <Image
                src="/crunchpop-hero.png"
                alt="Monte sua combinação de sabores CrunchPop"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                style={{ objectPosition: "50% 40%" }}
              />
            </div>
            <div className="p-6 sm:p-7">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-caramel">
                Do seu jeito
              </span>
              <h3
                className={`mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl ${purchasePath === "custom" ? "text-warm" : "text-chocolate"}`}
              >
                Monte a sua
              </h3>
              <p
                className={`mt-2 text-sm leading-6 ${purchasePath === "custom" ? "text-warm/70" : "text-coffee"}`}
              >
                Tamanho e sabores escolhidos por você. Sem mais nem menos.
              </p>
              <span
                className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${purchasePath === "custom" ? "bg-warm text-chocolate" : "bg-chocolate text-warm group-hover:bg-coffee"}`}
              >
                Montar o meu <span aria-hidden="true">→</span>
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Products Section ────────────────────────────────────────────────────────

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
  onToggleFlavor,
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
        classicProducts.map((product) => [product.id, sizeOptions[0].id]),
      ),
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
    <section id="sabores" className="bg-cream px-5 py-14 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {purchasePath === "classic" && (
          <div className="animate-rise">
            <SectionHeader
              eyebrow="Preparados hoje"
              title="Nossos Clássicos"
              subtitle="Quatro combinações. Cada uma com sua própria textura, seu próprio momento."
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
              {classicProducts.map((product, index) => {
                const selectedClassicSize = getClassicSize(product.id);
                const cartItemId = `${product.id}-${selectedClassicSize.id}`;

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-chocolate/10 bg-warm shadow-card transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-soft sm:rounded-[2rem]"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    {/* Image with badge overlay */}
                    <div className="relative overflow-hidden">
                      <Image
                        src="/crunchpop-baldinho.png"
                        alt={`Baldinho CrunchPop ${product.name}`}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                        style={{ objectPosition: product.imagePosition }}
                      />
                      {product.badge && (
                        <span className="absolute bottom-2 left-2 rounded-full border border-caramel/30 bg-warm/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-caramel backdrop-blur-sm sm:bottom-3 sm:left-3 sm:px-2.5 sm:text-[10px]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Info — grows to fill card height for alignment */}
                    <div className="flex flex-1 flex-col p-3 sm:p-4 lg:p-5">
                      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-caramel sm:text-[10px]">
                        {product.note}
                      </p>
                      <h3 className="font-display text-lg font-semibold leading-tight text-chocolate sm:text-xl lg:text-2xl">
                        {product.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-coffee sm:text-xs sm:leading-5">
                        {product.description}
                      </p>

                      {/* Size pills */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {sizeOptions.map((size) => (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() =>
                              selectClassicSize(product.id, size.id)
                            }
                            aria-pressed={selectedClassicSize.id === size.id}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-3 sm:text-xs ${
                              selectedClassicSize.id === size.id
                                ? "border-chocolate bg-chocolate text-warm"
                                : "border-chocolate/12 bg-cream text-chocolate hover:border-caramel"
                            }`}
                          >
                            {size.name}
                          </button>
                        ))}
                      </div>

                      {/* Spacer pushes price+cta to bottom */}
                      <div className="flex-1" />

                      {/* Price + CTA — always at card bottom */}
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-chocolate/10 pt-3">
                        <p className="font-display text-lg font-semibold text-chocolate sm:text-xl">
                          {formatCurrency(selectedClassicSize.price)}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            onAddClassic(product, selectedClassicSize)
                          }
                          className="inline-flex min-h-8 items-center justify-center rounded-full bg-chocolate px-3 py-1.5 text-[10px] font-semibold text-warm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-1 focus:ring-offset-warm sm:min-h-10 sm:px-5 sm:py-2 sm:text-xs"
                        >
                          {addedCartItemId === cartItemId ? "✓" : "Adicionar"}
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
              eyebrow="Combinação livre"
              title="Monte seu baldinho"
              subtitle="Escolha o tamanho e depois os sabores. Simples, direto e do seu jeito."
            />

            <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-chocolate/10 bg-warm/65 p-4 shadow-card sm:p-6">
              <div className="space-y-7">
                {/* Step 1 — Size */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-chocolate text-[10px] font-semibold text-warm">
                      1
                    </span>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coffee">
                      Escolha o tamanho
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => onSelectSize(size.id)}
                        aria-pressed={selectedSizeId === size.id}
                        className={`min-h-[7.5rem] rounded-[1.35rem] border p-4 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:p-5 ${
                          selectedSizeId === size.id
                            ? "border-chocolate bg-chocolate text-warm shadow-card"
                            : "border-chocolate/10 bg-warm text-chocolate hover:border-caramel/45"
                        }`}
                      >
                        <span className="block font-display text-2xl font-semibold">
                          {size.name}
                        </span>
                        <span
                          className={`mt-2 block text-sm font-semibold ${selectedSizeId === size.id ? "text-warm/70" : "text-coffee"}`}
                        >
                          Até {size.maxFlavors} sabores
                        </span>
                        <span
                          className={`mt-2 block font-display text-xl font-semibold ${selectedSizeId === size.id ? "text-warm" : "text-chocolate"}`}
                        >
                          {formatCurrency(size.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 — Flavors (only when size is selected) */}
                {selectedSize && (
                  <div className="animate-rise border-t border-chocolate/10 pt-7">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-chocolate text-[10px] font-semibold text-warm">
                          2
                        </span>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coffee">
                          Escolha os sabores
                        </p>
                      </div>
                      <span className="rounded-full border border-caramel/25 bg-cream px-3 py-1 text-xs font-semibold text-chocolate">
                        {flavorCounter}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {customFlavors.map((flavor) => {
                        const isSelected = selectedFlavorIds.includes(
                          flavor.id,
                        );
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
                            className={`flex min-h-[4.5rem] items-center justify-between gap-4 rounded-[1.35rem] border px-4 py-3.5 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                              isSelected
                                ? "border-chocolate bg-cream shadow-card"
                                : "border-chocolate/10 bg-warm hover:border-caramel/45"
                            } ${isDisabled ? "opacity-40" : ""}`}
                          >
                            <span>
                              <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-caramel">
                                {flavor.note}
                              </span>
                              <span className="block font-display text-xl font-semibold text-chocolate sm:text-2xl">
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
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                                isSelected
                                  ? "border-chocolate bg-chocolate text-warm"
                                  : "border-caramel/35 text-caramel"
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected && (
                                <Check
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
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
                      className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-7 py-3 text-sm font-semibold text-warm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream"
                    >
                      {!canAddCustom
                        ? "Escolha pelo menos um sabor"
                        : addedCartItemId === selectedCartItemId
                          ? "Adicionado ✓"
                          : "Adicionar ao baldinho"}
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

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  subtitle,
  title,
}: {
  eyebrow: string;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <span className="luxury-eyebrow">{eyebrow}</span>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-chocolate sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-coffee">{subtitle}</p>
    </div>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { title: "Escolha seu baldinho", icon: ShoppingBag },
    { title: "Envie pelo WhatsApp", icon: MessageCircle },
    { title: "Combine a entrega", icon: Home },
  ];

  return (
    <section id="pedido" className="px-5 py-10 sm:px-8 lg:py-14">
      <div className="mx-auto grid max-w-6xl gap-5 py-8 md:grid-cols-[0.55fr_1.45fr] md:items-center">
        <div>
          <span className="luxury-eyebrow">Simples assim</span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-chocolate sm:text-3xl">
            Como pedir
          </h2>
        </div>

        <div className="grid divide-y divide-chocolate/10 border-y border-chocolate/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex items-center gap-3 py-5 sm:px-6"
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

// ─── Store Info ──────────────────────────────────────────────────────────────

function StoreInfo() {
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP}`;
  const instagramUrl = `https://instagram.com/${STORE_INSTAGRAM.replace("@", "")}`;

  return (
    <footer className="px-5 pb-10 pt-8 sm:px-8 lg:pt-10" aria-label="Rodapé">
      <div className="mx-auto max-w-6xl border-t border-chocolate/10 pt-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-4">
            <BrandLockup compact />
            <p className="max-w-sm text-sm font-medium leading-6 text-chocolate">
              Pequenos lotes. Grandes momentos.
            </p>
          </div>

          <div className="flex max-w-xl flex-wrap items-center gap-x-3 gap-y-3 text-sm font-medium leading-6 text-coffee md:justify-end md:text-right">
            <span>Curitiba, PR</span>
            <span className="text-caramel/60" aria-hidden="true">
              ·
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-chocolate focus:outline-none focus:ring-2 focus:ring-caramel"
            >
              WhatsApp
            </a>
            <span className="text-caramel/60" aria-hidden="true">
              ·
            </span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-chocolate focus:outline-none focus:ring-2 focus:ring-caramel"
            >
              Instagram
            </a>
            <span className="text-caramel/60" aria-hidden="true">
              ·
            </span>
            <span>Pix após confirmação.</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-chocolate/10 pt-5 text-xs leading-5 text-coffee/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© CrunchPop</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Order Confirmation Modal ────────────────────────────────────────────────

function OrderConfirmationModal({
  cart,
  checkout,
  isOpen,
  onEdit,
  onSend,
  total,
}: {
  cart: CartItem[];
  checkout: CheckoutData;
  isOpen: boolean;
  onEdit: () => void;
  onSend: () => void;
  total: number;
}) {
  const notes = checkout.notes.trim();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-chocolate/10 bg-cream shadow-drawer transition duration-500 focus:outline-none sm:max-w-2xl sm:rounded-[2rem] ${
          isOpen ? "translate-y-0" : "translate-y-6"
        }`}
      >
        <div className="border-b border-chocolate/10 px-6 py-6 sm:px-8">
          <h2
            id="confirmation-title"
            className="font-display text-3xl font-semibold text-chocolate sm:text-4xl"
          >
            Confira seu pedido
          </h2>
        </div>

        <div className="space-y-4 px-6 py-6 sm:px-8">
          {cart.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-chocolate/10 bg-warm p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold leading-tight text-chocolate">
                  CrunchPop {item.sizeName}
                </h3>
                <span className="rounded-full border border-caramel/25 px-3 py-1 text-xs font-semibold text-chocolate">
                  {item.quantity}×
                </span>
              </div>
              <div className="mt-3 text-sm leading-6 text-coffee">
                {item.kind === "classic" && (
                  <p className="mb-2 font-semibold text-chocolate">
                    {item.name}
                  </p>
                )}
                <p className="font-semibold text-chocolate">Sabores</p>
                <ul className="mt-1 space-y-0.5">
                  {item.flavors.map((flavor) => (
                    <li key={flavor}>• {flavor}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 font-display text-xl font-semibold text-chocolate">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </article>
          ))}

          <ReviewLine label="Total" value={formatCurrency(total)} strong />
          <ReviewLine label="Nome" value={checkout.name.trim()} />
          {notes && <ReviewBlock label="Observações" value={notes} />}
        </div>

        <div className="space-y-4 border-t border-chocolate/10 bg-warm/85 px-6 py-6 sm:px-8">
          <div className="rounded-2xl border border-caramel/25 bg-cream px-5 py-4">
            <p className="text-xs leading-6 text-coffee">
              Após abrir o WhatsApp, confirmaremos a disponibilidade,
              informaremos o tempo de preparo e enviaremos a chave Pix e o
              endereço para retirada. Caso prefira, você poderá solicitar um
              Moto Uber ou Uber Flash para buscar o pedido.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-chocolate/10 bg-cream px-6 py-3 text-sm font-semibold text-chocolate transition hover:border-caramel hover:text-coffee focus:outline-none focus:ring-2 focus:ring-caramel"
            >
              Editar pedido
            </button>
            <button
              type="button"
              onClick={onSend}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-chocolate px-6 py-3 text-sm font-semibold text-warm shadow-soft transition hover:bg-coffee focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-warm"
            >
              Confirmar e abrir WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Review helpers ──────────────────────────────────────────────────────────

function ReviewLine({
  label,
  strong,
  value,
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
        className={`text-right ${strong ? "font-display text-2xl font-semibold text-chocolate" : "text-sm font-semibold text-chocolate"}`}
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

// ─── Cart Drawer ─────────────────────────────────────────────────────────────

function CartDrawer({
  cart,
  checkout,
  isOpen,
  status,
  total,
  onCheckoutChange,
  onClose,
  onContinueShopping,
  onRemove,
  onSubmit,
  onUpdateQuantity,
}: {
  cart: CartItem[];
  checkout: CheckoutData;
  isOpen: boolean;
  status: string;
  total: number;
  onCheckoutChange: (checkout: CheckoutData) => void;
  onClose: () => void;
  onContinueShopping: () => void;
  onRemove: (productId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}) {
  const isCartEmpty = cart.length === 0;

  return (
    <div
      className={`fixed inset-0 z-50 transition ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={onClose}
        className={`absolute inset-0 bg-chocolate/35 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-cream shadow-drawer transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrinho e checkout"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chocolate/10 px-5 py-5 sm:px-7">
          <div>
            <h2 className="font-display text-2xl font-semibold text-chocolate">
              {isCartEmpty ? "Seu carrinho" : "Seu pedido"}
            </h2>
            <p className="mt-1 max-w-xs text-xs leading-5 text-coffee">
              {isCartEmpty
                ? "Ainda não há nenhuma CrunchPop por aqui."
                : "Revise, ajuste e finalize quando estiver pronto."}
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <p className="sr-only" aria-live="polite">
            {status}
          </p>

          {isCartEmpty ? (
            <div className="rounded-[1.75rem] border border-chocolate/10 bg-warm px-6 py-8 text-left shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-caramel/25 bg-cream text-caramel">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-7 font-display text-3xl font-semibold leading-tight text-chocolate">
                Vamos escolher a primeira?
              </p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-coffee">
                Escolha um clássico da casa ou crie sua própria combinação.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-chocolate/10 bg-warm p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-semibold leading-tight text-chocolate">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-caramel">
                        {item.sizeName}
                      </p>
                      <div className="mt-3 text-xs leading-5 text-coffee">
                        <p className="font-semibold text-chocolate">Sabores</p>
                        <ul className="mt-1 space-y-0.5">
                          {item.flavors.map((flavor) => (
                            <li key={flavor}>• {flavor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-chocolate/10 text-coffee transition hover:border-caramel hover:bg-cream hover:text-chocolate focus:outline-none focus:ring-2 focus:ring-caramel"
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
                    <p className="font-display text-xl font-semibold text-chocolate">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <>
              <form
                id="checkout"
                onSubmit={onSubmit}
                className="mt-6 space-y-5"
              >
                <TextField
                  label="Como podemos te chamar?"
                  value={checkout.name}
                  required
                  autoComplete="name"
                  placeholder="Seu nome"
                  onChange={(value) =>
                    onCheckoutChange({ ...checkout, name: value })
                  }
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-chocolate">
                    Quer acrescentar alguma observação?
                  </span>
                  <textarea
                    value={checkout.notes}
                    onChange={(event) =>
                      onCheckoutChange({
                        ...checkout,
                        notes: event.target.value,
                      })
                    }
                    className="min-h-24 w-full resize-none rounded-2xl border border-chocolate/10 bg-warm px-4 py-3 text-sm text-chocolate outline-none transition placeholder:text-coffee/55 focus:border-caramel focus:ring-2 focus:ring-caramel/20"
                    placeholder="Ex.: preferência de horário ou alguma informação importante."
                  />
                </label>

                <p className="rounded-2xl border border-caramel/20 bg-warm px-4 py-3 text-xs leading-6 text-coffee">
                  Após abrir o WhatsApp, confirmaremos a disponibilidade,
                  informaremos o tempo de preparo e enviaremos a chave Pix e o
                  endereço para retirada. Caso prefira, você poderá solicitar um
                  Moto Uber ou Uber Flash para buscar o pedido.
                </p>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-chocolate/10 bg-warm/92 px-5 py-5 backdrop-blur sm:px-7">
          {isCartEmpty ? (
            <div className="space-y-3">
              <a
                href="#escolha"
                onClick={onContinueShopping}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-chocolate px-6 py-3 text-sm font-semibold text-warm shadow-soft transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-coffee active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-warm"
              >
                Começar meu pedido
              </a>
              <button
                type="button"
                onClick={onClose}
                className="min-h-10 w-full text-center text-xs font-semibold text-coffee transition hover:text-chocolate focus:outline-none focus:ring-2 focus:ring-caramel"
              >
                Continuar navegando
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-coffee">
                  Total
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
                Abrir conversa no WhatsApp
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-coffee">
                Você poderá revisar tudo antes de enviar o pedido pelo WhatsApp.
              </p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

// ─── Quantity Button ─────────────────────────────────────────────────────────

function QuantityButton({
  children,
  label,
  onClick,
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

// ─── Text Field ───────────────────────────────────────────────────────────────

function TextField({
  autoComplete,
  inputMode,
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: {
  autoComplete?: string;
  inputMode?: "text" | "tel" | "numeric";
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "tel";
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-chocolate">
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
        placeholder={placeholder}
        className="min-h-12 w-full rounded-full border border-chocolate/10 bg-warm px-4 py-3 text-sm text-chocolate outline-none transition placeholder:text-coffee/55 focus:border-caramel focus:ring-2 focus:ring-caramel/20"
      />
    </label>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

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
