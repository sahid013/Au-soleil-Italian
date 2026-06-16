"use client";

import { useLanguage } from "@/lib/i18n";
import type { BambinoGroup as BambinoGroupType, MenuItem } from "@/lib/types";
import { PlayButton } from "@/components/atoms/PlayButton";

/** One labelled line inside the children's-menu block. */
export function BambinoGroup({ group, onPlay }: { group: BambinoGroupType; onPlay?: (item: MenuItem) => void }) {
  const { t } = useLanguage();
  return (
    <div className="grp">
      <div className="lab">
        {t(group.label)}
        {group.video && onPlay && (
          <PlayButton
            label={t({ fr: "Voir la vidéo du plat", en: "Watch dish video" })}
            onClick={() => onPlay({ name: t(group.label), video: group.video })}
          />
        )}
      </div>
      <div className="v">{t(group.value)}</div>
    </div>
  );
}
