'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useOrderStore } from '@/hooks/useOrderStore'
import { Input } from '@/components/ui/Input'
import TemplateSelector from '@/components/order/TemplateSelector'
import { step1Schema } from '@/lib/validation'
import { cn } from '@/lib/utils'

type FieldErrors = Partial<Record<'couple_name_1' | 'couple_name_2' | 'wedding_date' | 'template_slug', string>>

export default function Step1() {
  const store = useOrderStore()
  const [errors, setErrors] = useState<FieldErrors>({})
  const templateRef = useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().split('T')[0]
  const twoYearsOut = new Date()
  twoYearsOut.setFullYear(twoYearsOut.getFullYear() + 2)
  const maxDate = twoYearsOut.toISOString().split('T')[0]

  const handleNext = () => {
    const result = step1Schema.safeParse({
      couple_name_1: store.couple_name_1,
      couple_name_2: store.couple_name_2,
      wedding_date: store.wedding_date,
      template_slug: store.template_slug,
    })

    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof FieldErrors
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = err.message
        }
      })
      setErrors(fieldErrors)

      if (fieldErrors.template_slug) {
        templateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    setErrors({})
    store.nextStep()
  }

  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold logo-gradient-text leading-tight">
          Let&rsquo;s start with your details
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Step 1 of 4 — couple names, wedding date, and template
        </p>
      </div>

      {/* Couple names */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold logo-gradient-text">The couple</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Bride / Partner 1"
            placeholder="e.g. Priya"
            required
            autoFocus
            value={store.couple_name_1}
            onChange={(e) => {
              store.updateCouple({ couple_name_1: e.target.value })
              if (errors.couple_name_1) setErrors((p) => ({ ...p, couple_name_1: undefined }))
            }}
            error={errors.couple_name_1}
          />
          <Input
            label="Groom / Partner 2"
            placeholder="e.g. Rahul"
            required
            value={store.couple_name_2}
            onChange={(e) => {
              store.updateCouple({ couple_name_2: e.target.value })
              if (errors.couple_name_2) setErrors((p) => ({ ...p, couple_name_2: undefined }))
            }}
            error={errors.couple_name_2}
          />
        </div>
      </div>

      {/* Wedding date */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold logo-gradient-text">Wedding date</h2>
        <div className="max-w-xs">
          <Input
            label="Date of the wedding"
            type="date"
            required
            min={today}
            max={maxDate}
            value={store.wedding_date}
            onChange={(e) => {
              store.updateCouple({ wedding_date: e.target.value })
              if (errors.wedding_date) setErrors((p) => ({ ...p, wedding_date: undefined }))
            }}
            error={errors.wedding_date}
            hint="Must be within the next 2 years"
          />
        </div>
      </div>

      {/* Template selection */}
      <div ref={templateRef} className="space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold logo-gradient-text">
            Choose your template
            <span className="ml-0.5 text-[--color-terracotta]" aria-hidden="true">
              *
            </span>
          </h2>
          <span className="text-xs text-gray-400">8 premium designs</span>
        </div>

        {errors.template_slug && (
          <p role="alert" className="text-xs text-[--color-terracotta] flex items-center gap-1">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
            {errors.template_slug}
          </p>
        )}

        <div
          className={cn(
            'rounded-2xl p-1 transition-all duration-200',
            errors.template_slug && 'ring-2 ring-[--color-terracotta]/40 rounded-2xl'
          )}
        >
          <TemplateSelector
            selectedSlug={store.template_slug || null}
            onSelect={(slug) => {
              store.selectTemplate(slug)
              setErrors((p) => ({ ...p, template_slug: undefined }))
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-2 border-t border-gray-100">
        <motion.button
          onClick={handleNext}
          whileHover={{
            scale: 1.04,
            y: -2,
            boxShadow: '0 12px 40px rgba(192,24,95,0.45), 0 0 0 3px rgba(201,169,98,0.35)',
          }}
          whileTap={{ scale: 0.97, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          className="order-cta-btn inline-flex items-center gap-2 h-14 px-8 text-base font-semibold rounded-full text-white"
        >
          Continue to Events
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}
