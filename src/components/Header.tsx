"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx, formatPrice } from "@/lib/format";
import { useAuth, useCart, useWishlist } from "@/lib/store";
import { searchProducts } from "@/lib/products";
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconUser, Logo } from "./icons";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?sort=new", label: "New In" },
  { href: "/shop?occasion=summer", label: "Summer" },
  { href: "/shop?occasion=evening", label: "Evening" },
  { href: "/#story", label: "Our Story" },
];

export function PromoBar() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    setHidden(window.localStorage.getItem("algodon:promo-hidden") === "1");
  }, []);
  if (hidden) return null;
  return (
    <div className="bg-ink text-cotton text-center text-[11px] sm:text-xs tracking-[0.12em] uppercase relative z-40">
      <div className="wrap py-2 flex items-center justify-center gap-3">
        <p>
          Complimentary shipping over $150 · Code <span className="text-clay-wash font-medium">ALGODON10</span> for 10% off
        </p>
        <button
          className="absolute right-3 opacity-70 hover:opacity-100"
          aria-label="Dismiss announcement"
          onClick={() => {
            setHidden(true);
            window.localStorage.setItem("algodon:promo-hidden", "1");
          }}
        >
          <IconClose className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ================= search with autocomplete ================= */

function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchProducts(q, 6);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    onNavigate?.();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) {
      if (e.key === "Enter" && q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active >= 0 ? `/product/${results[active].slug}` : `/shop?q=${encodeURIComponent(q.trim())}`);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          Search dresses
        </label>
        <div className="flex items-center gap-2 border border-line bg-surface rounded-full px-4 py-2 focus-within:border-clay transition-colors">
          <IconSearch className="w-4 h-4 text-ink-soft" />
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/60"
            placeholder="Search dresses, colours, occasions…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            autoComplete="off"
          />
        </div>
      </form>

      {open && q.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-md border border-line bg-cotton shadow-[var(--shadow-lift)]" role="listbox" aria-label="Search suggestions">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-ink-soft">
              No matches for “{q}”. Try <button className="text-clay-deep link-underline" onClick={() => go("/shop")}>browsing the shop</button>.
            </p>
          ) : (
            <ul>
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    className={cx("flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors", active === i ? "bg-parchment" : "hover:bg-parchment/60")}
                    role="option"
                    aria-selected={active === i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/product/${p.slug}`)}
                  >
                    <span className="relative h-12 w-9 overflow-hidden rounded-sm bg-parchment">
                      <Image src={p.image} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block truncate text-xs text-ink-soft">{p.tagline}</span>
                    </span>
                    <span className="text-xs text-ink-soft">{formatPrice(p.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button className="w-full border-t border-line px-4 py-2.5 text-left text-xs font-medium tracking-wide text-clay-deep hover:bg-parchment/60" onClick={() => go(`/shop?q=${encodeURIComponent(q.trim())}`)}>
            See all results for “{q.trim()}” →
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= header ================= */

export function Header() {
  const cart = useCart();
  const wishlist = useWishlist();
  const { user } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cotton/90 backdrop-blur-md">
      <div className="wrap flex items-center gap-4 py-3.5 lg:py-4" role="banner">
        <button className="btn btn-quiet p-2 lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>

        <Link href="/" className="flex items-center gap-2.5" aria-label="Algodón — home">
          <Logo className="w-8 h-8" />
          <span className="font-display text-[1.6rem] leading-none tracking-tight">
            Algodón
            <span className="block text-[9px] font-sans font-medium tracking-[0.34em] uppercase text-taupe-deep mt-0.5" aria-hidden="true">
              cotton · atelier
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-8 hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="link-underline text-sm text-ink-soft hover:text-ink transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden min-w-0 max-w-xs flex-1 justify-end xl:flex">
          <SearchBox />
        </div>

        <div className="ml-auto xl:ml-4 flex items-center gap-0.5">
          <button className="btn btn-quiet p-2 xl:hidden" aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen((v) => !v)}>
            <IconSearch />
          </button>
          <Link href="/wishlist" className="btn btn-quiet p-2 relative" aria-label={`Wishlist${mounted && wishlist.ids.length ? `, ${wishlist.ids.length} saved` : ""}`}>
            <IconHeart />
            {mounted && wishlist.ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold text-white" aria-hidden="true">
                {wishlist.ids.length}
              </span>
            )}
          </Link>
          <Link href={user ? "/account" : "/account/login"} className="btn btn-quiet p-2 flex items-center gap-2" aria-label={user ? "Your account" : "Sign in"}>
            <IconUser />
            {user && <span className="hidden sm:inline text-xs text-ink-soft max-w-24 truncate">{user.name}</span>}
          </Link>
          <Link href="/cart" className="btn btn-quiet p-2 relative" aria-label={`Shopping bag${mounted && cart.count ? `, ${cart.count} items` : ""}`}>
            <IconBag />
            {mounted && cart.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-cotton" aria-hidden="true">
                {cart.count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="wrap pb-3 xl:hidden">
          <SearchBox onNavigate={() => setSearchOpen(false)} />
        </div>
      )}

      {/* mobile drawer */}
      <div
        className={cx(
          "fixed inset-x-0 top-0 z-[60] origin-top bg-cotton shadow-[var(--shadow-lift)] transition-transform duration-300 lg:hidden",
          menuOpen ? "translate-y-0" : "-translate-y-full pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <div className="wrap flex items-center justify-between py-4 border-b border-line">
          <span className="font-display text-xl">Menu</span>
          <button className="btn btn-quiet" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <IconClose />
          </button>
        </div>
        <nav aria-label="Mobile" className="wrap py-4 flex flex-col">
          {NAV.map((n, i) => (
            <Link key={n.href} href={n.href} className="font-display text-2xl py-3 border-b border-line/60 hover:text-clay-deep transition-colors">
              {n.label}
            </Link>
          ))}
          <Link href="/account" className="font-display text-2xl py-3 border-b border-line/60 hover:text-clay-deep transition-colors">
            {user ? "My Account" : "Sign In"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
