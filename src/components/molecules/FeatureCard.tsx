"use client";

import { useLanguage } from "@/lib/i18n";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { useDishView } from "@/lib/useDishView";
import { PlayButton } from "@/components/atoms/PlayButton";
import { View3DButton } from "@/components/atoms/View3DButton";
import { DishThumb } from "./DishThumb";

/**
 * A highlighted dish at the top of a category panel: a large square thumbnail
 * beside a kicker (the dish's badge, e.g. "Nouveauté" / "Signature"), name,
 * description and price. The first two items of every category are shown this way.
 */
export function FeatureCard({
  item,
  onPlay,
  onOpenImage,
  onView3D,
}: {
  item: MenuItemType;
  onPlay: (item: MenuItemType) => void;
  onOpenImage: (item: MenuItemType) => void;
  onView3D: (item: MenuItemType) => void;
}) {
  const { t } = useLanguage();
  const ref = useDishView<HTMLDivElement>(item.id);
  const description = item.description ? t(item.description) : "";
  const has3D = Boolean(item.model3dGlb || item.model3dUsdz);

  return (
    <div className="feature-card" ref={ref}>
      <DishThumb item={item} size="lg" onOpenImage={onOpenImage} />
      <div className="feature-body">
        {item.badge && <span className="feature-kicker">{t(item.badge)}</span>}
        <h3 className="feature-name">{t(item.name)}</h3>
        {description && <p className="feature-desc">{description}</p>}
        <div className="feature-foot">
          {item.price && <span className="feature-price">{item.price}</span>}
          {item.hasVideo && (
            <PlayButton
              label={t({ fr: "Voir la vidéo du plat", en: "Watch dish video", es: "Ver el vídeo del plato", zh: "观看菜品视频" })}
              onClick={() => onPlay(item)}
            />
          )}
          {has3D && (
            <View3DButton
              label={t({ fr: "Voir le plat en 3D", en: "View dish in 3D", es: "Ver el plato en 3D", zh: "查看 3D 菜品" })}
              onClick={() => onView3D(item)}
            />
          )}
        </div>
        {item.addons && item.addons.length > 0 && (
          <ul className="mitem-addons">
            {item.addons.map((addon, i) => (
              <li className="mitem-addon" key={i}>
                <span className="mitem-addon-name">+ {addon.name}</span>
                {addon.price && <span className="mitem-addon-price">{addon.price}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
