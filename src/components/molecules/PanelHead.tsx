"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import type { Localized } from "@/lib/types";
import { Rule } from "@/components/atoms/Rule";

/**
 * Centred category heading: title, gold rule, optional note.
 * Pass `note` for a simple bilingual line, or `noteNode` for custom content
 * (e.g. the Bambino price + age line).
 */
export function PanelHead({
  title,
  note,
  noteNode,
  style,
}: {
  title: Localized;
  note?: Localized;
  noteNode?: ReactNode;
  style?: React.CSSProperties;
}) {
  const { t } = useLanguage();
  return (
    <div className="panel-head" style={style}>
      <h2>{t(title)}</h2>
      <Rule variant="panel" />
      {note && <p className="panel-note">{t(note)}</p>}
      {noteNode}
    </div>
  );
}
