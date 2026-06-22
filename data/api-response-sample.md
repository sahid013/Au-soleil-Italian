# Ochel API — Live Response Sample

Fetched **2026-06-23** from staging.

- **Endpoint:** `GET https://magnificent-beauty-staging.up.railway.app/api/v1/menu/9289c209-1e66-4cab-888d-1643965d8ee0`
- **Status:** `200 OK`

## Summary

| Field | Value |
|---|---|
| `restaurantName` | `Au Soleil Italien sgdb` |
| `cuisine` | `Italian` |
| `currency` | `EUR` |
| `categories` | 2 (`Planches à partager`, `Antipasti`) |
| `subcategories` | 0 (empty array) |
| `dishes` | 6 |
| root `tags` | _not present in response_ |

### Quick observations (no action taken yet)

- Only **2 categories / 6 dishes** are in this menu right now — far less than your local `menu.json` (8 categories, ~80 dishes). This is a partial/test menu.
- `subcategories` is empty — flat category → dish structure, like your current UI.
- Text is **French only** (no `en`). Your site has a FR/EN toggle.
- `price` is a **number** (`17.0`, `8.9`) — no currency symbol/formatting.
- `mediaType` / `videoStatus` enum casing differs from the docs: response uses `"Photo"`, `"None"`, `"Pending"`, `"NoVideo"` (docs showed `photo`, `none`, `video`, `Live`). Worth noting for the adapter.
- `photoUrl` is a **signed, expiring S3 URL** (`X-Amz-Expires=604800` = 7 days). Not a stable/permanent link.
- No dish currently has a playable video (`videoUrl` always `null`; `videoVisible: false`).
- Sample has duplicate `sortOrder` values (two dishes at `sortOrder: 2`) — gaps/dupes are expected per docs; sort ascending.

## Full JSON response

```json
{
    "menuId": "9289c209-1e66-4cab-888d-1643965d8ee0",
    "restaurantName": "Au Soleil Italien sgdb",
    "cuisine": "Italian",
    "currency": "EUR",
    "categories": [
        {
            "id": "dc847863-c676-4889-b3ee-d0065f9724a2",
            "name": "Planches à partager",
            "sortOrder": 0,
            "icon": null,
            "subtitle": null,
            "isEnabled": true,
            "isSystem": false
        },
        {
            "id": "d78c5b53-c159-4554-8c1a-097a2980fb26",
            "name": "Antipasti",
            "sortOrder": 1,
            "icon": null,
            "subtitle": null,
            "isEnabled": true,
            "isSystem": false
        }
    ],
    "subcategories": [],
    "dishes": [
        {
            "id": "26028ab0-5f75-4a6e-b679-6ca6aa19c3ef",
            "categoryId": "dc847863-c676-4889-b3ee-d0065f9724a2",
            "subcategoryId": null,
            "name": "Assortiment de charcuterie italiennes",
            "description": "Coppa, jambon italien, salami italien, Spinata piccante, mortadelle à la truffe",
            "price": 17.0,
            "sortOrder": 0,
            "isSpecial": false,
            "specialLabel": null,
            "tags": [],
            "ingredients": [],
            "mediaType": "Photo",
            "photoUrl": "https://t3.storageapi.dev/.../2fbcd62debce4829bab32262da6092a8.jpg?X-Amz-Expires=604800&X-Amz-Algorithm=AWS4-HMAC-SHA256&...&X-Amz-Signature=dd82f68e...",
            "videoUrl": null,
            "model3dUrl": null,
            "posterUrl": null,
            "videoVisible": false,
            "videoStatus": "Pending"
        },
        {
            "id": "1c94e583-caa0-48c5-88f4-0cdc29aceca6",
            "categoryId": "dc847863-c676-4889-b3ee-d0065f9724a2",
            "subcategoryId": null,
            "name": "Méli - Mélo",
            "description": "Légumes grillés marinés, charcuterie, burrata fraîche",
            "price": 18.0,
            "sortOrder": 1,
            "isSpecial": false,
            "specialLabel": null,
            "tags": [],
            "ingredients": [],
            "mediaType": "Photo",
            "photoUrl": "https://t3.storageapi.dev/.../62f347487fb6425daec9626cce53cfb5.jpg?X-Amz-Expires=604800&...&X-Amz-Signature=2b8e6cb5...",
            "videoUrl": null,
            "model3dUrl": null,
            "posterUrl": null,
            "videoVisible": false,
            "videoStatus": "Pending"
        },
        {
            "id": "ebedf723-accf-4e2f-8607-5f2aeddecef5",
            "categoryId": "d78c5b53-c159-4554-8c1a-097a2980fb26",
            "subcategoryId": null,
            "name": "Calamars Frits \"Maison\"",
            "description": "Sauce Caesar",
            "price": 8.9,
            "sortOrder": 2,
            "isSpecial": false,
            "specialLabel": null,
            "tags": [],
            "ingredients": [],
            "mediaType": "None",
            "photoUrl": null,
            "videoUrl": null,
            "model3dUrl": null,
            "posterUrl": null,
            "videoVisible": false,
            "videoStatus": "NoVideo"
        },
        {
            "id": "81dd0132-f24c-431f-a420-55e2a75980c0",
            "categoryId": "d78c5b53-c159-4554-8c1a-097a2980fb26",
            "subcategoryId": null,
            "name": "Burrata crémeuse à l'huile truffée",
            "description": null,
            "price": 9.8,
            "sortOrder": 2,
            "isSpecial": false,
            "specialLabel": null,
            "tags": [],
            "ingredients": [],
            "mediaType": "None",
            "photoUrl": null,
            "videoUrl": null,
            "model3dUrl": null,
            "posterUrl": null,
            "videoVisible": false,
            "videoStatus": "NoVideo"
        },
        {
            "id": "0c8358cf-94ce-4ed0-ad4c-302087388318",
            "categoryId": "d78c5b53-c159-4554-8c1a-097a2980fb26",
            "subcategoryId": null,
            "name": "Carpaccio de Boeuf",
            "description": "Basilic et Parmesan",
            "price": 12.0,
            "sortOrder": 3,
            "isSpecial": false,
            "specialLabel": null,
            "tags": [],
            "ingredients": [],
            "mediaType": "None",
            "photoUrl": null,
            "videoUrl": null,
            "model3dUrl": null,
            "posterUrl": null,
            "videoVisible": false,
            "videoStatus": "NoVideo"
        },
        {
            "id": "e8f7fb4b-1a89-41a0-bb92-d269c90073df",
            "categoryId": "d78c5b53-c159-4554-8c1a-097a2980fb26",
            "subcategoryId": null,
            "name": "Carpaccio de Boeuf et Burrata à l'huile truffée",
            "description": null,
            "price": 14.5,
            "sortOrder": 4,
            "isSpecial": false,
            "specialLabel": null,
            "tags": [],
            "ingredients": [],
            "mediaType": "Photo",
            "photoUrl": "https://t3.storageapi.dev/.../047bf33efa3447e08a2bd26692e34b32.jpg?X-Amz-Expires=604800&...&X-Amz-Signature=2f4a9674...",
            "videoUrl": null,
            "model3dUrl": null,
            "posterUrl": null,
            "videoVisible": false,
            "videoStatus": "NoVideo"
        }
    ]
}
```
