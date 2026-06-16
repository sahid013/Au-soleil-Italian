"use client";

/* ============================================================
   Language context — holds the active language (fr/en), persists
   it to localStorage, and exposes a `t()` helper that resolves a
   Localized object to the active string.

   Because every bilingual string carries BOTH languages in the data,
   switching language is instant and needs no refetch.
   ============================================================ */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Lang, Localized } from "./types";

const STORAGE_KEY = "asi-lang";
const DEFAULT_LANG: Lang = "fr";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Resolve a Localized object to the active language string. */
  t: (value: Localized) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Restore the saved preference on mount (client only).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "fr" || saved === "en") setLangState(saved);
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  // Keep <html lang> in sync for accessibility / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((value: Localized) => value[lang], [lang]);

  const ctx = useMemo<LanguageContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={ctx}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a <LanguageProvider>");
  return ctx;
}
