'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOrderStore } from '@/hooks/useOrderStore'
import { Button } from '@/components/ui/Button'
import EventForm from '@/components/order/EventForm'
import { step2Schema } from '@/lib/validation'
import { cn } from '@/lib/utils'
import type { EventFormData } from '@/types/order.types'

const QUICK_ADD = ['Mehendi', 'Haldi', 'Sangeet', 'Wedding', 'Reception'] as const

type EventErrors = Record<string, Partial<Record<keyof EventFormData, string>>>

function makeEmptyEvent(name = ''): EventFormData {
  return {
    event_name: name,
    event_date: '',
    event_time: '',
    venue_name: '',
    venue_address: '',
    venue_city: '',
    venue_map_link: '',
  }
}

export default function Step2() {
  const { events, addEvent, updateEvent, removeEvent, nextStep, prevStep } = useOrderStore()
  const [eventErrors, setEventErrors] = useState<EventErrors>({})
  const [listError, setListError] = useState('')

  const handleAdd = (name = '') => {
    addEvent(makeEmptyEvent(name))
    setListError('')
  }

  const handleNext = () => {
    const result = step2Schema.safeParse({ events })

    if (!result.success) {
      const newEventErrors: EventErrors = {}
      let newListError = ''

      result.error.issues.forEach((err) => {
        const [root, idx, field] = err.path
        if (root === 'events' && typeof idx === 'number' && field) {
          const key = String(idx)
          newEventErrors[key] = newEventErrors[key] ?? {}
          newEventErrors[key][field as keyof EventFormData] = err.message
        } else if (root === 'events') {
          newListError = err.message
        }
      })

      setEventErrors(newEventErrors)
      setListError(newListError)
      return
    }

    setEventErrors({})
    setListError('')
    nextStep()
  }

  const quickAddUsed = QUICK_ADD.filter((name) =>
    events.some((e) => e.event_name.toLowerCase() === name.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold text-[--color-charcoal] leading-tight">
          Add your events
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Step 2 of 4 — add all your ceremonies and celebrations
        </p>
      </div>

      {/* Quick-add pills */}
      <div className="space-y-2.5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quick add</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD.map((name) => {
            const used = quickAddUsed.includes(name)
            return (
              <button
                key={name}
                type="button"
                disabled={used}
                onClick={() => handleAdd(name)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                  'border transition-all duration-150',
                  used
                    ? 'bg-[--color-charcoal] text-[--color-cream] border-[--color-charcoal] opacity-60 cursor-not-allowed'
                    : 'bg-white text-[--color-charcoal] border-gray-200 hover:border-[--color-charcoal] hover:bg-gray-50 active:scale-[0.97]'
                )}
                aria-label={used ? `${name} already added` : `Add ${name} event`}
              >
                {!used && (
                  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                    <path d="M6 1a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5H1.75a.75.75 0 010-1.5h3.5V1.75A.75.75 0 016 1z" />
                  </svg>
                )}
                {used && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {name}
              </button>
            )
          })}
        </div>
      </div>

      {/* List error (no events) */}
      {listError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="text-sm text-[--color-terracotta] flex items-center gap-1.5"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
          {listError}
        </motion.p>
      )}

      {/* Event cards */}
      {events.length === 0 && !listError && (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-300" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No events yet</p>
          <p className="text-xs text-gray-300 mt-0.5">Use quick add above or click below</p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {events.map((event, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <EventForm
              event={event}
              index={index}
              onUpdate={updateEvent}
              onRemove={(i) => {
                removeEvent(i)
                setEventErrors((prev) => {
                  const next: EventErrors = {}
                  Object.entries(prev).forEach(([k, v]) => {
                    const n = parseInt(k)
                    if (n < i) next[String(n)] = v
                    else if (n > i) next[String(n - 1)] = v
                  })
                  return next
                })
              }}
              errors={eventErrors[String(index)]}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add custom event button */}
      <button
        type="button"
        onClick={() => handleAdd()}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 rounded-2xl',
          'border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400',
          'hover:border-[--color-charcoal]/40 hover:text-[--color-charcoal]',
          'transition-colors duration-150 active:scale-[0.99]'
        )}
      >
        <svg viewBox="0 0 12 12" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
          <path d="M6 1a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5H1.75a.75.75 0 010-1.5h3.5V1.75A.75.75 0 016 1z" />
        </svg>
        Add custom event
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Button
          variant="secondary"
          onClick={prevStep}
          className="gap-1.5"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Button>

        <Button onClick={handleNext} size="lg" className="gap-2">
          Continue to Media
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  )
}
