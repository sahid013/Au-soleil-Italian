import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "olive";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * Anchor styled as a button. The brand uses links (tel:, #anchors) as CTAs,
 * so this renders an <a>. `variant` maps to the .btn-* classes.
 */
export function ButtonLink({ variant = "primary", className, children, ...rest }: ButtonLinkProps) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");
  return (
    <a className={classes} {...rest}>
      {children}
    </a>
  );
}
