"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrders, type Order } from "@/lib/store";
import { formatDate, formatPrice } from "@/lib/format";
import { PaymentBadges, TrustRow } from "@/components/ui";
import { IconArrow, IconCheck } from "@/components/icons";


const TIMELINE = [
  { id: "confirmed", label: "Order confirmed", sub: "We've emailed your receipt" },
  { id: "in_transit", label: "In transit", sub: "Tracked, carbon-neutral delivery" },
  { id: "delivered", label: "Delivered", sub: "30 days to return, no questions" },
] as const;

export default function ConfirmationPage() {
  const { orders } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = window.localStorage.getItem("algodon:lastOrderId");
    setOrder(orders.find((o) => o.id === id) ?? orders[0] ?? null);
    setLoaded(true);
  }, [orders]);

  return (
    <div className="wrap max-w-3xl py-14 sm:py-20">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-deep text-white pop" aria-hidden="true">
          <IconCheck className="w-7 h-7" />
        </span>
        <p className="eyebrow mt-6">Gracias</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">
          Your order is <em className="display-italic text-clay-deep">confirmed</em>
        </h1>
        {order ? (
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
            We&apos;ve sent a receipt to <strong className="text-ink">{order.email}</strong>. Your dresses are being
            wrapped in paper — not plastic — as we speak.
          </p>
        ) : loaded ? (
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            We couldn&apos;t find that order on this device — but if you checked out, a receipt is on its way to your
            inbox.
          </p>
        ) : null}
      </div>

      {order && (
        <>
          <div className="card mt-10 flex flex-wrap items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="eyebrow">Order number</p>
              <p className="mt-1 font-display text-2xl tracking-wide">{order.number}</p>
            </div>
            <div>
              <p className="eyebrow">Placed</p>
              <p className="mt-1 text-sm">{formatDate(order.date)}</p>
            </div>
            <div>
              <p className="eyebrow">Arriving by</p>
              <p className="mt-1 text-sm">{formatDate(order.eta)}</p>
            </div>
            <div>
              <p className="eyebrow">Total</p>
              <p className="mt-1 text-sm tabular-nums">{formatPrice(order.total)}</p>
            </div>
          </div>

          {/* timeline */}
          <ol className="relative mt-10 space-y-8 border-l border-dashed border-clay/40 pl-8" aria-label="Order status">
            {TIMELINE.map((t, i) => (
              <li key={t.id} className="relative">
                <span
                  className={`absolute -left-[41px] grid h-6 w-6 place-items-center rounded-full border ${
                    i === 0 ? "border-sage-deep bg-sage-deep text-white" : "border-line bg-cotton text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  <IconCheck className="w-3.5 h-3.5" />
                </span>
                <p className={`font-medium ${i === 0 ? "text-ink" : "text-ink-soft"}`}>{t.label}</p>
                <p className="text-xs text-ink-soft">{t.sub}</p>
              </li>
            ))}
          </ol>

          {/* items */}
          <section className="mt-10" aria-label="Items ordered">
            <h2 className="font-display text-2xl">What&apos;s coming</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {order.items.map((i) => (
                <li key={`${i.slug}-${i.color}-${i.size}`} className="flex items-center gap-4 py-4">
                  <Link href={`/product/${i.slug}`} className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-sm bg-parchment">
                    <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
                  </Link>
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
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-soft">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sage-deep">
                  <dt>Discount {order.promoCode ? `(${order.promoCode})` : ""}</dt>
                  <dd className="tabular-nums">−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <dt>Shipping</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-medium">
                <dt>Total ({order.paymentLabel})</dt>
                <dd className="tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          <div className="mt-10">
            <TrustRow />
          </div>
        </>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="btn btn-primary">
          Continue shopping <IconArrow />
        </Link>
        <Link href="/account?tab=orders" className="btn btn-outline">
          View order history
        </Link>
      </div>
      <p className="mt-8 text-center text-xs text-ink-soft">
        Questions? Ask Lina in the corner — she can track this order for you. <PaymentBadges className="mt-3 justify-center opacity-80" />
      </p>
    </div>
  );
}
