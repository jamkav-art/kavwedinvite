"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";

function calculateYearsTogether(dateString: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const today = new Date();
  let years = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    years--;
  }
  return Math.max(0, years);
}

export default function SlideAnniversaryDate() {
  const anniversaryDate = useAnniversaryOrderStore((s) => s.anniversaryDate);
  const updateCouple = useAnniversaryOrderStore((s) => s.updateCouple);
  const nextStep = useAnniversaryOrderStore((s) => s.nextStep);

  const yearsTogether = useMemo(
    () => calculateYearsTogether(anniversaryDate),
    [anniversaryDate],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (anniversaryDate) nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      {/* Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-5xl mb-6"
      >
        📅
      </motion.div>

      {/* Question */}
      <h1 className="font-serif text-2xl sm:text-3xl text-[--color-charcoal] mb-2 leading-snug">
        When did forever begin?
      </h1>
      <p className="text-sm text-gray-400 mb-8">Your anniversary date 💌</p>

      {/* Date Input */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="date"
            value={anniversaryDate}
            onChange={(e) => {
              updateCouple({ anniversaryDate: e.target.value });
              if (e.target.value) {
                updateCouple({
                  yearsTogether: calculateYearsTogether(e.target.value),
                });
              }
            }}
            autoFocus
            className="w-full px-6 py-4 text-lg text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 focus:border-[--color-gold] focus:ring-2 focus:ring-[--color-gold]/20 outline-none transition-all text-[--color-charcoal] [color-scheme:light]"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Years Together Counter */}
        {yearsTogether > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="bg-gradient-to-r from-[--color-blush]/30 to-[--color-gold]/10 rounded-2xl p-4 border border-[--color-gold]/20"
          >
            <motion.span
              key={yearsTogether}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="block text-3xl font-bold text-[--color-rose]"
            >
              {yearsTogether} {yearsTogether === 1 ? "year" : "years"} ❤️
            </motion.span>
            <span className="text-xs text-gray-400">of togetherness</span>
          </motion.div>
        )}

        {/* Next Button */}
        <motion.button
          type="submit"
          disabled={!anniversaryDate}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            anniversaryDate
              ? "bg-gradient-to-r from-[--color-gold] to-[--color-rose] text-white shadow-lg shadow-[--color-rose]/20 hover:shadow-xl hover:scale-[1.02]"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
          whileTap={{ scale: anniversaryDate ? 0.98 : 1 }}
        >
          Continue →
        </motion.button>
      </form>
    </motion.div>
  );
}
