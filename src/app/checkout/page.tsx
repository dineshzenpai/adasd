"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddresses, useAuth, useCards, useCart, useOrders, useUI, type Address } from "@/lib/store";
import { cx, formatPrice, orderNumber } from "@/lib/format";
import { PaymentBadges } from "@/components/ui";
import { IconApple, IconCheck, IconGoogle, IconShield } from "@/components/icons";


/* ---------- helpers ---------- */

type Brand = "visa" | "mastercard" | "amex" | null;
function detectBrand(num: string): Brand {
  if (/^4/.test(num)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(num)) return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  return null;
}
function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function validExpiry(v: string) {
  const m = v.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = +m[1];
  const year = 2000 + +m[2];
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

const STEPS = ["Information", "Payment", "Review"] as const;

/* ---------- page ---------- */

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const auth = useAuth();
  const addresses = useAddresses();
  const cardsApi = useCards();
  const orders = useOrders();
  const ui = useUI();

  const [step, setStep] = useState(0);

  // --- contact & shipping ---
  const prefill = auth.user ?? { name: "", email: "" };
  const defAddr = addresses.addresses.find((a) => a.isDefault) ?? addresses.addresses[0];
  const [email, setEmail] = useState(prefill.email);
  const [name, setName] = useState(defAddr?.name ?? prefill.name);
  const [line1, setLine1] = useState(defAddr?.line1 ?? "");
  const [line2, setLine2] = useState(defAddr?.line2 ?? "");
  const [city, setCity] = useState(defAddr?.city ?? "");
  const [state, setState] = useState(defAddr?.state ?? "");
  const [zip, setZip] = useState(defAddr?.zip ?? "");
  const [country, setCountry] = useState(defAddr?.country ?? "United States");
  const [saveAddr, setSaveAddr] = useState(false);
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({});

  // --- payment ---
  type Method = "card" | "paypal" | "applepay" | "googlepay" | "klarna";
  const [method, setMethod] = useState<Method>("card");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState(defAddr?.name ?? prefill.name);
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [savedCardId, setSavedCardId] = useState<string | null>(cardsApi.cards.find((c) => c.isDefault)?.id ?? null);
  const [payErrors, setPayErrors] = useState<Record<string, string>>({});

  const brand = detectBrand(cardNum.replace(/\s/g, ""));
  const usingSavedCard = method === "card" && !!savedCardId && cardsApi.cards.some((c) => c.id === savedCardId);

  const paymentLabel = useMemo(() => {
    switch (method) {
      case "card":
        if (usingSavedCard) {
          const c = cardsApi.cards.find((x) => x.id === savedCardId)!;
          return `${c.brand === "amex" ? "Amex" : c.brand[0].toUpperCase() + c.brand.slice(1)} ending in ${c.last4}`;
        }
        return brand ? `${brand[0].toUpperCase() + brand.slice(1)} ending in ${cardNum.replace(/\s/g, "").slice(-4)}` : "Card";
      case "paypal":
        return "PayPal";
      case "applepay":
        return "Apple Pay";
      case "googlepay":
        return "Google Pay";
      case "klarna":
        return "Klarna — 4 interest-free payments";
    }
  }, [method, brand, cardNum, usingSavedCard, savedCardId, cardsApi.cards]);

  if (cart.items.length === 0) {
    return (
      <div className="wrap py-24 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-ink-soft">Add a dress or two before checking out.</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Browse the collection
        </Link>
      </div>
    );
  }

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Enter a valid email for your receipt";
    if (name.trim().length < 2) e.name = "Enter your full name";
    if (line1.trim().length < 3) e.line1 = "Enter your street address";
    if (!city.trim()) e.city = "Enter your city";
    if (!state.trim()) e.state = "Enter your state / region";
    if (!/^\d{4,6}(-\d{4})?$/.test(zip.trim())) e.zip = "Enter a valid postal code";
    setInfoErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (method !== "card") return true;
    if (usingSavedCard) return true;
    const e: Record<string, string> = {};
    const digits = cardNum.replace(/\s/g, "");
    if (!brand) e.card = "We accept Visa, Mastercard and Amex";
    else if (brand === "amex" ? digits.length !== 15 : digits.length !== 16) e.card = "Enter the full card number";
    if (cardName.trim().length < 2) e.cardName = "Name on card";
    if (!validExpiry(exp)) e.exp = "MM/YY, in the future";
    if (!/^\d{3,4}$/.test(cvc)) e.cvc = "3–4 digits";
    setPayErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    const address: Address = {
      id: "order-addr",
      label: "Shipping",
      name: name.trim(),
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      country,
    };
    const order = {
      id: `order-${Date.now()}`,
      number: orderNumber(),
      date: new Date().toISOString(),
      email: email.trim().toLowerCase(),
      name: name.trim(),
      items: cart.items.map((i) => ({ slug: i.slug, name: i.name, price: i.price, image: i.image, color: i.color, size: i.size, qty: i.qty })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      promoCode: cart.promo?.code,
      shipping: cart.shipping,
      total: cart.total,
      paymentLabel,
      address,
      status: "confirmed" as const,
      eta: new Date(Date.now() + 6 * 86400000).toISOString(),
    };
    orders.addOrder(order);
    try {
      window.localStorage.setItem("algodon:lastOrderId", order.id);
    } catch {}
    if (saveAddr && auth.user) {
      addresses.saveAddress({ ...address, label: "Saved at checkout", phone: undefined });
    }
    if (method === "card" && !usingSavedCard && brand && auth.user) {
      cardsApi.addCard({ brand, last4: cardNum.replace(/\s/g, "").slice(-4), exp, name: cardName.trim() });
    }
    cart.clear();
    ui.toast("Order confirmed — gracias! 🤍");
    router.push("/checkout/confirmation");
  };

  const err = (k: string) => (infoErrors[k] ?? payErrors[k]);

  const inputCls = (k: string) => cx("field", err(k) && "field-error");

  return (
    <div className="wrap py-10 sm:py-14">
      <h1 className="font-display text-4xl sm:text-5xl">
        <em className="display-italic text-clay-deep">Secure</em> checkout
      </h1>

      {/* stepper */}
      <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              aria-current={i === step ? "step" : undefined}
              className={cx(
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-colors",
                i === step ? "border-ink bg-ink text-cotton" : i < step ? "border-sage/60 bg-sage-wash/50 text-sage-deep" : "border-line text-ink-soft/60",
              )}
            >
              <span className={cx("grid h-5 w-5 place-items-center rounded-full text-[11px]", i === step ? "bg-cotton/20" : "")} aria-hidden="true">
                {i < step ? <IconCheck className="w-3 h-3" /> : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && <span aria-hidden="true" className="text-line">—</span>}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          {/* ============ STEP 1 — information ============ */}
          {step === 0 && (
            <section aria-label="Contact and shipping information" className="rise">
              {!auth.user && (
                <div className="card mb-8 flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                  <p className="text-sm text-ink-soft">
                    Have an account? <Link href="/account/login?next=/checkout" className="text-clay-deep link-underline">Sign in</Link> for faster checkout — or keep shopping as a guest.
                  </p>
                </div>
              )}

              <h2 className="font-display text-2xl">Contact</h2>
              <div className="mt-4 max-w-md">
                <label className="label" htmlFor="co-email">
                  Email (receipt & tracking)
                  <input id="co-email" type="email" autoComplete="email" className={cx("mt-1.5", inputCls("email"))} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </label>
                {err("email") && <p className="error-text" role="alert">{err("email")}</p>}
              </div>

              <h2 className="mt-10 font-display text-2xl">Shipping address</h2>
              <div className="mt-4 grid max-w-2xl gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="co-name">
                    Full name
                    <input id="co-name" autoComplete="name" className={cx("mt-1.5", inputCls("name"))} value={name} onChange={(e) => setName(e.target.value)} />
                  </label>
                  {err("name") && <p className="error-text" role="alert">{err("name")}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="co-line1">
                    Street address
                    <input id="co-line1" autoComplete="address-line1" className={cx("mt-1.5", inputCls("line1"))} value={line1} onChange={(e) => setLine1(e.target.value)} />
                  </label>
                  {err("line1") && <p className="error-text" role="alert">{err("line1")}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="co-line2">
                    Apartment, suite (optional)
                    <input id="co-line2" autoComplete="address-line2" className="field mt-1.5" value={line2} onChange={(e) => setLine2(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label className="label" htmlFor="co-city">
                    City
                    <input id="co-city" autoComplete="address-level2" className={cx("mt-1.5", inputCls("city"))} value={city} onChange={(e) => setCity(e.target.value)} />
                  </label>
                  {err("city") && <p className="error-text" role="alert">{err("city")}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="co-state">
                      State
                      <input id="co-state" autoComplete="address-level1" className={cx("mt-1.5", inputCls("state"))} value={state} onChange={(e) => setState(e.target.value)} />
                    </label>
                    {err("state") && <p className="error-text" role="alert">{err("state")}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="co-zip">
                      ZIP
                      <input id="co-zip" autoComplete="postal-code" inputMode="numeric" className={cx("mt-1.5", inputCls("zip"))} value={zip} onChange={(e) => setZip(e.target.value)} />
                    </label>
                    {err("zip") && <p className="error-text" role="alert">{err("zip")}</p>}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="co-country">
                    Country
                    <select id="co-country" autoComplete="country-name" className="field mt-1.5 cursor-pointer" value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Spain</option>
                      <option>Mexico</option>
                      <option>Australia</option>
                    </select>
                  </label>
                </div>
                {auth.user && (
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft sm:col-span-2">
                    <input type="checkbox" className="accent-[var(--color-clay)]" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} />
                    Save this address to my account
                  </label>
                )}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button className="btn btn-primary" onClick={() => validateInfo() && setStep(1)}>
                  Continue to payment
                </button>
                <Link href="/cart" className="btn btn-quiet !px-0 text-clay-deep link-underline">
                  ← Back to bag
                </Link>
              </div>
            </section>
          )}

          {/* ============ STEP 2 — payment ============ */}
          {step === 1 && (
            <section aria-label="Payment method" className="rise">
              <h2 className="font-display text-2xl">Express checkout</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {([
                  { id: "applepay", label: "Pay", icon: <IconApple className="w-4 h-4" /> },
                  { id: "googlepay", label: "Google Pay", icon: <IconGoogle className="w-4 h-4" /> },
                  { id: "paypal", label: "PayPal", icon: null },
                ] as const).map((x) => (
                  <button
                    key={x.id}
                    className="btn btn-outline h-12"
                    onClick={() => {
                      setMethod(x.id);
                      setStep(2);
                    }}
                  >
                    {x.icon}
                    {x.label}
                  </button>
                ))}
              </div>

              <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-taupe-deep" aria-hidden="true">
                <span className="h-px flex-1 bg-line" /> or pay with <span className="h-px flex-1 bg-line" />
              </div>

              <h2 className="font-display text-2xl">Payment method</h2>

              {/* saved cards */}
              {auth.user && cardsApi.cards.length > 0 && (
                <fieldset className="mt-5 space-y-2.5">
                  <legend className="eyebrow mb-3">Saved cards</legend>
                  {cardsApi.cards.map((c) => (
                    <label
                      key={c.id}
                      className={cx(
                        "flex cursor-pointer items-center gap-3 rounded-md border bg-surface px-4 py-3.5 text-sm transition-colors",
                        savedCardId === c.id && method === "card" ? "border-ink" : "border-line hover:border-taupe",
                      )}
                    >
                      <input
                        type="radio"
                        name="pay"
                        className="accent-[var(--color-clay)]"
                        checked={method === "card" && savedCardId === c.id}
                        onChange={() => {
                          setMethod("card");
                          setSavedCardId(c.id);
                        }}
                      />
                      <span className="uppercase tracking-wide text-xs font-semibold">{c.brand}</span>
                      <span className="text-ink-soft">•••• {c.last4}</span>
                      <span className="ml-auto text-xs text-ink-soft">exp {c.exp}</span>
                    </label>
                  ))}
                </fieldset>
              )}

              {/* new card */}
              <fieldset className="mt-6">
                <legend className="eyebrow mb-3">New card</legend>
                <label className={cx("flex cursor-pointer items-center gap-3 rounded-md border bg-surface px-4 py-3.5 text-sm transition-colors", method === "card" && !usingSavedCard ? "border-ink" : "border-line hover:border-taupe")}>
                  <input
                    type="radio"
                    name="pay"
                    className="accent-[var(--color-clay)]"
                    checked={method === "card" && !usingSavedCard}
                    onChange={() => {
                      setMethod("card");
                      setSavedCardId(null);
                    }}
                  />
                  Credit / debit card
                  <span className="ml-auto flex gap-1.5 text-[10px] font-bold" aria-hidden="true">
                    <span className="rounded border border-line bg-cotton px-1.5 py-0.5">VISA</span>
                    <span className="rounded border border-line bg-cotton px-1.5 py-0.5">MC</span>
                    <span className="rounded border border-line bg-cotton px-1.5 py-0.5">AMEX</span>
                  </span>
                </label>

                {method === "card" && !usingSavedCard && (
                  <div className="mt-4 grid max-w-xl gap-4 rounded-md border border-line bg-parchment/40 p-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="cc-num">
                        Card number
                        <input
                          id="cc-num"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          className={cx("mt-1.5 tracking-widest", inputCls("card"))}
                          placeholder={brand === "amex" ? "3782 822463 10005" : "4242 4242 4242 4242"}
                          value={cardNum}
                          onChange={(e) => setCardNum(formatCardNumber(e.target.value))}
                        />
                      </label>
                      {err("card") && <p className="error-text" role="alert">{err("card")}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label" htmlFor="cc-name">
                        Name on card
                        <input id="cc-name" autoComplete="cc-name" className={cx("mt-1.5", inputCls("cardName"))} value={cardName} onChange={(e) => setCardName(e.target.value)} />
                      </label>
                      {err("cardName") && <p className="error-text" role="alert">{err("cardName")}</p>}
                    </div>
                    <div>
                      <label className="label" htmlFor="cc-exp">
                        Expiry (MM/YY)
                        <input id="cc-exp" inputMode="numeric" autoComplete="cc-exp" className={cx("mt-1.5", inputCls("exp"))} placeholder="08/28" value={exp} onChange={(e) => setExp(formatExpiry(e.target.value))} />
                      </label>
                      {err("exp") && <p className="error-text" role="alert">{err("exp")}</p>}
                    </div>
                    <div>
                      <label className="label" htmlFor="cc-cvc">
                        Security code
                        <input id="cc-cvc" inputMode="numeric" autoComplete="cc-csc" className={cx("mt-1.5", inputCls("cvc"))} placeholder={brand === "amex" ? "1234" : "123"} value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                      </label>
                      {err("cvc") && <p className="error-text" role="alert">{err("cvc")}</p>}
                    </div>
                  </div>
                )}
              </fieldset>

              {/* klarna */}
              <fieldset className="mt-4">
                <label className={cx("flex cursor-pointer items-center gap-3 rounded-md border bg-surface px-4 py-3.5 text-sm transition-colors", method === "klarna" ? "border-ink" : "border-line hover:border-taupe")}>
                  <input type="radio" name="pay" className="accent-[var(--color-clay)]" checked={method === "klarna"} onChange={() => setMethod("klarna")} />
                  Buy now, pay later
                  <span className="rounded border border-line bg-cotton px-1.5 py-0.5 text-[10px] font-bold" aria-hidden="true">Klarna</span>
                </label>
                {method === "klarna" && (
                  <div className="mt-3 rounded-md border border-line bg-parchment/40 px-5 py-4 text-sm text-ink-soft">
                    4 interest-free payments of <strong className="text-ink">{formatPrice(cart.total / 4)}</strong> — one now, one every 2 weeks. No fees when you pay on time. <span className="text-xs">(Simulated for this demo.)</span>
                  </div>
                )}
              </fieldset>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (validatePayment()) setStep(2);
                  }}
                >
                  Review order
                </button>
                <button className="btn btn-quiet" onClick={() => setStep(0)}>
                  ← Back
                </button>
              </div>
            </section>
          )}

          {/* ============ STEP 3 — review ============ */}
          {step === 2 && (
            <section aria-label="Review your order" className="rise">
              <h2 className="font-display text-2xl">Review &amp; place order</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="eyebrow">Ship to</h3>
                    <button className="text-xs text-clay-deep link-underline" onClick={() => setStep(0)}>
                      Edit
                    </button>
                  </div>
                  <address className="mt-2.5 text-sm not-italic leading-relaxed text-ink-soft">
                    {name}
                    <br />
                    {line1}
                    {line2 ? <><br />{line2}</> : null}
                    <br />
                    {city}, {state} {zip}
                    <br />
                    {country}
                  </address>
                </div>
                <div className="card p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="eyebrow">Paying with</h3>
                    <button className="text-xs text-clay-deep link-underline" onClick={() => setStep(1)}>
                      Edit
                    </button>
                  </div>
                  <p className="mt-2.5 text-sm text-ink-soft">{paymentLabel}</p>
                  <p className="mt-1 text-xs text-ink-soft">{email}</p>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-line border-y border-line">
                {cart.items.map((i) => (
                  <li key={i.key} className="flex items-center gap-4 py-4">
                    <span className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-sm bg-parchment">
                      <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{i.name}</span>
                      <span className="block text-xs text-ink-soft">
                        {i.color} · {i.size} · Qty {i.qty}
                      </span>
                    </span>
                    <span className="text-sm tabular-nums">{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="btn btn-primary" onClick={placeOrder}>
                  Place order · {formatPrice(cart.total)}
                </button>
                <button className="btn btn-quiet" onClick={() => setStep(1)}>
                  ← Back
                </button>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
                <IconShield className="w-4 h-4 text-sage-deep" />
                256-bit SSL encrypted. Demo store — no real charge will be made.
              </p>
            </section>
          )}
        </div>

        {/* ============ summary rail ============ */}
        <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-xl">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {cart.items.map((i) => (
                <li key={i.key} className="flex items-center gap-3 text-sm">
                  <span className="relative aspect-[3/4] w-10 shrink-0 overflow-hidden rounded-sm bg-parchment">
                    <Image src={i.image} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-ink-soft">{i.name} × {i.qty}</span>
                  <span className="tabular-nums">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sage-deep">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{formatPrice(cart.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="tabular-nums">{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(cart.total)}</dd>
              </div>
            </dl>
            <PaymentBadges className="mt-5 justify-center" />
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
              <IconShield className="w-3.5 h-3.5 text-sage-deep" /> SSL secure · PCI compliant · Carbon-neutral delivery
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
