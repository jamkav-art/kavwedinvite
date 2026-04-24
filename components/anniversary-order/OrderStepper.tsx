"use client";

import { Fragment, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Couple" },
  { number: 2, label: "Quiz" },
  { number: 3, label: "Theme & Music" },
  { number: 4, label: "Message" },
];

interface StepColorConfig {
  /** Gradient Tailwind classes for the completed/active circle background */
  circleBg: string;
  /** Ring glow color for the current step */
  ringColor: string;
  /** Gradient Tailwind classes for the completed/active label text (without bg-clip-text/text-transparent) */
  labelGradient: string;
  /** Gradient Tailwind classes for the connector line fill */
  connectorBg: string;
}

const STEP_COLORS: StepColorConfig[] = [
  {
    // Step 1 — Couple: gold → red (warm, passionate)
    circleBg: "bg-gradient-to-br from-[#F0CB35] to-[#C02425]",
    ringColor: "ring-[#F0CB35]/30",
    labelGradient: "from-[#F0CB35] to-[#C02425]",
    connectorBg: "bg-gradient-to-r from-[#F0CB35] to-[#C02425]",
  },
  {
    // Step 2 — Quiz: light green → green (fresh, playful)
    circleBg: "bg-gradient-to-br from-[#8DC26F] to-[#76b852]",
    ringColor: "ring-[#8DC26F]/30",
    labelGradient: "from-[#8DC26F] to-[#76b852]",
    connectorBg: "bg-gradient-to-r from-[#8DC26F] to-[#76b852]",
  },
  {
    // Step 3 — Theme & Music: red → purple (dramatic, creative)
    circleBg: "bg-gradient-to-br from-[#dc2430] to-[#7b4397]",
    ringColor: "ring-[#dc2430]/30",
    labelGradient: "from-[#dc2430] to-[#7b4397]",
    connectorBg: "bg-gradient-to-r from-[#dc2430] to-[#7b4397]",
  },
  {
    // Step 4 — Message: blue → teal (calm, heartfelt)
    circleBg: "bg-gradient-to-br from-[#185a9d] to-[#43cea2]",
    ringColor: "ring-[#185a9d]/30",
    labelGradient: "from-[#185a9d] to-[#43cea2]",
    connectorBg: "bg-gradient-to-r from-[#185a9d] to-[#43cea2]",
  },
];

/* ── Staggered entrance variants ── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const stepItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 18,
      duration: 0.45,
    },
  },
};

interface OrderStepperProps {
  currentStep: number;
}

export default function OrderStepper({ currentStep }: OrderStepperProps) {
  // Only trigger the staggered entrance on first mount, not on step navigation
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <nav aria-label="Order progress">
      <motion.ol
        className="flex items-center w-full"
        variants={hasMounted ? containerVariants : undefined}
        initial={hasMounted ? "hidden" : undefined}
        animate={hasMounted ? "visible" : undefined}
      >
        {STEPS.map((step, index) => {
          const colors = STEP_COLORS[index];
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isActive = step.number <= currentStep;

          return (
            <Fragment key={step.number}>
              {/* Step bubble + label */}
              <motion.li
                className="flex flex-col items-center shrink-0"
                variants={hasMounted ? stepItemVariants : undefined}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: isCurrent ? 1.08 : 1 }}
                  transition={{ duration: 0.2 }}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                    "text-sm font-semibold transition-all duration-300",
                    isCurrent && [colors.ringColor, "ring-4"],
                    isActive
                      ? `${colors.circleBg} text-white shadow-sm`
                      : "bg-gray-100 text-gray-400 border border-gray-200",
                  )}
                >
                  {isCompleted ? (
                    <svg
                      viewBox="0 0 12 12"
                      fill="none"
                      className="w-3.5 h-3.5"
                      aria-label="Completed"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={cn(isCurrent && "drop-shadow-sm")}
                      aria-label={`Step ${step.number}`}
                    >
                      {step.number}
                    </span>
                  )}
                </motion.div>

                <span
                  className={cn(
                    "mt-1.5 text-[10px] sm:text-xs font-medium text-center leading-tight transition-colors duration-300",
                    isActive
                      ? `bg-gradient-to-r ${colors.labelGradient} bg-clip-text text-transparent`
                      : "text-gray-400",
                  )}
                >
                  {step.label}
                </span>
              </motion.li>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-1 sm:mx-2 mb-5 overflow-hidden rounded-full">
                  <motion.div
                    className={`h-full rounded-full ${colors.connectorBg}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </motion.ol>
    </nav>
  );
}
