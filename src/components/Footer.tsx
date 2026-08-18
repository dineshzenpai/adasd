"use client";

import React from "react";
import Link from "next/link";
import { useUI } from "@/lib/store";
import { PaymentBadges } from "./ui";
import { IconInstagram, IconPinterest, IconTikTok, Logo } from "./icons";

export function Footer() {
  const ui = useUI();

  const care = [
    { label: "Shipping & Delivery", chat: "What are your shipping times?" },
    { label: "Returns & Exchanges", chat: "What is your returns policy?" },
    { label: "Size Guide", chat: "size guide" },
    { label: "Track My Order", chat: "Where is my order?" },
    { label: "Ask a Stylist", chat: "help me find a dress" },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-parchment/70" aria-label="Site footer">
      <div className="wrap py-14 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <Logo className="w-8 h-8" />
            <span className="font-display text-2xl">Algodón</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Named for the Spanish word for cotton, Algodón is a small boutique making dresses from organic,
            breathable fibres — grown naturally, dyed gently, and sewn in slow, considered batches. Softness is
            our whole philosophy.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: IconInstagram, label: "Instagram" },
              { Icon: IconPinterest, label: "Pinterest" },
              { Icon: IconTikTok, label: "TikTok" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={`${label} (demo link)`}
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-all hover:text-clay-deep hover:border-clay/50"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Shop">
          <h2 className="eyebrow mb-4">Shop</h2>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li><Link href="/shop" className="link-underline hover:text-ink">All Dresses</Link></li>
            <li><Link href="/shop?sort=new" className="link-underline hover:text-ink">New Arrivals</Link></li>
            <li><Link href="/shop?occasion=casual" className="link-underline hover:text-ink">Everyday</Link></li>
            <li><Link href="/shop?occasion=summer" className="link-underline hover:text-ink">Summer</Link></li>
            <li><Link href="/shop?occasion=formal" className="link-underline hover:text-ink">Formal</Link></li>
            <li><Link href="/shop?occasion=evening" className="link-underline hover:text-ink">Evening Wear</Link></li>
          </ul>
        </nav>

        <nav aria-label="Customer care">
          <h2 className="eyebrow mb-4">Customer Care</h2>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            {care.map((c) => (
              <li key={c.label}>
                <button className="link-underline hover:text-ink text-left" onClick={() => ui.openChat(c.chat)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-4">Your Account</h2>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li><Link href="/account/login" className="link-underline hover:text-ink">Sign In</Link></li>
            <li><Link href="/account/signup" className="link-underline hover:text-ink">Create Account</Link></li>
            <li><Link href="/account?tab=orders" className="link-underline hover:text-ink">Order History</Link></li>
            <li><Link href="/wishlist" className="link-underline hover:text-ink">Wishlist</Link></li>
            <li><Link href="/cart" className="link-underline hover:text-ink">Shopping Bag</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="wrap py-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} Algodón Atelier · A demo storefront — no real orders or payments are processed.
          </p>
          <PaymentBadges />
        </div>
      </div>
    </footer>
  );
}
