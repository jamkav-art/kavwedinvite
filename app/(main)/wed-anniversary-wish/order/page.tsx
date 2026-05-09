"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";

// Lazy load slides for better performance
const SlideName = dynamic(
  () => import("@/components/anniversary-wizard/SlideName"),
  { ssr: false },
);
const SlidePartnerName = dynamic(
  () => import("@/components/anniversary-wizard/SlidePartnerName"),
  { ssr: false },
);
const SlideAnniversaryDate = dynamic(
  () => import("@/components/anniversary-wizard/SlideAnniversaryDate"),
  { ssr: false },
);
const SlideCouplePhoto = dynamic(
  () => import("@/components/anniversary-wizard/SlideCouplePhoto"),
  { ssr: false },
);
const SlideQuizMatrix = dynamic(
  () => import("@/components/anniversary-wizard/SlideQuizMatrix"),
  { ssr: false },
);
const SlideLoveNote = dynamic(
  () => import("@/components/anniversary-wizard/SlideLoveNote"),
  { ssr: false },
);
const SlideReviewPay = dynamic(
  () => import("@/components/anniversary-wizard/SlideReviewPay"),
  { ssr: false },
);

const SLIDE_MAP: Record<number, React.ComponentType> = {
  1: SlideName,
  2: SlidePartnerName,
  3: SlideAnniversaryDate,
  4: SlideCouplePhoto,
  5: SlideQuizMatrix,
  6: SlideLoveNote,
  7: SlideReviewPay,
};

// ── Slide transition variants (moved from WizardContainer) ──
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

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[--color-blush] to-[--color-gold]/20 animate-pulse" />
        <div className="h-8 w-48 mx-auto bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-32 mx-auto bg-gray-50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// ── Inline Error Boundary ──
class SlideErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      "[SlideErrorBoundary] Caught error:",
      error.message,
      error.stack,
    );
    console.error("[SlideErrorBoundary] Component stack:", info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      console.log(
        "[SlideErrorBoundary] Rendering fallback, error:",
        this.state.error?.message,
      );
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function AnniversaryOrderPage() {
  const currentStep = useAnniversaryOrderStore((s) => s.currentStep);
  const hasHydrated = useAnniversaryOrderStore((s) => s.hasHydrated);

  // ── Direction tracking for slide animations (moved from WizardContainer) ──
  const [direction, setDirection] = React.useState(0);
  const prevStepRef = React.useRef(currentStep);

  useEffect(() => {
    setDirection(currentStep > prevStepRef.current ? 1 : -1);
    prevStepRef.current = currentStep;
  }, [currentStep]);

  // ── Hydration ──
  useEffect(() => {
    console.log("[AnniversaryOrderPage] Calling rehydrate()");
    const promise = useAnniversaryOrderStore.persist.rehydrate();
    if (promise && typeof (promise as Promise<void>).then === "function") {
      (promise as Promise<void>)
        .then(() => {
          console.log("[AnniversaryOrderPage] rehydrate() completed");
        })
        .catch((err: unknown) => {
          console.error("[AnniversaryOrderPage] rehydrate() failed:", err);
        });
    }
  }, []);

  useEffect(() => {
    console.log("[AnniversaryOrderPage] state changed", {
      currentStep,
      hasHydrated,
    });
  }, [currentStep, hasHydrated]);

  if (!hasHydrated) {
    console.log(
      "[AnniversaryOrderPage] Not hydrated yet, showing LoadingSkeleton",
    );
    return <LoadingSkeleton />;
  }

  const SlideComponent = SLIDE_MAP[currentStep];
  console.log("[AnniversaryOrderPage] Rendering slide", {
    currentStep,
    SlideComponentName:
      (SlideComponent as any)?.name ||
      (SlideComponent as any)?.displayName ||
      "unknown",
  });

  if (!SlideComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Step not found</p>
      </div>
    );
  }

  return (
    <SlideErrorBoundary
      fallback={
        <div className="text-white text-center p-10">Slide crashed</div>
      }
    >
      {/*
        AnimatePresence is placed HERE, wrapping ONLY the slide component.
        This prevents the entire AnniversaryOrderPage from being unmounted
        when currentStep changes (which was the root cause of React error #310).
      */}
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
          <SlideComponent />
        </motion.div>
      </AnimatePresence>
    </SlideErrorBoundary>
  );
}
