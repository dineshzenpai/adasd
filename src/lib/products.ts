export type Occasion = "casual" | "formal" | "summer" | "evening";
export type ColorFamily = "clay" | "sage" | "ivory" | "ink" | "taupe" | "rose" | "gold";

export interface ColorOption {
  name: string;
  hex: string;
  family: ColorFamily;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  tagline: string;
  description: string;
  fabric: string;
  details: string[];
  colors: ColorOption[];
  sizes: string[];
  occasions: Occasion[];
  badge?: "New" | "Bestseller" | "Limited";
  image: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  newness: number;
}

export const OCCASIONS: { id: Occasion; label: string; blurb: string }[] = [
  { id: "casual", label: "Everyday", blurb: "Easy pieces for slow mornings" },
  { id: "summer", label: "Summer", blurb: "Sun-washed & breezy" },
  { id: "formal", label: "Formal", blurb: "Polished, considered dressing" },
  { id: "evening", label: "Evening", blurb: "After-dark elegance" },
];

export const COLOR_FAMILIES: { id: ColorFamily; label: string; hex: string }[] = [
  { id: "clay", label: "Terracotta Clay", hex: "#b0614a" },
  { id: "sage", label: "Sage Green", hex: "#8a9b7e" },
  { id: "ivory", label: "Ivory & White", hex: "#f1eadb" },
  { id: "ink", label: "Ink Black", hex: "#2b2520" },
  { id: "taupe", label: "Taupe & Sand", hex: "#b3a189" },
  { id: "rose", label: "Dusty Rose", hex: "#c4958c" },
  { id: "gold", label: "Marigold", hex: "#c79b5e" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

let rid = 0;
const rv = (
  author: string,
  rating: number,
  date: string,
  title: string,
  body: string,
): Review => ({
  id: `r${++rid}`,
  author,
  rating,
  date,
  title,
  body,
  verified: true,
});

const ivory: ColorOption = { name: "Raw Ivory", hex: "#f1eadb", family: "ivory" };
const clay: ColorOption = { name: "Burnt Clay", hex: "#b0614a", family: "clay" };
const ink: ColorOption = { name: "Deep Ink", hex: "#2b2520", family: "ink" };
const sage: ColorOption = { name: "Garden Sage", hex: "#8a9b7e", family: "sage" };
const taupe: ColorOption = { name: "Warm Taupe", hex: "#b3a189", family: "taupe" };
const rose: ColorOption = { name: "Dusty Rose", hex: "#c4958c", family: "rose" };
const gold: ColorOption = { name: "Muted Marigold", hex: "#c79b5e", family: "gold" };

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "marisol-wrap-dress",
    name: "Marisol Wrap Dress",
    price: 148,
    tagline: "The everyday wrap, softened",
    description:
      "Our signature wrap dress in garment-washed organic cotton. The tie waist skims rather than cinches, and flutter sleeves fall just past the elbow — a dress that moves with you from the market to a late lunch.",
    fabric: "100% organic cotton poplin, garment-washed for a lived-in hand",
    details: [
      "True to size — take one size up for a relaxed drape",
      "Full-length tie waist with inner anchor to keep the wrap secure",
      "Flutter sleeves, midi length (46\" from shoulder)",
      "Side pockets, hidden",
      "Machine wash cold, line dry",
    ],
    colors: [clay, ivory],
    sizes: SIZES,
    occasions: ["casual", "summer"],
    badge: "Bestseller",
    image: "/products/marisol-wrap.jpg",
    rating: 4.8,
    reviewCount: 214,
    newness: 5,
    reviews: [
      rv("Elena V.", 5, "2026-06-21", "The one I reach for", "Bought this in clay and it hasn't seen the inside of my closet since. The cotton gets softer with every wash and the wrap stays put — no wardrobe malfunctions."),
      rv("Priya S.", 5, "2026-05-30", "Flattering without trying", "The tie waist is forgiving but still gives shape. I'm 5'3\" and the midi hits mid-calf, which I love."),
      rv("Dana R.", 4, "2026-05-12", "Lovely, slightly long", "Beautiful quality. I'm petite so I had it hemmed two inches — worth it."),
    ],
  },
  {
    id: "p2",
    slug: "sienna-utility-midi",
    name: "Sienna Utility Midi",
    price: 128,
    compareAt: 158,
    tagline: "A shirt dress with workwear bones",
    description:
      "Cut from dense linen-cotton canvas that softens beautifully, the Sienna borrows its pockets and belt from vintage workwear but keeps a feminine, easy silhouette. Rolled sleeves, washed taupe, endless wear.",
    fabric: "55% European linen, 45% organic cotton canvas",
    details: [
      "Relaxed fit — size down for a tailored look",
      "Removable self-belt, brass-finish hardware",
      "Two chest pockets, deep side pockets",
      "Midi length, slight A-line",
      "Machine wash cold, tumble dry low",
    ],
    colors: [taupe, ink],
    sizes: SIZES,
    occasions: ["casual"],
    image: "/products/sienna-linen-midi.jpg",
    rating: 4.6,
    reviewCount: 96,
    newness: 2,
    reviews: [
      rv("Marta K.", 5, "2026-06-02", "Wears like armor, feels like pajamas", "The canvas is substantial without being stiff. I've worn it to the studio, to dinner, on a train. Zero wrinkles that matter."),
      rv("Jocelyn T.", 4, "2026-04-18", "Great, wish belt loops were wider", "Beautiful color — a true warm taupe. Belt is a little fussy but the dress is a keeper."),
    ],
  },
  {
    id: "p3",
    slug: "lucia-bias-gown",
    name: "Lucia Bias Gown",
    price: 328,
    tagline: "Liquid cotton, after dark",
    description:
      "A bias-cut gown in fluid cotton-satin that pours rather than falls. Deep ink catches the light like water; delicate straps and a low, straight back keep it modern. Made in a small atelier run of 120.",
    fabric: "Cotton-satin (long-staple cotton, sateen weave)",
    details: [
      "Runs true to size; bias cut relaxes slightly with wear",
      "Floor length (58\" from shoulder)",
      "Adjustable straps, low straight back",
      "Dry clean recommended",
      "Limited run — numbered garment tag",
    ],
    colors: [ink],
    sizes: SIZES,
    occasions: ["evening", "formal"],
    badge: "Limited",
    image: "/products/lucia-gown.jpg",
    rating: 4.9,
    reviewCount: 61,
    newness: 1,
    reviews: [
      rv("Sofia M.", 5, "2026-07-08", "Wore it to a wedding, still thinking about it", "People kept asking what designer it was. The cotton-satin is heavier than silk so it drapes perfectly and never clings."),
      rv("Amara O.", 5, "2026-06-15", "Investment piece", "The finish inside is as clean as the outside. Worth every penny."),
    ],
  },
  {
    id: "p4",
    slug: "alba-lace-slip-dress",
    name: "Alba Lace-Slip Dress",
    price: 98,
    tagline: "A slip, barely there",
    description:
      "The lightest thing we make. A whisper of ivory cotton voile with a touch of cotton lace at the hem, cut on the bias to skim the body. Wear it alone in July, over a tee in September.",
    fabric: "Cotton voile with cotton-clip lace trim",
    details: [
      "Relaxed, slightly loose fit",
      "Above-knee to knee length depending on height",
      "Adjustable straps",
      "Hand wash cold, dry flat",
    ],
    colors: [ivory],
    sizes: SIZES,
    occasions: ["summer"],
    badge: "New",
    image: "/products/alba-slip.jpg",
    rating: 4.5,
    reviewCount: 48,
    newness: 12,
    reviews: [
      rv("Nina B.", 5, "2026-07-19", "Exactly the slip I wanted", "Not sheer enough to be awkward, not heavy enough to feel. The lace detail is so sweet in person."),
      rv("Ruth A.", 4, "2026-07-01", "Delicate", "Treat it gently and it's perfect. I sized up for a looser drape."),
    ],
  },
  {
    id: "p5",
    slug: "rosa-tiered-maxi",
    name: "Rosa Tiered Maxi",
    price: 178,
    tagline: "A garden party in dress form",
    description:
      "Three gathered tiers of featherweight cotton crinkle, held by a smocked bodice that needs no fussing. The Rosa spins beautifully, packs down to nothing, and exists to be worn barefoot somewhere warm.",
    fabric: "Organic cotton crinkle gauze",
    details: [
      "Smocked bodice — stretches to fit, true to size",
      "Full-length maxi with tiered skirt",
      "Ruffle straps, square neckline",
      "Machine wash cold, hang to dry (wrinkles are the point)",
    ],
    colors: [rose, ivory],
    sizes: SIZES,
    occasions: ["summer"],
    image: "/products/rosa-tiered.jpg",
    rating: 4.7,
    reviewCount: 132,
    newness: 7,
    reviews: [
      rv("Camille D.", 5, "2026-06-27", "Took it to Portugal", "Lived in this for two weeks. Rolled it into a ball in my bag, shook it out, looked intentional. The smocked bodice is so comfortable."),
      rv("Hana L.", 4, "2026-05-22", "So twirlable", "My daughter keeps borrowing it. Buying a second one."),
      rv("Greta W.", 5, "2026-04-30", "The color is a dream", "Dusty rose done right — muted, not saccharine."),
    ],
  },
  {
    id: "p6",
    slug: "vega-tailored-sheath",
    name: "Vega Tailored Sheath",
    price: 198,
    tagline: "Boardroom to booking-hall",
    description:
      "A precisely tailored sheath in firm cotton twill with a hint of stretch. Structured shoulders, a clean back vent, and an invisible zip — the quiet dress that means business without a single statement.",
    fabric: "Cotton twill (98% cotton, 2% elastane)",
    details: [
      "Tailored fit — true to size",
      "Knee length, back vent",
      "Fully lined in cotton voile, invisible back zip",
      "Deep pockets concealed in side seams",
      "Machine wash cold, cool iron",
    ],
    colors: [ink, sage],
    sizes: SIZES,
    occasions: ["formal"],
    image: "/products/vega-sheath.jpg",
    rating: 4.6,
    reviewCount: 87,
    newness: 3,
    reviews: [
      rv("Diane F.", 5, "2026-06-10", "My uniform", "I present in this dress weekly. It looks pressed even after a full day of travel. Hidden pockets!!"),
      rv("Bex J.", 4, "2026-05-03", "Sharp", "Very structured — if you're between sizes go up; the tailoring is unforgiving but flattering."),
    ],
  },
  {
    id: "p7",
    slug: "mira-embroidered-midi",
    name: "Mira Embroidered Midi",
    price: 218,
    tagline: "Stitched by hand, slowly",
    description:
      "Ivory cotton mul with sage-green hand embroidery at the neckline and cuffs, done by a women's cooperative we've partnered with for six years. Puffed sleeves, a nipped waist, and a story in every stitch.",
    fabric: "Hand-loomed cotton mul, cotton-thread embroidery",
    details: [
      "True to size; smocked back panel adds give",
      "Midi length, gently flared skirt",
      "Hand embroidery — slight variation is part of the beauty",
      "Detachable self-tie sash",
      "Hand wash cold or dry clean",
    ],
    colors: [ivory, sage],
    sizes: SIZES,
    occasions: ["formal", "evening"],
    badge: "New",
    image: "/products/mira-embroidered.jpg",
    rating: 4.8,
    reviewCount: 73,
    newness: 11,
    reviews: [
      rv("Alicia P.", 5, "2026-07-25", "Heirloom energy", "Wore this to my engagement dinner. The embroidery is even more delicate in person, and the smocked back means I could actually eat."),
      rv("Yuki N.", 5, "2026-07-02", "Slow fashion at its best", "You can feel the care in it. The sage on ivory is so quiet and pretty."),
    ],
  },
  {
    id: "p8",
    slug: "sol-smocked-sundress",
    name: "Sol Smocked Sundress",
    price: 118,
    tagline: "Sunshine, subdued",
    description:
      "A muted marigold sundress with a smocked body and ruffle straps that flatter every shoulder. Dense smocking holds you in gently; the skirt swings. Made for peaches, patios, and long light.",
    fabric: "Organic cotton, yarn-dyed",
    details: [
      "Smocked bodice, true to size with stretch",
      "Above-ankle length",
      "Ruffle straps (non-adjustable), square neck",
      "Side pockets",
      "Machine wash cold",
    ],
    colors: [gold],
    sizes: SIZES,
    occasions: ["summer", "casual"],
    image: "/products/sol-smocked.jpg",
    rating: 4.5,
    reviewCount: 110,
    newness: 9,
    reviews: [
      rv("Lucia G.", 5, "2026-07-14", "The color everyone asks about", "It's marigold but muted — mustard's gentler cousin. I have it in M and the smocking is so comfy."),
      rv("Tessa H.", 4, "2026-06-05", "Cute but straps run short", "I'm broad-shouldered and the straps are a touch short. Still love it."),
    ],
  },
  {
    id: "p9",
    slug: "noor-pleated-midi",
    name: "Noor Pleated Midi",
    price: 248,
    tagline: "Pleats that travel by air",
    description:
      "Finely knife-pleated cotton chiffon in garden sage. The Noor catches air with every step and recovers from a suitcase without complaint. A high crew neck and blouson bodice keep it graceful, never fussy.",
    fabric: "Pleated cotton chiffon, lined bodice",
    details: [
      "True to size; bodice has comfortable ease",
      "Midi length (47\" from shoulder)",
      "Keyhole back closure, three-quarter sleeves",
      "Permanent pleats — do not iron pleats",
      "Machine wash cold on delicate, hang to dry",
    ],
    colors: [sage],
    sizes: SIZES,
    occasions: ["evening", "formal"],
    image: "/products/noor-pleated.jpg",
    rating: 4.7,
    reviewCount: 54,
    newness: 8,
    reviews: [
      rv("Margaux L.", 5, "2026-06-18", "Movement for days", "It sways when you walk and people notice. Wore it to a gallery opening and a baptism in the same month."),
      rv("Ines C.", 4, "2026-05-28", "Elegant but mind the lining", "The bodice lining sits slightly short on my long torso. Otherwise stunning."),
    ],
  },
  {
    id: "p10",
    slug: "camila-poplin-shirt-dress",
    name: "Camila Poplin Shirt Dress",
    price: 138,
    tagline: "Crisp, striped, incorruptible",
    description:
      "The classic shirt dress in a fine ivory-and-taupe micro-stripe, cut from Portuguese cotton poplin. Horn-look buttons, a self-belt, and a collar that stands when you need it to. Impeccable out of the suitcase.",
    fabric: "Portuguese cotton poplin, yarn-dyed micro stripe",
    details: [
      "Classic fit — true to size",
      "Below-knee length",
      "Corozo-nut buttons down the placket",
      "Removable self-belt; back yoke pleat for movement",
      "Machine wash warm, iron while damp for sharpest look",
    ],
    colors: [ivory, taupe],
    sizes: SIZES,
    occasions: ["casual"],
    badge: "Bestseller",
    image: "/products/camila-shirt.jpg",
    rating: 4.8,
    reviewCount: 189,
    newness: 4,
    reviews: [
      rv("Rachel E.", 5, "2026-06-30", "My desert island dress", "Meetings, weekends, dinners. Belt it, don't belt it, layer over a swimsuit. The poplin is crisp but breathes."),
      rv("Ana María Q.", 5, "2026-05-15", "Perfect stripe", "Not too nautical, not too subtle. Size S fit exactly and the buttons are real corozo — lovely detail."),
      rv("Fern D.", 4, "2026-04-22", "Needs an iron", "It's poplin — it creases. Small price for the crispness."),
    ],
  },
  {
    id: "p11",
    slug: "elena-puff-sleeve-midi",
    name: "Elena Puff-Sleeve Midi",
    price: 188,
    tagline: "Romance, restrained",
    description:
      "A burnt-clay midi with the drama concentrated exactly where you want it: generous puff sleeves and a smocked waist, then calm from there. Fall dinner parties were the brief; this is the answer.",
    fabric: "Structured organic cotton with smocked panels",
    details: [
      "True to size; smocked waist accommodates in-between sizing",
      "Midi length, straight skirt",
      "Elasticated puff sleeves fall just below elbow",
      "Square neckline",
      "Machine wash cold, reshape sleeves when damp",
    ],
    colors: [clay],
    sizes: SIZES,
    occasions: ["formal"],
    image: "/products/elena-puff.jpg",
    rating: 4.6,
    reviewCount: 66,
    newness: 6,
    reviews: [
      rv("Paloma R.", 5, "2026-07-11", "Main-character dress", "The sleeves! The color is a deep terracotta that glows at golden hour. Felt like the prettiest person at the party."),
      rv("June K.", 4, "2026-06-08", "Beautiful, size up if busty", "The smocked waist is great, the bodice runs slightly small. Exchange was easy."),
    ],
  },
  {
    id: "p12",
    slug: "duna-column-gown",
    name: "Duna Column Gown",
    price: 268,
    tagline: "The quietest statement",
    description:
      "A floor-length column in heavyweight undyed cotton, cut with a square neck and an architectural seam down the bodice. No embellishment, no apology — just cloth, fall, and the person wearing it.",
    fabric: "Heavyweight undyed organic cotton (450 GSM)",
    details: [
      "Runs true to size; column silhouette — size up for more drape",
      "Floor length (57\" from shoulder)",
      "Square neckline, wide straps",
      "Back zip, fully lined",
      "Machine wash cold, hang to dry",
    ],
    colors: [ivory],
    sizes: SIZES,
    occasions: ["evening", "formal"],
    badge: "New",
    image: "/products/duna-column.jpg",
    rating: 4.9,
    reviewCount: 39,
    newness: 10,
    reviews: [
      rv("Isabel T.", 5, "2026-07-29", "Married in it", "Simple, sculptural, cool as anything in 90° heat. Our photographer said the fabric photographs like couture."),
      rv("Wren S.", 5, "2026-07-06", "Undyed and unmatched", "Knowing it's undyed cotton makes it feel even more special. Drapes heavy and clean."),
    ],
  },
];

