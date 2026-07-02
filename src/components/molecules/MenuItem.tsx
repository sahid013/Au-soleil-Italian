"use client";

import { useLanguage } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { useDishView } from "@/lib/useDishView";
import { NewTag } from "@/components/atoms/NewTag";
import { PlayButton } from "@/components/atoms/PlayButton";
import { View3DButton } from "@/components/atoms/View3DButton";
import { DishThumb } from "./DishThumb";

/**
 * A compact dish row in the lower part of a category panel.
 *
 * Desktop: name (+ badge / prep time) with a dotted leader to the price, then a
 * description line. Mobile: the fields stack — name, then the tag, then a row
 * with the price and (right of it) the play icon, then the description.
 * `onPlay` opens the dish video lightbox; the thumbnail opens the photo.
 */
export function MenuItem({
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
  const description = item.description ? t(item.description) : "";
  const ref = useDishView<HTMLDivElement>(item.id);
  const isMobile = useMediaQuery("(max-width: 760px)");
  const has3D = Boolean(item.model3dGlb || item.model3dUsdz);

  const playButton = item.hasVideo && (
    <PlayButton
      label={t({ fr: "Voir la vidéo du plat", en: "Watch dish video", es: "Ver el vídeo del plato", zh: "观看菜品视频" })}
      onClick={() => onPlay(item)}
    />
  );

  const view3DButton = has3D && (
    <View3DButton
      label={t({ fr: "Voir le plat en 3D", en: "View dish in 3D", es: "Ver el plato en 3D", zh: "查看 3D 菜品" })}
      onClick={() => onView3D(item)}
    />
  );

  // Dish-specific add-ons, listed inside the card.
  const addons = item.addons && item.addons.length > 0 && (
    <ul className="mitem-addons">
      {item.addons.map((addon, i) => (
        <li className="mitem-addon" key={i}>
          <span className="mitem-addon-name">+ {addon.name}</span>
          {addon.price && <span className="mitem-addon-price">{addon.price}</span>}
        </li>
      ))}
    </ul>
  );

  if (isMobile) {
    return (
      <div className="mitem mitem--stack" ref={ref}>
        <DishThumb item={item} size="sm" onOpenImage={onOpenImage} />
        <div className="mbody">
          <span className="nm">
            {t(item.name)}
            {item.time && <span className="mtime"> · {item.time}</span>}
          </span>
          {item.badge && (
            <span className="m-tag">
              <NewTag label={t(item.badge)} />
            </span>
          )}
          {(item.price || playButton || view3DButton) && (
            <span className="m-price-row">
              {item.price && <span className="pr">{item.price}</span>}
              {playButton}
              {view3DButton}
            </span>
          )}
          {description && <div className="ds">{description}</div>}
          {addons}
        </div>
      </div>
    );
  }

  return (
    <div className="mitem" ref={ref}>
      <DishThumb item={item} size="sm" onOpenImage={onOpenImage} />
      <div className="mbody">
        <div className="r1">
          <span className="nm">
            {t(item.name)}
            {item.badge && <NewTag label={t(item.badge)} />}
            {item.time && <span className="mtime"> · {item.time}</span>}
          </span>
          {playButton}
          {view3DButton}
          <span className="lead-dots" />
          {item.price && <span className="pr">{item.price}</span>}
        </div>
        {description && <div className="ds">{description}</div>}
        {addons}
      </div>
    </div>
  );
}
