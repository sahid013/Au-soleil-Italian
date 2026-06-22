"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { trackDishView } from "@/lib/analytics";
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

  // Fire a "dish_view" event the first time this row scrolls into view.
  // (trackDishView is itself de-duped per dish per page load.)
  const rootRef = useRef<HTMLDivElement>(null);
  const dishId = item.id;
  useEffect(() => {
    if (!dishId) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trackDishView(dishId);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dishId]);

  return (
    <div className="mitem" ref={rootRef}>
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
