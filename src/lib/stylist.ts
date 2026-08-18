import { PRODUCTS, type ColorFamily, type Occasion, type Product } from "./products";
import type { Order } from "./store";

export interface ChatAction {
  label: string;
  kind: "size-guide" | "shipping" | "returns" | "track" | "sale" | "browse";
}

export interface BotReply {
  text: string;
  products?: Product[];
  actions?: ChatAction[];
}

const COLOR_WORDS: Record<string, ColorFamily> = {
  terracotta: "clay", clay: "clay", rust: "clay", red: "clay", orange: "clay", copper: "clay", claycol: "clay",
  green: "sage", sage: "sage", olive: "sage", pistachio: "sage",
  white: "ivory", ivory: "ivory", cream: "ivory", "off-white": "ivory", natural: "ivory", ecru: "ivory",
  black: "ink", ink: "ink", noir: "ink", dark: "ink",
  taupe: "taupe", tan: "taupe", beige: "taupe", brown: "taupe", nude: "taupe", sand: "taupe", neutral: "taupe",
  pink: "rose", rose: "rose", blush: "rose",
  yellow: "gold", gold: "gold", marigold: "gold", mustard: "gold",
};

const OCCASION_WORDS: { words: string[]; occasion: Occasion }[] = [
  { words: ["wedding", "wedding-guest", "bridesmaid"], occasion: "formal" },
  { words: ["work", "office", "interview", "meeting", "professional", "business"], occasion: "formal" },
  { words: ["party", "gala", "cocktail", "holiday", "event", "dinner", "date"], occasion: "evening" },
  { words: ["evening", "night", "gown", "black-tie", "gala2"], occasion: "evening" },
  { words: ["beach", "vacation", "holiday2", "summer", "sun", "travel", "trip", "island"], occasion: "summer" },
  { words: ["casual", "everyday", "weekend", "errands", "lunch", "relaxed", "day"], occasion: "casual" },
  { words: ["garden", "brunch", "picnic"], occasion: "summer" },
  { words: ["graduation", "baptism", "christening", "recital"], occasion: "formal" },
];

