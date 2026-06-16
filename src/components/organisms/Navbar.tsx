"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";
import { LangToggle } from "@/components/atoms/LangToggle";
import { ButtonLink } from "@/components/atoms/Button";
import { MenuIcon, PhoneIcon } from "@/components/atoms/icons";

/** Sticky top navigation: brand, links, language toggle and a "book" CTA. */
export function Navbar({ site }: { site: SiteData }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="shell nav-in">
        <a className="brand" href="/" aria-label={`${site.brand.name} — accueil`}>
          <img className="brand-logo" src="/logo-nav.svg" alt={site.brand.name} width={186} height={56} />
        </a>

        <nav className={`nav-links${open ? " open" : ""}`} aria-label="Navigation principale">
          <LangToggle />

          <ButtonLink variant="primary" href={`tel:${site.contact.phone}`} onClick={close}>
            <PhoneIcon className="ic" />
            {t({ fr: "Réserver", en: "Book a table" })}
          </ButtonLink>
        </nav>

        <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
