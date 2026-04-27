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
              className={`relative w-3 h-3 rounded-full transition-all ${
                isActive
                  ? "bg-[#C4497C] ring-2 ring-[#C4497C]/40 shadow-lg shadow-[#C4497C]/30"
                  : isCompleted
                    ? "bg-[#D4AF37]"
                    : "bg-white/15"
              }`}
              animate={isActive ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              aria-label={`Step ${stepNum}: ${step.label}`}
            >
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-[#C4497C]"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Connector line (except after last) */}
            {index < WIZARD_STEPS.length - 1 && (
              <motion.div
                className={`h-0.5 w-6 sm:w-10 rounded-full ${
                  isCompleted ? "bg-[#D4AF37]" : "bg-white/10"
                }`}
                animate={isCompleted ? { backgroundColor: "#D4AF37" } : {}}
                transition={{ duration: 0.3 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