export const SIZE_GUIDE = {
  columns: ["Size", "US", "Bust (in)", "Waist (in)", "Hips (in)"],
  rows: [
    ["XS", "0–2", "31–32", "24–25", "34–35"],
    ["S", "4–6", "33–34", "26–27", "36–37"],
    ["M", "8–10", "35–36", "28–29", "38–39"],
    ["L", "12–14", "38–39.5", "31–32.5", "41–42.5"],
    ["XL", "16–18", "41–43", "34–36", "44–46"],
  ],
  notes: [
    "Our dresses run true to size. Between sizes? Take the larger one for a relaxed drape.",
    "Bodices with smocking stretch up to 2\" comfortably.",
    "Our model is 5'9\" and wears a size S.",
    "Need a hand? Ask Lina, our styling assistant (bottom-right corner), or email fit@algodon.shop.",
  ],
};

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(product: Product, count = 4): Product[] {
  return [...PRODUCTS]
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score:
        p.occasions.filter((o) => product.occasions.includes(o)).length * 2 +
        p.colors.filter((c) => product.colors.some((pc) => pc.family === c.family)).length +
        (p.badge ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .slice(0, count)
    .map((x) => x.p);
}

export function searchProducts(q: string, limit = 8): Product[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return PRODUCTS.map((p) => {
    const hay = [
      p.name,
      p.tagline,
      p.fabric,
      ...p.occasions,
      ...p.colors.map((c) => c.name),
      ...p.colors.map((c) => c.family),
    ]
      .join(" ")
      .toLowerCase();
    let score = 0;
    if (p.name.toLowerCase().startsWith(needle)) score += 6;
    if (p.name.toLowerCase().includes(needle)) score += 4;
    if (hay.includes(needle)) score += 2;
    needle.split(/\s+/).forEach((w) => {
      if (w.length > 2 && hay.includes(w)) score += 1;
    });
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export const PRICE_BUCKETS = [
  { id: "u125", label: "Under $125", test: (n: number) => n < 125 },
  { id: "125-200", label: "$125 – $200", test: (n: number) => n >= 125 && n <= 200 },
  { id: "o200", label: "Over $200", test: (n: number) => n > 200 },
];
