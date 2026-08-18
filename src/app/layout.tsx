import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Header, PromoBar } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { Toaster } from "@/components/Toaster";
import { SizeGuideModal } from "@/components/SizeGuideModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://algodon.example.com"),
  title: {
    default: "Algodón — Naturally Beautiful Cotton Dresses",
    template: "%s · Algodón",
  },
  description:
    "Algodón is a boutique dress atelier named for the Spanish word for cotton. Organic, breathable dresses in warm, quiet colours — made slowly, worn endlessly.",
  keywords: [
    "cotton dresses",
    "organic cotton",
    "boutique dresses",
    "sustainable fashion",
    "summer dresses",
    "evening dresses",
  ],
  openGraph: {
    title: "Algodón — Naturally Beautiful Cotton Dresses",
    description: "Organic, breathable dresses in warm, quiet colours — made slowly, worn endlessly.",
    type: "website",
    siteName: "Algodón",
    images: [{ url: "/products/hero.jpg", width: 1600, height: 1000, alt: "The Algodón summer cotton edit" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf6ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cotton font-sans text-ink antialiased">
        <AppProvider>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <PromoBar />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <Toaster />
          <SizeGuideModal />
        </AppProvider>
      </body>
    </html>
  );
}
