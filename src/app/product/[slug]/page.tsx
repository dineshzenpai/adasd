import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, PRODUCTS, relatedProducts } from "@/lib/products";
import { Breadcrumbs } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { Gallery } from "@/components/product/Gallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { ReviewsSection } from "@/components/product/Reviews";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Dress not found" };
  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.name} · Algodón`,
      description: product.tagline,
      images: [{ url: product.image, width: 900, height: 1200, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image],
    brand: { "@type": "Brand", name: "Algodón" },
    material: product.fabric,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const related = relatedProducts(product, 4);

  return (
    <div className="wrap py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/shop", label: "Shop" },
          ...(product.occasions[0]
            ? [{ href: `/shop?occasion=${product.occasions[0]}`, label: product.occasions[0] }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery product={product} />
        <BuyPanel product={product} />
      </div>

      <ReviewsSection product={product} />

      <section className="mt-20" aria-labelledby="related-title">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Styled together</p>
            <h2 id="related-title" className="mt-2 font-display text-3xl">
              You may also <em className="display-italic text-clay-deep">love</em>
            </h2>
          </div>
          <Link href="/shop" className="btn btn-outline btn-sm">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
