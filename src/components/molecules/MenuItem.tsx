"use client";

import { useLanguage } from "@/lib/i18n";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { useDishView } from "@/lib/useDishView";
import { NewTag } from "@/components/atoms/NewTag";
import { PlayButton } from "@/components/atoms/PlayButton";
import { DishThumb } from "./DishThumb";

/**
 * A compact dish row in the lower (two-column) part of a category panel: a small
 * square thumbnail, the name (+ optional badge / prep time) with a dotted leader
 * to the price, and a description line. `onPlay` opens the dish video lightbox
 * (also reachable by tapping the thumbnail when the dish has a video).
 */
export function MenuItem({
  item,
  onPlay,
  onOpenImage,
}: {
  item: MenuItemType;
  onPlay: (item: MenuItemType) => void;
  onOpenImage: (item: MenuItemType) => void;
}) {
  const { t, lang } = useLanguage();
  const description = item.description ? item.description[lang] : "";
  const ref = useDishView<HTMLDivElement>(item.id);

  return (
    <div className="mitem" ref={ref}>
      <DishThumb item={item} size="sm" onOpenImage={onOpenImage} />
      <div className="mbody">
        <div className="r1">
          <span className="nm">
            {item.name}
            {item.badge && <NewTag label={item.badge} />}
            {item.time && <span className="mtime"> · {item.time}</span>}
          </span>
          {item.hasVideo && (
            <PlayButton
              label={t({ fr: "Voir la vidéo du plat", en: "Watch dish video", es: "Ver el vídeo del plato", zh: "观看菜品视频" })}
              onClick={() => onPlay(item)}
            />
          )}
          <span className="lead-dots" />
          {item.price && <span className="pr">{item.price}</span>}
        </div>
        {description && <div className="ds">{description}</div>}
      </div>
    </div>
  );
}
