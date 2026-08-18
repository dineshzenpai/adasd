import type { Metadata } from "next";
import { ShopBrowser, type ShopFilters } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop All Dresses",
  description:
    "Browse every Algodón dress — organic cotton, natural dyes, silhouettes for everyday, summer, formal and evening. Filter by size, colour, price and occasion.",
};

type SP = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined): string[] =>
  typeof v === "string" && v ? v.split(",").filter(Boolean) : Array.isArray(v) ? v : [];

export default async function ShopPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const initial: ShopFilters = {
    q: typeof sp.q === "string" ? sp.q : "",
    occasions: one(sp.occasion),
    colors: one(sp.color),
    sizes: one(sp.size),
    prices: one(sp.price),
    sort: typeof sp.sort === "string" ? sp.sort : "featured",
  };
  return <ShopBrowser initial={initial} />;
}
