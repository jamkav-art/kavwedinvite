"use client";

import React from "react";
import { motion } from "framer-motion";

interface SlideSlideWrapperProps {
  emoji: string;
  heading: string;
  subheading?: string;
  children: React.ReactNode;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  showContinueHint?: boolean;
  onBack?: () => void;
  showBack?: boolean;
}

const staggerItems = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

const emojiVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 20 },
  },
};

const inputVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      delay: 0.15,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      delay: 0.25,
    },
  },
};

const hintVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.6,
    transition: { delay: 0.35 },
  },
};

export default function SlideSlideWrapper({
  emoji,
  heading,
  subheading,
  children,
  onContinue,
  continueLabel = "✨ Continue →",
  continueDisabled = false,
  showContinueHint = true,
  onBack,
  showBack = false,
}: SlideSlideWrapperProps) {
  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center gap-6 w-full"
    >
      {/* Emoji */}
      <motion.div
        variants={emojiVariants}
        className="text-[clamp(2.5rem,6vw,3.5rem)] select-none"
        aria-hidden="true"
      >
        {emoji}
      </motion.div>

      {/* Heading */}
      <motion.h2
        variants={itemVariants}
        className="wiz-heading-gradient font-[var(--font-cormorant)] font-semibold leading-tight"
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          letterSpacing: "0.02em",
        }}
      >
        {heading}
      </motion.h2>

      {/* Subheading */}
      {subheading && (
        <motion.p
          variants={itemVariants}
          className="text-[var(--wiz-text-secondary)] text-sm -mt-3"
        >
          {subheading}
        </motion.p>
      )}

      {/* Input / Content area */}
      <motion.div variants={inputVariants} className="w-full">
        {children}
      </motion.div>

      {/* Continue Button */}
      {onContinue && (
        <motion.div variants={buttonVariants} className="w-full">
          <motion.button
            onClick={onContinue}
            disabled={continueDisabled}
            whileHover={!continueDisabled ? { scale: 1.03 } : {}}
            whileTap={!continueDisabled ? { scale: 0.97 } : {}}
            className={`
              relative w-full h-[52px] rounded-2xl overflow-hidden font-semibold
              text-white text-base tracking-[0.05em] transition-all duration-300
              ${
                continueDisabled
                  ? "opacity-40 cursor-not-allowed bg-white/10"
                  : "wiz-btn-gradient cursor-pointer shadow-lg shadow-black/20"
              }
            `}
          >
            {!continueDisabled && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-wiz-shimmer-sweep" />
            )}
            <span className="relative z-10">{continueLabel}</span>
          </motion.button>
        </motion.div>
      )}

      {/* "press Enter or tap Continue" hint */}
      {showContinueHint && onContinue && (
        <motion.p
          variants={hintVariants}
          className="text-xs text-[var(--wiz-text-muted)] select-none"
        >
          press Enter or tap {continueLabel}
        </motion.p>
      )}

      {/* Back button */}
      {showBack && onBack && (
        <motion.button
          onClick={onBack}
          className="text-sm text-[var(--wiz-text-secondary)] hover:text-[var(--wiz-accent-gold)] transition-colors font-medium tracking-[0.04em] self-start -ml-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ← Back
        </motion.button>
      )}
    </motion.div>
  );
}
