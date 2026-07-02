"use client";

import { useLanguage } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { MenuCategory, MenuItem as MenuItemType } from "@/lib/types";
import { PanelHead } from "@/components/molecules/PanelHead";
import { MenuItem } from "@/components/molecules/MenuItem";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { AddOnsCard } from "@/components/molecules/AddOnsCard";

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
  onView3D,
}: {
  category: MenuCategory;
  active: boolean;
  onPlay: (item: MenuItemType) => void;
  onOpenImage: (item: MenuItemType) => void;
  onView3D: (item: MenuItemType) => void;
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
            <FeatureCard key={item.id ?? item.name.fr} item={item} onPlay={onPlay} onOpenImage={onOpenImage} onView3D={onView3D} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="panel-cols">
          {rest.map((item) => (
            <MenuItem key={item.id ?? item.name.fr} item={item} onPlay={onPlay} onOpenImage={onOpenImage} onView3D={onView3D} />
          ))}
        </div>
      )}

      {category.addons && category.addons.length > 0 && <AddOnsCard groups={category.addons} />}

      {category.supplement && <p className="sub-note panel-supp">{t(category.supplement)}</p>}
    </div>
  );
}
