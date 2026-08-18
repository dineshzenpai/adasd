"use client";

import React, { useState } from "react";
import { cx } from "@/lib/format";
import { IconCheck } from "./icons";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState("error");
      return;
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-3 rounded-md border border-sage/50 bg-sage-wash/60 px-6 py-5" role="status">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-deep text-white pop">
          <IconCheck className="w-4 h-4" />
        </span>
        <p className="text-sm">
          <strong className="font-medium">Welcome to the list.</strong> Your 10% welcome code is on its way to{" "}
          <span className="whitespace-nowrap">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={cx("w-full", compact ? "" : "max-w-xl mx-auto")}>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1">
          <label htmlFor={compact ? "nl-footer" : "nl-home"} className="sr-only">
            Email address
          </label>
          <input
            id={compact ? "nl-footer" : "nl-home"}
            type="email"
            className={cx("field", state === "error" && "field-error")}
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setState("idle");
            }}
            aria-invalid={state === "error"}
            aria-describedby={state === "error" ? "nl-error" : undefined}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary shrink-0">
          {compact ? "Join" : "Subscribe"}
        </button>
      </div>
      {state === "error" && (
        <p className="error-text" id="nl-error" role="alert">
          Please enter a valid email address.
        </p>
      )}
      {!compact && <p className="mt-3 text-xs text-ink-soft">10% off your first order. One soft letter a month — never spam.</p>}
    </form>
  );
}
