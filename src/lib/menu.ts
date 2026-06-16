/* ============================================================
   DATA ACCESS LAYER  —  the single seam between the UI and the
   data source.

   Today the menu lives in /data/*.json (committed, version-controlled,
   easy to edit). When your friend's backend API is ready, you only
   change THIS file: flip the `USE_API` switch (or always go to the API)
   and point `API_BASE_URL` at the endpoint. Nothing in the components
   needs to change because they all consume the typed `MenuData` /
   `SiteData` shapes from ./types.

   The functions are async on purpose so that switching from a local
   import to `fetch()` is a drop-in change.
   ============================================================ */

import menuJson from "@data/menu.json";
import siteJson from "@data/site.json";
import type { MenuData, SiteData } from "./types";

/**
 * Toggle to `true` once the backend is live. Reads NEXT_PUBLIC_USE_API
 * so you can flip it per-environment without touching code:
 *   NEXT_PUBLIC_USE_API=true
 *   NEXT_PUBLIC_API_BASE_URL=https://api.ausoleilitalien.fr
 */
const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Fetch the full menu. Swap-in for the backend:
 *
 *   const res = await fetch(`${API_BASE_URL}/menu`, { next: { revalidate: 60 } });
 *   if (!res.ok) throw new Error(`Menu API ${res.status}`);
 *   return (await res.json()) as MenuData;
 *
 * As long as the API returns the `MenuData` shape (see ./types.ts),
 * the UI keeps working untouched.
 */
export async function getMenu(): Promise<MenuData> {
  if (USE_API) {
    const res = await fetch(`${API_BASE_URL}/menu`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Menu API responded ${res.status}`);
    return (await res.json()) as MenuData;
  }
  // Local source of truth. `$comment` keys in the JSON are ignored by the type.
  return menuJson as unknown as MenuData;
}

/** Fetch site-wide config (brand, nav, contact, footer). */
export async function getSite(): Promise<SiteData> {
  if (USE_API) {
    const res = await fetch(`${API_BASE_URL}/site`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Site API responded ${res.status}`);
    return (await res.json()) as SiteData;
  }
  return siteJson as unknown as SiteData;
}
