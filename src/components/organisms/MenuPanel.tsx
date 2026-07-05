"use client";

import { useLanguage } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { MenuCategory, MenuItem as MenuItemType, MenuVariation } from "@/lib/types";
import { PanelHead } from "@/components/molecules/PanelHead";
import { MenuItem } from "@/components/molecules/MenuItem";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { AddOnsCard } from "@/components/molecules/AddOnsCard";
import { VariationsCard } from "@/components/molecules/VariationsCard";

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
  onPlay: (item: MenuItemType, variations?: MenuVariation[]) => void;
  onOpenImage: (item: MenuItemType) => void;
  onView3D: (item: MenuItemType, variations?: MenuVariation[]) => void;
}) {
  const { t } = useLanguage();

  // Categories priced by size variations (the Salades category) show every dish
  // as a regular row — no large featured cards — and hide per-dish prices, since
  // pricing is given once by the category's size options (see VariationsCard).
  const pricedBySizes = (category.variations?.length ?? 0) > 0;

  // For size-priced categories (Salades), carry the size options into the media
  // lightboxes so they show the pills in place of a (missing) per-dish price.
  const saladVariations = pricedBySizes ? category.variations : undefined;
  const handlePlay = (item: MenuItemType) => onPlay(item, saladVariations);
  const handleView3D = (item: MenuItemType) => onView3D(item, saladVariations);

  // On mobile, skip the two large featured cards and show every dish in the list.
  const isMobile = useMediaQuery("(max-width: 760px)");
  const featured = isMobile || pricedBySizes ? [] : category.items.slice(0, 2);
  const rest = isMobile || pricedBySizes ? category.items : category.items.slice(2);

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

      {/* Size options card. In size-priced categories (Salades) it sits above the
          dishes, since the sizes/prices frame the whole list; elsewhere it would
          follow the items (see below). */}
      {pricedBySizes && category.variations && category.variations.length > 0 && (
        <VariationsCard variations={category.variations} />
      )}

      {featured.length > 0 && (
        <div className="panel-feature">
          {featured.map((item) => (
            <FeatureCard key={item.id ?? item.name.fr} item={item} onPlay={handlePlay} onOpenImage={onOpenImage} onView3D={handleView3D} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="panel-cols">
          {rest.map((item) => (
            <MenuItem key={item.id ?? item.name.fr} item={item} hidePrice={pricedBySizes} onPlay={handlePlay} onOpenImage={onOpenImage} onView3D={handleView3D} />
          ))}
        </div>
      )}

      {!pricedBySizes && category.variations && category.variations.length > 0 && (
        <VariationsCard variations={category.variations} />
      )}

      {category.addons && category.addons.length > 0 && <AddOnsCard groups={category.addons} />}

      {category.supplement && <p className="sub-note panel-supp">{t(category.supplement)}</p>}
    </div>
  );
}
