'use client'

import { useRef, useLayoutEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useGSAPTimeline } from '@/hooks/useGSAPTimeline'

// AI-ADDED: Dynamic import — protects initial page load; canvas is SSR-safe to skip
const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false })

// AI-ADDED: Template preview data for floating glass cards
const TEMPLATE_PREVIEWS = [
  {
    slug: 'royal-gold',
    name: 'Royal Gold',
    primary: '#8B1A1A',
    accent: '#C9A962',
    tag: 'Most Popular',
  },
  {
    slug: 'celestial-navy',
    name: 'Celestial Navy',
    primary: '#1B2C4E',
    accent: '#C9A962',
    tag: 'Best Seller',
  },
  {
    slug: 'bohemian-wildflower',
    name: 'Bohemian',
    primary: '#C45C8A',
    accent: '#7BAE7F',
    tag: 'Trending',
  },
]

export default function Hero() {
  useGSAPTimeline() // EXISTING — scroll-reveal for all [data-gsap="reveal"] elements

  // AI-ADDED: Separate GSAP context for character-stagger on h1 — runs on mount, no ScrollTrigger
  const titleRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    if (!titleRef.current) return
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>('[data-hero-char]', titleRef.current!)
      gsap.fromTo(
        chars,
        { autoAlpha: 0, y: 36, rotateX: -50 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.055,
          duration: 0.75,
          ease: 'back.out(1.4)',
          delay: 0.15,
        }
      )
    }, titleRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient-bg pt-16">

      {/* AI-ADDED: Gold dust particle system — fixed, behind all content */}
      <ParticleCanvas />

      {/* Decorative background elements — EXISTING, untouched */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-1/4 right-[8%] w-72 h-72 rounded-full border border-[--color-gold]/20" />
        <div className="absolute top-[18%] right-[5%] w-[480px] h-[480px] rounded-full border border-[--color-gold]/8" />
        <div className="absolute bottom-1/4 left-[6%] w-48 h-48 rounded-full border border-[--color-sage]/25" />
        {/* AI-ADDED: ornament-drift animation classes added to existing ornament divs */}
        <div className="absolute top-[12%] left-[4%] font-[--font-cormorant] text-[9rem] text-[--color-gold]/10 leading-none ornament-drift">
          ❧
        </div>
        <div className="absolute bottom-[15%] right-[4%] font-[--font-cormorant] text-[9rem] text-[--color-gold]/10 leading-none rotate-180 ornament-drift-slow">
          ❧
        </div>
      </div>

      {/* AI-ADDED: Floating glass cards — left side, hidden below xl breakpoint */}
      <div
        className="absolute left-[2.5%] top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-5 z-10"
        aria-hidden="true"
      >
        {TEMPLATE_PREVIEWS.slice(0, 2).map((t, i) => (
          <div
            key={t.slug}
            className={`glass-card rounded-2xl p-4 w-44 will-change-transform ${
              i === 0 ? 'float-card-a' : 'float-card-b'
            }`}
          >
            <div
              className="w-full h-[72px] rounded-xl mb-3"
              style={{
                background: `linear-gradient(135deg, ${t.primary} 0%, ${t.accent} 100%)`,
              }}
            />
            <p className="text-xs font-semibold text-[--color-charcoal] truncate leading-tight">
              {t.name}
            </p>
            <span className="text-[10px] text-[--color-gold] font-medium">{t.tag}</span>
          </div>
        ))}
      </div>

      {/* AI-ADDED: Floating glass card — right side */}
      <div
        className="absolute right-[2.5%] top-1/2 -translate-y-1/2 hidden xl:block z-10"
        aria-hidden="true"
      >
        <div className="glass-card rounded-2xl p-4 w-44 will-change-transform float-card-c">
          <div
            className="w-full h-[72px] rounded-xl mb-3"
            style={{
              background: `linear-gradient(135deg, ${TEMPLATE_PREVIEWS[2].primary} 0%, ${TEMPLATE_PREVIEWS[2].accent} 100%)`,
            }}
          />
          <p className="text-xs font-semibold text-[--color-charcoal] truncate leading-tight">
            {TEMPLATE_PREVIEWS[2].name}
          </p>
          <span className="text-[10px] text-[--color-gold] font-medium">
            {TEMPLATE_PREVIEWS[2].tag}
          </span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">

        {/* Eyebrow label — EXISTING data-gsap="reveal" preserved */}
        <p
          data-gsap="reveal"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-6"
        >
          Premium Digital Wedding Invitations
        </p>

        {/* AI-ADDED: Word-level GSAP stagger replaces the single data-gsap="reveal" on h1.
            aria-label keeps full text accessible for screen readers.
            [perspective:800px] enables the 3-D rotateX entrance. */}
        <h1
          ref={titleRef}
          className="font-[--font-cormorant] text-[clamp(2.8rem,5.5vw+1rem,5.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-[--color-charcoal] mb-6 [perspective:800px]"
          aria-label="Create Your Dream Digital Wedding Invitation"
        >
          {/* Line 1 */}
          {['Create', 'Your', 'Dream'].map((word) => (
            <span
              key={word}
              data-hero-char
              className="inline-block mr-[0.28em] will-change-transform"
            >
              {word}
            </span>
          ))}
          <br />
          {/* Line 2 — gold colour */}
          {['Digital', 'Wedding'].map((word) => (
            <span
              key={word}
              data-hero-char
              className="inline-block mr-[0.28em] text-[--color-gold] not-italic will-change-transform"
            >
              {word}
            </span>
          ))}
          <br />
          {/* Line 3 */}
          <span data-hero-char className="inline-block will-change-transform">
            Invitation
          </span>
        </h1>

        {/* Subheadline — EXISTING data-gsap="reveal" preserved */}
        <p
          data-gsap="reveal"
          className="text-lg md:text-xl text-[--color-charcoal]/55 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          8 stunning templates. WhatsApp delivery. Live RSVP collection.
          <br className="hidden sm:block" />
          All for just ₹699 — one-time, no subscriptions.
        </p>

        {/* CTA buttons — EXISTING hrefs, layout, hover classes untouched.
            AI-ADDED: Framer Motion spring badge for ₹699 price. */}
        <div
          data-gsap="reveal"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/order"
            className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[--color-charcoal] text-[--color-cream] font-medium text-base hover:bg-black transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-black/10"
          >
            Create Your Invite
            {/* AI-ADDED: spring-physics price badge */}
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 13, delay: 1.1 }}
              className="inline-flex items-center justify-center bg-[--color-gold] text-[--color-charcoal] text-xs font-bold px-2.5 py-0.5 rounded-full will-change-transform"
            >
              ₹699
            </motion.span>
          </Link>
          <Link
            href="/templates"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full border border-[--color-charcoal]/25 text-[--color-charcoal] font-medium text-base hover:border-[--color-charcoal]/60 hover:bg-black/4 transition-all duration-300"
          >
            Browse Templates →
          </Link>
        </div>

        {/* Trust signals — EXISTING data-gsap="reveal" preserved */}
        <p
          data-gsap="reveal"
          className="mt-10 text-sm text-[--color-charcoal]/40 flex flex-wrap justify-center gap-x-4 gap-y-1"
        >
          <span>✓ Delivered in 24 hours</span>
          <span>·</span>
          <span>✓ WhatsApp shareable</span>
          <span>·</span>
          <span>✓ 1 year validity</span>
        </p>
      </div>
    </section>
  )
}
