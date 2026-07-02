"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { MenuData, MenuItem } from "@/lib/types";
import { ChevronIcon } from "@/components/atoms/icons";

/** Tag (case-insensitive) that flags a dish for the highlights carousel. */
const HIGHLIGHT_TAG = "carrousel";
/** Horizontal gap between cards, in px — must match `.cdh-track` gap in CSS. */
const GAP = 22;
/** Tighter gap used on mobile — must match the `.cdh-track` mobile gap in CSS. */
const MOBILE_GAP = 8;
/** Mobile ticker speed, in px per second. */
const TICKER_SPEED = 28;

/** Wrap `v` into the half-open range [min, max) (for the seamless loop). */
function wrapValue(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/** Cards visible at once, based on the viewport width of the carousel. */
function perViewFor(width: number): number {
  if (width >= 900) return 3;
  return 2; // tablet & mobile: two at a time (mobile swipes to scroll)
}

/**
 * Flatten every category's items, keeping dishes that are BOTH tagged for the
 * carousel AND have a video. A dish tagged "Carrousel" but without a `videoUrl`
 * is skipped, so no blank cards ever show.
 */
function pickHighlights(menu: MenuData): MenuItem[] {
  const seen = new Set<string>();
  const out: MenuItem[] = [];
  for (const category of menu.categories) {
    for (const item of category.items) {
      const tagged = item.tags?.some((tag) => tag.trim().toLowerCase() === HIGHLIGHT_TAG);
      const hasVideo = Boolean(item.videoUrl ?? item.videoSrc);
      if (!tagged || !hasVideo) continue;
      const key = item.id ?? item.name.fr;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

/**
 * "Nos coups de cœur" — a horizontally sliding carousel of the dishes the
 * restaurant tagged "Carrousel". Each card autoplays its dish video (muted,
 * looping) with the dish name + price, and the track glides between pages with
 * a framer-motion spring. Renders nothing when no dish is tagged.
 */
export function HighlightsCarousel({ menu }: { menu: MenuData }) {
  const { t } = useLanguage();
  const items = useMemo(() => pickHighlights(menu), [menu]);

  // On mobile the carousel becomes a continuous right-to-left ticker (native
  // scroll auto-advanced each frame): still swipeable, no arrows, dots below.
  const isMobile = useMediaQuery("(max-width: 760px)");

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [page, setPage] = useState(0);
  // Active (real) card index on mobile, driven by the ticker position.
  const [tickIndex, setTickIndex] = useState(0);

  // Swipe state for the mobile ticker: while the finger is down the track
  // follows it; on release the fling speed is added to the base drift and then
  // decays back to it.
  const draggingRef = useRef(false);
  const flingRef = useRef(0); // extra px/s velocity from a swipe, decaying
  const dragStartXRef = useRef(0);
  const dragStartTrackRef = useRef(0);
  const lastMoveXRef = useRef(0);
  const lastMoveTRef = useRef(0);

  // Track the viewport width so card width / cards-per-view stay responsive.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const perView = perViewFor(viewportWidth || 900);
  const gap = isMobile ? MOBILE_GAP : GAP;
  // The carousel moves a full page (perView cards) at a time.
  const pageCount = Math.max(1, Math.ceil(items.length / perView));
  const maxStart = Math.max(0, items.length - perView);
  const cardWidth = viewportWidth > 0 ? (viewportWidth - gap * (perView - 1)) / perView : 0;
  const step = cardWidth + gap;
  const period = items.length * step; // width of one full set of cards

  // Keep the page in range when the viewport (and so perView) changes.
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  // Mobile ticker: drift the track leftward at a constant speed via a GPU
  // transform (motion value → translateX), wrapping by one full set for a
  // seamless loop. No layout reads/writes, so the motion stays smooth. A swipe
  // adds a decaying fling velocity on top of the base drift. The dot index is
  // updated from React state only when it actually changes.
  const trackX = useMotionValue(0);
  const syncDot = (x: number) => {
    const idx = wrapValue(0, items.length, Math.round(-x / step)) | 0;
    setTickIndex((prev) => (prev === idx ? prev : idx));
  };
  useAnimationFrame((_, delta) => {
    if (!isMobile || period <= 0 || draggingRef.current) return;
    const dt = delta / 1000;
    // Ease the swipe fling back toward the steady ticker speed.
    flingRef.current *= Math.exp(-dt / 0.9);
    if (Math.abs(flingRef.current) < 2) flingRef.current = 0;
    const dx = (-TICKER_SPEED + flingRef.current) * dt;
    const next = wrapValue(-period, 0, trackX.get() + dx);
    trackX.set(next);
    syncDot(next);
  });

  if (items.length === 0) return null;

  // Start index of the current page, clamped so the last page aligns to the end
  // instead of leaving a trailing gap (e.g. 7 items / 3 per view → last page
  // shows items 5–7, not 7 alone).
  const startIndex = Math.min(page * perView, maxStart);
  const offset = -startIndex * (cardWidth + gap);
  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  // Mobile renders the cards twice for a seamless loop.
  const trackItems = isMobile ? [...items, ...items] : items;

  const go = (next: number) => setPage(Math.max(0, Math.min(next, pageCount - 1)));
  // Mobile: jump the ticker so card `i` sits at the left edge.
  const jumpToDot = (i: number) => trackX.set(wrapValue(-period, 0, -i * step));

  // Swipe handlers (mobile only): the track follows the finger, and the release
  // velocity is handed to the frame loop as a decaying fling.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isMobile) return;
    draggingRef.current = true;
    flingRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragStartTrackRef.current = trackX.get();
    lastMoveXRef.current = e.clientX;
    lastMoveTRef.current = performance.now();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isMobile || !draggingRef.current) return;
    const next = wrapValue(-period, 0, dragStartTrackRef.current + (e.clientX - dragStartXRef.current));
    trackX.set(next);
    syncDot(next);
    const now = performance.now();
    const dtMs = now - lastMoveTRef.current;
    if (dtMs > 0) flingRef.current = ((e.clientX - lastMoveXRef.current) / dtMs) * 1000;
    lastMoveXRef.current = e.clientX;
    lastMoveTRef.current = now;
  };
  const endDrag = () => {
    // If the finger paused before lifting, don't carry a stale fling velocity.
    if (performance.now() - lastMoveTRef.current > 120) flingRef.current = 0;
    draggingRef.current = false; // frame loop resumes with the fling velocity
  };

  // On desktop the track springs between pages; on mobile it's the ticker
  // transform driven by `trackX` each frame.
  const trackProps = isMobile
    ? { style: { x: trackX } }
    : { animate: { x: offset }, transition: { type: "spring" as const, stiffness: 260, damping: 34 } };

  return (
    <section className="cdh" aria-roledescription="carousel" aria-label={t({ fr: "Nos coups de cœur", en: "Our favourites", es: "Nuestros favoritos", zh: "我们的心头好" })}>
      <div className="shell">
        <h2 className="cdh-title">
          {t({ fr: "Nos coups de cœur", en: "Our favourites", es: "Nuestros favoritos", zh: "我们的心头好" })}
        </h2>

        <div className="cdh-stage">
          {!isMobile && (
            <button
              type="button"
              className="cdh-arrow cdh-arrow--prev"
              onClick={() => go(page - 1)}
              disabled={!canPrev}
              aria-label={t({ fr: "Précédent", en: "Previous", es: "Anterior", zh: "上一个" })}
            >
              <ChevronIcon />
            </button>
          )}

          <div
            className={`cdh-viewport${isMobile ? " is-swipe" : ""}`}
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <motion.ul className="cdh-track" {...trackProps}>
              {/* Wait until the viewport is measured so cards get their real
                  width up front — avoids a flash of one full-width, over-tall
                  card before the layout settles. */}
              {cardWidth > 0 &&
                trackItems.map((item, i) => (
                  <li
                    className="cdh-card"
                    key={`${item.id ?? item.name.fr}-${i}`}
                    style={{ width: cardWidth }}
                    aria-hidden={isMobile && i >= items.length}
                  >
                    <HighlightMedia item={item} />
                    <div className="cdh-foot">
                      <span className="cdh-name">{t(item.name)}</span>
                      {item.price && <span className="cdh-price">{item.price}</span>}
                    </div>
                  </li>
                ))}
            </motion.ul>
          </div>

          {!isMobile && (
            <button
              type="button"
              className="cdh-arrow cdh-arrow--next"
              onClick={() => go(page + 1)}
              disabled={!canNext}
              aria-label={t({ fr: "Suivant", en: "Next", es: "Siguiente", zh: "下一个" })}
            >
              <ChevronIcon />
            </button>
          )}
        </div>

        {!isMobile && pageCount > 1 && (
          <div className="cdh-dots" role="tablist">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`cdh-dot${i === page ? " is-active" : ""}`}
                aria-label={t({ fr: `Aller à la page ${i + 1}`, en: `Go to page ${i + 1}`, es: `Ir a la página ${i + 1}`, zh: `前往第 ${i + 1} 页` })}
                aria-selected={i === page}
                role="tab"
                onClick={() => go(i)}
              />
            ))}
          </div>
        )}

        {isMobile && items.length > 1 && (
          <div className="cdh-dots" role="tablist">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`cdh-dot${i === tickIndex ? " is-active" : ""}`}
                aria-label={t({ fr: `Aller à la diapositive ${i + 1}`, en: `Go to slide ${i + 1}`, es: `Ir a la diapositiva ${i + 1}`, zh: `前往第 ${i + 1} 张` })}
                aria-selected={i === tickIndex}
                role="tab"
                onClick={() => jumpToDot(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Card media: a looping muted dish video when available, else the photo. */
function HighlightMedia({ item }: { item: MenuItem }) {
  const { t } = useLanguage();
  const src = item.videoUrl ?? item.videoSrc;
  return (
    <div className="cdh-media">
      {src ? (
        <video
          className="cdh-video"
          src={src}
          poster={item.poster ?? item.image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : item.image ? (
        <img className="cdh-video" src={item.image} alt={t(item.name)} loading="lazy" />
      ) : (
        <div className="cdh-video cdh-media--empty" aria-hidden="true" />
      )}
      {item.badge && <span className="cdh-badge">{item.badge}</span>}
    </div>
  );
}
