"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/store";
import { cx } from "@/lib/format";
import { AuthShell, DemoNote, SocialButtons } from "@/components/account/AuthShell";


export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const auth = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    window.setTimeout(() => {
      const res = auth.login(email, password);
      setBusy(false);
      if (res.ok) {
        router.push(next);
      } else {
        setError(res.error ?? "Something went wrong");
      }
    }, 450);
  };

  return (
    <AuthShell
      title={
        <>
          Welcome <em className="display-italic text-clay-deep">back</em>
        </>
      }
      subtitle="Your orders, addresses and wishlist — all in one soft place."
      footer={
        <>
          New to Algodón?{" "}
          <Link href="/account/signup" className="text-clay-deep link-underline">
            Create an account
          </Link>
        </>
      }
    >
      <SocialButtons
        onClick={() => {
          router.push(next);
        }}
      />

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-taupe-deep" aria-hidden="true">
        <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="label" htmlFor="li-email">
            Email
            <input
              id="li-email"
              type="email"
              autoComplete="email"
              className={cx("field mt-1.5", error && "field-error")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
        </div>
        <div>
          <label className="label" htmlFor="li-pw">
            <span className="flex items-center justify-between">
              Password
              <Link href="/account/forgot-password" className="font-sans text-xs normal-case tracking-normal text-clay-deep link-underline">
                Forgot password?
              </Link>
            </span>
            <span className="relative block">
              <input
                id="li-pw"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                className={cx("field mt-1.5 pr-16", error && "field-error")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft hover:text-ink"
                onClick={() => setShowPw((v) => !v)}
                aria-pressed={showPw}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </span>
          </label>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Signing you in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-xs text-ink-soft">
        First time here? Any account you create in this demo session works instantly — or just{" "}
        <Link href="/shop" className="text-clay-deep link-underline">
          shop as a guest
        </Link>
        .
      </p>
      <DemoNote />
    </AuthShell>
  );
}
