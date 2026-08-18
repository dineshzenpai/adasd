"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Product, Review } from "@/lib/products";
import { cx, formatDate } from "@/lib/format";
import { useUI } from "@/lib/store";
import { StarPicker, StarRating } from "@/components/ui";
import { IconCheck } from "@/components/icons";

/* deterministic-ish distribution from avg rating */
function distribution(rating: number) {
  const r5 = Math.round(((rating - 3.4) / 1.6) * 100);
  const r4 = Math.round((1 - Math.abs(rating - 4.4)) * 45);
  const r2 = Math.max(2, Math.round((4.6 - rating) * 30));
  const r1 = Math.max(1, Math.round((4.75 - rating) * 22));
  const r3 = Math.max(3, 100 - r5 - r4 - r2 - r1);
  const raw = { 5: r5, 4: r4, 3: r3, 2: r2, 1: r1 };
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Math.round((v / total) * 100)])) as Record<number, number>;
}

function storeKey(slug: string) {
  return `algodon:reviews:${slug}`;
}

export function ReviewsSection({ product }: { product: Product }) {
  const ui = useUI();
  const [mine, setMine] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storeKey(product.slug));
      if (raw) setMine(JSON.parse(raw) as Review[]);
    } catch {
      /* ignore */
    }
  }, [product.slug]);

  const all = useMemo(() => [...mine, ...product.reviews], [mine, product.reviews]);
  const dist = distribution(product.rating);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      setError("Please add your name and a few words about the dress.");
      return;
    }
    const review: Review = {
      id: `local-${Date.now()}`,
      author: name.trim(),
      rating,
      date: new Date().toISOString().slice(0, 10),
      title: title.trim() || "My thoughts",
      body: body.trim(),
      verified: false,
    };
    const next = [review, ...mine];
    setMine(next);
    try {
      window.localStorage.setItem(storeKey(product.slug), JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setShowForm(false);
    setName("");
    setTitle("");
    setBody("");
    setError("");
    ui.toast("Thank you — your review is live 💛");
  };

  return (
    <section id="reviews" className="mt-16 scroll-mt-28 border-t border-line pt-12 sm:mt-24" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="font-display text-3xl">
        What wearers <em className="display-italic text-clay-deep">say</em>
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        {/* summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-end gap-3">
            <p className="font-display text-5xl">{product.rating.toFixed(1)}</p>
            <div className="pb-1.5">
              <StarRating value={product.rating} size="sm" />
              <p className="mt-1 text-xs text-ink-soft">{product.reviewCount + mine.length} verified reviews</p>
            </div>
          </div>
          <ul className="mt-5 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <li key={star} className="flex items-center gap-2.5 text-xs text-ink-soft">
                <span className="w-3 tabular-nums">{star}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line/70">
                  <span className="block h-full rounded-full bg-clay/80" style={{ width: `${dist[star]}%` }} />
                </span>
                <span className="w-8 text-right tabular-nums">{dist[star]}%</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline btn-sm mt-6 w-full" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
            {showForm ? "Close" : "Write a review"}
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-soft">
            Reviews are collected from verified purchases. This is a demo store — new reviews are saved in your
            browser only.
          </p>
        </div>

        {/* list + form */}
        <div>
          {showForm && (
            <form onSubmit={submit} noValidate className="card mb-8 space-y-4 p-5 sm:p-6 rise" aria-label="Write a review">
              <div>
                <p className="label">Your rating</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="rv-name">
                    Name
                    <input id="rv-name" className="field mt-1.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana R." autoComplete="name" />
                  </label>
                </div>
                <div>
                  <label className="label" htmlFor="rv-title">
                    Headline
                    <input id="rv-title" className="field mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Softest dress I own" />
                  </label>
                </div>
              </div>
              <div>
                <label className="label" htmlFor="rv-body">
                  Your review
                  <textarea id="rv-body" className="field mt-1.5 min-h-24" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Fit, feel, colour, occasions — tell it like it is." />
                </label>
              </div>
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary btn-sm">
                  Post review
                </button>
                <button type="button" className="btn btn-quiet btn-sm" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <ul className="space-y-8">
            {all.map((r) => (
              <li key={r.id} className="border-b border-line/70 pb-7 last:border-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <StarRating value={r.rating} size="xs" />
                  <h3 className="font-medium">{r.title}</h3>
                </div>
                <p className="mt-2 leading-relaxed text-ink-soft">{r.body}</p>
                <p className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                  <span className="font-medium text-ink">{r.author}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={r.date}>{formatDate(r.date)}</time>
                  {r.verified && (
                    <span className={cx("inline-flex items-center gap-1 rounded-full border border-sage/40 bg-sage-wash/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage-deep")}>
                      <IconCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
