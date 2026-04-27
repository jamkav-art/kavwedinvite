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

export default function WizardContainer({ children }: WizardContainerProps) {
  const currentStep = useAnniversaryOrderStore((s) => s.currentStep);
  const [direction, setDirection] = React.useState(0);
  const prevStepRef = React.useRef(currentStep);

  React.useEffect(() => {
    setDirection(currentStep > prevStepRef.current ? 1 : -1);
    prevStepRef.current = currentStep;
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream] flex flex-col">
      {/* Progress Indicator */}
      <div className="flex-shrink-0 px-4 pt-6 pb-2">
        <WizardProgress />
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative overflow-hidden">
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
            className="absolute inset-0 flex items-center justify-center px-6"
          >
            <div className="w-full max-w-lg mx-auto">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
