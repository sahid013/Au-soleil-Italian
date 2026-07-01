"use client";

import { useLanguage } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { MenuCategory, MenuItem as MenuItemType } from "@/lib/types";
import { PanelHead } from "@/components/molecules/PanelHead";
import { MenuItem } from "@/components/molecules/MenuItem";
import { FeatureCard } from "@/components/molecules/FeatureCard";

/**
 * A category panel inside a decorative parchment frame: centred heading, two
 * featured dishes (the first two items) as large cards, then the remaining
 * dishes in a two-column list, with optional supplements underneath.
 */
export function MenuPanel({
  category,
  active,
  onPlay,
  onOpenImage,
}: {
  category: MenuCategory;
  active: boolean;
  onPlay: (item: MenuItemType) => void;
  onOpenImage: (item: MenuItemType) => void;
}) {
  const { t } = useLanguage();

  // On mobile, skip the two large featured cards and show every dish in the list.
  const isMobile = useMediaQuery("(max-width: 760px)");
  const featured = isMobile ? [] : category.items.slice(0, 2);
  const rest = isMobile ? category.items : category.items.slice(2);

  return (
    <div
      className={`menu-panel${active ? " active" : ""}`}
      id={`panel-${category.id}`}
      role="tabpanel"
      data-panel={category.id}
      hidden={!active}
    >
      <span className="panel-corner panel-corner--tl" aria-hidden="true" />
      <span className="panel-corner panel-corner--tr" aria-hidden="true" />
      <span className="panel-corner panel-corner--bl" aria-hidden="true" />
      <span className="panel-corner panel-corner--br" aria-hidden="true" />

      <PanelHead title={category.title} note={category.note} ornament />

      {featured.length > 0 && (
        <div className="panel-feature">
          {featured.map((item) => (
            <FeatureCard key={item.name} item={item} onPlay={onPlay} onOpenImage={onOpenImage} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="panel-cols">
          {rest.map((item) => (
            <MenuItem key={item.name} item={item} onPlay={onPlay} onOpenImage={onOpenImage} />
          ))}
        </div>
      )}

      {category.supplement && <p className="sub-note panel-supp">{t(category.supplement)}</p>}
    </div>
  );
}
