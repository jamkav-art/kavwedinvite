"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";

export default function SlideLoveNote() {
  const loveNote = useAnniversaryOrderStore((s) => s.loveNote);
  const updatePersonalMessage = useAnniversaryOrderStore(
    (s) => s.updatePersonalMessage,
  );
  const nextStep = useAnniversaryOrderStore((s) => s.nextStep);
  const prevStep = useAnniversaryOrderStore((s) => s.prevStep);

  const charCount = loveNote.length;
  const maxChars = 300;

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
        💌
      </motion.div>

      {/* Question */}
      <h1 className="font-serif text-2xl sm:text-3xl text-[--color-charcoal] mb-2 leading-snug">
        Write from your heart
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        A love note they'll see before the quiz 💕
      </p>

      {/* Textarea */}
      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={loveNote}
            onChange={(e) =>
              updatePersonalMessage({
                loveNote: e.target.value.slice(0, maxChars),
              })
            }
            placeholder="My love, I created this quiz because..."
            rows={5}
            autoFocus
            className="w-full px-6 py-5 text-base text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 focus:border-[--color-rose] focus:ring-2 focus:ring-[--color-rose]/20 outline-none transition-all placeholder:text-gray-300 resize-none font-medium leading-relaxed"
            maxLength={maxChars}
          />

          {/* Character count */}
          <div className="absolute bottom-3 right-4 text-xs text-gray-300">
            {charCount}/{maxChars}
          </div>

          {/* Floating hearts effect when typing */}
          {charCount > 0 && (
            <div className="absolute -top-2 -right-2 animate-float-a">
              <span className="text-lg">💖</span>
            </div>
          )}
          {charCount > 50 && (
            <div className="absolute -top-1 -left-1 animate-float-b">
              <span className="text-sm">✨</span>
            </div>
          )}
          {charCount > 100 && (
            <div className="absolute top-1/2 -right-3 animate-float-c">
              <span className="text-lg">💫</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <motion.button
            onClick={prevStep}
            className="flex-1 py-4 rounded-2xl font-semibold bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            whileTap={{ scale: 0.98 }}
          >
            ← Back
          </motion.button>
          <motion.button
            onClick={nextStep}
            className="flex-1 py-4 rounded-2xl font-semibold bg-gradient-to-r from-[--color-gold] to-[--color-rose] text-white shadow-lg shadow-[--color-rose]/20 hover:shadow-xl hover:scale-[1.02] transition-all"
            whileTap={{ scale: 0.98 }}
          >
            {loveNote.trim() ? "Beautiful! →" : "Skip →"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
