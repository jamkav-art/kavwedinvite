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

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-4">
            Happy Couples
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(2rem,4vw,3rem)] font-semibold text-[--color-charcoal]">
            Loved by couples across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-7 md:p-8 rounded-2xl bg-[--color-cream] border border-black/5 flex flex-col"
            >
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
          ))}
        </div>
      </div>
    </section>
  )
}
