"use client";

import { useLanguage } from "@/lib/i18n";
import type { BambinoGroup as BambinoGroupType } from "@/lib/types";

/** One labelled line inside the children's-menu block. */
export function BambinoGroup({ group }: { group: BambinoGroupType }) {
  const { t } = useLanguage();
  return (
    <div className="grp">
      <div className="lab">{t(group.label)}</div>
      <div className="v">{t(group.value)}</div>
    </div>
  );
}
