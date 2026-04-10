"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // 1. Initial state: slightly lower and invisible
      initial={{ y: 20, opacity: 0 }}
      
      // 2. Animate to: resting position and fully visible
      animate={{ y: 0, opacity: 1 }}
      
      // 3. The physics: quick, smooth, and gentle
      transition={{ ease: "easeInOut", duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}