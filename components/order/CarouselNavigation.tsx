"use client";

import { motion } from "framer-motion";

interface CarouselNavigationProps {
  currentIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

export default function CarouselNavigation({
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
  onDotClick,
}: CarouselNavigationProps) {
  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {/* Arrow navigation */}
      <div className="flex items-center gap-6">
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Previous template"
        >
          <svg
            className="w-5 h-5 text-[var(--wiz-text-secondary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <motion.button
              key={i}
              onClick={() => onDotClick(i)}
              animate={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                opacity: i === currentIndex ? 1 : 0.4,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="rounded-full bg-[var(--wiz-accent-gold)] cursor-pointer"
              aria-label={`Go to template ${i + 1}`}
            />
          ))}
        </div>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Next template"
        >
          <svg
            className="w-5 h-5 text-[var(--wiz-text-secondary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Slide counter */}
      <span className="text-xs text-[var(--wiz-text-muted)]">
        {currentIndex + 1} / {totalSlides}
      </span>
    </div>
  );
}
