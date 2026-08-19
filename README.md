# Algodón — an online dress boutique

*Algodón* is Spanish for cotton. This is a full storefront for a fictional boutique that feels
soft, natural and breathable — warm cotton-whites, deep ink text, dusty terracotta-clay accents,
muted sage, and editorial serif typography (Fraunces + Inter, self-hosted).

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS v4**. Fully responsive,
keyboard accessible, SEO-friendly (per-page metadata, JSON-LD product schema, sitemap, robots).

## Run it

```bash
npm install
npm run dev     # develop on :3000
npm run build   # production build
npm start       # serve the production build on :3000
```

## What's inside

| Area | Details |
| --- | --- |
| **Home** | Seasonal hero, values marquee, category tiles (everyday / summer / formal / evening), new arrivals, brand story, testimonials, newsletter |
| **Shop** | Filter by occasion, colour, size & price; 5 sort orders; shareable filter URLs; quick-view modal; mobile filter drawer |
| **Product** | Image gallery, colour swatches, size selector + size-guide modal, add-to-bag, wishlist, details accordions, ratings & reviews (write your own), related items, JSON-LD |
| **Cart** | Quantity controls, save-for-later, promo codes (`ALGODON10`, `WELCOME15`, `FREESHIP`), free-shipping progress |
| **Checkout** | 3 steps (information → payment → review), guest checkout, cards (Visa/MC/Amex with live formatting & brand detection), PayPal, Apple/Google Pay express, Klarna BNPL, order confirmation with timeline |
| **Account** | Email/password sign-up & login, simulated Google/Apple SSO, forgot-password flow (on-screen demo code), dashboard with orders, addresses CRUD, wishlist, saved cards |
| **Lina chatbot** | Floating styling assistant — finds dresses by occasion/colour/size/budget, answers FAQs (shipping, returns, sizing, order tracking), surfaces product cards in-chat |
| **Global** | Search with autocomplete (keyboard navigable), wishlist everywhere, toasts, promo banner, garment-tag & stitching design accents, paper-grain texture |

## Notes

- Demo store: cart/auth/orders/reviews are persisted in `localStorage` — no backend, no real payments.
- Product photography is AI-generated placeholder/editorial imagery in `public/products/`.
