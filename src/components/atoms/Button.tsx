"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "ghost" | "olive";

interface ButtonLinkProps extends HTMLMotionProps<"a"> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * Anchor styled as a button. The brand uses links (tel:, #anchors) as CTAs,
 * so this renders an <a>. `variant` maps to the .btn-* classes, with a subtle
 * framer-motion press/hover for tactile feedback.
 */
export function ButtonLink({ variant = "primary", className, children, ...rest }: ButtonLinkProps) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  return (
    <motion.a
      className={classes}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
