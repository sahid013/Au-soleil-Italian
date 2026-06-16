import type { ReactNode } from "react";

/** A labelled row in the olive "Reserve" strip (icon + label + value). */
export function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="row">
      {icon}
      <div>
        <div className="lab">{label}</div>
        <div className="val">{children}</div>
      </div>
    </div>
  );
}
