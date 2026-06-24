"use client";

import { useLanguage } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";
import { PhoneIcon, SocialIcon } from "@/components/atoms/icons";

/** Site footer: brand blurb, explore links, social, and legal line. */
export function Footer({ site }: { site: SiteData }) {
  const { t } = useLanguage();
  const { brand, footer, nav, social, contact } = site;

  return (
    <footer className="footer">
      <div className="shell">
        <div className="top">
          <div>
            <img className="footer-logo" src="/logo-nav.svg" alt={brand.name} width={186} height={56} />
            <p>{t(footer.blurb)}</p>
          </div>

          <div>
            <h4>{t(footer.exploreTitle)}</h4>
            <div className="lk">
              {nav.map((link) => (
                <a key={t(link.label)} href={link.href}>
                  {t(link.label)}
                </a>
              ))}
              <a href={contact.website} target="_blank" rel="noopener noreferrer">
                {contact.websiteLabel}
              </a>
            </div>
          </div>

          <div>
            <h4>{t(footer.followTitle)}</h4>
            <div className="lk">
              {social.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                  <SocialIcon type={s.type} className="ic" />
                  {s.label}
                </a>
              ))}
              <a href={`tel:${contact.phone}`}>
                <PhoneIcon className="ic" />
                {t({ fr: "Réserver par téléphone", en: "Book by phone", es: "Reservar por teléfono", zh: "电话预订" })}
              </a>
            </div>
          </div>
        </div>

        <div className="bottom">
          <span>© {new Date().getFullYear()} {brand.name}</span>
          <span>{t(footer.legal)}</span>
        </div>
      </div>
    </footer>
  );
}
