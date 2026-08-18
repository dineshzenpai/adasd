"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { cx } from "@/lib/format";
import { AuthShell, DemoNote, SocialButtons } from "@/components/account/AuthShell";
import { IconCheck } from "@/components/icons";


export default function SignupPage() {
  const auth = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const rules = [
    { ok: password.length >= 8, label: "8+ characters" },
    { ok: /[A-Za-z]/.test(password) && /\d/.test(password), label: "A letter and a number" },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8 || !/\d/.test(password)) {
      setError("Choose a stronger password — 8+ characters with at least one number.");
      return;
    }
    setBusy(true);
    setError("");
    window.setTimeout(() => {
      const res = auth.signup(name, email, password);
      setBusy(false);
      if (res.ok) {
        router.push("/account");
      } else {
        setError(res.error ?? "Something went wrong");
      }
    }, 450);
  };

  return (
    <AuthShell
      title={
        <>
          Join the <em className="display-italic text-clay-deep">cotton club</em>
        </>
      }
      subtitle="Faster checkout, order history, early access to new colours — and a 10% welcome code in your inbox."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/account/login" className="text-clay-deep link-underline">
            Sign in
          </Link>
        </>
      }
    >
      <SocialButtons
        onClick={() => {
          router.push("/account");
        }}
      />

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-taupe-deep" aria-hidden="true">
        <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="label" htmlFor="su-name">
            First name
            <input id="su-name" autoComplete="given-name" className={cx("field mt-1.5", error && "field-error")} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ana" required />
          </label>
        </div>
        <div>
          <label className="label" htmlFor="su-email">
            Email
            <input id="su-email" type="email" autoComplete="email" className={cx("field mt-1.5", error && "field-error")} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
        </div>
        <div>
          <label className="label" htmlFor="su-pw">
            Password
            <input id="su-pw" type="password" autoComplete="new-password" className="field mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1" aria-live="polite">
            {rules.map((r) => (
              <li key={r.label} className={cx("flex items-center gap-1.5 text-xs", r.ok ? "text-sage-deep" : "text-ink-soft")}>
                <span className={cx("grid h-3.5 w-3.5 place-items-center rounded-full border", r.ok ? "border-sage-deep bg-sage-deep text-white" : "border-line")}>
                  {r.ok && <IconCheck className="w-2 h-2" />}
                </span>
                {r.label}
              </li>
            ))}
          </ul>
        </div>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Creating your account…" : "Create account"}
        </button>
        <p className="text-[11px] leading-relaxed text-ink-soft">
          By joining you agree to our imaginary terms and equally imaginary privacy policy — this is a demo boutique,
          nothing leaves your browser.
        </p>
      </form>
      <DemoNote />
    </AuthShell>
  );
}
