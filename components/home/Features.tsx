'use client'

import { useRef, useLayoutEffect } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── EXISTING DATA — untouched ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: '🎨',
    title: '8 Premium Templates',
    description:
      'Royal Gold, Celestial Navy, Bohemian Wildflower & more — each meticulously crafted for Indian weddings.',
  },
  {
    icon: '📅',
    title: 'Unlimited Events',
    description:
      'Mehendi, Sangeet, Wedding, Reception — add every ceremony in a single beautiful invite.',
  },
  {
    icon: '📸',
    title: 'Photo & Video Gallery',
    description:
      'Upload pre-wedding shoot or engagement photos. Your memories, beautifully displayed.',
  },
  {
    icon: '⏳',
    title: 'Live Countdown Timer',
    description:
      'A real-time countdown to your big day — guests feel the excitement build with every visit.',
  },
  {
    icon: '💌',
    title: 'Digital RSVP',
    description:
      'Guests respond with a tap. Collect names, attendance, and meal preferences digitally.',
  },
  {
    icon: '💚',
    title: 'WhatsApp Sharing',
    description:
      'Share your invite link instantly via WhatsApp, email, or any messaging platform.',
  },
  {
    icon: '🎙️',
    title: 'Voice Message',
    description:
      'Record a personal voice message from the couple — a warm touch your guests will love.',
  },
  {
    icon: '🎵',
    title: 'Background Music',
    description:
      'Add your favourite song that plays softly as guests scroll through your invitation.',
  },
]

// ── EXISTING FRAMER MOTION VARIANTS — untouched ────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
}

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' }) // EXISTING

  // AI-ADDED: GSAP horizontal scroll-jacking — desktop only (≥1024px).
  // On smaller viewports the Framer Motion grid below takes over automatically.
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 64),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth + 64}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      }, section)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    // AI-ADDED: bg-[--color-blush] replaces bg-white for the Festive palette.
    // overflow-hidden prevents the horizontal track from creating a scrollbar.
    <section ref={sectionRef} className="relative bg-[--color-blush] overflow-hidden">

      {/* Section heading — EXISTING Framer Motion animation logic preserved */}
      <div className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={headingVariants}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-4">
            Everything You Need
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(2rem,4vw,3rem)] font-semibold text-[--color-charcoal]">
            Your invite, beautifully complete
          </h2>
        </motion.div>

        {/* ── MOBILE GRID (< lg) — EXISTING Framer Motion stagger, glassmorphism cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              // AI-ADDED: glass-feature-card replaces inline bg/border for glassmorphism
              className="p-6 rounded-2xl glass-feature-card hover:border-[--color-gold]/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-4" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-[--color-charcoal] mb-2 text-base leading-snug">
                {feature.title}
              </h3>
              <p className="text-sm text-[--color-charcoal]/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── DESKTOP HORIZONTAL SCROLL TRACK (≥ lg) — GSAP translates this div ── */}
      {/* AI-ADDED: hidden on mobile, flex row on desktop; GSAP pins + scrubs */}
      <div
        ref={trackRef}
        className="hidden lg:flex items-stretch gap-6 px-24 pb-20 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            // AI-ADDED: glass-feature-card + fixed width for the horizontal track
            className="flex-none w-72 p-6 rounded-2xl glass-feature-card hover:border-[--color-gold]/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-3xl mb-4" aria-hidden="true">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-[--color-charcoal] mb-2 text-base leading-snug">
              {feature.title}
            </h3>
            <p className="text-sm text-[--color-charcoal]/50 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
