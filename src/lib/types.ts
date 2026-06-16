/* ============================================================
   Domain types — shared by the data layer, components and (soon)
   the backend API client. Keep these in sync with the shape your
   friend's API returns so swapping the source is a one-file change
   (see src/lib/menu.ts).
   ============================================================ */

/** A piece of text available in both site languages. */
export interface Localized {
  fr: string;
  en: string;
}

/** A single dish / line on the menu. */
export interface MenuItem {
  /** Proper name, shown as-is in both languages (e.g. "Linguine du Soleil"). */
  name: string;
  /** Price string including the currency symbol, or null when priced elsewhere (e.g. salads). */
  price?: string | null;
  /** Optional bilingual description / list of ingredients. */
  description?: Localized;
  /** Flags a brand-new dish (renders the "NEW" badge + section sub-note). */
  isNew?: boolean;
  /** When true, an item video button opens the lightbox (video at /videos/<slug>.mp4). */
  hasVideo?: boolean;
  /** Optional preparation time note (e.g. "25 min"). */
  time?: string;
  /** Free-form tag (e.g. "plat" = main course only). */
  tag?: string;
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
}

export interface CafeExtra {
  title: Localized;
  text: Localized;
}

export interface BambinoGroup {
  label: Localized;
  value: Localized;
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
  extras: MenuExtras;
  notes: MenuNotes;
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

/** Supported UI languages. */
export type Lang = "fr" | "en";
