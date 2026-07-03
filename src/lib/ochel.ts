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

import { LANGS, type AddOn, type AddOnGroup, type Lang, type Localized, type MenuCategory, type MenuItem, type MenuVariation } from "./types";
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
  /** When true, this subcategory is an add-on group for its category (its dishes
   *  are add-ons shown at the bottom of the category, not regular menu items). */
  isAddOn?: boolean;
}

/**
 * A single add-on entry. The API returns these in the top-level `addons` array,
 * each linked to its dish via `dishId` (shown inside that dish's card).
 */
export interface OchelAddon {
  id?: string;
  dishId?: string;
  name: string;
  price?: number | null;
  sortOrder?: number;
  multiLangData?: {
    name?: LangArrays;
  };
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
  /** Interactive 3D model (glTF-binary), viewed inline in the 3D lightbox. */
  model3dGlbUrl?: string | null;
  /** USDZ variant of the 3D model, launched in AR Quick Look on iOS. */
  model3dUsdzUrl?: string | null;
  posterUrl: string | null;
  videoVisible: boolean;
  videoStatus: string; // "Live" | "Pending" | ... (casing varies)
  /** Some deployments embed a dish's add-ons here instead of the top-level list. */
  addons?: OchelAddon[];
  multiLangData?: {
    name?: LangArrays;
    description?: LangArrays;
    /** Per-language translations of `specialLabel` (the small badge above the name). */
    specialLabel?: LangArrays;
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
  /** Dish add-ons, each linked to its dish by `dishId`. */
  addons?: OchelAddon[];
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
 * video shows only when it is ready (`videoStatus === "Live"`), has a URL,
 * and is explicitly marked visible (`videoVisible === true`): if a dish has a
 * video URL but `videoVisible` is false, we hide it. `mediaType` is ignored.
 * Enum casing differs between the docs and the live API, so compare lower-cased.
 */
function resolveVideo(dish: OchelDish): { hasVideo: boolean; videoSrc?: string; poster?: string } {
  const isLive = dish.videoStatus?.toLowerCase() === "live";
  if (isLive && dish.videoVisible && dish.videoUrl) {
    return {
      hasVideo: true,
      videoSrc: dish.videoUrl,
      poster: dish.posterUrl ?? dish.photoUrl ?? undefined,
    };
  }
  return { hasVideo: false };
}

/** Map one raw add-on into the UI `AddOn` shape (name + formatted price). */
function mapAddOn(addon: OchelAddon, currency: string): AddOn {
  return {
    name: firstOf(addon.multiLangData?.name?.fr) ?? addon.name,
    price: addon.price != null ? formatPrice(addon.price, currency) : null,
  };
}

function mapDish(dish: OchelDish, currency: string, dishAddons: OchelAddon[] = []): MenuItem {
  const { hasVideo, videoSrc, poster } = resolveVideo(dish);
  // Add-ons come from the top-level list (matched by dishId); some deployments
  // also embed them on the dish itself.
  const addons = [...(dish.addons ?? []), ...dishAddons];
  return {
    id: dish.id,
    // Name + description both come from the API's per-language multiLangData
    // (falling back to the French value when a language isn't translated).
    name: localize(dish.multiLangData?.name, dish.name) ?? { fr: dish.name, en: dish.name },
    price: formatPrice(dish.price, currency),
    description: localize(dish.multiLangData?.description, dish.description ?? ""),
    // Show a badge only when the API provides a label for the dish. Its
    // translations come from multiLangData.specialLabel (fallback: French).
    badge: dish.specialLabel?.trim()
      ? localize(dish.multiLangData?.specialLabel, dish.specialLabel)
      : undefined,
    hasVideo: hasVideo || undefined,
    videoSrc,
    // Raw clip URL (independent of videoVisible) so curated highlights can show
    // a looping preview even when the dish hides its video in the menu listing.
    videoUrl: dish.videoUrl ?? undefined,
    poster,
    image: dish.photoUrl ?? undefined,
    tags: dish.tags?.length ? dish.tags : undefined,
    // Dish-specific add-ons (shown inside the dish card).
    addons: addons.length ? addons.map((a) => mapAddOn(a, currency)) : undefined,
    // 3D model URLs (GLB for the inline viewer, USDZ for iOS AR).
    model3dGlb: dish.model3dGlbUrl?.trim() || undefined,
    model3dUsdz: dish.model3dUsdzUrl?.trim() || undefined,
  };
}

const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder;

/**
 * A placeholder/separator dish whose name is blank or just dashes (e.g. "-").
 * These are dummy rows used in the dashboard (sometimes to carry a supplements
 * note in the badge) and must never render as a real menu card.
 */
function isPlaceholderDish(dish: OchelDish): boolean {
  const name = dish.name?.trim() ?? "";
  return name === "" || /^-+$/.test(name);
}

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
  // Dish add-ons arrive in the top-level list, keyed by dishId.
  const addonsByDish = groupBy(
    [...(api.addons ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    (a) => a.dishId ?? "",
  );
  const addonsFor = (dishId: string) => addonsByDish.get(dishId) ?? [];

  return [...api.categories]
    .sort(bySortOrder)
    .map((cat) => {
      const dishes = (dishesByCategory.get(cat.id) ?? [])
        .filter((d) => !isPlaceholderDish(d))
        .sort(bySortOrder);
      const subs = (subsByCategory.get(cat.id) ?? []).slice().sort(bySortOrder);

      // Add-on subcategories (isAddOn) don't list their dishes as regular menu
      // items — they become a category add-on card instead.
      const addonSubs = subs.filter((s) => s.isAddOn);
      const normalSubs = subs.filter((s) => !s.isAddOn);

      // Special-case the Salades category: its dish add-ons are really portion
      // options (Small / Large) that apply to every salad, so we lift them to
      // category-level `variations` and stop attaching them to a single dish.
      const isSalad = /salad/i.test(cat.name);
      const dishAddonsFor = (dishId: string) => (isSalad ? [] : addonsFor(dishId));

      const items: MenuItem[] = [
        ...dishes
          .filter((d) => d.subcategoryId === null)
          .map((d) => mapDish(d, api.currency, dishAddonsFor(d.id))),
        ...normalSubs.flatMap((sub) =>
          dishes
            .filter((d) => d.subcategoryId === sub.id)
            .map((d) => mapDish(d, api.currency, dishAddonsFor(d.id))),
        ),
      ];

      // Collect the salad portion options (deduped by name, in sort order).
      let variations: MenuVariation[] | undefined;
      if (isSalad) {
        const seen = new Set<string>();
        const collected: MenuVariation[] = [];
        for (const d of dishes) {
          for (const addon of addonsFor(d.id)) {
            const name = localize(addon.multiLangData?.name, addon.name);
            if (!name) continue;
            const key = name.fr.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            collected.push({ name, price: addon.price != null ? formatPrice(addon.price, api.currency) : null });
          }
        }
        variations = collected.length ? collected : undefined;
      }

      const addons: AddOnGroup[] = addonSubs
        .map((sub) => ({
          title: localize(sub.multiLangData?.name, sub.name) ?? { fr: sub.name, en: sub.name },
          items: dishes
            .filter((d) => d.subcategoryId === sub.id)
            .map<AddOn>((d) => ({ name: d.name, price: formatPrice(d.price, api.currency) })),
        }))
        .filter((group) => group.items.length > 0);

      const category: MenuCategory = {
        // id stays language-independent (built from the primary name) so tab
        // anchors don't change when the visitor switches language.
        id: slugify(cat.name) || cat.id,
        title: localize(cat.multiLangData?.name, cat.name) ?? { fr: cat.name, en: cat.name },
        note: localize(cat.multiLangData?.subtitle, cat.subtitle ?? ""),
        items,
        addons: addons.length ? addons : undefined,
        variations,
      };
      return category;
    })
    .filter((cat) => cat.items.length > 0 || (cat.addons?.length ?? 0) > 0);
}
