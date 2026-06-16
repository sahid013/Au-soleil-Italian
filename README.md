# Au Soleil Italien — Menu

A scalable, bilingual (FR/EN) menu for **Au Soleil Italien**, built with Next.js
(App Router) + TypeScript and organised with **atomic component design**. The menu
is fully **data-driven**: dishes live in JSON today and will be served by the
backend API later — without touching any UI code.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run typecheck
```

## Where things live

```
data/
  menu.json          ← the menu (categories, dishes, prices, extras, notes)
  site.json          ← brand, navigation, contact, hours, footer, social
src/
  lib/
    types.ts         ← TypeScript shapes (the contract with the API)
    menu.ts          ← DATA ACCESS LAYER — the single seam to the backend
    i18n.tsx         ← FR/EN language context + t() helper
    slug.ts          ← dish-name → slug (for video file names)
  components/         ← atomic design
    atoms/            ← Logo, icons, Button, LangToggle, Rule, NewTag, PlayButton
    molecules/        ← MenuItem, PanelHead, InfoRow, BambinoGroup, Reveal
    organisms/        ← Navbar, PageHead, MenuExplorer, MenuPanel, ExtrasPanel,
                        VideoLightbox, ReserveStrip, Footer
    templates/        ← MenuTemplate (composes the whole page)
  app/
    layout.tsx        ← fonts + <html>
    page.tsx          ← server component: loads data, renders the template
    globals.css       ← brand charter (design tokens + component styles)
public/
  videos/             ← optional dish videos, named <dish-slug>.mp4
```

## Editing the menu (no code required)

Open `data/menu.json` and edit. Each item supports:

| field         | type              | notes                                            |
| ------------- | ----------------- | ------------------------------------------------ |
| `name`        | string            | proper name, shown as-is in both languages       |
| `price`       | string \| null    | e.g. `"15,50€"`; omit for salads priced elsewhere |
| `description` | `{ fr, en }`      | optional bilingual description                   |
| `isNew`       | boolean           | shows the **NEW** badge + section "New" sub-note |
| `hasVideo`    | boolean           | shows a ▶ button opening the video lightbox      |
| `time`        | string            | e.g. `"25 min"`                                  |
| `tag`         | string            | free note (e.g. `"plat"` = main course only)     |

- **Categories render in the order they appear** in `categories[]`.
- Add a category by adding an object with `id`, `title`, and `items`.
- Site-wide content (phone, address, social, hours) is in `data/site.json`.

## Connecting the backend API (later)

When your friend's API is ready, **the only file you change is
`src/lib/menu.ts`**. Two options:

1. Set environment variables (no code change):
   ```
   NEXT_PUBLIC_USE_API=true
   NEXT_PUBLIC_API_BASE_URL=https://api.ausoleilitalien.fr
   ```
   The data layer will then call `GET {API_BASE_URL}/menu` and
   `GET {API_BASE_URL}/site`.

2. Or edit `getMenu()` / `getSite()` directly to match the API's routes/auth.

As long as the API returns the shapes defined in `src/lib/types.ts`
(`MenuData` and `SiteData`), every component keeps working unchanged.
Share `src/lib/types.ts` with the backend dev as the contract.

## Internationalisation

Every bilingual value carries both languages (`{ fr, en }`), so the FR/EN
toggle is instant and never needs a refetch. Language preference is saved to
`localStorage`. Add a language by extending the `Lang` type and the data.

## Dish videos

Drop an MP4 in `public/videos/` named after the dish slug
(`Linguine du Soleil` → `linguine-du-soleil.mp4`). Until then, the lightbox
shows a styled "coming soon" poster.
