"use client";

import React from "react";
import { motion } from "framer-motion";

interface QuizEntranceScreenProps {
  coupleName1: string;
  coupleName2: string;
  couplePhotoUrl?: string | null;
  onStart: () => void;
}

export default function QuizEntranceScreen({
  coupleName1,
  coupleName2,
  couplePhotoUrl,
  onStart,
}: QuizEntranceScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream] px-6"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[--color-blush]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[--color-gold]/10 rounded-full blur-3xl" />
      </div>

      {/* Couple Photo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[--color-gold] to-[--color-rose] p-1 shadow-xl">
          {couplePhotoUrl ? (
            <img
              src={couplePhotoUrl}
              alt={`${coupleName1} & ${coupleName2}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl">
              💑
            </div>
          )}
        </div>
        {/* Floating hearts */}
        <motion.div
          animate={{ y: [-10, -20, -10], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 text-xl"
        >
          💕
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center relative z-10"
      >
        <p className="text-sm text-gray-400 mb-2">
          {coupleName1} created a quiz for you
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[--color-charcoal] mb-2 leading-snug">
          How well do you know{" "}
          <span className="text-[--color-rose]">{coupleName1}</span>?
        </h1>
        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
          Think you can predict their heart? Take the challenge and find your
          Soul-Sync score.
        </p>
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onStart}
        className="relative z-10 px-10 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-[--color-gold] to-[--color-rose] text-white shadow-lg shadow-[--color-rose]/20 hover:shadow-xl hover:scale-[1.02] transition-all"
        whileTap={{ scale: 0.98 }}
      >
        Start the Journey →
      </motion.button>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 text-xs text-gray-300"
      >
        Built with ❤️ by WedInviter
      </motion.p>
    </motion.div>
  );
}
