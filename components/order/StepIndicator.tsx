'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const STEPS = [
  { number: 1, label: 'Details' },
  { number: 2, label: 'Events' },
  { number: 3, label: 'Media' },
  { number: 4, label: 'Review' },
]

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Order progress">
      <ol className="flex items-center w-full">
        {STEPS.map((step, index) => (
          <Fragment key={step.number}>
            {/* Step bubble + label */}
            <li className="flex flex-col items-center shrink-0">
              <motion.div
                initial={false}
                animate={{ scale: step.number === currentStep ? 1.08 : 1 }}
                transition={{ duration: 0.2 }}
                aria-current={step.number === currentStep ? 'step' : undefined}
                className={cn(
                  'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center',
                  'text-sm font-semibold transition-colors duration-300 ring-0',
                  step.number === currentStep &&
                    'ring-4 ring-[--color-charcoal]/15',
                  step.number <= currentStep
                    ? 'bg-[--color-charcoal] text-[--color-cream]'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                )}
              >
                {step.number < currentStep ? (
                  <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5" aria-label="Completed">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span aria-label={`Step ${step.number}`}>{step.number}</span>
                )}
              </motion.div>

              <span
                className={cn(
                  'mt-1.5 text-[10px] sm:text-xs font-medium text-center leading-tight',
                  step.number <= currentStep
                    ? 'text-[--color-charcoal]'
                    : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </li>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-1 sm:mx-2 mb-5 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-[--color-charcoal] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step.number < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
