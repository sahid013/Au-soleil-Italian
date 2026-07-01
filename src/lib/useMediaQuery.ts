"use client";

import { useEffect, useState } from "react";

/**
 * Track whether a CSS media query currently matches. SSR-safe: returns `false`
 * on the server and on the first client render (so hydration matches), then
 * updates from `matchMedia` on mount and on every change.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
