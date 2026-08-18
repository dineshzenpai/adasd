"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { cx, formatPrice } from "@/lib/format";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { Price, QtyStepper, StarRating } from "./ui";
import { IconHeart } from "./icons";

export function Badge({ kind }: { kind: NonNullable<Product["badge"]> }) {
  const styles: Record<string, string> = {
    New: "bg-sage-wash text-sage-deep border-sage/40",
    Bestseller: "bg-clay-wash text-clay-deep border-clay/40",
    Limited: "bg-ink text-cotton border-ink",
  };
  return (
    <span className={cx("rounded-[3px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]", styles[kind])}>
      {kind}
    </span>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const wishlist = useWishlist();
  const ui = useUI();
  const [quickOpen, setQuickOpen] = useState(false);
  const wished = wishlist.has(product.id);

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-md bg-parchment">
        <Link href={`/product/${product.slug}`} className="block aspect-[3/4] outline-none" aria-label={`${product.name} — ${formatPrice(product.price)}`}>
          <Image
            src={product.image}
            alt={`${product.name} — ${product.tagline}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.badge && <Badge kind={product.badge} />}
          {product.compareAt && (
            <span className="rounded-[3px] border border-sale/40 bg-cotton/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sale">
              Sale
            </span>
          )}
        </div>

        <button
          onClick={() => {
            wishlist.toggle(product.id);
            ui.toast(wished ? `Removed ${product.name} from wishlist` : `Saved ${product.name} to wishlist`, "/wishlist", "View wishlist");
          }}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cx(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all",
            wished ? "bg-clay border-clay text-white pop" : "bg-cotton/85 border-line text-ink-soft hover:text-clay",
          )}
        >
          <IconHeart filled={wished} className="w-[18px] h-[18px]" />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 invisible transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible focus-within:translate-y-0 focus-within:opacity-100 focus-within:visible">
          <button className="btn btn-primary btn-sm flex-1" onClick={() => setQuickOpen(true)}>
            Quick view
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.05rem] leading-snug">
            <Link href={`/product/${product.slug}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <Price value={product.price} compareAt={product.compareAt} className="text-sm shrink-0 pt-0.5" />
        </div>
        <p className="text-xs text-ink-soft">{product.tagline}</p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarRating value={product.rating} size="xs" />
            <span className="text-[11px] text-ink-soft">({product.reviewCount})</span>
          </div>
          <span className="flex gap-1" aria-hidden="true">
            {product.colors.slice(0, 3).map((c) => (
              <span key={c.name} className="h-3 w-3 rounded-full border border-line" style={{ background: c.hex }} title={c.name} />
            ))}
          </span>
        </div>
      </div>

      {quickOpen && <QuickView product={product} onClose={() => setQuickOpen(false)} />}
    </article>
  );
}

/* ================= quick view ================= */

export function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const cart = useCart();
  const ui = useUI();
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const add = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    cart.add(
      { slug: product.slug, name: product.name, price: product.price, image: product.image, color, size },
      qty,
    );
    ui.toast(`${product.name} added to your bag`, "/cart", "View bag");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Quick view — ${product.name}`}>
      <button className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] cursor-default" onClick={onClose} aria-label="Close quick view" tabIndex={-1} />
      <div className="relative w-full sm:max-w-3xl bg-cotton rounded-t-lg sm:rounded-lg overflow-hidden shadow-[var(--shadow-lift)] rise outline-none" tabIndex={-1}>
        <button className="btn btn-quiet absolute right-2 top-2 z-10" onClick={onClose} aria-label="Close quick view">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
        <div className="grid sm:grid-cols-2 max-h-[88vh] overflow-y-auto">
          <div className="relative aspect-[3/4] sm:aspect-auto sm:min-h-[460px] bg-parchment">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, 380px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-4 p-5 sm:p-7">
            <div>
              <p className="eyebrow mb-1">Quick view</p>
              <h2 className="font-display text-2xl">{product.name}</h2>
              <p className="text-sm text-ink-soft mt-0.5">{product.tagline}</p>
            </div>
            <Price value={product.price} compareAt={product.compareAt} className="text-lg" />
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <StarRating value={product.rating} size="xs" />
              <span>{product.rating.toFixed(1)} · {product.reviewCount} reviews</span>
            </div>

            <fieldset>
              <legend className="label">Colour — <span className="normal-case tracking-normal text-ink">{color}</span></legend>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-pressed={color === c.name}
                    aria-label={c.name}
                    className={cx("h-8 w-8 rounded-full border transition-all", color === c.name ? "ring-2 ring-clay ring-offset-2 ring-offset-cotton border-transparent" : "border-line hover:scale-105")}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="label">
                Size{" "}
                <button type="button" className="ml-2 normal-case tracking-normal text-clay-deep link-underline" onClick={() => ui.setSizeGuideOpen(true)}>
                  Size guide
                </button>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => { setSize(s); setSizeError(false); }} aria-pressed={size === s} className={cx("chip", size === s && "chip-on")}>
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="error-text" role="alert">
                  Please choose a size
                </p>
              )}
            </fieldset>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <QtyStepper value={qty} onChange={setQty} />
              <button className="btn btn-primary flex-1 min-w-40" onClick={add}>
                Add to bag · {formatPrice(product.price * qty)}
              </button>
            </div>
            <Link href={`/product/${product.slug}`} className="text-sm text-clay-deep link-underline">
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
