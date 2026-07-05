"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import type { MenuItem, MenuVariation } from "@/lib/types";
import { CloseIcon, CubeIcon } from "@/components/atoms/icons";

/**
 * Dish 3D-model lightbox. Open by passing an `item` that has a 3D model; close
 * via `onClose`. The GLB model is embedded in an interactive <model-viewer>
 * (rotate / zoom). A "See it live" link launches the model in AR — on iOS this
 * opens the USDZ in AR Quick Look, elsewhere it opens the model file.
 *
 * @google/model-viewer is imported lazily on the client (it registers the
 * <model-viewer> custom element on import), so it never runs on the server.
 */
export function Model3DLightbox({
  item,
  variations,
  onClose,
}: {
  item: MenuItem | null;
  /** Salades only: category size options shown as title-less pills in place of a price. */
  variations?: MenuVariation[];
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const viewerRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const open = item !== null;

  // Register the <model-viewer> custom element once, on the client only.
  useEffect(() => {
    let alive = true;
    import("@google/model-viewer").then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Reset the "model loaded" state whenever a different dish opens.
  useEffect(() => {
    if (open) setLoaded(false);
  }, [open, item?.id]);

  // Attach model-viewer's real DOM events via the ref (React's synthetic onLoad
  // is unreliable for custom elements). `load` fires when the GLB is ready;
  // `error` also clears the spinner so the UI never gets stuck.
  useEffect(() => {
    const viewer = viewerRef.current as (HTMLElement & { loaded?: boolean }) | null;
    if (!viewer) return;
    const done = () => setLoaded(true);
    // If the model finished loading before this listener attached (cached), sync now.
    if (viewer.loaded) setLoaded(true);
    viewer.addEventListener("load", done);
    viewer.addEventListener("error", done);
    return () => {
      viewer.removeEventListener("load", done);
      viewer.removeEventListener("error", done);
    };
  }, [ready, open, item?.id]);

  // Lock body scroll and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const description = item?.description ? t(item.description) : "";

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="vmodal vmodal--3d open"
          aria-hidden={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="vmodal-scrim" onClick={onClose} />
          <motion.div
            className="vmodal-box"
            role="dialog"
            aria-modal="true"
            aria-label={t(item.name)}
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <button
              className="vmodal-close"
              type="button"
              onClick={onClose}
              aria-label={t({ fr: "Fermer", en: "Close", es: "Cerrar", zh: "关闭" })}
            >
              <CloseIcon />
            </button>

            <div className="vframe vframe--3d">
              {(!ready || !loaded) && (
                <div className="vplaceholder vplaceholder--3d">
                  <span className="vsun" />
                  <span className="vspinner" aria-hidden="true" />
                  <span className="vph-name">{t(item.name)}</span>
                  <span className="vph-soon">
                    {t({ fr: "Chargement du modèle 3D…", en: "Loading 3D model…", es: "Cargando modelo 3D…", zh: "正在加载 3D 模型…" })}
                  </span>
                </div>
              )}
              {ready && item.model3dGlb && (
                <model-viewer
                  ref={viewerRef}
                  className="vmodel"
                  src={item.model3dGlb}
                  ios-src={item.model3dUsdz}
                  alt={t(item.name)}
                  poster={item.poster ?? item.image}
                  camera-controls
                  auto-rotate
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  shadow-intensity="1"
                  exposure="1"
                  reveal="auto"
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>

            <div className="vmeta">
              <span className="vkicker">{t({ fr: "Le plat en 3D", en: "The dish in 3D", es: "El plato en 3D", zh: "3D 菜品" })}</span>
              <div className="vname">{t(item.name)}</div>
              {description && <div className="vdesc">{description}</div>}
              {variations && variations.length > 0 ? (
                <ul className="vpiles">
                  {variations.map((v, i) => (
                    <li className="variation-pill" key={i}>
                      <span className="variation-name">{t(v.name)}</span>
                      {v.price && <span className="variation-price">{v.price}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                item.price && <div className="vprice">{item.price}</div>
              )}
              {item.model3dUsdz && (
                // Explicitly spawn a new tab/window for the USDZ. On iOS Safari
                // this navigates to the .usdz and launches AR Quick Look ("see
                // it live"); on desktop it opens the model in a separate tab.
                <button
                  type="button"
                  className="ar-cta"
                  onClick={() => window.open(item.model3dUsdz, "_blank", "noopener,noreferrer")}
                >
                  <CubeIcon />
                  <span>{t({ fr: "Voir en réel", en: "See it live", es: "Verlo en vivo", zh: "实景查看" })}</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
