"use client";

import { PlayIcon } from "./icons";

/** Round play button on a menu item that has a dish video. */
export function PlayButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="vbtn" type="button" aria-label={label} onClick={onClick}>
      <PlayIcon />
    </button>
  );
}
