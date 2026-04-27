"use client";

import React from "react";
import { motion } from "framer-motion";

export default function QuizCompletionLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream]">
      {/* Animated Heart Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="text-7xl mb-8"
      >
        💓
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="font-serif text-2xl text-[--color-charcoal] mb-2">
          Calculating your Soul-Sync...
        </h2>
        <p className="text-sm text-gray-400">
          Measuring the depth of your connection
        </p>
      </motion.div>

      {/* Loading dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              delay: i * 0.15,
            }}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-[--color-gold] to-[--color-rose]"
          />
        ))}
      </div>

      {/* Sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg"
            initial={{
              x: `${10 + Math.random() * 80}%`,
              y: `${10 + Math.random() * 80}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [`${10 + Math.random() * 80}%`, `${Math.random() * 20}%`],
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 2,
              delay: i * 0.3,
            }}
          >
            {["✨", "⭐", "💫", "🌟"][i % 4]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
