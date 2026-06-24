/* ============================================================
   OCHEL API ADAPTER
   ------------------------------------------------------------
   Translates the Ochel public menu API (parallel category /
   subcategory / dish arrays, multi-language text, numeric prices,
   absolute media URLs) into the tree-shaped `MenuData.categories`
   the UI consumes (see ./types.ts).

   Only this file knows the API's shape. The components never do.
   Doc: GET /api/v1/menu/{menuId}
   ============================================================ */

import { LANGS, type Lang, type Localized, type MenuCategory, type MenuItem } from "./types";
import { slugify } from "./slug";

/* ---- Raw API response shapes ---- */

/** Per-field translations: each language maps to an array of strings (usually 0 or 1). */
type LangArrays = Partial<Record<Lang, string[]>>;

export interface OchelCategory {
  id: string;
  name: string;
  sortOrder: number;
  icon: string | null;
  subtitle: string | null;
  isEnabled: boolean;
  isSystem: boolean;
  multiLangData?: {
    name?: LangArrays;
    subtitle?: LangArrays;
  };
}

export interface OchelSubcategory extends OchelCategory {
  categoryId: string;
}

export interface OchelDish {
  id: string;
  categoryId: string;
  subcategoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  sortOrder: number;
  isSpecial: boolean;
  specialLabel: string | null;
  tags: string[];
  ingredients: string[];
  mediaType: string; // "none" | "photo" | "video" | "model3d" (casing varies)
  photoUrl: string | null;
  videoUrl: string | null;
  model3dUrl: string | null;
  posterUrl: string | null;
  videoVisible: boolean;
  videoStatus: string; // "Live" | "Pending" | ... (casing varies)
  multiLangData?: {
    name?: LangArrays;
    description?: LangArrays;
  };
}

export interface OchelMenuResponse {
  menuId: string;
  restaurantName: string;
  cuisine: string | null;
  currency: string;
  categories: OchelCategory[];
  subcategories: OchelSubcategory[];
  dishes: OchelDish[];
}

/* ---- Helpers ---- */

/** First non-empty, trimmed translation in a language's array, if any. */
function firstOf(arr: string[] | undefined): string | undefined {
  const value = arr?.[0]?.trim();
  return value ? value : undefined;
}

/**
 * Build a `Localized` from the API's per-language arrays, falling back to the
 * plain top-level value (`fallback`) for the primary language. Each language
 * uses its own translation when present, otherwise the primary value — so a
 * dish only translated into French still shows (in French) under ES/ZH.
 * Returns `undefined` when there is no text at all.
 */
function localize(field: LangArrays | undefined, fallback: string): Localized | undefined {
  const primary = firstOf(field?.fr) ?? fallback.trim();
  if (!primary) return undefined;
  const out = { fr: primary } as Localized;
  for (const lang of LANGS) {
    if (lang === "fr") continue;
    out[lang] = firstOf(field?.[lang]) ?? primary;
  }
  return out;
}

/**
 * Format a numeric price into the site's French style, e.g.
 *   17     -> "17,00€"
 *   8.9    -> "8,90€"
 * The currency symbol (not code) is appended; EUR -> "€".
 */
export function formatPrice(value: number, currency: string): string {
  const symbol = currency === "EUR" ? "€" : currency;
  return `${value.toFixed(2).replace(".", ",")}${symbol}`;
}

/**
 * Decide whether to surface a dish video. The video source is always the
 * dish's `videoUrl` (we never treat `model3dUrl` as a video, even when it
 * happens to point at an .mp4 — that field is reserved for 3D models). A
 * video shows whenever it is ready (`videoStatus === "Live"`) and has a URL,
 * regardless of `mediaType` or the `videoVisible` flag. Enum casing differs
 * between the docs and the live API, so compare lower-cased.
 */
function resolveVideo(dish: OchelDish): { hasVideo: boolean; videoSrc?: string; poster?: string } {
  const isLive = dish.videoStatus?.toLowerCase() === "live";
  if (isLive && dish.videoUrl) {
    return {
      hasVideo: true,
      videoSrc: dish.videoUrl,
      poster: dish.posterUrl ?? dish.photoUrl ?? undefined,
    };
  }
  return { hasVideo: false };
}

function mapDish(dish: OchelDish, currency: string): MenuItem {
  const { hasVideo, videoSrc, poster } = resolveVideo(dish);
  return {
    id: dish.id,
    name: dish.name,
    price: formatPrice(dish.price, currency),
    description: localize(dish.multiLangData?.description, dish.description ?? ""),
    // Show a badge only when the API provides a label for the dish.
    badge: dish.specialLabel?.trim() || undefined,
    hasVideo: hasVideo || undefined,
    videoSrc,
    poster,
    image: dish.photoUrl ?? undefined,
  };
}

const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder;

function groupBy<T, K extends string | null>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return map;
}

/**
 * Join the three parallel arrays into the UI's flat category -> items tree.
 * Within a category, dishes attached directly (subcategoryId === null) come
 * first, then each subcategory's dishes, all sorted by sortOrder. Empty
 * categories are dropped so no blank tab/panel renders.
 */
export function mapOchelToCategories(api: OchelMenuResponse): MenuCategory[] {
  const dishesByCategory = groupBy(api.dishes, (d) => d.categoryId);
  const subsByCategory = groupBy(api.subcategories, (s) => s.categoryId);

  return [...api.categories]
    .sort(bySortOrder)
    .map((cat) => {
      const dishes = (dishesByCategory.get(cat.id) ?? []).slice().sort(bySortOrder);
      const subs = (subsByCategory.get(cat.id) ?? []).slice().sort(bySortOrder);

      const items: MenuItem[] = [
        ...dishes.filter((d) => d.subcategoryId === null).map((d) => mapDish(d, api.currency)),
        ...subs.flatMap((sub) =>
          dishes.filter((d) => d.subcategoryId === sub.id).map((d) => mapDish(d, api.currency)),
        ),
      ];

      const category: MenuCategory = {
        // id stays language-independent (built from the primary name) so tab
        // anchors don't change when the visitor switches language.
        id: slugify(cat.name) || cat.id,
        title: localize(cat.multiLangData?.name, cat.name) ?? { fr: cat.name, en: cat.name },
        note: localize(cat.multiLangData?.subtitle, cat.subtitle ?? ""),
        items,
      };
      return category;
    })
    .filter((cat) => cat.items.length > 0);
}
