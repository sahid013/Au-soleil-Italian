"use client";

import { useLanguage } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { useDishView } from "@/lib/useDishView";
import { NewTag } from "@/components/atoms/NewTag";
import { PlayButton } from "@/components/atoms/PlayButton";
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
}: {
  item: MenuItemType;
  onPlay: (item: MenuItemType) => void;
  onOpenImage: (item: MenuItemType) => void;
}) {
  const { t, lang } = useLanguage();
  const description = item.description ? item.description[lang] : "";
  const ref = useDishView<HTMLDivElement>(item.id);
  const isMobile = useMediaQuery("(max-width: 760px)");

  const playButton = item.hasVideo && (
    <PlayButton
      label={t({ fr: "Voir la vidéo du plat", en: "Watch dish video", es: "Ver el vídeo del plato", zh: "观看菜品视频" })}
      onClick={() => onPlay(item)}
    />
  );

  if (isMobile) {
    return (
      <div className="mitem mitem--stack" ref={ref}>
        <DishThumb item={item} size="sm" onOpenImage={onOpenImage} />
        <div className="mbody">
          <span className="nm">
            {item.name}
            {item.time && <span className="mtime"> · {item.time}</span>}
          </span>
          {item.badge && (
            <span className="m-tag">
              <NewTag label={item.badge} />
            </span>
          )}
          {(item.price || playButton) && (
            <span className="m-price-row">
              {item.price && <span className="pr">{item.price}</span>}
              {playButton}
            </span>
          )}
          {description && <div className="ds">{description}</div>}
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
            {item.name}
            {item.badge && <NewTag label={item.badge} />}
            {item.time && <span className="mtime"> · {item.time}</span>}
          </span>
          {playButton}
          <span className="lead-dots" />
          {item.price && <span className="pr">{item.price}</span>}
        </div>
        {description && <div className="ds">{description}</div>}
      </div>
    </div>
  );
}
