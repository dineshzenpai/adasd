"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cx, formatPrice } from "@/lib/format";
import { IconApple, IconCheck, IconMinus, IconPlus, IconStar } from "./icons";

/* ---------- star rating ---------- */

export function StarRating({
  value,
  size = "sm",
  className = "",
}: {
  value: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const px = size === "xs" ? "w-3 h-3" : size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  const pct = Math.round((Math.max(0, Math.min(5, value)) / 5) * 100);
  return (
    <span
      className={cx("relative inline-flex align-middle", className)}
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 5 stars`}
    >
      <span className="flex gap-0.5 text-line">
        {[0, 1, 2, 3, 4].map((i) => (
          <IconStar key={i} className={px} />
        ))}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }} aria-hidden="true">
        <span className="flex gap-0.5 text-clay">
          {[0, 1, 2, 3, 4].map((i) => (
            <IconStar key={i} className={px} />
          ))}
        </span>
      </span>
    </span>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={cx("transition-transform hover:scale-110", n <= (hover || value) ? "text-clay" : "text-line")}
        >
          <IconStar className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
}

/* ---------- price ---------- */

export function Price({ value, compareAt, className = "" }: { value: number; compareAt?: number; className?: string }) {
  return (
    <span className={cx("inline-flex items-baseline gap-2", className)}>
      <span className={compareAt ? "text-sale font-medium" : ""}>{formatPrice(value)}</span>
      {compareAt && (
        <s className="text-ink-soft/70 text-sm font-normal" aria-label={`Compare at ${formatPrice(compareAt)}`}>
          {formatPrice(compareAt)}
        </s>
      )}
    </span>
  );
}

/* ---------- quantity stepper ---------- */

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label = "Quantity",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center border border-line rounded-[3px] bg-surface" role="group" aria-label={label}>
      <button
        type="button"
        className="p-2.5 text-ink-soft hover:text-ink transition-colors disabled:opacity-40"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <IconMinus />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="p-2.5 text-ink-soft hover:text-ink transition-colors disabled:opacity-40"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <IconPlus />
      </button>
    </div>
  );
}

/* ---------- payment badges ---------- */

const BADGES: { id: string; label: string; sub?: string }[] = [
  { id: "visa", label: "VISA" },
  { id: "mc", label: "", sub: "Mastercard" },
  { id: "amex", label: "AMEX" },
  { id: "paypal", label: "PayPal" },
  { id: "applepay", label: "Pay" },
  { id: "gpay", label: "G Pay" },
  { id: "klarna", label: "Klarna" },
];

export function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={cx("flex flex-wrap items-center gap-1.5", className)} aria-label="Accepted payment methods">
      {BADGES.map((b) => (
        <li
          key={b.id}
          className="flex h-6 min-w-9 items-center justify-center rounded-[3px] border border-line bg-surface px-1.5 text-[9px] font-semibold tracking-wide text-ink-soft"
        >
          {b.id === "mc" ? (
            <span className="flex items-center" title="Mastercard">
              <span className="w-3 h-3 rounded-full bg-[#eb5757]/80" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-[#f2a33c]/80 -ml-1" aria-hidden="true" />
              <span className="sr-only">Mastercard</span>
            </span>
          ) : b.id === "applepay" ? (
            <span className="font-sans">
              <span className="text-[11px]" aria-hidden="true"></span>Pay
            </span>
          ) : (
            b.label
          )}
        </li>
      ))}
    </ul>
  );
}

/* ---------- section heading ---------- */

export function SectionHeading({
  eyebrow,
  title,
  action,
  center = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  action?: { href: string; label: string };
  center?: boolean;
}) {
  return (
    <div className={cx("flex flex-wrap items-end gap-4 mb-8", center ? "justify-center text-center" : "justify-between")}>
      <div className={center ? "" : "max-w-xl"}>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="btn btn-outline btn-sm group">
          {action.label}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}

/* ---------- breadcrumbs ---------- */

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink-soft tracking-wide">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href ? (
              <Link href={it.href} className="link-underline hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true" className="text-taupe">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- modal shell ---------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
  labelId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  labelId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={title} aria-labelledby={labelId}>
      <button className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] cursor-default" onClick={onClose} aria-label="Close dialog" tabIndex={-1} />
      <div
        ref={ref}
        tabIndex={-1}
        className={cx(
          "relative w-full bg-cotton rounded-t-lg sm:rounded-lg shadow-[var(--shadow-lift)] outline-none max-h-[92vh] overflow-y-auto rise",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <div className="flex items-center justify-between px-5 sm:px-7 pt-5 sm:pt-6 sticky top-0 bg-cotton/95 backdrop-blur z-10 border-b border-line/60 pb-4">
          <h2 id={labelId} className="font-display text-xl sm:text-2xl">
            {title}
          </h2>
          <button className="btn btn-quiet" onClick={onClose} aria-label="Close">
            <IconCloseButton />
          </button>
        </div>
        <div className="px-5 sm:px-7 pb-6 sm:pb-8 pt-4">{children}</div>
      </div>
    </div>
  );
}

function IconCloseButton() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

/* ---------- trust badges ---------- */

export function TrustRow({ className = "" }: { className?: string }) {
  const items = [
    { icon: "🚚" as const, title: "Free shipping over $150", sub: "Carbon-neutral delivery" },
    { icon: "🔄" as const, title: "30-day easy returns", sub: "Free return label included" },
    { icon: "🔒" as const, title: "Secure checkout", sub: "256-bit SSL encryption" },
  ];
  return (
    <ul className={cx("grid gap-3 sm:grid-cols-3", className)}>
      {items.map((it) => (
        <li key={it.title} className="flex items-start gap-3 rounded-md border border-line bg-surface/70 px-4 py-3">
          <span aria-hidden="true" className="text-lg leading-none mt-0.5">{it.icon}</span>
          <span>
            <span className="block text-sm font-medium">{it.title}</span>
            <span className="block text-xs text-ink-soft">{it.sub}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- field with label + error ---------- */

export function Field({
  label,
  error,
  children,
  hint,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">
        {label}
        {children as React.ReactElement}
      </label>
      {hint && !error && <p className="text-xs text-ink-soft mt-1">{hint}</p>}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- check pill ---------- */

export function CheckPill({ checked }: { checked: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
        checked ? "bg-sage-deep border-sage-deep text-white" : "border-line bg-surface text-transparent",
      )}
      aria-hidden="true"
    >
      <IconCheck className="w-3 h-3" />
    </span>
  );
}
