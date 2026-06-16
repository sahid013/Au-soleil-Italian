"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper. Mirrors the original IntersectionObserver behaviour:
 * the child fades/slides in the first time it enters the viewport.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div ref={ref} className={["reveal", shown ? "in" : "", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
