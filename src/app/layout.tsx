import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

/* Brand fonts, exposed as CSS variables consumed in globals.css. */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Carte — Au Soleil Italien · Pizzeria · Ristorante",
  description:
    "Pâtes fraîches, pizzas pétries sur place et produits transalpins. Cuisine italienne authentique, faite maison et baignée de soleil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cinzel.variable} ${cormorant.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
