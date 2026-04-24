"use client";

import { motion } from "framer-motion";
import type { FloralTheme } from "@/types/anniversary-order.types";
import { FLORAL_THEMES, FLORAL_THEME_ORDER } from "@/lib/anniversary-themes";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  value: FloralTheme;
  onChange: (theme: FloralTheme) => void;
}

export default function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FLORAL_THEME_ORDER.map((key) => {
        const theme = FLORAL_THEMES[key];
        const selected = value === key;
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className={cn(
              "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
              selected
                ? "border-[--color-gold] bg-[--color-blush] shadow-lg shadow-[--color-gold]/10"
                : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm",
            )}
          >
            {/* Decorative gradient bar */}
            <div
              className={cn(
                "w-full h-12 rounded-xl bg-gradient-to-br",
                theme.gradient,
                selected && "ring-2 ring-[--color-gold]/30",
              )}
            />

            <div className="text-center">
              <p className="text-lg">{theme.emoji}</p>
              <p className="text-sm font-semibold text-[--color-charcoal] mt-1">
                {theme.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                {theme.description}
              </p>
            </div>

            {/* Selected indicator */}
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[--color-gold] flex items-center justify-center"
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
