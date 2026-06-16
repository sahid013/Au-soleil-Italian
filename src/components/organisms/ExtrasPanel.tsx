"use client";

import { useLanguage } from "@/lib/i18n";
import type { MenuExtras } from "@/lib/types";
import { PanelHead } from "@/components/molecules/PanelHead";
import { BambinoGroup } from "@/components/molecules/BambinoGroup";

/** The "Coffee & Kids" tab — café gourmand note + children's menu block. */
export function ExtrasPanel({ extras, active }: { extras: MenuExtras; active: boolean }) {
  const { t } = useLanguage();
  const { cafe, bambino } = extras;

  return (
    <div className={`menu-panel${active ? " active" : ""}`} id="panel-extras" role="tabpanel" data-panel="extras" hidden={!active}>
      <PanelHead title={cafe.title} />
      <p className="panel-note" style={{ textAlign: "center", fontSize: "1.1rem" }}>
        {t(cafe.text)}
      </p>

      <PanelHead
        title={bambino.title}
        style={{ marginTop: 48 }}
        noteNode={
          <p className="panel-note">
            {bambino.price} · {t(bambino.age)}
          </p>
        }
      />

      <div className="bambino">
        {bambino.groups.map((group) => (
          <BambinoGroup key={t(group.label)} group={group} />
        ))}
      </div>
    </div>
  );
}
