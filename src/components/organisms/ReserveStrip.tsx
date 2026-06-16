"use client";

import { useLanguage } from "@/lib/i18n";
import type { SiteData } from "@/lib/types";
import { Reveal } from "@/components/molecules/Reveal";
import { InfoRow } from "@/components/molecules/InfoRow";
import { ButtonLink } from "@/components/atoms/Button";
import { GlobeIcon, PhoneIcon, PinIcon } from "@/components/atoms/icons";

/** Olive "reserve your table" strip with contact info and an hours card. */
export function ReserveStrip({ site }: { site: SiteData }) {
  const { t } = useLanguage();
  const { contact, hours, reserve } = site;

  return (
    <section className="visit" id="visiter">
      <div className="shell">
        <Reveal>
          <span className="kicker">{t(reserve.kicker)}</span>
          <h2>{t(reserve.title)}</h2>
          <p>{t(reserve.text)}</p>

          <div className="info">
            <InfoRow icon={<PinIcon className="ic" />} label={t({ fr: "Adresse", en: "Address" })}>
              <span className="muted">{t(contact.address)}</span>
            </InfoRow>
            <InfoRow icon={<PhoneIcon className="ic" />} label={t({ fr: "Téléphone", en: "Telephone" })}>
              <span className="muted">{t(contact.phoneNote)}</span>
            </InfoRow>
            <InfoRow icon={<GlobeIcon className="ic" />} label={t({ fr: "En ligne", en: "Online" })}>
              <a href={contact.website} target="_blank" rel="noopener noreferrer">
                {contact.websiteLabel}
              </a>
            </InfoRow>
          </div>
        </Reveal>

        <Reveal className="visit-card">
          <div className="scr">{reserve.welcome}</div>
          <div className="days">{t(hours.days)}</div>
          <div className="hours">{t(hours.service)}</div>
          <div className="closed">{t(hours.closed)}</div>
          <a className="phone" href={`tel:${contact.phone}`}>
            {contact.phoneDisplay}
          </a>
          <ButtonLink variant="primary" href={`tel:${contact.phone}`}>
            {t({ fr: "Appeler pour réserver", en: "Call to book" })}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
