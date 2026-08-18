"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useAddresses, useCards, useOrders, useUI, useWishlist, type Address } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { cx, formatDate, formatPrice } from "@/lib/format";
import { AuthShell } from "@/components/account/AuthShell";
import { PaymentBadges } from "@/components/ui";
import { IconArrow, IconCheck, IconHeart, IconTrash } from "@/components/icons";


type Tab = "overview" | "orders" | "addresses" | "wishlist" | "payments";

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="wrap py-20 text-center text-sm text-ink-soft">Loading your account…</div>}>
      <AccountInner />
    </Suspense>
  );
}

function AccountInner() {
  const auth = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  if (!auth.user) {
    return (
      <AuthShell
        title={<>Welcome <em className="display-italic text-clay-deep">back</em></>}
        subtitle="Sign in to see your orders, addresses and wishlist — or keep browsing as our guest."
        footer={
          <>
            New to Algodón?{" "}
            <Link href="/account/signup" className="text-clay-deep link-underline">
              Create an account
            </Link>
          </>
        }
      >
        <p className="text-sm text-ink-soft">You&apos;re signed out.</p>
        <Link href="/account/login" className="btn btn-primary mt-4">
          Sign in
        </Link>
      </AuthShell>
    );
  }

  const initial = (params.get("tab") as Tab) || "overview";
  return <Dashboard initialTab={initial} />;
}

/* ================= dashboard ================= */

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "wishlist", label: "Wishlist" },
  { id: "payments", label: "Payment methods" },
];

function Dashboard({ initialTab }: { initialTab: Tab }) {
  const auth = useAuth();
  const ordersApi = useOrders();
  const wishlist = useWishlist();
  const addressesApi = useAddresses();
  const cardsApi = useCards();
  const ui = useUI();
  const [tab, setTab] = useState<Tab>(initialTab);
  const user = auth.user!;

  const myOrders = ordersApi.orders.filter((o) => o.email === user.email || !o.email);
  const saved = PRODUCTS.filter((p) => wishlist.ids.includes(p.id));

  return (
    <div className="wrap py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">
            Hola, <em className="display-italic text-clay-deep">{user.name.split(" ")[0]}</em>
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Signed in as {user.email}
            {user.provider !== "email" && ` · via ${user.provider === "google" ? "Google" : "Apple"}`}
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={auth.logout}>
          Sign out
        </button>
      </div>

      {/* tabs */}
      <div className="mt-8 flex gap-1.5 overflow-x-auto border-b border-line pb-px no-scrollbar" role="tablist" aria-label="Account sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cx(
              "relative whitespace-nowrap px-4 py-3 text-sm transition-colors",
              tab === t.id ? "text-ink" : "text-ink-soft hover:text-ink",
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-clay" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "overview" && (
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { label: "Orders placed", value: myOrders.length, tab: "orders" as Tab, sub: "Lifetime with Algodón" },
              { label: "Wishlist", value: saved.length, tab: "wishlist" as Tab, sub: "Dresses you're thinking about" },
              { label: "Saved addresses", value: addressesApi.addresses.length, tab: "addresses" as Tab, sub: "Where softness should be sent" },
            ].map((c) => (
              <button key={c.label} onClick={() => setTab(c.tab)} className="card group p-6 text-left transition-shadow hover:shadow-[var(--shadow-soft)]">
                <p className="eyebrow">{c.label}</p>
                <p className="mt-3 font-display text-4xl text-clay-deep">{c.value}</p>
                <p className="mt-2 text-xs text-ink-soft">{c.sub}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-clay-deep link-underline">
                  Manage <IconArrow className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
            <div className="card p-6 md:col-span-3">
              <p className="eyebrow">Perks of the cotton club</p>
              <ul className="mt-3 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
                <li className="flex gap-2"><IconCheck className="w-4 h-4 mt-0.5 text-sage-deep" /> Free shipping over $150, always</li>
                <li className="flex gap-2"><IconCheck className="w-4 h-4 mt-0.5 text-sage-deep" /> Early access to new colours</li>
                <li className="flex gap-2"><IconCheck className="w-4 h-4 mt-0.5 text-sage-deep" /> 30-day returns with free labels</li>
                <li className="flex gap-2"><IconCheck className="w-4 h-4 mt-0.5 text-sage-deep" /> Birthday-month surprise (it&apos;s cotton)</li>
              </ul>
            </div>
          </div>
        )}

        {tab === "orders" && <OrdersTab orders={myOrders} />}

        {tab === "addresses" && <AddressesTab />}

        {tab === "wishlist" &&
          (saved.length === 0 ? (
            <div className="card px-6 py-14 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay-wash text-clay-deep" aria-hidden="true">
                <IconHeart className="w-6 h-6" />
              </span>
              <h2 className="mt-4 font-display text-2xl">No saved dresses yet</h2>
              <p className="mt-2 text-sm text-ink-soft">Tap the heart on any dress to save it here.</p>
              <Link href="/shop" className="btn btn-primary btn-sm mt-6">
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {saved.map((p) => (
                <MiniProduct key={p.id} slug={p.slug} name={p.name} image={p.image} price={p.price} />
              ))}
            </div>
          ))}

        {tab === "payments" && <PaymentsTab />}
      </div>

      <p className="mt-14 text-xs text-ink-soft">
        Demo note: order history shows orders placed on this device{user.provider === "email" ? " under this account" : ""}.{" "}
        <PaymentBadges className="mt-2" />
      </p>
    </div>
  );
}

