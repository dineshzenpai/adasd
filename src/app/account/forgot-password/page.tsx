"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import { cx } from "@/lib/format";
import { AuthShell } from "@/components/account/AuthShell";
import { IconCheck } from "@/components/icons";


export default function ForgotPasswordPage() {
  const auth = useAuth();
  const [stage, setStage] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [error, setError] = useState("");

  const request = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Enter the email on your account");
      return;
    }
    const res = auth.requestReset(email);
    setDemoCode(res.code ?? "");
    setError("");
    setStage("code");
  };

  const confirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) {
      setError("New password needs 8+ characters");
      return;
    }
    const res = auth.confirmReset(email, code, newPw);
    if (res.ok) {
      setError("");
      setStage("done");
    } else {
      setError(res.error ?? "Something went wrong");
    }
  };

  return (
    <AuthShell
      title={
        <>
          A little <em className="display-italic text-clay-deep">reset</em>
        </>
      }
      subtitle="Forgotten passwords happen to the best of us. Three soft steps and you're back in."
      footer={
        <>
          Remembered it after all?{" "}
          <Link href="/account/login" className="text-clay-deep link-underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {stage === "email" && (
        <form onSubmit={request} noValidate className="space-y-4">
          <div>
            <label className="label" htmlFor="fp-email">
              Account email
              <input
                id="fp-email"
                type="email"
                autoComplete="email"
                className={cx("field mt-1.5", error && "field-error")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Send reset code
          </button>
        </form>
      )}

      {stage === "code" && (
        <>
          <div className="rounded-md border border-sage/50 bg-sage-wash/50 px-4 py-3.5 text-sm" role="status">
            <p className="font-medium">Code sent (well, almost)</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              In this demo we show the code right here instead of emailing it. Your 6-digit code is{" "}
              <strong className="tracking-[0.3em] text-sage-deep">{demoCode}</strong>
            </p>
          </div>
          <form onSubmit={confirm} noValidate className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="fp-code">
                6-digit code
                <input id="fp-code" inputMode="numeric" className="field mt-1.5 tracking-[0.4em]" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="······" required />
              </label>
            </div>
            <div>
              <label className="label" htmlFor="fp-pw">
                New password
                <input id="fp-pw" type="password" autoComplete="new-password" className="field mt-1.5" value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
              </label>
            </div>
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary w-full">
              Reset password
            </button>
          </form>
        </>
      )}

      {stage === "done" && (
        <div className="rise text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-deep text-white pop" aria-hidden="true">
            <IconCheck className="w-6 h-6" />
          </span>
          <h2 className="mt-4 font-display text-2xl">Password reset</h2>
          <p className="mt-2 text-sm text-ink-soft">Your new password is ready. Go on in.</p>
          <Link href="/account/login" className="btn btn-primary mt-6">
            Sign in
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
