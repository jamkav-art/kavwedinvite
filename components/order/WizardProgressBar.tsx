"use client";

import { motion } from "framer-motion";

interface WizardProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export default function WizardProgressBar({
  totalSteps = 24,
  currentStep,
}: WizardProgressBarProps) {
  const maxVisibleDots = 24;

  return (
    <div className="flex items-center justify-center gap-0.5 px-2 py-3 overflow-x-auto">
      {Array.from({ length: Math.min(totalSteps, maxVisibleDots) }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const isCarouselEntry = stepNum === 17; // Special visual marker

        return (
          <div key={i} className="flex items-center gap-0.5">
            {/* Connector bar (between dots) */}
            {i > 0 && (
              <motion.div
                animate={{
                  opacity: isCompleted ? 1 : 0.2,
                  background: isCompleted
                    ? "var(--wiz-accent-gold)"
                    : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.3 }}
                className="h-[2px] w-[6px] rounded-full"
              />
            )}

            {/* Dot */}
            <motion.div
              animate={{
                width: isActive ? 10 : isCompleted ? 8 : 6,
                height: isActive ? 10 : isCompleted ? 8 : 6,
                opacity: isActive ? 1 : isCompleted ? 0.7 : 0.35,
                scale: isActive ? 1.3 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                rounded-full relative
                ${
                  isActive
                    ? "bg-[var(--wiz-accent-gold)] shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                    : isCompleted
                      ? "bg-[var(--wiz-accent-gold)]"
                      : isCarouselEntry
                        ? "bg-[var(--wiz-accent-rose)]"
                        : "bg-white/20"
                }
              `}
            >
              {/* Label for active dot */}
              {isActive && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[0.6rem] font-bold text-[var(--wiz-accent-gold)] whitespace-nowrap">
                  {stepNum}
                </span>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
