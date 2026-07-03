"use client";

import { useLanguage } from "@/lib/i18n";
import type { AddOnGroup } from "@/lib/types";

/**
 * Category add-on card, shown beneath a category's items. Lists each add-on
 * group (e.g. "Suppléments") with its entries and prices.
 */
export function AddOnsCard({ groups }: { groups: AddOnGroup[] }) {
  const { t } = useLanguage();
  return (
    <div className="addons-card">
      {groups.map((group, gi) => (
        <div className="addons-group" key={gi}>
          <h3 className="addons-title">{t(group.title)}</h3>
          <ul className="addons-list">
            {group.items.map((addon, i) => (
              <li className="addons-row" key={i}>
                <span className="addons-name">{t(addon.name)}</span>
                <span className="addons-dots" />
                {addon.price && <span className="addons-price">{addon.price}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
