import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
