import Link from 'next/link'

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
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[--color-cream]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-4">
            Simple Pricing
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(2rem,4vw,3rem)] font-semibold text-[--color-charcoal]">
            One price. Everything included.
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/8 overflow-hidden border border-black/5">
            {/* Gold accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-[--color-gold]/60 via-[--color-gold] to-[--color-gold]/60" />

            <div className="p-8 md:p-10">
              {/* Price display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-start gap-1">
                  <span className="mt-4 text-xl font-medium text-[--color-charcoal]/50">₹</span>
                  <span className="font-[--font-cormorant] text-8xl font-semibold leading-none text-[--color-charcoal]">
                    699
                  </span>
                </div>
                <p className="text-sm text-[--color-charcoal]/45 mt-2">
                  One-time payment · No subscriptions
                </p>
              </div>

              {/* Feature checklist */}
              <ul className="space-y-3.5 mb-8" aria-label="Included features">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-[--color-gold]/15 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        width="9"
                        height="7"
                        viewBox="0 0 9 7"
                        fill="none"
                      >
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

              {/* CTA */}
              <Link
                href="/order"
                className="flex items-center justify-center h-14 rounded-full bg-[--color-charcoal] text-[--color-cream] font-medium text-base hover:bg-black transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-black/15"
              >
                Get Started — ₹699
              </Link>

              <p className="text-center text-xs text-[--color-charcoal]/35 mt-4">
                Secured by Razorpay · UPI, Cards, Net Banking
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
