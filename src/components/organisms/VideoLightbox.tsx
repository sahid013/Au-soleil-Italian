"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import type { MenuItem } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { trackVideoPlay, trackWatchTime } from "@/lib/analytics";
import { CloseIcon } from "@/components/atoms/icons";

/**
 * Dish-video lightbox. Open by passing an `item`; close via `onClose`.
 * Looks for a clip at /videos/<slug>.mp4 and shows an elegant poster
 * fallback until it loads (so the UI works before videos are added).
 *
 * The clip auto-plays muted + inline so it also starts on iOS Safari,
 * which blocks autoplay for anything with sound.
 *
 * Analytics: fires `video_play` when playback starts and `watch_time`
 * (with seconds watched) when the clip ends, the lightbox closes, or the
 * page is navigated away — once per open.
 */
export function VideoLightbox({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { t, lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Always-current item, so listeners added once still read the latest dish.
  const itemRef = useRef<MenuItem | null>(item);
  itemRef.current = item;
  // Per-open guards so each event fires at most once per video.
  const playSentRef = useRef(false);
  const watchSentRef = useRef(false);

  const open = item !== null;

  // Send watch_time once, using the live playback position. Reads refs only,
  // so it's stable across renders.
  const sendWatchTime = useCallback(() => {
    if (watchSentRef.current) return;
    const id = itemRef.current?.id;
    if (!id) return;
    watchSentRef.current = true;
    trackWatchTime(id, videoRef.current?.currentTime ?? 0);
  }, []);

  const handlePlaying = useCallback(() => {
    const id = itemRef.current?.id;
    if (!id || playSentRef.current) return;
    playSentRef.current = true;
    trackVideoPlay(id);
  }, []);

  const handleClose = useCallback(() => {
    sendWatchTime();
    onClose();
  }, [sendWatchTime, onClose]);

  // Reset ready state + per-open guards whenever a different dish opens.
  useEffect(() => {
    if (!open) return;
    setVideoReady(false);
    playSentRef.current = false;
    watchSentRef.current = false;
  }, [open, item?.id]);

  // Lock body scroll, close on Escape, and flush watch_time on page hide.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    const onHide = () => sendWatchTime();
    document.addEventListener("keydown", onKey);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pagehide", onHide);
    };
  }, [open, handleClose, sendWatchTime]);

  if (!item) return null;

  // Prefer an absolute URL from the backend API; otherwise fall back to a local
  // /videos/ file (explicit filename, then name-slug lookup).
  const src = item.videoSrc ?? (item.video ? `/videos/${item.video}` : `/videos/${slugify(item.name)}.mp4`);
  const description = item.description ? item.description[lang] : "";

  return (
    <div className="vmodal open" aria-hidden={false}>
      <div className="vmodal-scrim" onClick={handleClose} />
      <div className="vmodal-box" role="dialog" aria-modal="true" aria-label={item.name}>
        <button
          className="vmodal-close"
          type="button"
          onClick={handleClose}
          aria-label={t({ fr: "Fermer", en: "Close", es: "Cerrar", zh: "关闭" })}
        >
          <CloseIcon />
        </button>

        <div className="vframe">
          {!videoReady && (
            <div className="vplaceholder">
              <span className="vsun" />
              <span className="vspinner" aria-hidden="true" />
              <span className="vph-name">{item.name}</span>
              <span className="vph-soon">
                {t({ fr: "Chargement de la vidéo…", en: "Loading video…", es: "Cargando vídeo…", zh: "正在加载视频…" })}
              </span>
            </div>
          )}
          <video
            ref={videoRef}
            className="vvid"
            playsInline
            muted
            autoPlay
            controls
            preload="auto"
            poster={item.poster}
            src={src}
            style={{ display: videoReady ? "block" : "none" }}
            onLoadedData={() => {
              setVideoReady(true);
              videoRef.current?.play().catch(() => {});
            }}
            onPlaying={handlePlaying}
            onEnded={sendWatchTime}
          />
        </div>

        <div className="vmeta">
          <span className="vkicker">{t({ fr: "Le plat en vidéo", en: "The dish on film", es: "El plato en vídeo", zh: "菜品视频" })}</span>
          <div className="vname">{item.name}</div>
          {description && <div className="vdesc">{description}</div>}
          {item.price && <div className="vprice">{item.price}</div>}
        </div>
      </div>
    </div>
  );
}
