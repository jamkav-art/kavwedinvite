"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";

export default function SlideName() {
  const yourName = useAnniversaryOrderStore((s) => s.yourName);
  const updateCouple = useAnniversaryOrderStore((s) => s.updateCouple);
  const nextStep = useAnniversaryOrderStore((s) => s.nextStep);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (yourName.trim()) nextStep();
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
        ✨
      </motion.div>

      {/* Question — gradient text */}
      <h1 className="font-serif text-2xl sm:text-3xl love-story-gradient mb-2 leading-snug">
        What's your name?
      </h1>
      <p className="text-sm text-[#F5C6DA]/70 mb-8">
        Let's start your love story ✍️
      </p>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={yourName}
            onChange={(e) => updateCouple({ yourName: e.target.value })}
            placeholder="Type your name..."
            autoFocus
            className="w-full px-6 py-4 text-lg text-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 focus:border-[#C4497C] focus:ring-2 focus:ring-[#C4497C]/30 outline-none transition-all placeholder:text-white/25 text-white font-medium"
            maxLength={50}
          />
          {yourName && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Next Button — animated gradient */}
        <motion.button
          type="submit"
          disabled={!yourName.trim()}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            yourName.trim()
              ? "anniv-step1-cta-btn text-white shadow-lg shadow-[#C4497C]/30 hover:shadow-xl"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
          whileTap={{ scale: yourName.trim() ? 0.98 : 1 }}
        >
          Continue →
        </motion.button>
      </form>

      {/* Hint */}
      <p className="mt-6 text-xs text-white/20">Press Enter or tap Continue</p>
    </motion.div>
  );
}
