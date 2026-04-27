"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  type QuestionCategory,
} from "@/types/anniversary-quiz.types";

interface CertificateBreakdownProps {
  scores: Record<QuestionCategory, number>;
}

const CATEGORIES: QuestionCategory[] = [
  "nostalgia",
  "playful",
  "soul",
  "discovery",
  "future",
];

export default function CertificateBreakdown({
  scores,
}: CertificateBreakdownProps) {
  return (
    <div className="space-y-3">
      {CATEGORIES.map((category, index) => {
        const score = scores[category] ?? 0;
        const emoji = CATEGORY_EMOJI[category] ?? "❓";
        const label = CATEGORY_LABEL[category] ?? category;

        return (
          <motion.div
            key={category}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center gap-1.5">
                <span>{emoji}</span>
                <span className="truncate max-w-[160px] sm:max-w-[200px]">
                  {label}
                </span>
              </span>
              <motion.span
                key={score}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-sm font-bold text-[--color-charcoal]"
              >
                {score}%
              </motion.span>
            </div>

            {/* Bar background */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-gold), var(--color-rose))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{
                  duration: 1,
                  delay: 1.2 + index * 0.1,
                  ease: "easeOut",
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
