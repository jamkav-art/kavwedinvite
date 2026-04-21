import Link from 'next/link'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919846224086'

export default function Footer() {
  return (
    <footer id="contact" className="footer-bridal-bg text-[--color-cream]/80 relative overflow-hidden">

      {/* Decorative top gradient accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[--color-gold]/60 to-transparent" />

      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-80 bg-[--color-magenta]/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-64 bg-[--color-gold]/7 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* Brand */}
          <div className="backdrop-blur-sm bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div className="font-[--font-cormorant] text-2xl font-semibold mb-3 logo-gradient-text">
              Wed✦Inviter
            </div>
            <p className="text-sm leading-relaxed text-[--color-cream]/50 max-w-xs">
              Premium digital wedding invitations delivered via WhatsApp.
              Beautiful, shareable, and live within 24 hours.
            </p>
          </div>

          {/* Quick Links */}
          <div className="backdrop-blur-sm bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:mx-auto w-full">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[--color-gold] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/templates', label: 'Templates' },
                { href: '/#pricing', label: 'Pricing' },
                { href: '/order', label: 'Order Now' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--color-cream]/55 hover:text-[--color-gold] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="backdrop-blur-sm bg-white/[0.04] border border-white/10 rounded-2xl p-6 md:ml-auto w-full">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[--color-gold] mb-4">
              Contact Us
            </h3>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#1eb85a] transition-colors duration-200 shadow-lg shadow-[#25D366]/20"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.427A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.077-1.115l-.292-.173-3.025.867.836-3.048-.19-.308A7.962 7.962 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[--color-cream]/30">
            © {new Date().getFullYear()} WedInviter. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-[--color-cream]/30 hover:text-[--color-gold]/70 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[--color-cream]/30 hover:text-[--color-gold]/70 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
