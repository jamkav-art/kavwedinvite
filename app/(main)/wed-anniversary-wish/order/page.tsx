"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import OrderStepper from "@/components/anniversary-order/OrderStepper";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";

const STEP_COMPONENTS = [Step1, Step2, Step3, Step4] as const;

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-14 bg-gray-100 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-100 rounded-lg" />
        <div className="h-11 bg-gray-100 rounded-lg" />
        <div className="h-11 bg-gray-100 rounded-lg" />
        <div className="h-11 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl" />
    </div>
  );
}

export default function AnniversaryOrderPage() {
  const hasHydrated = useAnniversaryOrderStore((s) => s.hasHydrated);
  const currentStep = useAnniversaryOrderStore((s) => s.currentStep);

  useEffect(() => {
    useAnniversaryOrderStore.persist.rehydrate();
  }, []);

  if (!hasHydrated) return <LoadingSkeleton />;

  const StepComponent = STEP_COMPONENTS[currentStep - 1];

  return (
    <div className="space-y-8">
      <OrderStepper currentStep={currentStep} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
