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

      {/* Question — gradient text */}
      <h1 className="font-serif text-2xl sm:text-3xl love-story-gradient mb-2 leading-snug">
        When did forever begin?
      </h1>
      <p className="text-sm text-[#F5C6DA]/70 mb-8">Your anniversary date 💌</p>

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
            className="w-full px-6 py-4 text-lg text-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 focus:border-[#C4497C] focus:ring-2 focus:ring-[#C4497C]/30 outline-none transition-all text-white [color-scheme:dark]"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Years Together Counter */}
        {yearsTogether > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
          >
            <motion.span
              key={yearsTogether}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="block text-3xl font-bold text-[#C4497C]"
            >
              {yearsTogether} {yearsTogether === 1 ? "year" : "years"} ❤️
            </motion.span>
            <span className="text-xs text-white/40">of togetherness</span>
          </motion.div>
        )}

        {/* Next Button — animated gradient */}
        <motion.button
          type="submit"
          disabled={!anniversaryDate}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            anniversaryDate
              ? "anniv-step1-cta-btn text-white shadow-lg shadow-[#C4497C]/30 hover:shadow-xl"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
          whileTap={{ scale: anniversaryDate ? 0.98 : 1 }}
        >
          Continue →
        </motion.button>
      </form>
    </motion.div>
  );
}
