"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLOR_FAMILIES, OCCASIONS, PRICE_BUCKETS, PRODUCTS, type ColorFamily, type Occasion } from "@/lib/products";
import { cx } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { IconClose, IconSliders } from "@/components/icons";

export interface ShopFilters {
  q: string;
  occasions: string[];
  colors: string[];
  sizes: string[];
  prices: string[];
  sort: string;
}

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

function matches(f: ShopFilters, p: (typeof PRODUCTS)[number]) {
  if (f.q && !`${p.name} ${p.tagline} ${p.fabric} ${p.occasions.join(" ")} ${p.colors.map((c) => c.family).join(" ")}`.toLowerCase().includes(f.q.toLowerCase()))
    return false;
  if (f.occasions.length && !f.occasions.some((o) => p.occasions.includes(o as Occasion))) return false;
  if (f.colors.length && !p.colors.some((c) => f.colors.includes(c.family))) return false;
  if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s))) return false;
  if (f.prices.length && !f.prices.some((pid) => PRICE_BUCKETS.find((b) => b.id === pid)?.test(p.price) ?? false)) return false;
  return true;
}

export function ShopBrowser({ initial }: { initial: ShopFilters }) {
  const router = useRouter();
  const [f, setF] = useState<ShopFilters>(initial);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // keep the URL shareable
  useEffect(() => {
    const params = new URLSearchParams();
    if (f.q) params.set("q", f.q);
    if (f.occasions.length) params.set("occasion", f.occasions.join(","));
    if (f.colors.length) params.set("color", f.colors.join(","));
    if (f.sizes.length) params.set("size", f.sizes.join(","));
    if (f.prices.length) params.set("price", f.prices.join(","));
    if (f.sort !== "featured") params.set("sort", f.sort);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }, [f, router]);

  const toggle = (key: "occasions" | "colors" | "sizes" | "prices", value: string) =>
    setF((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => matches(f, p));
    switch (f.sort) {
      case "new":
        list = [...list].sort((a, b) => b.newness - a.newness);
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.rating - a.rating);
    }
    return list;
  }, [f]);

  const activeCount = f.occasions.length + f.colors.length + f.sizes.length + f.prices.length + (f.q ? 1 : 0);
  const clearAll = () => setF({ q: "", occasions: [], colors: [], sizes: [], prices: [], sort: f.sort });

  const filterPanel = (
    <div className="space-y-7">
      {f.q && (
        <div>
          <p className="eyebrow mb-2">Search</p>
          <button onClick={() => setF((p) => ({ ...p, q: "" }))} className="chip chip-on">
            “{f.q}” ✕
          </button>
        </div>
      )}
      <fieldset>
        <legend className="eyebrow mb-3">Occasion</legend>
        <div className="space-y-1.5">
          {OCCASIONS.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-0.5 text-sm text-ink-soft hover:text-ink">
              <input
                type="checkbox"
                className="accent-[var(--color-clay)]"
                checked={f.occasions.includes(o.id)}
                onChange={() => toggle("occasions", o.id)}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-3">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {COLOR_FAMILIES.map((c) => {
            const on = f.colors.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle("colors", c.id)}
                aria-pressed={on}
                title={c.label}
                className={cx(
                  "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs transition-all",
                  on ? "border-ink bg-ink text-cotton" : "border-line bg-surface text-ink-soft hover:border-taupe",
                )}
              >
                <span className="h-5 w-5 rounded-full border border-line" style={{ background: c.hex }} aria-hidden="true" />
                {c.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-3">Size</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button key={s} onClick={() => toggle("sizes", s)} aria-pressed={f.sizes.includes(s)} className={cx("chip !px-3.5", f.sizes.includes(s) && "chip-on")}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow mb-3">Price</legend>
        <div className="space-y-1.5">
          {PRICE_BUCKETS.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-0.5 text-sm text-ink-soft hover:text-ink">
              <input
                type="checkbox"
                className="accent-[var(--color-clay)]"
                checked={f.prices.includes(b.id)}
                onChange={() => toggle("prices", b.id)}
              />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>
      {activeCount > 0 && (
        <button onClick={clearAll} className="text-sm text-clay-deep link-underline">
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="wrap py-8 sm:py-12">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow">The collection</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">
          Every <em className="display-italic text-clay-deep">Algodón</em> dress
        </h1>
        <p className="mt-3 text-ink-soft">
          {PRODUCTS.length} quiet silhouettes in organic cotton — from market-morning wrap dresses to full-length
          evening columns.
        </p>
      </header>

      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        {/* desktop filter rail */}
        <aside className="hidden w-56 shrink-0 lg:block" aria-label="Product filters">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm text-ink-soft" role="status">
              {results.length} {results.length === 1 ? "dress" : "dresses"}
              {activeCount > 0 && " matching your filters"}
            </p>
            <div className="flex items-center gap-3">
              <button className="btn btn-outline btn-sm lg:hidden" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen}>
                <IconSliders className="w-4 h-4" />
                Filters{activeCount ? ` (${activeCount})` : ""}
              </button>
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <span className="hidden sm:inline">Sort</span>
                <select
                  className="field !w-auto !py-1.5 cursor-pointer"
                  value={f.sort}
                  onChange={(e) => setF((p) => ({ ...p, sort: e.target.value }))}
                  aria-label="Sort products"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* active chips */}
          {activeCount > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {f.occasions.map((o) => (
                <button key={o} className="chip" onClick={() => toggle("occasions", o)}>
                  {OCCASIONS.find((x) => x.id === o)?.label} ✕
                </button>
              ))}
              {f.colors.map((c) => (
                <button key={c} className="chip" onClick={() => toggle("colors", c)}>
                  <span className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: COLOR_FAMILIES.find((x) => x.id === c)?.hex }} aria-hidden="true" />
                  {COLOR_FAMILIES.find((x) => x.id === (c as ColorFamily))?.label} ✕
                </button>
              ))}
              {f.sizes.map((s) => (
                <button key={s} className="chip" onClick={() => toggle("sizes", s)}>
                  Size {s} ✕
                </button>
              ))}
              {f.prices.map((p) => (
                <button key={p} className="chip" onClick={() => toggle("prices", p)}>
                  {PRICE_BUCKETS.find((x) => x.id === p)?.label} ✕
                </button>
              ))}
              <button className="chip !border-clay/50 !text-clay-deep" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
              <span className="font-display text-5xl text-clay/40" aria-hidden="true">
                ◍
              </span>
              <div>
                <h2 className="font-display text-2xl">Nothing here — yet</h2>
                <p className="mt-2 max-w-sm text-sm text-ink-soft">
                  No dresses match that exact combination. Loosen a filter or two, or let Lina (bottom-right) style
                  you something similar.
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={clearAll}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} priority={results[0].id === p.id} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} aria-label="Close filters" tabIndex={-1} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-cotton shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-xl">Filters</h2>
              <button className="btn btn-quiet" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <IconClose />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
            <div className="border-t border-line p-4">
              <button className="btn btn-primary w-full" onClick={() => setDrawerOpen(false)}>
                Show {results.length} {results.length === 1 ? "dress" : "dresses"}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-12 text-center text-xs text-ink-soft">
        Can&apos;t decide? Ask <Link href="/account" className="sr-only">your account</Link>
        <span className="font-medium text-clay-deep">Lina</span>, our styling assistant in the corner — she knows every
        dress personally.
      </p>
    </div>
  );
}
