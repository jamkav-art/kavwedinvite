"use client";

import { motion } from "framer-motion";
import type { ColorMood } from "@/types/anniversary-order.types";
import { COLOR_MOODS, COLOR_MOOD_ORDER } from "@/lib/anniversary-themes";
import { cn } from "@/lib/utils";

interface ColorMoodPickerProps {
  value: ColorMood;
  onChange: (mood: ColorMood) => void;
}

export default function ColorMoodPicker({
  value,
  onChange,
}: ColorMoodPickerProps) {
  return (
    <div className="flex gap-4">
      {COLOR_MOOD_ORDER.map((key) => {
        const mood = COLOR_MOODS[key];
        const selected = value === key;
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
              selected
                ? "border-[--color-gold] shadow-lg"
                : "border-gray-100 bg-white hover:border-gray-200",
            )}
          >
            {/* Color swatch circle */}
            <div
              className={cn(
                "w-16 h-16 rounded-full transition-all duration-200",
                selected && "ring-4 ring-[--color-gold]/20",
              )}
              style={{
                background: `linear-gradient(135deg, ${mood.primary}, ${mood.accent})`,
              }}
            />

            <div className="text-center">
              <p className="text-sm font-semibold text-[--color-charcoal]">
                {mood.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                {mood.description}
              </p>
            </div>

            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-[--color-gold] flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  className="w-3 h-3 text-white"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
