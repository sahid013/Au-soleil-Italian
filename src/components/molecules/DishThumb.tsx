"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { ExpandIcon } from "@/components/atoms/icons";

/**
 * Square dish thumbnail used in the menu panel (both the featured cards and the
 * compact list rows). Renders only when the dish has a photo — dishes without an
 * image show no preview at all. Clicking the thumbnail (or its expand glyph)
 * opens the photo in the image lightbox; dish video is opened separately via the
 * round play button.
 */
export function DishThumb({
  item,
  size = "sm",
  onOpenImage,
}: {
  item: MenuItemType;
  size?: "sm" | "lg";
  onOpenImage: (item: MenuItemType) => void;
}) {
  const { t } = useLanguage();

  // No photo → no preview thumbnail.
  if (!item.image) return null;

  return (
    <motion.button
      type="button"
      className={`dish-thumb dish-thumb--${size} is-playable`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={() => onOpenImage(item)}
      aria-label={t({ fr: "Agrandir la photo", en: "Enlarge photo", es: "Ampliar la foto", zh: "放大照片" })}
    >
      <img className="dish-thumb-img" src={item.image} alt={t(item.name)} loading="lazy" />
      <span className="dish-thumb-expand" aria-hidden="true">
        <ExpandIcon />
      </span>
    </motion.button>
  );
}
