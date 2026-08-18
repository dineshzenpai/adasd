import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account", robots: "noindex" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
