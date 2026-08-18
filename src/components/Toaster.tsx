"use client";

import React from "react";
import Link from "next/link";
import { useUI } from "@/lib/store";
import { IconCheck } from "./icons";

export function Toaster() {
  const ui = useUI();
  return (
    <div className="fixed bottom-4 left-4 z-[95] flex max-w-[calc(100vw-2rem)] flex-col gap-2" role="status" aria-live="polite">
      {ui.toasts.map((t) => (
        <div key={t.id} className="flex items-center gap-3 rounded-md border border-line bg-ink px-4 py-3 text-cotton shadow-[var(--shadow-lift)] rise">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage-deep text-white">
            <IconCheck className="w-3 h-3" />
          </span>
          <p className="text-sm">{t.msg}</p>
          {t.href && (
            <Link href={t.href} className="ml-1 shrink-0 text-xs uppercase tracking-wider text-clay-wash hover:text-cotton link-underline">
              {t.hrefLabel ?? "View"}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
