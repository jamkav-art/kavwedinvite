'use client'

import { useGSAPTimeline } from '@/hooks/useGSAPTimeline'

export function InviteScrollAnimations() {
  useGSAPTimeline(() => {
    // Hook handles selecting + animating elements with [data-gsap="reveal"]
  })

  return null
}