const GREETINGS = ["hi", "hello", "hey", "hola", "good morning", "good afternoon", "good evening", "¡hola"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function stylistReply(raw: string, orders: Order[]): BotReply {
  const q = raw.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  /* ---- explicit intents first ---- */

  if (has("size guide", "size chart", "sizing guide", "measurements", "what size")) {
    return {
      text: "Happy to help with sizing! Our dresses run true to size — between sizes, take the larger for a relaxed drape. Smocked bodices stretch up to 2\" comfortably. Full chart below:",
      actions: [{ label: "Open size guide", kind: "size-guide" }],
    };
  }

  if (has("true to size", "fits", "fit ", "sizing run")) {
    return {
      text: "Most of our dresses run true to size. Smocked styles (Rosa, Sol, Elena) are extra forgiving, while the Vega sheath is precisely tailored — if you're between sizes there, size up. Want me to open the size guide?",
      actions: [{ label: "Open size guide", kind: "size-guide" }],
    };
  }

  if (has("ship", "deliver", "arrival", "arrive", "how long", "when will")) {
    return {
      text: "Here's the shipping picture:\n• Standard (3–6 business days) — free over $150, otherwise $8\n• Express (2–3 days) — $14\n• All delivery is carbon-neutral, tracked, and ships in paper packaging.\nWant me to check on a specific order?",
      actions: [{ label: "Track my order", kind: "track" }],
    };
  }

  if (has("return", "exchange", "refund", "send back")) {
    return {
      text: "We make returns easy: 30 days from delivery, unworn with tags on, and a free return label is included in every parcel. Refunds land 3–5 business days after we receive your dress. Exchanges ship out the same day you request them.",
      actions: [{ label: "Track my order", kind: "track" }],
    };
  }

  if (has("track", "order status", "where is my order", "my order", "order number")) {
    const o = orders[0];
    if (o) {
      const when = new Date(o.eta).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      const status =
        o.status === "delivered"
          ? `Your order ${o.number} was delivered — we hope you love it. 💛`
          : o.status === "in_transit"
            ? `Order ${o.number} is on its way and should arrive by ${when}.`
            : `Order ${o.number} is confirmed and being wrapped in the atelier — it ships within 1–2 business days, arriving around ${when}.`;
      return { text: status, actions: [{ label: "View order history", kind: "browse" }] };
    }
    return {
      text: "I don't see any orders on this device yet. If you checked out as a guest, your confirmation email has a live tracking link. Anything else — styling help, perhaps? 😊",
      actions: [{ label: "Help me find a dress", kind: "browse" }],
    };
  }

  if (has("promo", "discount", "coupon", "code", "off", "sale")) {
    return {
      text: "A little insider deal, just between us: use code ALGODON10 for 10% off, or FREESHIP for free shipping on any order. First-time subscribers get 15% (WELCOME15) via the newsletter at the bottom of the page.",
      actions: [{ label: "Shop the sale styles", kind: "sale" }],
    };
  }

  if (has("cotton", "fabric", "material", "organic", "sustainab", "made")) {
    return {
      text: "Everything we make starts with fibre: GOTS-certified organic cotton, grown without synthetic pesticides, spun and woven in small European and Indian mills we've visited ourselves. Naturally dyed or undyed, garment-washed for softness, sewn in small batches. Softness you can feel, provenance you can trust.",
    };
  }

  if (has("thank", "gracias", "thanks")) {
    return { text: pick(["De nada! Come back anytime — I'm always here to talk cotton. 🤍", "You're so welcome. Happy twirling!", "Anytime, amiga. May your dresses always breathe."]) };
  }

  if (GREETINGS.some((g) => q === g || q.startsWith(g + " ") || q.startsWith(g + "!") || q.startsWith(g + ","))) {
    return {
      text: "¡Hola! I'm Lina, Algodón's styling assistant. I can help you find a dress by occasion, colour, size or budget — or answer anything about shipping, returns and sizing. What are we dressing for?",
      actions: [
        { label: "Style me", kind: "browse" },
        { label: "Shipping", kind: "shipping" },
      ],
    };
  }

  /* ---- shopping intents: parse facets ---- */

  let budget: number | null = null;
  const m = q.match(/(?:under|below|less than|max|budget(?: of)?|up to|upto|around|about|no more than)[^0-9$]*(\d{2,4})/);
  if (m) budget = parseInt(m[1], 10);

  const colors = new Set<ColorFamily>();
  for (const [word, fam] of Object.entries(COLOR_WORDS)) {
    if (q.includes(word)) colors.add(fam);
  }

  const occasions = new Set<Occasion>();
  for (const { words, occasion } of OCCASION_WORDS) {
    if (words.some((w) => q.includes(w))) occasions.add(occasion);
  }

  const sizeM = q.match(/\b(xxs|xs|s|m|l|xl|xxl)\b/);
  const size = sizeM ? sizeM[1].toUpperCase() : null;

  const wantsDress = has("dress", "gown", "something", "outfit", "look", "style", "recommend", "suggest", "find", "show", "shop", "browse", "buy");

  if (occasions.size || colors.size || budget || (size && wantsDress)) {
    let pool = PRODUCTS.filter((p) => {
      if (occasions.size && !p.occasions.some((o) => occasions.has(o))) return false;
      if (colors.size && !p.colors.some((c) => colors.has(c.family))) return false;
      if (budget && p.price > budget) return false;
      return true;
    });
    let loosened = false;
    if (pool.length === 0) {
      loosened = true;
      pool = PRODUCTS.filter((p) => {
        if (occasions.size && p.occasions.some((o) => occasions.has(o))) return true;
        if (colors.size && p.colors.some((c) => colors.has(c.family))) return true;
        return false;
      });
    }
    if (pool.length === 0) pool = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 3);

    const bits: string[] = [];
    if (occasions.size) bits.push([...occasions].join(" or "));
    if (colors.size) bits.push([...colors].map((c) => COLOR_FAM_LABEL[c]).join(" or "));
    if (budget) bits.push(`under $${budget}`);
    const desc = bits.length ? bits.join(", ") : "that";

    const top = pool.sort((a, b) => b.rating - a.rating).slice(0, 3);
    let text: string;
    if (loosened && budget) {
      text = `I couldn't find a perfect ${desc} match in that exact price range, so here are the closest loves — a couple are worth stretching for, and there's often a promo code floating around (ask me!).`;
    } else {
      text = pick([
        `Ooh, lovely brief — ${desc}. Here are my favourite picks:`,
        `Great taste. For ${desc}, I'd point you straight to these:`,
        `Let's see… for ${desc}, these three are singing today:`,
      ]);
    }
    if (size) text += `\n\nAnd noted on size ${size} — all of these come in XS–XL, true to size.`;
    return {
      text,
      products: top,
      actions: [
        { label: "Browse the whole shop", kind: "browse" },
        { label: "Size guide", kind: "size-guide" },
      ],
    };
  }

  /* ---- fallback ---- */

  return {
    text: "I want to make sure I get you the right thing. I'm best at:\n• Finding dresses — try \"something sage for a wedding under $250\"\n• Sizing & fit — \"size guide\" or \"does the Vega run true to size?\"\n• Orders — \"where is my order?\"\n• Shipping & returns\nWhat can I help with?",
    actions: [
      { label: "Style me for an event", kind: "browse" },
      { label: "Shipping times", kind: "shipping" },
    ],
  };
}

const COLOR_FAM_LABEL: Record<ColorFamily, string> = {
  clay: "terracotta",
  sage: "sage green",
  ivory: "ivory",
  ink: "ink black",
  taupe: "taupe",
  rose: "dusty rose",
  gold: "marigold",
};

export const CHAT_SUGGESTIONS = [
  "Style me for a wedding",
  "Something sage under $200",
  "Size guide",
  "Where is my order?",
  "Returns policy",
];
