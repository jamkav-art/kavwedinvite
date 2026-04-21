'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

const rsvpSchema = z.object({
  guest_name: z.string().min(2, "Please enter your full name").max(100),
  attending: z.enum(['yes', 'no']),
  guest_count: z.number().min(1).max(20),
  phone_number: z.string().max(20).optional(),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional()
})

type FormValues = z.infer<typeof rsvpSchema>

type RSVPFormProps = {
  inviteId: string
  accentColor?: string
  className?: string
}

export default function RSVPForm({ inviteId, accentColor, className }: RSVPFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guest_name: '',
      attending: 'yes',
      guest_count: 1,
      phone_number: '',
      message: '',
    },
    mode: 'onChange',
  })

  const attendingStatus = watch('attending')

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          attending: data.attending === 'yes',
          invite_id: inviteId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit RSVP.')
      }

      const params = new URLSearchParams({
        name: data.guest_name,
        attending: data.attending,
      })
      router.push(`/invite/${inviteId}/rsvp?${params.toString()}`)
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'RSVP failed. Please try again.')
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className={cn('rounded-2xl border border-black/10 bg-white/70 p-5 sm:p-6', className)}
      style={{ borderColor: `${accentColor ?? 'var(--invite-border)'}55` }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-xs font-medium text-black/55 uppercase tracking-wide">Your name</span>
          <input
            {...register('guest_name')}
            className={cn(
              "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 transition-shadow",
              errors.guest_name ? "border-red-300 focus:ring-red-100" : "border-black/10 focus:ring-black/5"
            )}
            placeholder="Enter your name"
            autoComplete="name"
          />
          {errors.guest_name && (
            <p className="text-[10px] text-red-500 mt-1">{errors.guest_name.message}</p>
          )}
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-black/55 uppercase tracking-wide">Phone (optional)</span>
          <input
            {...register('phone_number')}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
            placeholder="WhatsApp number"
            autoComplete="tel"
          />
          {errors.phone_number && (
            <p className="text-[10px] text-red-500 mt-1">{errors.phone_number.message}</p>
          )}
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-black/10 bg-white/60 p-4">
        <p className="text-xs font-medium text-black/55 uppercase tracking-wide">Will you be attending?</p>
        <div className="mt-3 flex gap-2">
          <Controller
            name="attending"
            control={control}
            render={({ field }) => (
              <>
                {(['yes', 'no'] as const).map((choice) => {
                  const active = field.value === choice
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => field.onChange(choice)}
                      className={cn(
                        'flex-1 rounded-full px-4 py-2 text-sm font-semibold border transition-all duration-300',
                        active ? 'text-white shadow-md' : 'bg-white text-black border-black/10 hover:bg-black/[0.03] opacity-60 hover:opacity-100'
                      )}
                      style={
                        active
                          ? { background: accentColor ?? 'var(--invite-secondary)', borderColor: 'transparent' }
                          : undefined
                      }
                    >
                      {choice === 'yes' ? "Joyfully Accept" : "Regretfully Decline"}
                    </button>
                  )
                })}
              </>
            )}
          />
        </div>

        <AnimatePresence initial={false}>
          {attendingStatus === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="pt-2 border-t border-black/5">
                <label className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-black/55 uppercase tracking-wide">Guest count</span>
                  <div>
                    <input
                      type="number"
                      {...register('guest_count', { valueAsNumber: true })}
                      className="w-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-shadow text-center"
                    />
                    {errors.guest_count && (
                      <p className="text-[10px] text-red-500 mt-1 w-24 text-center">{errors.guest_count.message}</p>
                    )}
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <label className="mt-4 block space-y-1">
        <span className="text-xs font-medium text-black/55 uppercase tracking-wide">Message (optional)</span>
        <textarea
          {...register('message')}
          className="min-h-[92px] w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
          placeholder="Write a blessing or short note..."
        />
        {errors.message && (
          <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>
        )}
      </label>

      {serverError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-xs text-red-600 text-center font-medium">{serverError}</p>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={cn(
          'mt-5 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all duration-300',
          isValid && !isSubmitting ? 'text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-black/5 text-black/40 cursor-not-allowed border border-black/5'
        )}
        style={isValid && !isSubmitting ? { background: accentColor ?? 'var(--invite-primary)' } : undefined}
      >
        {isSubmitting ? 'Sending your love...' : 'Submit RSVP'}
      </button>
    </form>
  )
}
