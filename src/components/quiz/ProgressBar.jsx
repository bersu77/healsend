import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium tracking-widest uppercase text-stone-400">
          Your Assessment
        </span>
        <span className="text-xs font-semibold text-stone-500">
          {current} of {total}
        </span>
      </div>
      <div className="h-2 bg-stone-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full shadow-lg"
          style={{
            background: "linear-gradient(90deg, #D97706, #F59E0B, #FBBF24)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}