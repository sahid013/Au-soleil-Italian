"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { MenuItem } from "@/lib/types";
import { CloseIcon } from "@/components/atoms/icons";

/**
 * Simple dish-photo lightbox: opens the dish image at a larger size, with no
 * title or price. Open by passing an `item` (with an `image`); close via
 * `onClose`. Separate from the video lightbox — the play button opens video,
 * the thumbnail / expand icon opens this.
 */
export function ImageLightbox({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { t } = useLanguage();
  const open = item !== null && Boolean(item?.image);

  // Lock body scroll and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="imodal open"
          aria-hidden={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="imodal-scrim" onClick={onClose} />
          <motion.div
            className="imodal-box"
            role="dialog"
            aria-modal="true"
            aria-label={t(item.name)}
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <button
              className="imodal-close"
              type="button"
              onClick={onClose}
              aria-label={t({ fr: "Fermer", en: "Close", es: "Cerrar", zh: "关闭" })}
            >
              <CloseIcon />
            </button>
            <img className="imodal-img" src={item.image} alt={t(item.name)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
