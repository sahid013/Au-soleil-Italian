"use client";

import { useEffect, useRef } from "react";
import { trackDishView } from "./analytics";

/**
 * Fire a single `dish_view` event the first time the returned element scrolls
 * into view. `trackDishView` is itself de-duped per dish per page load, so it's
 * safe to attach this to multiple representations of the same dish.
 * No-op when the dish has no backend id (local data).
 */
export function useDishView<T extends HTMLElement>(dishId: string | undefined) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!dishId) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trackDishView(dishId);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dishId]);
  return ref;
}
