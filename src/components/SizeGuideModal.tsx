"use client";

import React from "react";
import { SIZE_GUIDE } from "@/lib/products";
import { useUI } from "@/lib/store";
import { Modal } from "./ui";

export function SizeGuideModal() {
  const ui = useUI();
  return (
    <Modal open={ui.sizeGuideOpen} onClose={() => ui.setSizeGuideOpen(false)} title="Size Guide" labelId="size-guide-title" wide>
      <p className="text-sm text-ink-soft mb-5">
        Measurements are body measurements in inches, not garment measurements. Measure over a thin layer and keep
        the tape relaxed.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <caption className="sr-only">Algodón dress size chart, body measurements in inches</caption>
          <thead>
            <tr className="border-b-2 border-ink/70 text-left">
              {SIZE_GUIDE.columns.map((c) => (
                <th key={c} scope="col" className="py-2.5 pr-4 font-display text-base font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_GUIDE.rows.map((r) => (
              <tr key={r[0]} className="border-b border-line/70">
                {r.map((cell, i) => (
                  <td key={i} className={`py-2.5 pr-4 ${i === 0 ? "font-semibold" : "text-ink-soft tabular-nums"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-6 space-y-2 border-t border-line pt-5">
        {SIZE_GUIDE.notes.map((n) => (
          <li key={n} className="flex gap-2.5 text-sm text-ink-soft">
            <span aria-hidden="true" className="mt-2 h-1 w-4 shrink-0 border-t border-dashed border-clay/60" />
            {n}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
