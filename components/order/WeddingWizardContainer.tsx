"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import WizardProgressBar from "./WizardProgressBar";
import WeddingParticleBackground from "./WeddingParticleBackground";

interface WeddingWizardContainerProps {
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

export default function WeddingWizardContainer({
  children,
}: WeddingWizardContainerProps) {
  const currentStep = useOrderStore((s) => s.currentStep);
  const [direction, setDirection] = React.useState(0);
  const prevStepRef = React.useRef(currentStep);

  React.useEffect(() => {
    const newDirection = currentStep > prevStepRef.current ? 1 : -1;
    setDirection(newDirection);
    prevStepRef.current = currentStep;
  }, [currentStep]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden wiz-bg-animated">
      {/* Particle Background — gold sparkles, petals, orbs */}
      <WeddingParticleBackground />

      {/* Progress Bar */}
      <div className="relative z-10 flex-shrink-0 px-2 pt-4 pb-0">
        <div className="wiz-glass px-3 py-1 mx-auto inline-block">
          <WizardProgressBar totalSteps={24} currentStep={currentStep} />
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-6 pb-8">
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
