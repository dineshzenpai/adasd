import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { SectionHeading, StarRating } from "@/components/ui";
import { IconArrow, IconLeaf, IconReturn, IconTruck } from "@/components/icons";

const CATEGORIES = [
  {
    href: "/shop?occasion=casual",
    label: "Everyday",
    blurb: "Easy pieces for slow mornings",
    image: "/products/cat-casual.jpg",
  },
  {
    href: "/shop?occasion=summer",
    label: "Summer",
    blurb: "Sun-washed & breezy",
    image: "/products/cat-summer.jpg",
  },
  {
    href: "/shop?occasion=formal",
    label: "Formal",
    blurb: "Polished, considered dressing",
    image: "/products/cat-formal.jpg",
  },
  {
    href: "/shop?occasion=evening",
    label: "Evening",
    blurb: "After-dark elegance",
    image: "/products/cat-evening.jpg",
  },
];

const MARQUEE = [
  "100% organic cotton",
  "Naturally dyed",
  "Small-batch ateliers",
  "Carbon-neutral shipping",
  "30-day returns",
  "Softness, above all",
];

const TESTIMONIALS = [
  {
    quote: "The first brand where 'breathable' isn't marketing. I wore the Marisol through a Seville summer and never once thought about my clothes.",
    name: "Lucía G.",
    detail: "Marisol Wrap Dress",
    rating: 5,
  },
  {
    quote: "Everything arrived wrapped in paper, smelling faintly of clean cotton. It felt like a gift I'd given myself.",
    name: "Wren S.",
    detail: "Duna Column Gown",
    rating: 5,
  },
  {
    quote: "I've replaced most of my closet with Algodón pieces. Fewer dresses, better dresses.",
    name: "Diane F.",
    detail: "Vega Tailored Sheath",
    rating: 5,
  },
];

