"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { ButtonLink } from "@/components/atoms/Button";

/** Loop only the first N seconds of the presentation video. */
const HERO_LOOP_END = 33;

/**
 * Menu page intro: a centred Cinzel title + description with a "See menu"
 * CTA that jumps to the menu section, followed by the presentation video
 * (muted autoplay, loops the first ~33s).
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
    <>
      <section className="page-head">
        <div className="shell">
          <div className="hero-copy">
            <h1 className="hero-title">La Carte</h1>
            <p>
              {t({
                fr: "Pâtes fraîches, pizzas pétries sur place et produits transalpins. Plats préparés maison, avec générosité, sous le soleil.",
                en: "Fresh pasta, dough kneaded in-house and finest Italian produce. Made in our kitchen, with generosity, under the sun.",
                es: "Pasta fresca, masa amasada en casa y los mejores productos italianos. Platos preparados en casa, con generosidad, bajo el sol.",
                zh: "新鲜面食、现场手工揉制的披萨面团和精选意大利食材。自家厨房用心烹制，沐浴阳光。",
              })}
            </p>
            <ButtonLink variant="olive" href="#menu" className="hero-cta">
              {t({ fr: "Voir la carte", en: "See menu", es: "Ver la carta", zh: "查看菜单" })}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Presentation video (muted autoplay, loops first ~33s). */}
      <section className="hero-video-section">
        <div className="shell">
          <video
            ref={videoRef}
            className="hero-video"
            src="/Video_presentation_restaurant.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>
      </section>
    </>
  );
}
