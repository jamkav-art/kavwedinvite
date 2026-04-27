"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { QuizResult } from "@/hooks/useAnniversaryQuiz";
import { SCORE_TIERS } from "@/types/anniversary-quiz.types";
import CertificateBreakdown from "./CertificateBreakdown";
import ChallengePartnerCTA from "./ChallengePartnerCTA";
import QuizShareButtons from "./QuizShareButtons";

interface SoulCertificateProps {
  result: QuizResult;
  coupleName1: string;
  coupleName2: string;
  quizId: string;
  inviteId: string;
}

export default function SoulCertificate({
  result,
  coupleName1,
  coupleName2,
  quizId,
  inviteId,
}: SoulCertificateProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const tier = SCORE_TIERS.find((t) => t.id === result.soul_tier)!;

  // Animated counter from 0 → soul_percentage
  useEffect(() => {
    const duration = 1500; // ms
    const startTime = performance.now();
    const target = result.soul_percentage;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercentage(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [result.soul_percentage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Certificate Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Decorative top gradient */}
        <div className="h-2 bg-gradient-to-r from-[--color-gold] via-[--color-rose] to-[--color-gold]" />

        {/* Inner padding */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
              Soul-Sync Certificate
            </p>
            <h2 className="font-serif text-2xl text-[--color-charcoal]">
              {coupleName1}
            </h2>
            <p className="text-gray-300 text-sm">&</p>
            <h2 className="font-serif text-2xl text-[--color-charcoal]">
              {coupleName2}
            </h2>
          </motion.div>

          {/* Score Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-36 h-36">
              {/* Ring background */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 52 * (1 - result.soul_percentage / 100),
                  }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="var(--color-gold)" />
                    <stop offset="100%" stopColor="var(--color-rose)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score text centered */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={displayPercentage}
                  initial={{ scale: 1.3, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-[--color-charcoal]"
                >
                  {displayPercentage}%
                </motion.span>
                <span className="text-xs text-gray-400 mt-1">Soul-Sync</span>
              </div>
            </div>
          </motion.div>

          {/* Tier Badge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[--color-gold]/10 to-[--color-rose]/10 border border-[--color-gold]/20 text-sm font-semibold text-[--color-charcoal]">
              <span className="text-lg">{tier.emoji}</span>
              {tier.title}
            </span>
            <p className="text-xs text-gray-400 mt-2">{tier.description}</p>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Pattern Breakdown */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-4 text-center">
              Pattern Breakdown
            </p>
            <CertificateBreakdown scores={result.scores} />
          </motion.div>

          {/* Correct Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-4"
          >
            <p className="text-sm text-gray-400">
              {result.correctCount} / {result.totalCount} correct
            </p>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Challenge CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <ChallengePartnerCTA
              coupleName1={coupleName1}
              coupleName2={coupleName2}
              quizId={quizId}
              inviteId={inviteId}
            />
          </motion.div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Share Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <QuizShareButtons
              coupleName1={coupleName1}
              coupleName2={coupleName2}
              soulPercentage={result.soul_percentage}
              tierEmoji={tier.emoji}
              inviteId={inviteId}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
