/* ============================================================
   ANALYTICS — behavioural event tracking (POST /events)
   ------------------------------------------------------------
   Fire-and-forget client-side events that power the restaurant's
   dashboard (scan counts, dish views, video plays, watch time).

   Spec: POST {BASE_URL}/events
   - tenant is resolved server-side from menuId — never sent here
   - one sessionId per page load, reused for every event
   - a fresh idempotencyKey per event (server dedupes retries ~5 min)
   - dishId / durationSeconds are only included when required for the
     event type; sending them otherwise is a 400.
   ============================================================ */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const MENU_ID = process.env.NEXT_PUBLIC_MENU_ID ?? "";
const ENABLED = process.env.NEXT_PUBLIC_USE_API === "true" && !!BASE_URL && !!MENU_ID;

type EventType = "scan" | "dish_view" | "video_play" | "watch_time";

/** One id per page load; created lazily on the first event in the browser. */
let sessionId: string | null = null;
function getSessionId(): string {
  if (!sessionId) sessionId = crypto.randomUUID();
  return sessionId;
}

interface TrackOptions {
  /** Required for dish_view, video_play, watch_time. Omitted for scan. */
  dishId?: string;
  /** Required for watch_time only. Integer seconds watched. */
  durationSeconds?: number;
}

/** Low-level send. Fire-and-forget; analytics are non-critical so errors are swallowed. */
function track(eventType: EventType, opts: TrackOptions = {}): void {
  if (!ENABLED || typeof window === "undefined") return;

  const body: Record<string, unknown> = {
    eventType,
    menuId: MENU_ID,
    sessionId: getSessionId(),
    idempotencyKey: crypto.randomUUID(),
  };
  if (opts.dishId != null) body.dishId = opts.dishId;
  if (opts.durationSeconds != null) body.durationSeconds = opts.durationSeconds;

  try {
    fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true, // lets watch_time send during page unload
    }).catch(() => {});
  } catch {
    /* ignore — analytics must never break the page */
  }
}

let scanned = false;
/** QR scanned / menu page first loaded. Sent once per page load. */
export function trackScan(): void {
  if (scanned) return;
  scanned = true;
  track("scan");
}

const viewedDishes = new Set<string>();
/** Dish scrolled into view. Sent at most once per dish per page load. */
export function trackDishView(dishId: string): void {
  if (!dishId || viewedDishes.has(dishId)) return;
  viewedDishes.add(dishId);
  track("dish_view", { dishId });
}

/** Video playback started. */
export function trackVideoPlay(dishId: string): void {
  if (!dishId) return;
  track("video_play", { dishId });
}

/** Video ended or the viewer navigated away. `seconds` = integer seconds watched. */
export function trackWatchTime(dishId: string, seconds: number): void {
  if (!dishId) return;
  track("watch_time", { dishId, durationSeconds: Math.max(0, Math.round(seconds)) });
}