export default function HomePage() {
  const newArrivals = [...PRODUCTS].sort((a, b) => b.newness - a.newness).slice(0, 4);

  return (
    <>
      {/* ============ hero ============ */}
      <section className="relative overflow-hidden border-b border-line/70" aria-labelledby="hero-title">
        <div className="wrap grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow rise">The Summer Edit — 2026</p>
            <h1 id="hero-title" className="rise rise-1 mt-4 font-display text-[clamp(2.6rem,6vw,4.3rem)] leading-[1.05] tracking-tight">
              Dresses that let your skin <em className="display-italic text-clay-deep">breathe</em>.
            </h1>
            <p className="rise rise-2 mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
              Algodón means cotton. Every piece we make begins with organic fibre, natural dye, and the belief
              that softness is a form of luxury fast fashion forgot.
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop new arrivals <IconArrow />
              </Link>
              <Link href="/#story" className="btn btn-outline">
                Our story
              </Link>
            </div>
            <ul className="rise rise-3 mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-soft">
              <li className="flex items-center gap-1.5"><IconTruck className="w-4 h-4 text-sage-deep" /> Free shipping over $150</li>
              <li className="flex items-center gap-1.5"><IconReturn className="w-4 h-4 text-sage-deep" /> 30-day returns</li>
              <li className="flex items-center gap-1.5"><IconLeaf className="w-4 h-4 text-sage-deep" /> GOTS-certified cotton</li>
            </ul>
          </div>

          <div className="relative rise rise-2">
            <div className="absolute -inset-3 rounded-lg border border-clay/25 sm:-inset-4" aria-hidden="true" />
            <div className="stitch absolute -bottom-4 -right-4 -z-0 hidden h-full w-full sm:block" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-parchment lg:aspect-[5/6]">
              <Image
                src="/products/hero.jpg"
                alt="A woman in a flowing raw-cotton dress catching the breeze in soft morning light"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <span className="garment-tag absolute -left-3 bottom-8 -rotate-3 sm:-left-6">100% organic cotton</span>
          </div>
        </div>
      </section>

      {/* ============ marquee ============ */}
      <section className="overflow-hidden border-b border-line/70 bg-parchment/60 py-3.5" aria-hidden="true">
        <div className="marquee-track gap-10 text-[11px] uppercase tracking-[0.28em] text-taupe-deep">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center gap-10 pr-10">
              {MARQUEE.map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t} <span className="text-clay">✕</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ categories ============ */}
      <section className="wrap py-16 sm:py-20" aria-labelledby="categories-title">
        <SectionHeading
          eyebrow="Find your occasion"
          title={
            <span id="categories-title">
              Shop by <em className="display-italic text-clay-deep">mood</em>
            </span>
          }
          action={{ href: "/shop", label: "View everything" }}
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className="group relative overflow-hidden rounded-md bg-parchment outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={c.image}
                  alt={`${c.label} dresses`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" aria-hidden="true" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                <div>
                  <h3 className="font-display text-xl text-cotton sm:text-2xl">{c.label}</h3>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-cotton/80">{c.blurb}</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cotton/40 text-cotton transition-all group-hover:bg-cotton group-hover:text-ink" aria-hidden="true">
                  <IconArrow />
                </span>
              </div>
              <span className="sr-only">Shop {c.label} dresses</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ new arrivals ============ */}
      <section className="wrap pb-16 sm:pb-20" aria-labelledby="new-title">
        <SectionHeading
          eyebrow="Just landed"
          title={
            <span id="new-title">
              New <em className="display-italic text-clay-deep">arrivals</em>
            </span>
          }
          action={{ href: "/shop?sort=new", label: "Shop all new" }}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} priority={newArrivals[0].id === p.id} />
          ))}
        </div>
      </section>

      {/* ============ story ============ */}
      <section id="story" className="scroll-mt-24 border-y border-line/70 bg-parchment/50" aria-labelledby="story-title">
        <div className="wrap grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-parchment">
              <Image
                src="/products/brand-story.jpg"
                alt="The Algodón atelier table — folded cotton garments in cream, clay and sage, with cotton bolls in a clay vase"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <span className="garment-tag absolute -right-2 -top-4 rotate-2">Est. 2019 · Slow & steady</span>
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Our story</p>
            <h2 id="story-title" className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              We only make what <em className="display-italic text-clay-deep">cotton</em> wants to be.
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Algodón began in 2019 with a single bolt of undyed organic cotton and a stubborn question: what if a
              dress could feel like your favourite bedsheets and look like couture? Seven years on, we still spin
              every collection from that same fibre-first thinking — natural dyes, small ateliers, fair hands, and
              silhouettes designed to be worn for a decade, not a season.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["GOTS", "certified organic cotton"],
                ["12", "atelier partners, all visited"],
                ["94%", "of dye baths water-recycled"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-2xl text-clay-deep sm:text-3xl">{k}</dt>
                  <dd className="mt-1 text-xs leading-snug text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============ testimonials ============ */}
      <section className="wrap py-16 sm:py-20" aria-labelledby="love-title">
        <SectionHeading
          center
          eyebrow="Loved by our community"
          title={
            <span id="love-title">
              Soft words, <em className="display-italic text-clay-deep">soft dresses</em>
            </span>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col gap-4 p-6">
              <StarRating value={t.rating} />
              <blockquote className="font-display text-lg leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-auto text-xs uppercase tracking-[0.14em] text-ink-soft">
                {t.name} · {t.detail}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ newsletter ============ */}
      <section className="border-t border-line/70 bg-sage-wash/50" aria-labelledby="nl-title">
        <div className="wrap py-16 text-center sm:py-20">
          <p className="eyebrow">Stay soft</p>
          <h2 id="nl-title" className="mx-auto mt-3 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
            One gentle letter a month, <em className="display-italic text-sage-deep">10% off</em> to say hello.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            New colours, atelier notes and quiet sales. No noise — we&apos;re a boutique, not a billboard.
          </p>
          <div className="mt-8">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
