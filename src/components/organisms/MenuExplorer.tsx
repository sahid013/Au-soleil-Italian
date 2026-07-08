"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { MenuData, MenuItem, MenuVariation } from "@/lib/types";
import { trackScan } from "@/lib/analytics";
import { MenuPanel } from "./MenuPanel";
import { VideoLightbox } from "./VideoLightbox";
import { ImageLightbox } from "./ImageLightbox";
import { Model3DLightbox } from "./Model3DLightbox";

/**
 * The interactive heart of the menu page: a sticky category bar above every
 * category panel stacked one after another on a single, continuously
 * scrollable page. A scroll spy highlights the pill for the section currently
 * under the bar, and clicking a pill smooth-scrolls to that section. Every tab
 * and dish comes from the API-driven `menu` (see lib/menu.ts), so the menu is
 * purely data-driven.
 */
export function MenuExplorer({ menu }: { menu: MenuData }) {
  const { t } = useLanguage();
  const tabsRef = useRef<HTMLDivElement>(null);
  // While a pill click animates the smooth scroll, the scroll spy is locked so
  // the active pill doesn't flicker through the intermediate sections.
  const lockRef = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeTab, setActiveTab] = useState(menu.categories[0]?.id ?? "");
  const [activeVideo, setActiveVideo] = useState<MenuItem | null>(null);
  const [activeImage, setActiveImage] = useState<MenuItem | null>(null);
  const [activeModel, setActiveModel] = useState<MenuItem | null>(null);
  // Salades: the category size options carried alongside the open video/3D dish,
  // shown as title-less pills in the lightbox in place of a per-dish price.
  const [activeVariations, setActiveVariations] = useState<MenuVariation[] | undefined>(undefined);

  const openVideo = (item: MenuItem, variations?: MenuVariation[]) => {
    setActiveVariations(variations);
    setActiveVideo(item);
  };
  const openModel = (item: MenuItem, variations?: MenuVariation[]) => {
    setActiveVariations(variations);
    setActiveModel(item);
  };

  // Fire a single "scan" event when the menu page first loads.
  useEffect(() => {
    trackScan();
  }, []);

  // Scroll spy: highlight the pill for whichever category section is currently
  // sitting under the sticky bar as the user scrolls the stacked panels.
  useEffect(() => {
    const panels = menu.categories
      .map((c) => document.getElementById(`panel-${c.id}`))
      .filter((el): el is HTMLElement => el !== null);
    if (!panels.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-panel");
            if (id) setActiveTab(id);
          }
        }
      },
      // A thin band just below the sticky bar: a section becomes active as its
      // top crosses into that band near the top of the viewport.
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 },
    );
    panels.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, [menu.categories]);

  // Keep the active pill visible within the horizontally-scrolling tab strip
  // (mobile), without nudging the page's own vertical scroll.
  useEffect(() => {
    const wrap = tabsRef.current;
    if (!wrap || wrap.scrollWidth <= wrap.clientWidth) return;
    const btn = wrap.querySelector<HTMLElement>(`[aria-controls="panel-${activeTab}"]`);
    if (!btn) return;
    wrap.scrollTo({ left: btn.offsetLeft - wrap.clientWidth / 2 + btn.offsetWidth / 2, behavior: "smooth" });
  }, [activeTab]);

  // Click a pill: mark it active and smooth-scroll to its section, locking the
  // scroll spy until the animated scroll settles.
  function activate(id: string) {
    setActiveTab(id);
    lockRef.current = true;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      lockRef.current = false;
    }, 700);
    document.getElementById(`panel-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const tabs = menu.categories.map((c) => ({ id: c.id, label: t(c.title) }));

  return (
    <section className="menu-wrap" id="menu">
      <div className="menu-tabs-wrap">
        <div className="shell">
          <div className="menu-tabs" role="tablist" aria-label="Catégories de la carte" ref={tabsRef}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="menu-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => activate(tab.id)}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="menu-tab-pill"
                    className="menu-tab-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="menu-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="menu-panels">
          {menu.categories.map((category) => (
            <MenuPanel
              key={category.id}
              category={category}
              active
              onPlay={openVideo}
              onOpenImage={setActiveImage}
              onView3D={openModel}
            />
          ))}
        </div>
      </div>

      <VideoLightbox item={activeVideo} variations={activeVariations} onClose={() => setActiveVideo(null)} />
      <ImageLightbox item={activeImage} onClose={() => setActiveImage(null)} />
      <Model3DLightbox item={activeModel} variations={activeVariations} onClose={() => setActiveModel(null)} />
    </section>
  );
}
