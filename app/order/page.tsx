'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOrderStore } from '@/hooks/useOrderStore'
import StepIndicator from '@/components/order/StepIndicator'
import Step1 from './steps/step1'
import Step2 from './steps/step2'
import Step3 from './steps/step3'
import Step4 from './steps/step4'

const STEP_COMPONENTS = [Step1, Step2, Step3, Step4] as const

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
  )
}

export default function OrderPage() {
  const hasHydrated = useOrderStore((s) => s.hasHydrated)
  const currentStep = useOrderStore((s) => s.currentStep)

  useEffect(() => {
    useOrderStore.persist.rehydrate()
  }, [])

  if (!hasHydrated) return <LoadingSkeleton />

  const StepComponent = STEP_COMPONENTS[currentStep - 1]

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={currentStep} />

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
  )
}
