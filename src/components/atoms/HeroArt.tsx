"use client";

import { useEffect, useRef } from "react";

/**
 * Floating hero artwork slot. Renders one of:
 *  - a looping muted video (`video`),
 *  - an image (`src`),
 *  - a styled placeholder (neither).
 * Positioning/tilt comes from `className` (see globals.css). When `spin` is set
 * the element rotates with scroll (used for the round pizzas), honouring
 * prefers-reduced-motion. Purely decorative → hidden from assistive tech.
 */
export function HeroArt({
  shape,
  className,
  label,
  src,
  alt,
  video,
  spin,
  straightenFrom,
}: {
  shape: "circle" | "frame";
  className?: string;
  label?: string;
  src?: string;
  alt?: string;
  video?: string;
  /** round media: rotate continuously with scroll */
  spin?: boolean;
  /** framed media: start tilted at this many degrees and straighten to 0 on scroll */
  straightenFrom?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const active = spin || straightenFrom != null;
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      let deg: number;
      if (spin) {
        // continuous, gentle spin (≈360° per ~3000px)
        deg = y * 0.12;
      } else {
        // ease the tilt to 0 over the first ~600px of scroll
        const progress = Math.max(0, 1 - y / 600);
        deg = (straightenFrom ?? 0) * progress;
      }
      el.style.setProperty("--rot", `${deg}deg`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [spin, straightenFrom]);

  const filled = Boolean(src || video);
  const cls = ["hero-art", `hero-art--${shape}`, filled ? "hero-art--filled" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <figure ref={ref} className={cls} aria-hidden="true">
      {video ? (
        <video src={video} autoPlay loop muted playsInline preload="metadata" />
      ) : src ? (
        <img src={src} alt={alt ?? ""} />
      ) : (
        <span className="hero-art-ph">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {label ? <span className="hero-art-label">{label}</span> : null}
        </span>
      )}
    </figure>
  );
}
