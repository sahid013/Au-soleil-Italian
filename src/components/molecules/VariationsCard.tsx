"use client";

import { useLanguage } from "@/lib/i18n";
import type { MenuVariation } from "@/lib/types";

/**
 * Portion / size options for a category (e.g. the Salades category's Small /
 * Large pricing). Shown as a card of option pills beneath the category's items,
 * making clear the choice applies to every dish in the category.
 */
export function VariationsCard({ variations }: { variations: MenuVariation[] }) {
  const { t } = useLanguage();
  return (
    <div className="variations-card">
      <h3 className="variations-title">{t({ fr: "Tailles", en: "Sizes", es: "Tamaños", zh: "份量" })}</h3>
      <p className="variations-note">
        {t({
          fr: "Disponible pour toutes nos salades.",
          en: "Available for all our salads.",
          es: "Disponible para todas nuestras ensaladas.",
          zh: "适用于我们所有的沙拉。",
        })}
      </p>
      <ul className="variations-list">
        {variations.map((v, i) => (
          <li className="variation-pill" key={i}>
            <span className="variation-name">{t(v.name)}</span>
            {v.price && <span className="variation-price">{v.price}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
