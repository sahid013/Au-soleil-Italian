"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { Rule } from "@/components/atoms/Rule";

/** Loop only the first N seconds of the hero video. */
const HERO_LOOP_END = 33;

/**
 * Hero header for the menu page: a full-bleed background presentation video
 * with a centred Cinzel title (the lowercase renders as small-caps, hence
 * "La Carte" → LA CARTE).
 */
export function PageHead() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restart at 0 once playback passes HERO_LOOP_END, so only the first
  // ~33s loop and everything after is skipped.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (video.currentTime >= HERO_LOOP_END) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  return (
    <section className="page-head">
      <div className="hero-sky" />

      {/* Background presentation video (muted autoplay, loops first ~33s). */}
      <video
        ref={videoRef}
        className="hero-bg"
        src="/Video_presentation_restaurant.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="shell">
        <div className="hero-copy">
          <h1 className="hero-title">La Carte</h1>
          <p>
            {t({
              fr: "Pâtes fraîches, pizzas pétries sur place et produits transalpins. Tous nos plats sont préparés maison, avec générosité, sous le soleil.",
              en: "Fresh pasta, dough kneaded in-house and finest Italian produce. Every dish is made in our kitchen, with generosity, under the sun.",
              es: "Pasta fresca, masa amasada en casa y los mejores productos italianos. Todos nuestros platos se preparan en casa, con generosidad, bajo el sol.",
              zh: "新鲜面食、现场手工揉制的披萨面团和精选意大利食材。我们的每道菜都在自家厨房用心烹制，沐浴阳光。",
            })}
          </p>
          <Rule style={{ maxWidth: 300, margin: "24px auto 0" }} />
        </div>
      </div>
    </section>
  );
}
