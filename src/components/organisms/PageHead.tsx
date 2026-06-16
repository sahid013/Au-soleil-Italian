"use client";

import { useLanguage } from "@/lib/i18n";
import { Rule } from "@/components/atoms/Rule";
import { HeroArt } from "@/components/atoms/HeroArt";

/**
 * Hero header for the menu page: a centred Cinzel title (the lowercase renders
 * as small-caps, hence "La Carte" → LA CARTE) with four floating image slots
 * scattered around it. The slots are placeholders for now — pass `src`/`alt`
 * to HeroArt once the photos are ready. Scroll animation will hook onto the
 * `.hero-art` elements later.
 */
export function PageHead() {
  const { t } = useLanguage();
  return (
    <section className="page-head">
      <div className="hero-sky" />

      {/* Floating artwork: round pizzas spin on scroll, frames loop video. */}
      <HeroArt shape="circle" className="hero-art--pizza-1" src="/pizza-1.png" spin />
      <HeroArt shape="frame" className="hero-art--photo-1" video="/hero-video-1.mp4" straightenFrom={7} />
      <HeroArt shape="frame" className="hero-art--photo-2" video="/hero-video-2.mp4" straightenFrom={2} />
      <HeroArt shape="circle" className="hero-art--pizza-2" src="/pizza-2.png" spin />

      <div className="shell">
        <div className="hero-copy">
          <h1 className="hero-title">La Carte</h1>
          <p>
            {t({
              fr: "Pâtes fraîches, pizzas pétries sur place et produits transalpins. Tous nos plats sont préparés maison, avec générosité, sous le soleil.",
              en: "Fresh pasta, dough kneaded in-house and finest Italian produce. Every dish is made in our kitchen, with generosity, under the sun.",
            })}
          </p>
          <Rule style={{ maxWidth: 300, margin: "24px auto 0" }} />
        </div>
      </div>
    </section>
  );
}
