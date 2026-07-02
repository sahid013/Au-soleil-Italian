/* ============================================================
   Domain types — shared by the data layer, components and (soon)
   the backend API client. Keep these in sync with the shape your
   friend's API returns so swapping the source is a one-file change
   (see src/lib/menu.ts).
   ============================================================ */

/**
 * A piece of text available in the site languages. `fr` and `en` are always
 * present for the static UI strings; `es` and `zh` are optional and used by
 * API-driven menu text (see lib/ochel.ts). `t()` falls back to `fr` when a
 * requested language is missing.
 */
export interface Localized {
  fr: string;
  en: string;
  es?: string;
  zh?: string;
}

/** A single dish / line on the menu. */
export interface MenuItem {
  /** Backend dish UUID, used as `dishId` for analytics events. Absent for local data. */
  id?: string;
  /** Dish name in each site language, taken from the API's `multiLangData.name`
   *  and falling back to the French value when a language isn't translated. */
  name: Localized;
  /** Price string including the currency symbol, or null when priced elsewhere (e.g. salads). */
  price?: string | null;
  /** Optional bilingual description / list of ingredients. */
  description?: Localized;
  /** Badge text from the API (e.g. a chef-special label). Shown only when set. */
  badge?: string;
  /** When true, an item video button opens the lightbox (video at /videos/<slug>.mp4). */
  hasVideo?: boolean;
  /** Explicit video filename under /videos/ (overrides the name-slug lookup). */
  video?: string;
  /** Absolute video URL from the backend API (takes precedence over local /videos/). */
  videoSrc?: string;
  /** Raw dish video URL from the API, regardless of `videoVisible` — used for the
   *  highlights carousel preview (autoplay, muted, looping). */
  videoUrl?: string;
  /** Absolute poster/thumbnail URL shown while the video loads (from the API). */
  poster?: string;
  /** Absolute dish photo URL from the API; shown as a thumbnail. Omitted when none. */
  image?: string;
  /** Optional preparation time note (e.g. "25 min"). */
  time?: string;
  /** Free-form tag (e.g. "plat" = main course only). */
  tag?: string;
  /** All tags attached to the dish in the dashboard (e.g. "Carrousel"). */
  tags?: string[];
  /** Add-ons that apply only to this dish; rendered inside the dish card. */
  addons?: AddOn[];
}

/** A single add-on / supplement (a name and an optional price). */
export interface AddOn {
  name: string;
  /** Price string including the currency symbol, or null when it has none. */
  price?: string | null;
}

/** A named group of add-ons for a category (e.g. "Suppléments"). */
export interface AddOnGroup {
  title: Localized;
  items: AddOn[];
}

/** A menu category / tab (e.g. Pizza, Pasta). */
export interface MenuCategory {
  /** Stable slug used for the tab + panel ids. */
  id: string;
  title: Localized;
  /** Optional note shown under the category heading. */
  note?: Localized;
  /** Optional supplements line shown at the bottom of the panel. */
  supplement?: Localized;
  items: MenuItem[];
  /** Category-level add-on groups (from `isAddOn` subcategories); rendered as a
   *  card beneath the category's items. */
  addons?: AddOnGroup[];
}

export interface CafeExtra {
  title: Localized;
  text: Localized;
}

export interface BambinoGroup {
  label: Localized;
  value: Localized;
  /** Optional dish-video filename under /videos/ — renders a play button on the line. */
  video?: string;
}

export interface BambinoExtra {
  title: Localized;
  price: string;
  age: Localized;
  groups: BambinoGroup[];
}

export interface MenuExtras {
  cafe: CafeExtra;
  bambino: BambinoExtra;
}

export interface MenuNotes {
  main: Localized;
  sub: Localized;
}

/** The full menu document — the unit returned by the data layer. */
export interface MenuData {
  categories: MenuCategory[];
  /** Local-only café/bambino block. Absent when the menu is API-driven. */
  extras?: MenuExtras;
  /** Local-only legal notes. Absent when the menu is API-driven. */
  notes?: MenuNotes;
}

/* ---- Site configuration ---- */

export interface NavLink {
  label: Localized;
  href: string;
  current?: boolean;
}

export interface SocialLink {
  type: "facebook" | "instagram" | string;
  label: string;
  href: string;
}

export interface SiteData {
  brand: { name: string; tagline: string };
  contact: {
    phone: string;
    phoneDisplay: string;
    website: string;
    websiteLabel: string;
    address: Localized;
    phoneNote: Localized;
  };
  hours: { days: Localized; service: Localized; closed: Localized };
  nav: NavLink[];
  social: SocialLink[];
  footer: {
    blurb: Localized;
    exploreTitle: Localized;
    followTitle: Localized;
    legal: Localized;
  };
  reserve: {
    kicker: Localized;
    title: Localized;
    text: Localized;
    welcome: string;
  };
}

/** Supported UI languages (match the API's multiLangData keys). */
export type Lang = "fr" | "en" | "es" | "zh";

/** All languages, in display order. */
export const LANGS: Lang[] = ["fr", "en", "es", "zh"];
