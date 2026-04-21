'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'
import { cn } from '@/lib/utils'

type CountdownTimerProps = {
  weddingDate: string
  accentColor?: string
  className?: string
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function Ring({
  label,
  value,
  progress,
  accentColor,
}: {
  label: string
  value: string
  progress: number
  accentColor?: string
}) {
  const size = 88
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dashOffset = c * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(0,0,0,0.10)"
            strokeWidth={stroke}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={accentColor ?? 'var(--invite-primary)'}
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="relative h-9 w-10 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={value}
                  initial={{ y: 16, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -16, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="text-2xl font-semibold tabular-nums"
                >
                  {value}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-0.5 text-[10px] tracking-[0.18em] uppercase text-black/50">
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CountdownTimer({ weddingDate, accentColor, className }: CountdownTimerProps) {
  const { parts, isValid } = useCountdown(weddingDate)

  if (!isValid) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-black/10 bg-white/70 px-5 py-6 text-sm text-black/60',
          className
        )}
      >
        Countdown unavailable — invalid wedding date.
      </div>
    )
  }

  const daysProgress = parts.days > 0 ? 1 : 0
  const hoursProgress = parts.hours / 24
  const minutesProgress = parts.minutes / 60
  const secondsProgress = parts.seconds / 60

  return (
    <div
      className={cn(
        'rounded-2xl border border-black/10 bg-white/70 px-4 py-6 sm:px-6',
        className
      )}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
        <Ring
          label="Days"
          value={String(parts.days)}
          progress={daysProgress}
          accentColor={accentColor}
        />
        <Ring
          label="Hours"
          value={pad2(parts.hours)}
          progress={hoursProgress}
          accentColor={accentColor}
        />
        <Ring
          label="Minutes"
          value={pad2(parts.minutes)}
          progress={minutesProgress}
          accentColor={accentColor}
        />
        <Ring
          label="Seconds"
          value={pad2(parts.seconds)}
          progress={secondsProgress}
          accentColor={accentColor}
        />
      </div>
    </div>
  )
}
