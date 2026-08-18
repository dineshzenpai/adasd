"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { IconApple, IconGoogle, Logo } from "@/components/icons";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="wrap grid gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:gap-20">
      <div className="relative order-2 hidden lg:block">
        <div className="stitch absolute -left-4 -top-4 h-full w-full" aria-hidden="true" />
        <div className="relative h-full min-h-[560px] overflow-hidden rounded-md bg-parchment">
          <Image src="/products/cat-formal.jpg" alt="An embroidered Algodón dress, softly lit" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" aria-hidden="true" />
          <blockquote className="absolute inset-x-8 bottom-8 text-cotton">
            <p className="font-display text-2xl leading-snug italic">
              “Softness is a form of luxury fast fashion forgot.”
            </p>
            <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-cotton/70">— The Algodón founding note</footer>
          </blockquote>
        </div>
      </div>

      <div className="order-1 mx-auto flex w-full max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 flex items-center gap-2.5 self-start" aria-label="Back to Algodón home">
          <Logo className="w-7 h-7" />
          <span className="font-display text-xl">Algodón</span>
        </Link>
        <h1 className="font-display text-4xl leading-tight">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-sm text-ink-soft">{footer}</div>}
      </div>
    </div>
  );
}

export function SocialButtons({ onClick }: { onClick: (p: "google" | "apple") => void }) {
  const { oauth } = useAuth();
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <button
        type="button"
        className="btn btn-outline h-11"
        onClick={() => {
          oauth("google");
          onClick("google");
        }}
      >
        <IconGoogle />
        Continue with Google
      </button>
      <button
        type="button"
        className="btn btn-outline h-11"
        onClick={() => {
          oauth("apple");
          onClick("apple");
        }}
      >
        <IconApple />
        Continue with Apple
      </button>
    </div>
  );
}

export function DemoNote() {
  return (
    <p className="mt-5 rounded-md border border-line bg-parchment/60 px-4 py-3 text-[11px] leading-relaxed text-ink-soft">
      This boutique is a demonstration — accounts live only in your browser, and social sign-in is simulated. No
      real data is stored or sent anywhere.
    </p>
  );
}
