"use client";

import { useLanguage } from "@/lib/i18n";
import type { MenuCategory, MenuItem as MenuItemType } from "@/lib/types";
import { PanelHead } from "@/components/molecules/PanelHead";
import { MenuItem } from "@/components/molecules/MenuItem";

/** A category panel: heading, two-column list of dishes, optional supplements. */
export function MenuPanel({
  category,
  active,
  onPlay,
}: {
  category: MenuCategory;
  active: boolean;
  onPlay: (item: MenuItemType) => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`menu-panel${active ? " active" : ""}`}
      id={`panel-${category.id}`}
      role="tabpanel"
      data-panel={category.id}
      hidden={!active}
    >
      <PanelHead title={category.title} note={category.note} />

      <div className="panel-cols">
        {category.items.map((item) => (
          <MenuItem key={item.name} item={item} onPlay={onPlay} />
        ))}
      </div>

      {category.supplement && <p className="sub-note panel-supp">{t(category.supplement)}</p>}
    </div>
  );
}
