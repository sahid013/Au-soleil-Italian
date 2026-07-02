import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * JSX typing for Google's <model-viewer> web component (loaded client-side via
 * @google/model-viewer). Only the attributes we use are declared; the element
 * also exposes an imperative `activateAR()` method (see Model3DLightbox).
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          poster?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "ar-scale"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string | number;
          exposure?: string | number;
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "manual";
        },
        HTMLElement
      >;
    }
  }
}

export {};
