"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import type { MenuItem } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { CloseIcon, PlayIcon } from "@/components/atoms/icons";

/**
 * Dish-video lightbox. Open by passing an `item`; close via `onClose`.
 * Looks for a clip at /videos/<slug>.mp4 and shows an elegant poster
 * fallback until it loads (so the UI works before videos are added).
 */
export function VideoLightbox({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { t, lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const open = item !== null;

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    setVideoReady(false);
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

  if (!item) return null;

  const src = `/videos/${slugify(item.name)}.mp4`;
  const description = item.description ? item.description[lang] : "";

  return (
    <div className="vmodal open" aria-hidden={false}>
      <div className="vmodal-scrim" onClick={onClose} />
      <div className="vmodal-box" role="dialog" aria-modal="true" aria-label={item.name}>
        <button className="vmodal-close" type="button" onClick={onClose} aria-label={t({ fr: "Fermer", en: "Close" })}>
          <CloseIcon />
        </button>

        <div className="vframe">
          {!videoReady && (
            <div className="vplaceholder">
              <span className="vsun" />
              <span className="vplay">
                <PlayIcon />
              </span>
              <span className="vph-name">{item.name}</span>
              <span className="vph-soon">{t({ fr: "Vidéo du plat bientôt disponible", en: "Dish video coming soon" })}</span>
            </div>
          )}
          <video
            ref={videoRef}
            className="vvid"
            playsInline
            controls
            preload="metadata"
            src={src}
            style={{ display: videoReady ? "block" : "none" }}
            onLoadedData={() => {
              setVideoReady(true);
              videoRef.current?.play().catch(() => {});
            }}
          />
        </div>

        <div className="vmeta">
          <span className="vkicker">{t({ fr: "Le plat en vidéo", en: "The dish on film" })}</span>
          <div className="vname">{item.name}</div>
          {description && <div className="vdesc">{description}</div>}
          {item.price && <div className="vprice">{item.price}</div>}
        </div>
      </div>
    </div>
  );
}
