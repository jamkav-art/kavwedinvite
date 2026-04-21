'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navLinks = [
  {
    href: '/',
    label: 'Home',
    gradient: 'linear-gradient(135deg, #E8638C 0%, #C9A962 40%, #F7E7CE 70%, #E8638C 100%)',
  },
  {
    href: '/templates',
    label: 'Templates',
    gradient: 'linear-gradient(135deg, #C9A962 0%, #F7E7CE 35%, #C0185F 65%, #C9A962 100%)',
  },
  {
    href: '/#pricing',
    label: 'Pricing',
    gradient: 'linear-gradient(135deg, #F7E7CE 0%, #C9A962 35%, #E8638C 65%, #C9A962 100%)',
  },
  {
    href: '/#contact',
    label: 'Contact',
    gradient: 'linear-gradient(135deg, #C0185F 0%, #E8638C 35%, #C9A962 65%, #F7E7CE 100%)',
  },
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
        <Link href="/" className="flex items-center">
          <span className="logo-gradient-text font-[--font-cormorant] text-2xl font-semibold tracking-wide">
            Wed✦Inviter
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-gradient-text text-sm font-medium"
              style={
                {
                  '--nav-grad': link.gradient,
                  animationDelay: `${i * -1.8}s`,
                } as React.CSSProperties
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <motion.div
            className="hidden md:inline-flex"
            initial={{ filter: 'drop-shadow(0 0px 0px rgba(192,24,95,0))' }}
            whileHover={{
              scale: 1.05,
              filter: 'drop-shadow(0 4px 22px rgba(192,24,95,0.5))',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <Link
              href="/order"
              className="cta-gradient-btn inline-flex items-center h-10 px-5 rounded-full text-white text-sm font-semibold tracking-wide shadow-md"
            >
              Create Invite — ₹699
            </Link>
          </motion.div>

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
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-gradient-text py-3 px-2 text-base font-medium border-b border-black/5 last:border-0"
              style={
                {
                  '--nav-grad': link.gradient,
                  animationDelay: `${i * -1.8}s`,
                } as React.CSSProperties
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="cta-gradient-btn mt-3 flex items-center justify-center h-12 rounded-full text-white font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Create Invite — ₹699
          </Link>
        </nav>
      </div>
    </header>
  )
}
