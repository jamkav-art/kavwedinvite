'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'

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
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  return (
    <section className="py-24 md:py-32 bg-white" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="p-6 rounded-2xl border border-black/5 bg-[--color-cream]/50 hover:border-[--color-gold]/30 hover:shadow-lg hover:bg-[--color-cream] transition-all duration-300"
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
    </section>
  )
}
