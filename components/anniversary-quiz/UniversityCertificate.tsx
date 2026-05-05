"use client";

import React from "react";
import { motion } from "framer-motion";

interface UniversityCertificateProps {
  coupleName1: string;
  coupleName2: string;
  soulPercentage: number;
  tierTitle: string;
  tierEmoji: string;
}

export default function UniversityCertificate({
  coupleName1,
  coupleName2,
  soulPercentage,
  tierTitle,
  tierEmoji,
}: UniversityCertificateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.7, ease: "easeOut" }}
      className="relative mt-6"
    >
      {/* Certificate Card */}
      <div className="relative bg-gradient-to-br from-[#fdf6e3] via-[#fef9ef] to-[#f5e6c8] rounded-2xl border-2 border-[#c9a962]/40 shadow-2xl overflow-hidden">
        {/* Gold corner ornaments */}
        <div className="certificate-corner certificate-corner-tl" />
        <div className="certificate-corner certificate-corner-tr" />
        <div className="certificate-corner certificate-corner-bl" />
        <div className="certificate-corner certificate-corner-br" />

        {/* Inner decorative border */}
        <div className="m-[18px] border border-[#c9a962]/20 rounded-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
              className="text-3xl mb-2"
            >
              🎓✨💫
            </motion.div>
            <h3 className="font-serif text-xl sm:text-2xl text-[--color-gold] font-bold tracking-wide">
              SOUL-SYNC CERTIFICATE
            </h3>
            <p className="text-xs text-[#a8720a] mt-1 font-medium tracking-[0.15em] uppercase">
              University of Souls
            </p>
            <p className="text-[10px] text-[#c9a962] mt-0.5">
              wedinviter.wasleen.com
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a962]/40 to-transparent" />
            <span className="text-xs text-[#c9a962] italic font-serif">
              Certificate Presented To
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a962]/40 to-transparent" />
          </div>

          {/* Couple Names */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="text-center mb-5"
          >
            <p className="font-serif text-xl sm:text-2xl text-[--color-charcoal] font-bold">
              {coupleName1}{" "}
              <span className="text-[--color-rose] inline-block mx-1">❤️</span>{" "}
              {coupleName2}
            </p>
          </motion.div>

          {/* Certificate Body Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
            className="text-center mb-5"
          >
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic font-serif px-2">
              For the successful completion of the sacred Soul-Sync Quiz — a
              journey of love, laughter, midnight snacks, inside jokes, and
              proving once again that you really{" "}
              <span className="font-semibold not-italic">do</span> know what's
              in their heart (or at least you're getting warmer).
            </p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed italic font-serif mt-3 px-2">
              May your love continue to grow, your arguments stay silly, and
              your partner never finds out you guessed half of these answers.
            </p>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            className="text-center mb-6"
          >
            <div className="w-12 h-px bg-[#c9a962]/30 mx-auto mb-3" />
            <p className="text-xs text-gray-500 italic font-serif px-4 leading-relaxed">
              &ldquo;Love is not about how many days, months, or years you've
              been together. It's about how much you love each other every
              single day.&rdquo;
            </p>
          </motion.div>

          {/* Signature Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-4"
          >
            {/* Chancellor Signature */}
            <div className="text-center">
              <svg
                width="140"
                height="40"
                viewBox="0 0 140 40"
                className="mx-auto mb-1"
              >
                {/* Cursive signature path for "Soul Sync Chancellor" */}
                <path
                  d="M10 30 Q20 10 35 20 Q45 28 50 15 Q55 5 65 22 Q72 32 80 18 Q85 10 95 25 Q100 32 110 18 Q115 10 125 20 Q130 25 135 15"
                  stroke="#8B4513"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                {/* Small heart dot */}
                <circle cx="137" cy="18" r="2" fill="#e8638c" />
              </svg>
              <p className="text-[9px] text-[#8B4513] font-serif italic">
                ── Soul Sync Chancellor ──
              </p>
            </div>

            {/* President Signature */}
            <div className="text-center">
              <svg
                width="140"
                height="40"
                viewBox="0 0 140 40"
                className="mx-auto mb-1"
              >
                {/* Cursive signature path for "President, University of Souls" */}
                <path
                  d="M12 28 Q22 15 32 25 Q40 32 48 18 Q55 8 65 22 Q72 30 82 15 Q88 8 98 22 Q105 30 112 16 Q118 8 128 20 Q132 24 135 14"
                  stroke="#8B4513"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                {/* Small star dot */}
                <circle cx="137" cy="16" r="2" fill="#c9a962" />
              </svg>
              <p className="text-[9px] text-[#8B4513] font-serif italic">
                ── President, University of Souls ──
              </p>
            </div>
          </motion.div>

          {/* Bottom Score Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, type: "spring", stiffness: 100 }}
            className="text-center mt-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[--color-gold]/10 to-[--color-rose]/10 border border-[--color-gold]/20">
              <span className="text-sm">{tierEmoji}</span>
              <span className="text-xs font-semibold text-[--color-charcoal]">
                Soul Score: {soulPercentage}%
              </span>
              <span className="text-[10px] text-gray-400">|</span>
              <span className="text-xs font-medium text-[--color-rose]">
                {tierTitle}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
