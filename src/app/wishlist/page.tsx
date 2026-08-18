"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { useWishlist } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { IconHeart } from "@/components/icons";


export default function WishlistPage() {
  const { ids } = useWishlist();
  const saved = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="wrap py-10 sm:py-14">
      <p className="eyebrow">Saved for later</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">
        Your <em className="display-italic text-clay-deep">wishlist</em>
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-soft">
        Dresses you&apos;ve saved to think about. We&apos;ll keep them here on this device — no expiry, no pressure.
      </p>

      {saved.length === 0 ? (
        <div className="card mt-10 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-clay-wash text-clay-deep" aria-hidden="true">
            <IconHeart className="w-7 h-7" />
          </span>
          <div>
            <h2 className="font-display text-2xl">Nothing saved yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              Tap the little heart on any dress and it will wait for you here.
            </p>
          </div>
          <Link href="/shop" className="btn btn-primary btn-sm">
            Find something lovely
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
