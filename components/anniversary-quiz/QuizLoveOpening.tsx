"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizLoveOpeningProps {
  coupleName1: string;
  coupleName2: string;
  couplePhotoUrl?: string | null;
  onComplete: () => void;
}

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  driftX: number;
  driftY: number;
  duration: number;
  color: string;
  delay: number;
  emoji: string;
}

const PETAL_COLORS = [
  "#FFD700", // gold
  "#FF69B4", // pink
  "#FF1493", // rose
  "#DA70D6", // magenta
  "#F7E7CE", // champagne
  "#B8860B", // deep gold
  "#FFB6C1", // light pink
  "#DDA0DD", // plum
];

const PETAL_EMOJIS = ["🌸", "🌺", "✨", "💛", "🌷", "⭐", "💗", "🪷"];

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 8 + Math.random() * 16,
    rotation: Math.random() * 360,
    driftX: -150 + Math.random() * 300,
    driftY: -250 - Math.random() * 150,
    duration: 2 + Math.random() * 2,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    delay: Math.random() * 2,
    emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
  }));
}

export default function QuizLoveOpening({
  coupleName1,
  coupleName2,
  couplePhotoUrl,
  onComplete,
}: QuizLoveOpeningProps) {
  const [showContent, setShowContent] = useState(false);
  const [showILoveYou, setShowILoveYou] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [exiting, setExiting] = useState(false);

  const petals = useMemo(() => generatePetals(35), []);

  // Staggered reveal of text elements
  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 200);
    const t2 = setTimeout(() => setShowILoveYou(true), 1600);
    const t3 = setTimeout(() => setShowEmoji(true), 2800);

    // Auto-transition after 4 seconds
    const complete = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 600);
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(complete);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="love-opening"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 love-opening-bg flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Floating Petals */}
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute pointer-events-none"
              initial={{
                x: `${50 + (petal.x - 50) * 0.1}%`,
                y: `${50 + (petal.y - 50) * 0.1}%`,
                opacity: 0,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: `${petal.x}%`,
                y: `${petal.y}%`,
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0.3],
                rotate: petal.rotation,
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                repeatDelay: 1 + Math.random() * 2,
                ease: "easeOut",
              }}
              style={{ fontSize: petal.size }}
            >
              {petal.emoji}
            </motion.div>
          ))}

          {/* Couple Photo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 150,
              delay: 0.3,
              duration: 0.8,
            }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[--color-gold] via-[--color-rose] to-[--color-magenta] p-[3px] shadow-xl shadow-[--color-rose]/20">
              {couplePhotoUrl ? (
                <img
                  src={couplePhotoUrl}
                  alt={`${coupleName1} & ${coupleName2}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center text-3xl">
                  💑
                </div>
              )}
            </div>
            {/* Glowing ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[--color-gold]/20 to-[--color-rose]/20 blur-xl animate-pulse" />
          </motion.div>

          {/* "Hey [partnerName] 💕" */}
          <AnimatePresence>
            {showContent && (
              <motion.p
                key="greeting"
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-serif text-xl sm:text-2xl text-white/90 mb-2"
              >
                Hey {coupleName2} 💕
              </motion.p>
            )}
          </AnimatePresence>

          {/* "[coupleName1] told..." */}
          <AnimatePresence>
            {showContent && (
              <motion.p
                key="told"
                initial={{ opacity: 0, y: 15, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-sm sm:text-base text-[--color-champagne] italic mb-4"
              >
                {coupleName1} told me you know them inside out…
              </motion.p>
            )}
          </AnimatePresence>

          {/* "I Love You" — Animated Gradient Text */}
          <AnimatePresence>
            {showILoveYou && (
              <motion.div
                key="iloveyou"
                initial={{ opacity: 0, scale: 0.5, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 120,
                  delay: 0.1,
                }}
                className="mb-4"
              >
                <h1 className="anniversary-gradient-text text-5xl sm:text-7xl font-bold font-serif text-center leading-tight">
                  I Love You
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ❤️ Emoji with zoom animation */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                key="heart-emoji"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                className="love-emoji-zoom text-4xl sm:text-5xl"
              >
                ❤️
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading dots at bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-white/60"
              />
            ))}
          </motion.div>

          {/* Anniversary gradient text styles */}
          <style jsx>{`
            .anniversary-gradient-text {
              background: linear-gradient(
                135deg,
                #c9a962 0%,
                #e8638c 25%,
                #c0185f 50%,
                #d4a0e0 75%,
                #c9a962 100%
              );
              background-size: 300% 300%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: text-shimmer 3s ease-in-out infinite;
            }
            @keyframes text-shimmer {
              0%,
              100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
