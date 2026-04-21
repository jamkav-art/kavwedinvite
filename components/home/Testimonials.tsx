'use client'

import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    quote:
      'Our guests absolutely loved how beautiful and easy it was to open. Everyone kept asking us where we got it made!',
    name: 'Priya & Rahul',
    location: 'Kerala',
    template: 'Classic Ivory',
    initial: 'P',
  },
  {
    quote:
      'The Royal Gold template was exactly what we envisioned for our wedding. Delivered in under 24 hours — truly amazing service!',
    name: 'Sneha & Arjun',
    location: 'Mumbai',
    template: 'Royal Gold',
    initial: 'S',
  },
  {
    quote:
      'So much better than paper invites. Everyone in the family received it on WhatsApp instantly. Worth every single rupee.',
    name: 'Kavya & Vishnu',
    location: 'Bangalore',
    template: 'Celestial Navy',
    initial: 'K',
  },
]

const TESTIMONIAL_ACCENTS = ['❀', '✿', '❁'] as const

const TESTIMONIAL_GLOWS = [
  { bg: 'rgba(255, 240, 245, 0.92)', shadow: '0 8px 28px rgba(232, 99, 140, 0.10)' },
  { bg: 'rgba(255, 248, 232, 0.92)', shadow: '0 8px 28px rgba(201, 169, 98, 0.13)' },
  { bg: 'rgba(250, 245, 255, 0.92)', shadow: '0 8px 28px rgba(139, 92, 246, 0.09)' },
] as const

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[--color-blush] relative overflow-hidden">
      {/* Decorative background floral glyphs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <span className="absolute top-10 left-10 text-8xl opacity-[0.05] text-[--color-gold] select-none">❀</span>
        <span className="absolute bottom-10 right-10 text-8xl opacity-[0.05] text-[--color-gold] select-none">✿</span>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] opacity-[0.03] text-[--color-gold] select-none">❁</span>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-4">
            Happy Couples
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(2rem,4vw,3rem)] font-semibold text-[--color-charcoal]">
            Loved by couples across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => {
            const glow = TESTIMONIAL_GLOWS[i % 3]
            return (
              <motion.div
                key={t.name}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 20px 60px rgba(201, 169, 98, 0.28), 0 0 0 1.5px rgba(201, 169, 98, 0.50)',
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="relative p-7 md:p-8 rounded-2xl border border-[--color-gold]/20 flex flex-col overflow-hidden cursor-default"
                style={{ background: glow.bg, boxShadow: glow.shadow }}
              >
                {/* Floral watermark */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  aria-hidden="true"
                >
                  <span className="text-[150px] leading-none opacity-[0.055] select-none text-[--color-gold]">
                    {TESTIMONIAL_ACCENTS[i % 3]}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col flex-1">
                  <div
                    className="font-[--font-cormorant] text-5xl text-[--color-gold]/60 leading-none mb-4"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>
                  <p className="text-[--color-charcoal]/65 text-sm leading-relaxed flex-1 mb-6">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[--color-gold]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[--color-gold] font-[--font-cormorant] text-lg font-semibold">
                        {t.initial}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[--color-charcoal]">{t.name}</p>
                      <p className="text-xs text-[--color-charcoal]/45">
                        {t.location} · {t.template}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
