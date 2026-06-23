"use client";

import { useLanguage } from "@/lib/i18n";
import { LANGS } from "@/lib/types";

/** FR / EN / ES / ZH pill toggle, wired to the language context. */
export function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="lang" role="group" aria-label="Langue / Language">
      {LANGS.map((opt) => (
        <button key={opt} type="button" data-l={opt} aria-pressed={lang === opt} onClick={() => setLang(opt)}>
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
