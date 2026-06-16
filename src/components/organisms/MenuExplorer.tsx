"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import type { MenuData, MenuItem } from "@/lib/types";
import { MenuPanel } from "./MenuPanel";
import { ExtrasPanel } from "./ExtrasPanel";
import { VideoLightbox } from "./VideoLightbox";

const EXTRAS_ID = "extras";

/**
 * The interactive heart of the menu page: a sticky tab bar, one panel per
 * category (+ the extras panel), the footer notes, and the video lightbox.
 * All content comes from `menu` (the typed MenuData), so adding a category or
 * dish is purely a data edit.
 */
export function MenuExplorer({ menu }: { menu: MenuData }) {
  const { t } = useLanguage();
  const tabsWrapRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  const [activeTab, setActiveTab] = useState(menu.categories[0]?.id ?? EXTRAS_ID);
  const [activeVideo, setActiveVideo] = useState<MenuItem | null>(null);

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

  const tabs = [
    ...menu.categories.map((c) => ({ id: c.id, label: t(c.title) })),
    { id: EXTRAS_ID, label: t({ fr: "Café & Bambino", en: "Coffee & Kids" }) },
  ];

  return (
    <section className="menu-wrap">
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
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="menu-panels">
          {menu.categories.map((category) => (
            <MenuPanel key={category.id} category={category} active={activeTab === category.id} onPlay={setActiveVideo} />
          ))}
          <ExtrasPanel extras={menu.extras} active={activeTab === EXTRAS_ID} onPlay={setActiveVideo} />
        </div>

        <div className="menu-notes">
          <p>{t(menu.notes.main)}</p>
          <p>{t(menu.notes.sub)}</p>
        </div>
      </div>

      <VideoLightbox item={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
