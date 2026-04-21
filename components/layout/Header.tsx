'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[--color-cream]/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5">
          <span className="font-[--font-cormorant] text-2xl font-semibold tracking-wide text-[--color-charcoal]">
            Wed
          </span>
          <span className="text-[--color-gold] font-[--font-cormorant] text-2xl">✦</span>
          <span className="font-[--font-cormorant] text-2xl font-semibold tracking-wide text-[--color-charcoal]">
            Inviter
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[--color-charcoal]/70 hover:text-[--color-charcoal] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/order"
            className="hidden md:inline-flex items-center h-10 px-5 rounded-full bg-[--color-charcoal] text-[--color-cream] text-sm font-medium hover:bg-black transition-colors duration-200"
          >
            Create Invite — ₹699
          </Link>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span
                className={cn(
                  'block h-px bg-[--color-charcoal] transition-all duration-300 origin-center',
                  menuOpen && 'rotate-45 translate-y-[6px]'
                )}
              />
              <span
                className={cn(
                  'block h-px bg-[--color-charcoal] transition-all duration-300',
                  menuOpen && 'opacity-0 scale-x-0'
                )}
              />
              <span
                className={cn(
                  'block h-px bg-[--color-charcoal] transition-all duration-300 origin-center',
                  menuOpen && '-rotate-45 -translate-y-[6px]'
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!menuOpen}
      >
        <nav
          className="bg-[--color-cream]/98 backdrop-blur-md border-t border-black/5 px-4 py-4 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 px-2 text-base font-medium text-[--color-charcoal]/70 hover:text-[--color-charcoal] border-b border-black/5 last:border-0 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="mt-3 flex items-center justify-center h-12 rounded-full bg-[--color-charcoal] text-[--color-cream] font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Create Invite — ₹699
          </Link>
        </nav>
      </div>
    </header>
  )
}
