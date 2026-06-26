"use client";

import { motion } from "framer-motion";
import { PlayIcon } from "./icons";

/** Round play button on a menu item that has a dish video. */
export function PlayButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      className="vbtn"
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <PlayIcon />
    </motion.button>
  );
}
