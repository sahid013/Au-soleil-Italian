"use client";

import { useLanguage } from "@/lib/i18n";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { NewTag } from "@/components/atoms/NewTag";
import { PlayButton } from "@/components/atoms/PlayButton";

/**
 * A single dish row: name (+ optional NEW badge / prep time), an optional
 * video button, dotted leader, price, and a description line.
 * `onPlay` is called with the item when its video button is clicked.
 */
export function MenuItem({ item, onPlay }: { item: MenuItemType; onPlay: (item: MenuItemType) => void }) {
  const { t, lang } = useLanguage();
  const description = item.description ? item.description[lang] : "";

  return (
    <div className="mitem">
      {item.image && <img className="mthumb" src={item.image} alt={item.name} loading="lazy" />}
      <div className="mbody">
        <div className="r1">
          <span className="nm">
            {item.name}
            {item.isNew && <NewTag />}
            {item.time && <span className="mtime"> · {item.time}</span>}
          </span>
          {item.hasVideo && (
            <PlayButton label={t({ fr: "Voir la vidéo du plat", en: "Watch dish video" })} onClick={() => onPlay(item)} />
          )}
          <span className="lead-dots" />
          {item.price && <span className="pr">{item.price}</span>}
        </div>
        {description && <div className="ds">{description}</div>}
      </div>
    </div>
  );
}
