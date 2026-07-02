"use client";

import { motion } from "framer-motion";
import { CubeIcon } from "./icons";

/** Round 3D button on a menu item that has a 3D model. Sits beside the play button. */
export function View3DButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      className="vbtn vbtn--3d"
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <CubeIcon />
    </motion.button>
  );
}
