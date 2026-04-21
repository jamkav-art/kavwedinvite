'use client'

// AI-ADDED: "use client" directive added — required for useRef, useLayoutEffect,
// and mouse-event handlers. No server-only APIs were used in the original file.

import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimationControls } from 'framer-motion'
import gsap from 'gsap'

// ── EXISTING DATA — untouched ──────────────────────────────────────────────
const FEATURES = [
  'Choose from 8 premium templates',
  'Unlimited events & venues',
  'Photo & video gallery',
  'Voice message from couple',
  'Background music',
  'Live countdown timer',
  'Digital RSVP collection',
  'WhatsApp sharing',
  'Valid for 1 year',
]

export default function Pricing() {
  const cardRef = useRef<HTMLDivElement>(null)
  const btnWrapRef = useRef<HTMLDivElement>(null)
  const priceControls = useAnimationControls()
  const [magPos, setMagPos] = useState({ x: 0, y: 0 })

  // AI-ADDED: GSAP tween for the spinning conic-gradient border via CSS variable
  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card) return
    const proxy = { angle: 0 }
    const tween = gsap.to(proxy, {
      angle: 360,
      duration: 4,
      repeat: -1,
      ease: 'none',
      onUpdate() {
        card.style.setProperty('--border-angle', `${proxy.angle}deg`)
      },
    })
    return () => { tween.kill() }
  }, [])

  // Periodic 3D pop on ₹699 every 4 seconds
  useEffect(() => {
    const trigger = () => {
      priceControls.start({
        scale: [1, 1.14, 0.96, 1.06, 1],
        rotateX: [0, -10, 4, -2, 0],
        transition: { duration: 0.75, ease: 'easeInOut' },
      })
    }
    const id = setInterval(trigger, 4000)
    return () => clearInterval(id)
  }, [priceControls])

  const handleBtnMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = btnWrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.32
    const y = (e.clientY - rect.top - rect.height / 2) * 0.32
    setMagPos({ x, y })
  }
  const handleBtnMouseLeave = () => setMagPos({ x: 0, y: 0 })

  return (
    // EXISTING section structure — id, classes preserved
    <section id="pricing" className="py-24 md:py-32 bg-[--color-cream]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* EXISTING section heading — untouched */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-4">
            Simple Pricing
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(2rem,4vw,3rem)] font-semibold text-[--color-charcoal]">
            One price. Everything included.
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          {/* AI-ADDED: pricing-glow-card wrapper activates the spinning CSS pseudo-element border */}
          <div ref={cardRef} className="pricing-glow-card rounded-3xl">
            {/* Glassmorphism bridal card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/50 shadow-[0_32px_80px_rgba(201,169,98,0.22),0_8px_32px_rgba(192,24,95,0.12),0_2px_8px_rgba(0,0,0,0.05)] bg-gradient-to-br from-white via-[#FFF5F5] to-[#FEF3E2]">

              <div className="h-1.5 bg-gradient-to-r from-[--color-gold]/60 via-[--color-rose] to-[--color-magenta]/70" />

              <div className="p-8 md:p-10">

                {/* Animated gradient price with periodic 3D pop */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-start gap-1" style={{ perspective: '600px' }}>
                    <motion.div
                      animate={priceControls}
                      style={{ transformStyle: 'preserve-3d', display: 'inline-flex', alignItems: 'flex-start', gap: '2px' }}
                    >
                      <span className="mt-4 text-xl font-medium price-gradient-text">₹</span>
                      <span className="font-[--font-cormorant] text-8xl font-semibold leading-none price-gradient-text">
                        699
                      </span>
                    </motion.div>
                  </div>
                  <p className="text-sm text-[--color-charcoal]/45 mt-2">
                    One-time payment · No subscriptions
                  </p>
                </div>

                {/* EXISTING feature checklist — untouched */}
                <ul className="space-y-3.5 mb-8" aria-label="Included features">
                  {FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full bg-[--color-gold]/15 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path
                            d="M1.5 3.5L3.5 5.5L7.5 1.5"
                            stroke="#C9A962"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[--color-charcoal]/65">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* AI-ADDED: Magnetic wrapper div around the existing CTA link.
                    The Link href="/order" and all class names are preserved.
                    Framer Motion spring animates the wrapper on mouse movement. */}
                <div
                  ref={btnWrapRef}
                  onMouseMove={handleBtnMouseMove}
                  onMouseLeave={handleBtnMouseLeave}
                >
                  <motion.div
                    animate={{ x: magPos.x, y: magPos.y }}
                    transition={{ type: 'spring', stiffness: 160, damping: 16, mass: 0.12 }}
                    className="will-change-transform"
                  >
                    <Link
                      href="/order"
                      className="cta-gradient-btn flex items-center justify-center h-14 rounded-full text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] hover:brightness-110 shadow-lg shadow-[--color-magenta]/25"
                    >
                      Get Started — ₹699
                    </Link>
                  </motion.div>
                </div>

                <p className="text-center text-xs text-[--color-charcoal]/45 mt-4">
                  🔒 Secured by Razorpay · 💳 UPI, Cards, Net Banking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
