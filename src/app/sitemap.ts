import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const BASE = "https://algodon.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/shop", "/cart", "/wishlist", "/account/login", "/account/signup"].map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
  }));
  const products = PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...products];
}
