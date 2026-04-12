"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type LiquidButtonProps = HTMLMotionProps<"button"> & {
  hoverScale?: number;
  tapScale?: number;
};

export function LiquidButton({
  hoverScale = 1.05,
  tapScale = 0.95,
  className = "",
  children,
  ...props
}: LiquidButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      className={`relative px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 overflow-hidden ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {/* simple liquid sweep */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.button>
  );
}