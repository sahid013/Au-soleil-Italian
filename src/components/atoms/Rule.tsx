/**
 * Decorative gold rule with a centred sun dot.
 * `variant="panel"` is the tighter version used under category headings.
 */
export function Rule({ variant = "default", className, style }: { variant?: "default" | "panel"; className?: string; style?: React.CSSProperties }) {
  const cls = [variant === "panel" ? "panel-rule" : "rule", className].filter(Boolean).join(" ");
  return (
    <span className={cls} style={style}>
      <span className="dot" />
    </span>
  );
}
