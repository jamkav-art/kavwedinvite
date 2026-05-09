"use client";

import React from "react";
import WizardProgress from "./WizardProgress";

interface WizardContainerProps {
  children: React.ReactNode;
}

/**
 * WizardContainer — full-viewport screen with animated dark navy background.
 * Uses min-h-screen + overflow-hidden to prevent footer bleed-through.
 *
 * NOTE: Slide transitions (AnimatePresence) are handled inside the page
 * component (AnniversaryOrderPage) to avoid unmounting the entire page
 * when currentStep changes — which was causing React error #310
 * (Maximum update depth exceeded) via a cascade of rehydrate() calls.
 */
export default function WizardContainer({ children }: WizardContainerProps) {
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
        <div className="w-full max-w-lg mx-auto">{children}</div>
      </div>
    </div>
  );
}
