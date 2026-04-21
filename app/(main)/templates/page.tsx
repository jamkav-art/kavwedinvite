import Link from 'next/link'
import type { Metadata } from 'next'
import { TEMPLATES } from '@/lib/templates'

export const metadata: Metadata = {
  title: 'Wedding Invitation Templates',
  description:
    'Browse 8 premium digital wedding invitation templates — Royal Gold, Celestial Navy, Bohemian Wildflower, and more. All for ₹699.',
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    title: 'Wedding Invitation Templates | WedInviter',
    description:
      'Browse 8 premium digital wedding invitation templates — Royal Gold, Celestial Navy, Bohemian Wildflower, and more. All for ₹699.',
    url: '/templates',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Invitation Templates | WedInviter',
    description:
      'Browse 8 premium digital wedding invitation templates. Royal Gold, Celestial Navy, Bohemian Wildflower & more. All for ₹699.',
    images: ['/og-default.png'],
  },
}

export default function TemplatesPage() {
  return (
    <div className="bg-[--color-cream] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Page header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] logo-gradient-text mb-4">
            8 Premium Designs
          </p>
          <h1 className="font-[--font-cormorant] text-[clamp(2.5rem,5vw,4rem)] font-semibold logo-gradient-text mb-4">
            Choose Your Template
          </h1>
          <p className="text-[--color-charcoal]/55 max-w-lg mx-auto text-base leading-relaxed">
            Each template is meticulously crafted with unique typography, colours, and decorative
            motifs. One price — ₹699 — gets you everything.
          </p>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.slug}
              className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-xl hover:border-transparent transition-all duration-300"
            >
              {/* Visual preview */}
              <div
                className="h-44 relative overflow-hidden flex items-center justify-center p-5"
                style={{ backgroundColor: template.colors.background }}
              >
                {/* Template name preview */}
                <div className="text-center z-10 relative">
                  <p
                    className="font-[--font-cormorant] text-xl font-semibold mb-1 leading-tight"
                    style={{ color: template.colors.primary }}
                  >
                    {template.name}
                  </p>
                  <p
                    className="text-xs italic"
                    style={{ color: template.colors.secondary }}
                  >
                    {template.tagline}
                  </p>
                </div>

                {/* Color swatches */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                  {[
                    template.colors.primary,
                    template.colors.secondary,
                    template.colors.accent,
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full shadow-sm ring-1 ring-white/60"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-semibold text-[--color-charcoal] text-base leading-snug">
                    {template.name}
                  </h2>
                  <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-[--color-cream] text-[--color-charcoal]/45 border border-black/5 whitespace-nowrap">
                    {template.mood}
                  </span>
                </div>

                <p className="text-sm text-[--color-charcoal]/50 leading-relaxed mb-4 line-clamp-2">
                  {template.description}
                </p>

                <Link
                  href={`/order?template=${template.slug}`}
                  className="template-card-btn flex items-center justify-center h-10 rounded-full text-sm font-medium"
                >
                  Choose This Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[--color-charcoal]/45 mb-5">
            Not sure which to choose? You can preview and change it during checkout.
          </p>
          <Link
            href="/order"
            className="templates-main-cta inline-flex items-center justify-center h-12 px-8 rounded-full"
          >
            Start your invite — ₹699
          </Link>
        </div>
      </div>
    </div>
  )
}
