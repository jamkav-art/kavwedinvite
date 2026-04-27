"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";

export default function SlidePartnerName() {
  const partnerName = useAnniversaryOrderStore((s) => s.partnerName);
  const yourName = useAnniversaryOrderStore((s) => s.yourName);
  const updateCouple = useAnniversaryOrderStore((s) => s.updateCouple);
  const nextStep = useAnniversaryOrderStore((s) => s.nextStep);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerName.trim()) nextStep();
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
        💕
      </motion.div>

      {/* Question */}
      <h1 className="font-serif text-2xl sm:text-3xl text-[--color-charcoal] mb-2 leading-snug">
        {yourName ? `${yourName}, who's your` : "Who's your"}{" "}
        <span className="text-[--color-rose]">forever person</span>?
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        The one who makes your heart skip 💓
      </p>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={partnerName}
            onChange={(e) => updateCouple({ partnerName: e.target.value })}
            placeholder="Their name..."
            autoFocus
            className="w-full px-6 py-4 text-lg text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 focus:border-[--color-rose] focus:ring-2 focus:ring-[--color-rose]/20 outline-none transition-all placeholder:text-gray-300 font-medium"
            maxLength={50}
          />
          {partnerName && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <span className="text-2xl">💖</span>
            </motion.div>
          )}
        </div>

        {/* Next Button */}
        <motion.button
          type="submit"
          disabled={!partnerName.trim()}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            partnerName.trim()
              ? "bg-gradient-to-r from-[--color-gold] to-[--color-rose] text-white shadow-lg shadow-[--color-rose]/20 hover:shadow-xl hover:scale-[1.02]"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
          whileTap={{ scale: partnerName.trim() ? 0.98 : 1 }}
        >
          Continue →
        </motion.button>
      </form>
    </motion.div>
  );
}
