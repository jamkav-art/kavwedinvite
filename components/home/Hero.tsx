'use client'

import Link from 'next/link'
import { useGSAPTimeline } from '@/hooks/useGSAPTimeline'

export default function Hero() {
  useGSAPTimeline()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[--color-cream] pt-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-1/4 right-[8%] w-72 h-72 rounded-full border border-[--color-gold]/20" />
        <div className="absolute top-[18%] right-[5%] w-[480px] h-[480px] rounded-full border border-[--color-gold]/8" />
        <div className="absolute bottom-1/4 left-[6%] w-48 h-48 rounded-full border border-[--color-sage]/25" />
        <div className="absolute top-[12%] left-[4%] font-[--font-cormorant] text-[9rem] text-[--color-gold]/10 leading-none">
          ❧
        </div>
        <div className="absolute bottom-[15%] right-[4%] font-[--font-cormorant] text-[9rem] text-[--color-gold]/10 leading-none rotate-180">
          ❧
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow label */}
        <p
          data-gsap="reveal"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-6"
        >
          Premium Digital Wedding Invitations
        </p>

        {/* Main headline */}
        <h1
          data-gsap="reveal"
          className="font-[--font-cormorant] text-[clamp(2.8rem,5.5vw+1rem,5.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-[--color-charcoal] mb-6"
        >
          Create Your Dream
          <br />
          <em className="text-[--color-gold] not-italic">Digital Wedding</em>
          <br />
          Invitation
        </h1>

        {/* Subheadline */}
        <p
          data-gsap="reveal"
          className="text-lg md:text-xl text-[--color-charcoal]/55 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          8 stunning templates. WhatsApp delivery. Live RSVP collection.
          <br className="hidden sm:block" />
          All for just ₹699 — one-time, no subscriptions.
        </p>

        {/* CTA buttons */}
        <div
          data-gsap="reveal"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/order"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-[--color-charcoal] text-[--color-cream] font-medium text-base hover:bg-black transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-black/10"
          >
            Create Your Invite — ₹699
          </Link>
          <Link
            href="/templates"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full border border-[--color-charcoal]/25 text-[--color-charcoal] font-medium text-base hover:border-[--color-charcoal]/60 hover:bg-black/4 transition-all duration-300"
          >
            Browse Templates →
          </Link>
        </div>

        {/* Trust signals */}
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
