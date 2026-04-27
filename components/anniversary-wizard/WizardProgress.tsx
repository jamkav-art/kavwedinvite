"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { WIZARD_STEPS } from "@/types/anniversary-quiz.types";

export default function WizardProgress() {
  const currentStep = useAnniversaryOrderStore((s) => s.currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {WIZARD_STEPS.map((step, index) => {
        const stepNum = step.step;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;

        return (
          <React.Fragment key={stepNum}>
            {/* Dot */}
            <motion.button
              className={`relative w-3 h-3 rounded-full transition-colors ${
                isActive
                  ? "bg-[--color-gold] ring-2 ring-[--color-gold]/30"
                  : isCompleted
                    ? "bg-[--color-rose]"
                    : "bg-gray-200"
              }`}
              animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              aria-label={`Step ${stepNum}: ${step.label}`}
            />

            {/* Connector line (except after last) */}
            {index < WIZARD_STEPS.length - 1 && (
              <motion.div
                className={`h-0.5 w-6 sm:w-10 rounded-full ${
                  isCompleted ? "bg-[--color-rose]" : "bg-gray-200"
                }`}
                animate={
                  isCompleted ? { backgroundColor: "var(--color-rose)" } : {}
                }
                transition={{ duration: 0.3 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
