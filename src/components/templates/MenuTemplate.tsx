"use client";

import type { MenuData, SiteData } from "@/lib/types";
import { LanguageProvider } from "@/lib/i18n";
import { Navbar } from "@/components/organisms/Navbar";
import { PageHead } from "@/components/organisms/PageHead";
import { HighlightsCarousel } from "@/components/organisms/HighlightsCarousel";
import { MenuExplorer } from "@/components/organisms/MenuExplorer";
import { ReserveStrip } from "@/components/organisms/ReserveStrip";
import { Footer } from "@/components/organisms/Footer";

/**
 * Page-level template: wires the whole menu page together and provides the
 * language context. Data is injected as props (fetched server-side in
 * app/page.tsx) so this stays a pure composition layer.
 */
export function MenuTemplate({ menu, site }: { menu: MenuData; site: SiteData }) {
  return (
    <LanguageProvider>
      <Navbar site={site} />
      <main>
        <PageHead />
        <HighlightsCarousel menu={menu} />
        <MenuExplorer menu={menu} />
        <ReserveStrip site={site} />
      </main>
      <Footer site={site} />
    </LanguageProvider>
  );
}
