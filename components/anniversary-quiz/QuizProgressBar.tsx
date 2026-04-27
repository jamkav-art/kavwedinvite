"use client";

import React from "react";
import { motion } from "framer-motion";

interface QuizProgressBarProps {
  current: number;
  total: number;
}

export default function QuizProgressBar({
  current,
  total,
}: QuizProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      {/* Fraction display */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-400">
          Question {current} of {total}
        </span>
        <motion.span
          key={percentage}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-xs font-bold text-[--color-rose]"
        >
          {percentage}%
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[--color-gold] to-[--color-rose] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Love dots */}
      <div className="flex gap-1 justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < current
                ? "bg-[--color-rose]"
                : i === current
                  ? "bg-[--color-gold]"
                  : "bg-gray-200"
            }`}
            animate={i === current ? { scale: [1, 1.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        ))}
      </div>
    </div>
  );
}
