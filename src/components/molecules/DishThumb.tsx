"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { ExpandIcon } from "@/components/atoms/icons";

/**
 * Square dish thumbnail used in the menu panel (both the featured cards and the
 * compact list rows). Renders only when the dish has a photo — dishes without an
 * image show no preview at all. When the dish also has a video the thumbnail is a
 * button that opens the lightbox, marked with a small expand glyph.
 */
export function DishThumb({
  item,
  size = "sm",
  onPlay,
}: {
  item: MenuItemType;
  size?: "sm" | "lg";
  onPlay: (item: MenuItemType) => void;
}) {
  const { t } = useLanguage();
  const playable = Boolean(item.hasVideo);

  // No photo → no preview thumbnail (the round play button still offers video).
  if (!item.image) return null;

  const inner = (
    <>
      <img className="dish-thumb-img" src={item.image} alt={item.name} loading="lazy" />
      {playable && (
        <span className="dish-thumb-expand" aria-hidden="true">
          <ExpandIcon />
        </span>
      )}
    </>
  );

  if (playable) {
    return (
      <motion.button
        type="button"
        className={`dish-thumb dish-thumb--${size} is-playable`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        onClick={() => onPlay(item)}
        aria-label={t({ fr: "Voir la vidéo du plat", en: "Watch dish video", es: "Ver el vídeo del plato", zh: "观看菜品视频" })}
      >
        {inner}
      </motion.button>
    );
  }

  return <span className={`dish-thumb dish-thumb--${size}`} aria-hidden="true">{inner}</span>;
}
