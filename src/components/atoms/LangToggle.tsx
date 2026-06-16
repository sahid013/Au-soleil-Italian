"use client";

import { useLanguage } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

const OPTIONS: Lang[] = ["fr", "en"];

/** FR / EN pill toggle, wired to the language context. */
export function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="lang" role="group" aria-label="Langue / Language">
      {OPTIONS.map((opt) => (
        <button key={opt} type="button" data-l={opt} aria-pressed={lang === opt} onClick={() => setLang(opt)}>
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
