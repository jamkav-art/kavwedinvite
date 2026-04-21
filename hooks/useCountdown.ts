'use client'

import { useEffect, useMemo, useState } from 'react'

export type CountdownParts = {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function toTargetDate(date: string | Date): Date | null {
  if (date instanceof Date) {
    return Number.isFinite(date.getTime()) ? date : null
  }

  // Accepts YYYY-MM-DD or ISO
  const d = new Date(date)
  if (!Number.isFinite(d.getTime())) return null
  return d
}

export function useCountdown(target: string | Date) {
  const targetDate = useMemo(() => toTargetDate(target), [target])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const parts: CountdownParts = useMemo(() => {
    if (!targetDate) {
      return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const diff = targetDate.getTime() - now
    const totalMs = clamp(diff, 0, Number.POSITIVE_INFINITY)

    const totalSeconds = Math.floor(totalMs / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return { totalMs, days, hours, minutes, seconds }
  }, [now, targetDate])

  return { targetDate, parts, isValid: Boolean(targetDate) }
}
