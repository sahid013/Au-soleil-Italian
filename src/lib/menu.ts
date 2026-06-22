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
import { mapOchelToCategories, type OchelMenuResponse } from "./ochel";

/**
 * Toggle to `true` once the backend is live. Reads NEXT_PUBLIC_USE_API
 * so you can flip it per-environment without touching code:
 *   NEXT_PUBLIC_USE_API=true
 *   NEXT_PUBLIC_API_BASE_URL=https://magnificent-beauty-staging.up.railway.app
 *   NEXT_PUBLIC_MENU_ID=9289c209-1e66-4cab-888d-1643965d8ee0
 */
const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const MENU_ID = process.env.NEXT_PUBLIC_MENU_ID ?? "";

/** The local JSON, typed. `$comment` keys are ignored by the type. */
const localMenu = menuJson as unknown as MenuData;

/**
 * Fetch the full menu.
 *
 * The menu is fully API-driven: categories, dishes and any videos all come from
 * the Ochel backend. The tab bar is built straight from the API's categories.
 * The API returns French-only parallel arrays, which we map into the UI's
 * `MenuData.categories` (see ./ochel.ts).
 *
 * Fetched with `cache: "no-store"` so every page view reflects the latest menu
 * saved in the dashboard (the API itself has a ~30 s server cache). If the API
 * is unreachable or returns an error, we fall back to the committed local
 * categories so the site never shows a blank menu.
 */
export async function getMenu(): Promise<MenuData> {
  if (!USE_API) return localMenu;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/menu/${MENU_ID}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Menu API responded ${res.status}`);
    const data = (await res.json()) as OchelMenuResponse;
    return { categories: mapOchelToCategories(data) };
  } catch (err) {
    console.error("[getMenu] API fetch failed, falling back to local menu:", err);
    return { categories: localMenu.categories };
  }
}

/**
 * Site-wide config (brand, nav, contact, footer). The Ochel API only serves the
 * menu — it has no site endpoint — so this always reads the local JSON.
 */
export async function getSite(): Promise<SiteData> {
  return siteJson as unknown as SiteData;
}
