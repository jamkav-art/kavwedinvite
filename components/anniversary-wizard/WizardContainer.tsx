"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import WizardProgress from "./WizardProgress";

interface WizardContainerProps {
  children: React.ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

/**
 * WizardContainer — full-viewport screen with animated dark navy background.
 * Uses min-h-screen + overflow-hidden to prevent footer bleed-through.
 */
export default function WizardContainer({ children }: WizardContainerProps) {
  const currentStep = useAnniversaryOrderStore((s) => s.currentStep);
  const [direction, setDirection] = React.useState(0);
  const prevStepRef = React.useRef(currentStep);

  React.useEffect(() => {
    setDirection(currentStep > prevStepRef.current ? 1 : -1);
    prevStepRef.current = currentStep;
  }, [currentStep]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden anniversary-bg-animated">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full bg-[#C4497C]/15 blur-[120px] animate-orb-drift-slow" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-[#7B5EA7]/15 blur-[120px] animate-orb-drift-slower" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] rounded-full bg-[#D4AF37]/10 blur-[100px] animate-orb-pulse" />
      </div>

      {/* Progress Indicator */}
      <div className="relative z-10 flex-shrink-0 px-4 pt-6 pb-2">
        <WizardProgress />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-6">
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
