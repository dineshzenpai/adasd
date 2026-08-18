"use client";

import React, { useState } from "react";
import type { Product } from "@/lib/products";
import { cx, formatPrice } from "@/lib/format";
import { useCart, useUI, useWishlist } from "@/lib/store";
import { Price, QtyStepper, StarRating } from "@/components/ui";
import { IconHeart, IconLeaf, IconReturn, IconTruck } from "@/components/icons";

export function BuyPanel({ product }: { product: Product }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const ui = useUI();
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const wished = wishlist.has(product.id);

  const add = () => {
    if (!size) {
      setSizeError(true);
      document.getElementById("size-fieldset")?.focus({ preventScroll: false });
      return;
    }
    cart.add({ slug: product.slug, name: product.name, price: product.price, image: product.image, color, size }, qty);
    ui.toast(`${product.name} (${color}, ${size}) added to your bag`, "/cart", "View bag");
  };

  return (
    <div className="flex flex-col">
      <p className="eyebrow">{product.occasions.map((o) => (o === "casual" ? "Everyday" : o[0].toUpperCase() + o.slice(1))).join(" · ")}</p>
      <h1 className="mt-2 font-display text-4xl leading-tight sm:text-[2.75rem]">{product.name}</h1>
      <p className="mt-1.5 font-display text-lg italic text-ink-soft">{product.tagline}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Price value={product.price} compareAt={product.compareAt} className="text-xl" />
        <a href="#reviews" className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink link-underline">
          <StarRating value={product.rating} size="xs" />
          {product.rating.toFixed(1)} · {product.reviewCount} reviews
        </a>
      </div>

      <p className="mt-5 max-w-lg leading-relaxed text-ink-soft">{product.description}</p>

      {/* colours */}
      <fieldset className="mt-7">
        <legend className="label">
          Colour — <span className="normal-case tracking-normal text-ink">{color}</span>
        </legend>
        <div className="flex gap-2.5">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              aria-pressed={color === c.name}
              aria-label={c.name}
              title={c.name}
              className={cx(
                "h-9 w-9 rounded-full border transition-all",
                color === c.name
                  ? "ring-2 ring-clay ring-offset-2 ring-offset-cotton border-transparent"
                  : "border-line hover:scale-105",
              )}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </fieldset>

      {/* sizes */}
      <fieldset id="size-fieldset" tabIndex={-1} className="mt-6">
        <legend className="label flex w-full items-center justify-between">
          <span>Size</span>
          <button type="button" onClick={() => ui.setSizeGuideOpen(true)} className="link-underline normal-case tracking-normal text-clay-deep">
            Size guide
          </button>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button key={s} type="button" onClick={() => { setSize(s); setSizeError(false); }} aria-pressed={size === s} className={cx("chip !px-4", size === s && "chip-on")}>
              {s}
            </button>
          ))}
        </div>
        {sizeError && (
          <p className="error-text" role="alert">
            Please select a size — Lina suggests taking your usual; smocked styles are forgiving.
          </p>
        )}
      </fieldset>

      {/* actions */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={setQty} />
        <button className="btn btn-primary min-w-52 flex-1 sm:flex-none sm:px-10" onClick={add}>
          Add to bag · {formatPrice(product.price * qty)}
        </button>
        <button
          onClick={() => {
            wishlist.toggle(product.id);
            ui.toast(wished ? "Removed from wishlist" : "Saved to your wishlist", "/wishlist", "View wishlist");
          }}
          aria-pressed={wished}
          className={cx(
            "grid h-[46px] w-[46px] place-items-center rounded-[3px] border transition-all",
            wished ? "border-clay bg-clay text-white pop" : "border-line bg-surface text-ink-soft hover:text-clay hover:border-clay/50",
          )}
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
        >
          <IconHeart filled={wished} />
        </button>
      </div>

      <ul className="mt-6 grid gap-2.5 border-t border-line pt-5 text-sm text-ink-soft sm:grid-cols-2">
        <li className="flex items-center gap-2.5"><IconTruck className="w-4 h-4 text-sage-deep" /> Ships in 1–2 days · free over $150</li>
        <li className="flex items-center gap-2.5"><IconReturn className="w-4 h-4 text-sage-deep" /> 30-day returns, free label</li>
        <li className="flex items-center gap-2.5"><IconLeaf className="w-4 h-4 text-sage-deep" /> {product.fabric.split(",")[0]}</li>
      </ul>

      {/* accordions */}
      <div className="mt-8 divide-y divide-line border-y border-line">
        <details className="group py-4" open>
          <summary className="flex cursor-pointer items-center justify-between text-sm font-medium tracking-wide">
            Details &amp; fit
            <span className="text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <ul className="mt-3 space-y-2">
            {product.details.map((d) => (
              <li key={d} className="flex gap-2.5 text-sm text-ink-soft">
                <span aria-hidden="true" className="mt-2 h-0.5 w-3 shrink-0 border-t border-dashed border-clay/60" />
                {d}
              </li>
            ))}
          </ul>
        </details>
        <details className="group py-4">
          <summary className="flex cursor-pointer items-center justify-between text-sm font-medium tracking-wide">
            Fabric &amp; care
            <span className="text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {product.fabric}. GOTS-certified organic fibre, naturally dyed in small batches. Wash cold with like
            colours, reshape while damp, and let cotton do the rest — it only gets softer.
          </p>
        </details>
        <details className="group py-4">
          <summary className="flex cursor-pointer items-center justify-between text-sm font-medium tracking-wide">
            Shipping &amp; returns
            <span className="text-ink-soft transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Standard delivery 3–6 business days (free over $150, else $8). Express 2–3 days for $14. Returns are
            free within 30 days — unworn, tags on, using the paper label in your parcel.
          </p>
        </details>
      </div>
    </div>
  );
}
