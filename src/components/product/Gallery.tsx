"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { cx } from "@/lib/format";
import { Badge } from "@/components/ProductCard";

export function Gallery({ product }: { product: Product }) {
  const images = [
    { src: product.image, alt: `${product.name} — full view` },
    { src: "/products/fabric-detail.jpg", alt: `${product.name} — ${product.fabric}, close-up` },
    { src: "/products/tag-detail.jpg", alt: `${product.name} — Algodón garment tag and finishing` },
  ];
  const [active, setActive] = useState(0);

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-parchment">
        <Image
          key={images[active].src}
          src={images[active].src}
          alt={images[active].alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="animate-[fadein_.5s_ease] object-cover"
        />
        {product.badge && (
          <div className="absolute left-4 top-4">
            <Badge kind={product.badge} />
          </div>
        )}
      </div>
      <div className="mt-3 flex gap-3" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={img.src}
            role="tab"
            aria-selected={active === i}
            aria-label={`View image ${i + 1} of ${images.length}`}
            onClick={() => setActive(i)}
            className={cx(
              "relative aspect-[3/4] w-20 overflow-hidden rounded-sm border-2 transition-all",
              active === i ? "border-clay" : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
