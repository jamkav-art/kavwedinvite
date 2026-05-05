"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { QuizResult } from "@/hooks/useAnniversaryQuiz";
import { SCORE_TIERS } from "@/types/anniversary-quiz.types";
import CertificateBreakdown from "./CertificateBreakdown";
import ChallengePartnerCTA from "./ChallengePartnerCTA";
import QuizShareButtons from "./QuizShareButtons";
import UniversityCertificate from "./UniversityCertificate";

interface SoulCertificateProps {
  result: QuizResult;
  coupleName1: string;
  coupleName2: string;
  quizId: string;
  inviteId: string;
}

function ScoreRing({ percentage }: { percentage: number }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.round(eased * percentage));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [percentage]);

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="6"
        />
        {/* Multi-color gradient ring */}
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="url(#multiScoreGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference * (1 - percentage / 100),
          }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient
            id="multiScoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#c9a962" />
            <stop offset="30%" stopColor="#e8638c" />
            <stop offset="60%" stopColor="#c0185f" />
            <stop offset="85%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c9a962" />
          </linearGradient>
        </defs>
      </svg>
      {/* Score text centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={animatedPercent}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold text-[--color-charcoal]"
        >
          {animatedPercent}%
        </motion.span>
        <span className="text-xs text-gray-400 mt-1">Soul-Sync</span>
      </div>
    </div>
  );
}

export default function SoulCertificate({
  result,
  coupleName1,
  coupleName2,
  quizId,
  inviteId,
}: SoulCertificateProps) {
  const tier = SCORE_TIERS.find((t) => t.id === result.soul_tier)!;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto relative"
    >
      {/* Certificate Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* ── Animated Gradient Background Overlay ── */}
        <div className="absolute inset-0 bg-gradient-to-br from-[--color-gold]/[0.03] via-transparent via-[30%] to-[--color-rose]/[0.04] bg-[length:200%_200%] animate-grad-shift pointer-events-none" />

        {/* ── Decorative SVG Lines ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none cert-line z-0"
          viewBox="0 0 400 900"
          preserveAspectRatio="none"
          style={{ animationDelay: "0s" }}
        >
          <line
            x1="20"
            y1="0"
            x2="20"
            y2="900"
            stroke="#c9a962"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <line
            x1="380"
            y1="0"
            x2="380"
            y2="900"
            stroke="#e8638c"
            strokeWidth="0.5"
            opacity="0.1"
          />
          <line
            x1="60"
            y1="120"
            x2="340"
            y2="120"
            stroke="#c9a962"
            strokeWidth="0.3"
            opacity="0.12"
          />
          <line
            x1="60"
            y1="280"
            x2="340"
            y2="280"
            stroke="#e8638c"
            strokeWidth="0.3"
            opacity="0.1"
          />
          <line
            x1="60"
            y1="520"
            x2="340"
            y2="520"
            stroke="#a855f7"
            strokeWidth="0.3"
            opacity="0.08"
          />
          <line
            x1="60"
            y1="700"
            x2="340"
            y2="700"
            stroke="#c9a962"
            strokeWidth="0.3"
            opacity="0.1"
          />
        </svg>

        {/* ── Decorative SVG Lines 2 (diagonal) ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none cert-line z-0"
          viewBox="0 0 400 900"
          preserveAspectRatio="none"
          style={{ animationDelay: "2s" }}
        >
          <line
            x1="0"
            y1="0"
            x2="200"
            y2="900"
            stroke="#c0185f"
            strokeWidth="0.4"
            opacity="0.06"
          />
          <line
            x1="400"
            y1="0"
            x2="200"
            y2="900"
            stroke="#c9a962"
            strokeWidth="0.4"
            opacity="0.06"
          />
        </svg>

        {/* ── Scattered Petals ── */}
        {/* Top-left petal */}
        <svg
          className="absolute top-3 left-3 w-5 h-5 pointer-events-none cert-petal z-[1]"
          viewBox="0 0 20 20"
          fill="#c9a962"
          style={{ animationDelay: "0s", opacity: 0.15 }}
        >
          <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
        </svg>
        {/* Top-right petal */}
        <svg
          className="absolute top-6 right-4 w-4 h-4 pointer-events-none cert-petal z-[1]"
          viewBox="0 0 20 20"
          fill="#e8638c"
          style={{ animationDelay: "1.5s", opacity: 0.12 }}
        >
          <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
        </svg>
        {/* Bottom-left petal */}
        <svg
          className="absolute bottom-20 left-4 w-4 h-4 pointer-events-none cert-petal z-[1]"
          viewBox="0 0 20 20"
          fill="#a855f7"
          style={{ animationDelay: "3s", opacity: 0.1 }}
        >
          <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
        </svg>
        {/* Bottom-right petal */}
        <svg
          className="absolute bottom-32 right-3 w-5 h-5 pointer-events-none cert-petal z-[1]"
          viewBox="0 0 20 20"
          fill="#c0185f"
          style={{ animationDelay: "4.5s", opacity: 0.1 }}
        >
          <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
        </svg>
        {/* Mid-left petal */}
        <svg
          className="absolute top-1/3 left-2 w-3 h-3 pointer-events-none cert-petal z-[1]"
          viewBox="0 0 20 20"
          fill="#ffb6c1"
          style={{ animationDelay: "2s", opacity: 0.1 }}
        >
          <path d="M10 0c0 0 2 6 2 10s-2 10-2 10-2-6-2-10 2-10 2-10z" />
        </svg>

        {/* ── Decorative SVG Flowers ── */}
        {/* Top-right flower */}
        <svg
          className="absolute top-8 right-8 w-6 h-6 pointer-events-none cert-flower z-[1]"
          viewBox="0 0 24 24"
          fill="none"
          style={{ animationDelay: "0.8s", opacity: 0.12 }}
        >
          <circle cx="12" cy="8" r="3" fill="#e8638c" />
          <circle cx="8" cy="14" r="3" fill="#ffd700" />
          <circle cx="16" cy="14" r="3" fill="#e8638c" />
          <circle cx="12" cy="12" r="2" fill="#fff" />
        </svg>
        {/* Bottom-left flower */}
        <svg
          className="absolute bottom-40 left-6 w-5 h-5 pointer-events-none cert-flower z-[1]"
          viewBox="0 0 24 24"
          fill="none"
          style={{ animationDelay: "2.5s", opacity: 0.1 }}
        >
          <circle cx="12" cy="8" r="3" fill="#ffd700" />
          <circle cx="8" cy="14" r="3" fill="#a855f7" />
          <circle cx="16" cy="14" r="3" fill="#ffd700" />
          <circle cx="12" cy="12" r="2" fill="#fff" />
        </svg>
        {/* Mid-right flower */}
        <svg
          className="absolute top-1/2 right-5 w-4 h-4 pointer-events-none cert-flower z-[1]"
          viewBox="0 0 24 24"
          fill="none"
          style={{ animationDelay: "4s", opacity: 0.08 }}
        >
          <circle cx="12" cy="8" r="3" fill="#c0185f" />
          <circle cx="8" cy="14" r="3" fill="#ffb6c1" />
          <circle cx="16" cy="14" r="3" fill="#c0185f" />
          <circle cx="12" cy="12" r="2" fill="#fff" />
        </svg>

        {/* Decorative top gradient - multi-color */}
        <div className="relative h-2 bg-gradient-to-r from-[--color-gold] via-[--color-rose] via-[--color-magenta] to-[--color-gold] bg-[length:200%_100%] animate-pulse z-[2]" />

        {/* Inner padding */}
        <div className="relative p-6 sm:p-8 z-[2]">
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
            <h2 className="font-serif text-2xl bg-gradient-to-r from-[--color-gold] to-[--color-rose] bg-clip-text text-transparent">
              {coupleName1}
            </h2>
            <p className="text-gray-300 text-sm">&</p>
            <h2 className="font-serif text-2xl bg-gradient-to-r from-[--color-rose] to-[--color-magenta] bg-clip-text text-transparent">
              {coupleName2}
            </h2>
          </motion.div>

          {/* Score Circle - Multi-color */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
            className="flex justify-center mb-6"
          >
            <ScoreRing percentage={result.soul_percentage} />
          </motion.div>

          {/* Tier Badge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[--color-gold]/10 via-[--color-rose]/10 to-[--color-magenta]/10 border border-[--color-gold]/20 text-sm font-semibold text-[--color-charcoal]">
              <span className="text-lg">{tier.emoji}</span>
              {tier.title}
            </span>
            <p className="text-xs text-gray-400 mt-2">{tier.description}</p>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Pattern Breakdown - colorful bars */}
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

          {/* University Certificate Section */}
          <UniversityCertificate
            coupleName1={coupleName1}
            coupleName2={coupleName2}
            soulPercentage={result.soul_percentage}
            tierTitle={tier.title}
            tierEmoji={tier.emoji}
          />
        </div>
      </div>
    </motion.div>
  );
}
