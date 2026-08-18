"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, useUI, useWishlist, FREE_SHIPPING_THRESHOLD } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { cx, formatPrice } from "@/lib/format";
import { PaymentBadges, QtyStepper } from "@/components/ui";
import { IconArrow, IconBag, IconHeart, IconTrash } from "@/components/icons";


export default function CartPage() {
  const cart = useCart();
  const wishlist = useWishlist();
  const ui = useUI();
  const [code, setCode] = useState("");
  const [showPromoMsg, setShowPromoMsg] = useState(false);

  if (cart.items.length === 0) {
    return (
      <div className="wrap py-20 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-parchment text-ink-soft" aria-hidden="true">
          <IconBag className="w-8 h-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl">Your bag is empty — for now</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
          Nothing but potential in here. Let&apos;s find you something soft.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Shop the collection <IconArrow />
        </Link>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="wrap py-10 sm:py-14">
      <h1 className="font-display text-4xl sm:text-5xl">
        Your <em className="display-italic text-clay-deep">bag</em>
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {cart.count} {cart.count === 1 ? "piece" : "pieces"}, folded and waiting.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        {/* items */}
        <section aria-label="Items in your bag">
          {/* free shipping progress */}
          <div className="mb-8 rounded-md border border-line bg-parchment/60 px-4 py-3.5">
            <p className="text-xs text-ink-soft" role="status">
              {cart.shipping === 0 ? (
                <>🤍 You&apos;ve unlocked <strong className="text-ink">free shipping</strong>.</>
              ) : (
                <>
                  You&apos;re <strong className="text-ink">{formatPrice(FREE_SHIPPING_THRESHOLD - cart.subtotal)}</strong> away from
                  free shipping.
                </>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full bg-sage-deep transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {cart.items.map((item) => {
              const product = PRODUCTS.find((p) => p.slug === item.slug);
              return (
                <li key={item.key} className="flex gap-4 py-6 sm:gap-6">
                  <Link href={`/product/${item.slug}`} className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-sm bg-parchment sm:w-28">
                    <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-display text-lg leading-snug">
                          <Link href={`/product/${item.slug}`} className="link-underline">
                            {item.name}
                          </Link>
                        </h2>
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {item.color} · Size {item.size}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm tabular-nums">{formatPrice(item.price * item.qty)}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                      <QtyStepper value={item.qty} onChange={(v) => cart.setQty(item.key, v)} max={9} label={`Quantity for ${item.name}`} />
                      <button
                        className="btn btn-quiet btn-sm text-ink-soft"
                        onClick={() => {
                          if (product && !wishlist.has(product.id)) wishlist.toggle(product.id);
                          cart.remove(item.key);
                          ui.toast(`Moved ${item.name} to your wishlist`, "/wishlist", "View wishlist");
                        }}
                      >
                        <IconHeart className="w-3.5 h-3.5" /> Save for later
                      </button>
                      <button className="btn btn-quiet btn-sm text-ink-soft hover:text-sale" onClick={() => cart.remove(item.key)}>
                        <IconTrash /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link href="/shop" className="btn btn-quiet mt-4 !px-0 text-clay-deep link-underline">
            ← Continue shopping
          </Link>
        </section>

        {/* summary */}
        <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-xl">Order summary</h2>

            {/* promo */}
            <div className="mt-5">
              {cart.promo ? (
                <div className="flex items-center justify-between rounded-md border border-sage/50 bg-sage-wash/50 px-3.5 py-2.5 text-sm">
                  <span>
                    <strong className="font-medium">{cart.promo.code}</strong> applied — {cart.promo.label.toLowerCase()}
                  </span>
                  <button className="text-xs text-ink-soft hover:text-ink link-underline" onClick={cart.clearPromo}>
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const ok = cart.applyPromo(code);
                    setShowPromoMsg(!ok);
                    if (ok) setCode("");
                  }}
                >
                  <label htmlFor="promo" className="label">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <input id="promo" className={cx("field flex-1 uppercase", cart.promoError && showPromoMsg && "field-error")} placeholder="ALGODON10" value={code} onChange={(e) => { setCode(e.target.value); setShowPromoMsg(false); }} />
                    <button type="submit" className="btn btn-outline shrink-0">
                      Apply
                    </button>
                  </div>
                  {cart.promoError && showPromoMsg && (
                    <p className="error-text" role="alert">
                      {cart.promoError}
                    </p>
                  )}
                </form>
              )}
            </div>

            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sage-deep">
                  <dt>Discount ({cart.promo?.code})</dt>
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
              <p className="text-[11px] text-ink-soft">Taxes calculated at checkout</p>
            </dl>

            <Link href="/checkout" className="btn btn-primary mt-5 w-full">
              Checkout · {formatPrice(cart.total)}
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
              🔒 Secure 256-bit SSL checkout · Guest checkout welcome
            </p>
            <PaymentBadges className="mt-4 justify-center" />
          </div>
        </aside>
      </div>

    </div>
  );
}
