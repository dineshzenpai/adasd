import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmed" };

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
