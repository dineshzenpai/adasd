import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout", robots: "noindex" };

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
