/* ============================================================
   OCHEL API ADAPTER
   ------------------------------------------------------------
   Translates the Ochel public menu API (parallel category /
   subcategory / dish arrays, single-language, numeric prices,
   absolute media URLs) into the bilingual, tree-shaped
   `MenuData.categories` the UI consumes (see ./types.ts).

   Only this file knows the API's shape. The components never do.
   Doc: GET /api/v1/menu/{menuId}
   ============================================================ */

import type { Localized, MenuCategory, MenuItem } from "./types";
import { slugify } from "./slug";

/* ---- Raw API response shapes ---- */

export interface OchelCategory {
  id: string;
  name: string;
  sortOrder: number;
  icon: string | null;
  subtitle: string | null;
  isEnabled: boolean;
  isSystem: boolean;
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

/** Both languages carry the same French source for now (see notes in menu.ts). */
function bilingual(value: string): Localized {
  return { fr: value, en: value };
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
 * Decide what media to show for a dish, per the API's documented decision
 * table. A video is only surfaced when it is an actual, ready, visible video.
 * Enum casing differs between the docs and the live API, so compare lower-cased.
 */
function resolveVideo(dish: OchelDish): { hasVideo: boolean; videoSrc?: string; poster?: string } {
  const isVideo = dish.mediaType?.toLowerCase() === "video";
  const isLive = dish.videoStatus?.toLowerCase() === "live";
  if (isVideo && isLive && dish.videoVisible && dish.videoUrl) {
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
    description: dish.description ? bilingual(dish.description) : undefined,
    // The API has no "new" concept; flag chef specials so they still stand out.
    isNew: dish.isSpecial || undefined,
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
        id: slugify(cat.name) || cat.id,
        title: bilingual(cat.name),
        note: cat.subtitle ? bilingual(cat.subtitle) : undefined,
        items,
      };
      return category;
    })
    .filter((cat) => cat.items.length > 0);
}
