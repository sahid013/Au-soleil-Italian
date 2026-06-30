"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { MenuData, MenuItem } from "@/lib/types";
import { ChevronIcon } from "@/components/atoms/icons";

/** Tag (case-insensitive) that flags a dish for the highlights carousel. */
const HIGHLIGHT_TAG = "carrousel";
/** Horizontal gap between cards, in px — must match `.cdh-track` gap in CSS. */
const GAP = 22;

/** Cards visible at once, based on the viewport width of the carousel. */
function perViewFor(width: number): number {
  if (width >= 900) return 3;
  if (width >= 600) return 2;
  return 1;
}

/** Flatten every category's items, keeping dishes tagged for the carousel. */
function pickHighlights(menu: MenuData): MenuItem[] {
  const seen = new Set<string>();
  const out: MenuItem[] = [];
  for (const category of menu.categories) {
    for (const item of category.items) {
      const tagged = item.tags?.some((tag) => tag.trim().toLowerCase() === HIGHLIGHT_TAG);
      if (!tagged) continue;
      const key = item.id ?? item.name;
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

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [index, setIndex] = useState(0);

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
  const maxIndex = Math.max(0, items.length - perView);

  // Keep the index in range when the viewport (and so perView) changes.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  if (items.length === 0) return null;

  const cardWidth = viewportWidth > 0 ? (viewportWidth - GAP * (perView - 1)) / perView : 0;
  const offset = -index * (cardWidth + GAP);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const go = (next: number) => setIndex(Math.max(0, Math.min(next, maxIndex)));

  return (
    <section className="cdh" aria-roledescription="carousel" aria-label={t({ fr: "Nos coups de cœur", en: "Our favourites", es: "Nuestros favoritos", zh: "我们的心头好" })}>
      <div className="shell">
        <h2 className="cdh-title">
          {t({ fr: "Nos coups de cœur", en: "Our favourites", es: "Nuestros favoritos", zh: "我们的心头好" })}
        </h2>

        <div className="cdh-stage">
          <button
            type="button"
            className="cdh-arrow cdh-arrow--prev"
            onClick={() => go(index - 1)}
            disabled={!canPrev}
            aria-label={t({ fr: "Précédent", en: "Previous", es: "Anterior", zh: "上一个" })}
          >
            <ChevronIcon />
          </button>

          <div className="cdh-viewport" ref={viewportRef}>
            <motion.ul
              className="cdh-track"
              animate={{ x: offset }}
              transition={{ type: "spring", stiffness: 260, damping: 34 }}
            >
              {items.map((item) => (
                <li
                  className="cdh-card"
                  key={item.id ?? item.name}
                  style={cardWidth ? { width: cardWidth } : undefined}
                >
                  <HighlightMedia item={item} />
                  <div className="cdh-foot">
                    <span className="cdh-name">{item.name}</span>
                    {item.price && <span className="cdh-price">{item.price}</span>}
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>

          <button
            type="button"
            className="cdh-arrow cdh-arrow--next"
            onClick={() => go(index + 1)}
            disabled={!canNext}
            aria-label={t({ fr: "Suivant", en: "Next", es: "Siguiente", zh: "下一个" })}
          >
            <ChevronIcon />
          </button>
        </div>

        {maxIndex > 0 && (
          <div className="cdh-dots" role="tablist">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`cdh-dot${i === index ? " is-active" : ""}`}
                aria-label={t({ fr: `Aller à la diapositive ${i + 1}`, en: `Go to slide ${i + 1}`, es: `Ir a la diapositiva ${i + 1}`, zh: `前往第 ${i + 1} 张` })}
                aria-selected={i === index}
                role="tab"
                onClick={() => go(i)}
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
        <img className="cdh-video" src={item.image} alt={item.name} loading="lazy" />
      ) : (
        <div className="cdh-video cdh-media--empty" aria-hidden="true" />
      )}
      {item.badge && <span className="cdh-badge">{item.badge}</span>}
    </div>
  );
}
