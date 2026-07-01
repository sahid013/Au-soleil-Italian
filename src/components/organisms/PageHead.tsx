"use client";

import { useLanguage } from "@/lib/i18n";
import { ButtonLink } from "@/components/atoms/Button";

/**
 * Menu page intro: a centred Cinzel title + description with a "See menu"
 * CTA that jumps to the menu section.
 */
export function PageHead() {
  const { t } = useLanguage();

  return (
    <div className="hero">
      {/* Ambient sunlit gradient that slowly drifts behind the hero.
          Decorative only. */}
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-blob hero-blob--sun" />
        <span className="hero-blob hero-blob--sky" />
        <span className="hero-blob hero-blob--warm" />
        <span className="hero-blob hero-blob--red" />
      </div>

      <section className="page-head">
        <div className="shell">
          <div className="hero-copy">
            <h1 className="hero-title">
              {t({ fr: "La Carte", en: "The Menu", es: "La Carta", zh: "菜单" })}
            </h1>
            <p>
              {t({
                fr: "Pâtes, pizzas pétries sur place et produits transalpins. Plats préparés maison, avec générosité, sous le soleil.",
                en: "Pasta, pizzas kneaded on-site and finest Italian produce. Made in our kitchen, with generosity, under the sun.",
                es: "Pasta, pizzas amasadas en casa y los mejores productos italianos. Platos preparados en casa, con generosidad, bajo el sol.",
                zh: "面食、现场手工揉制的披萨和精选意大利食材。自家厨房用心烹制，沐浴阳光。",
              })}
            </p>
            <ButtonLink variant="olive" href="#menu" className="hero-cta">
              {t({ fr: "Voir la carte", en: "See menu", es: "Ver la carta", zh: "查看菜单" })}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
