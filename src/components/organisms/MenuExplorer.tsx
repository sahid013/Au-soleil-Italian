"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { MenuData, MenuItem } from "@/lib/types";
import { trackScan } from "@/lib/analytics";
import { MenuPanel } from "./MenuPanel";
import { VideoLightbox } from "./VideoLightbox";
import { ImageLightbox } from "./ImageLightbox";
import { Model3DLightbox } from "./Model3DLightbox";

/**
 * The interactive heart of the menu page: a sticky tab bar, one panel per
 * category, and the video lightbox. Every tab and dish comes from the
 * API-driven `menu` (see lib/menu.ts), so the menu is purely data-driven.
 */
export function MenuExplorer({ menu }: { menu: MenuData }) {
  const { t } = useLanguage();
  const tabsWrapRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  const [activeTab, setActiveTab] = useState(menu.categories[0]?.id ?? "");
  const [activeVideo, setActiveVideo] = useState<MenuItem | null>(null);
  const [activeImage, setActiveImage] = useState<MenuItem | null>(null);
  const [activeModel, setActiveModel] = useState<MenuItem | null>(null);

  // Fire a single "scan" event when the menu page first loads.
  useEffect(() => {
    trackScan();
  }, []);

  function activate(id: string) {
    setActiveTab(id);
    // After the first interaction, scroll the tab bar into view if the user
    // has scrolled past it (mirrors the original behaviour).
    if (readyRef.current && tabsWrapRef.current) {
      const y = tabsWrapRef.current.getBoundingClientRect().top + window.scrollY - 70;
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: "smooth" });
    }
    readyRef.current = true;
  }

  const tabs = menu.categories.map((c) => ({ id: c.id, label: t(c.title) }));

  return (
    <section className="menu-wrap" id="menu">
      <div className="menu-tabs-wrap" ref={tabsWrapRef}>
        <div className="shell">
          <div className="menu-tabs" role="tablist" aria-label="Catégories de la carte">
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
          <AnimatePresence mode="wait">
            {menu.categories
              .filter((category) => category.id === activeTab)
              .map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <MenuPanel
                    category={category}
                    active
                    onPlay={setActiveVideo}
                    onOpenImage={setActiveImage}
                    onView3D={setActiveModel}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      <VideoLightbox item={activeVideo} onClose={() => setActiveVideo(null)} />
      <ImageLightbox item={activeImage} onClose={() => setActiveImage(null)} />
      <Model3DLightbox item={activeModel} onClose={() => setActiveModel(null)} />
    </section>
  );
}