/* ================= orders ================= */

const STATUS_LABEL: Record<string, string> = {
  confirmed: "In the atelier",
  in_transit: "On its way",
  delivered: "Delivered",
};

function OrdersTab({ orders }: { orders: ReturnType<typeof useOrders>["orders"] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="card px-6 py-14 text-center">
        <h2 className="font-display text-2xl">No orders yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          When you place an order (demo checkout works end-to-end), it will appear here with live status.
        </p>
        <Link href="/shop" className="btn btn-primary btn-sm mt-6">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="card overflow-hidden">
          <button className="flex w-full flex-wrap items-center gap-4 px-5 py-4 text-left sm:px-6" onClick={() => setExpanded(expanded === o.id ? null : o.id)} aria-expanded={expanded === o.id}>
            <span className="font-display text-xl">{o.number}</span>
            <span className="text-xs text-ink-soft">{formatDate(o.date)}</span>
            <span className={cx("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", o.status === "delivered" ? "border-sage/50 bg-sage-wash text-sage-deep" : "border-clay/40 bg-clay-wash text-clay-deep")}>
              {STATUS_LABEL[o.status]}
            </span>
            <span className="ml-auto flex items-center gap-4">
              <span className="text-sm tabular-nums">{formatPrice(o.total)}</span>
              <span className="text-xs text-ink-soft">{expanded === o.id ? "Hide" : "Details"}</span>
            </span>
          </button>
          {expanded === o.id && (
            <div className="border-t border-line bg-parchment/40 px-5 py-5 sm:px-6">
              <ul className="space-y-3">
                {o.items.map((i) => (
                  <li key={`${i.slug}-${i.color}-${i.size}`} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-ink-soft">
                      {i.name} — {i.color}, {i.size} × {i.qty}
                    </span>
                    <span className="tabular-nums">{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-4 text-xs text-ink-soft">
                <span>Paid with {o.paymentLabel}</span>
                <span>
                  Ship to: {o.address.name}, {o.address.city}, {o.address.state}
                </span>
                <span>Arriving by {formatDate(o.eta)}</span>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ================= addresses ================= */

function emptyAddress(): Address {
  return { id: undefined as unknown as string, label: "", name: "", line1: "", city: "", state: "", zip: "", country: "United States" };
}

function AddressesTab() {
  const { addresses, saveAddress, removeAddress, setDefaultAddress } = useAddresses();
  const ui = useUI();
  const [editing, setEditing] = useState<Address | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {addresses.map((a) => (
        <div key={a.id} className={cx("card p-5", a.isDefault && "ring-1 ring-sage/50")}>
          <div className="flex items-center justify-between">
            <p className="eyebrow">
              {a.label || "Address"} {a.isDefault && <span className="ml-1 text-sage-deep">· default</span>}
            </p>
            {!a.isDefault && (
              <button className="text-xs text-clay-deep link-underline" onClick={() => setDefaultAddress(a.id)}>
                Make default
              </button>
            )}
          </div>
          <address className="mt-2.5 text-sm not-italic leading-relaxed text-ink-soft">
            {a.name}
            <br />
            {a.line1}
            {a.line2 ? <><br />{a.line2}</> : null}
            <br />
            {a.city}, {a.state} {a.zip}
            <br />
            {a.country}
          </address>
          <div className="mt-4 flex gap-3 text-xs">
            <button className="text-clay-deep link-underline" onClick={() => setEditing(a)}>
              Edit
            </button>
            <button className="text-ink-soft hover:text-sale link-underline" onClick={() => removeAddress(a.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      {editing ? (
        <AddressForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={(a) => {
            saveAddress(a);
            setEditing(null);
            ui.toast("Address saved");
          }}
        />
      ) : (
        <button className="card flex min-h-44 flex-col items-center justify-center gap-2 border-dashed p-5 text-ink-soft transition-colors hover:border-clay hover:text-clay-deep" onClick={() => setEditing(emptyAddress())}>
          <span className="text-2xl" aria-hidden="true">+</span>
          <span className="text-sm font-medium">Add a new address</span>
        </button>
      )}
    </div>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Address;
  onSave: (a: Omit<Address, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [a, setA] = useState<Address>(initial);
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => setA((p) => ({ ...p, [k]: e.target.value }));
  const valid = a.name.trim() && a.line1.trim() && a.city.trim() && a.state.trim() && /^\d{4,6}/.test(a.zip.trim());
  return (
    <form
      className="card grid gap-3 p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSave(a);
      }}
    >
      <h3 className="font-display text-xl sm:col-span-2">{initial.id ? "Edit address" : "New address"}</h3>
      <input className="field" placeholder="Label (Home, Studio…)" value={a.label} onChange={set("label")} aria-label="Label" />
      <input className="field" placeholder="Full name" value={a.name} onChange={set("name")} aria-label="Full name" required />
      <input className="field sm:col-span-2" placeholder="Street address" value={a.line1} onChange={set("line1")} aria-label="Street address" required />
      <input className="field sm:col-span-2" placeholder="Apartment (optional)" value={a.line2 ?? ""} onChange={set("line2")} aria-label="Apartment" />
      <input className="field" placeholder="City" value={a.city} onChange={set("city")} aria-label="City" required />
      <div className="grid grid-cols-2 gap-3">
        <input className="field" placeholder="State" value={a.state} onChange={set("state")} aria-label="State" required />
        <input className="field" placeholder="ZIP" value={a.zip} onChange={set("zip")} aria-label="ZIP" required />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={!valid}>
          Save address
        </button>
        <button type="button" className="btn btn-quiet btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ================= payments ================= */

function PaymentsTab() {
  const cardsApi = useCards();
  const ui = useUI();
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [name, setName] = useState("");
  const digits = num.replace(/\D/g, "");
  const brand = digits.startsWith("4") ? "visa" : /^(5[1-5]|2[2-7])/.test(digits) ? "mastercard" : /^3[47]/.test(digits) ? "amex" : null;
  const valid = brand !== null && (brand === "amex" ? digits.length === 15 : digits.length === 16) && /^\d{2}\/\d{2}$/.test(exp) && name.trim().length > 1;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-2xl">Saved cards</h2>
        <ul className="mt-4 space-y-3">
          {cardsApi.cards.map((c) => (
            <li key={c.id} className={cx("card flex items-center gap-4 px-5 py-4", c.isDefault && "ring-1 ring-sage/50")}>
              <span className="text-xs font-bold uppercase tracking-wider">{c.brand}</span>
              <span className="text-sm text-ink-soft">•••• {c.last4}</span>
              <span className="text-xs text-ink-soft">exp {c.exp}</span>
              {c.isDefault ? (
                <span className="ml-auto rounded-full border border-sage/50 bg-sage-wash px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage-deep">Default</span>
              ) : (
                <button className="ml-auto text-xs text-clay-deep link-underline" onClick={() => cardsApi.setDefaultCard(c.id)}>
                  Make default
                </button>
              )}
              <button className="text-xs text-ink-soft hover:text-sale" aria-label={`Remove card ending ${c.last4}`} onClick={() => cardsApi.removeCard(c.id)}>
                <IconTrash />
              </button>
            </li>
          ))}
          {cardsApi.cards.length === 0 && <li className="text-sm text-ink-soft">No saved cards yet.</li>}
        </ul>
        <p className="mt-4 text-xs text-ink-soft">
          Cards are stored in your browser only (demo). At real checkout, card data is tokenized — numbers are never
          stored raw.
        </p>
      </div>

      <form
        className="card h-fit space-y-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          cardsApi.addCard({ brand: brand as "visa" | "mastercard" | "amex", last4: digits.slice(-4), exp, name: name.trim() });
          setNum("");
          setExp("");
          setName("");
          ui.toast("Card saved to your account");
        }}
      >
        <h3 className="font-display text-xl">Add a card</h3>
        <input
          className="field tracking-widest"
          placeholder="Card number"
          inputMode="numeric"
          value={num}
          onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))}
          aria-label="Card number"
        />
        <div className="grid grid-cols-2 gap-3">
          <input className="field" placeholder="MM/YY" value={exp} onChange={(e) => setExp(e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/"))} aria-label="Expiry" />
          <input className="field" placeholder="Name on card" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name on card" />
        </div>
        <button type="submit" className="btn btn-primary btn-sm w-full" disabled={!valid}>
          {brand ? `Save ${brand[0].toUpperCase() + brand.slice(1)}` : "Save card"}
        </button>
        <PaymentBadges className="justify-center" />
      </form>
    </div>
  );
}

/* ================= mini product (wishlist) ================= */

function MiniProduct({ slug, name, image, price }: { slug: string; name: string; image: string; price: number }) {
  return (
    <article className="group">
      <Link href={`/product/${slug}`} className="relative block aspect-[3/4] overflow-hidden rounded-md bg-parchment">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </Link>
      <h3 className="mt-2 font-display text-sm">
        <Link href={`/product/${slug}`} className="link-underline">
          {name}
        </Link>
      </h3>
      <p className="text-xs text-ink-soft">{formatPrice(price)}</p>
    </article>
  );
}
