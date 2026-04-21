import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Testimonials from '@/components/home/Testimonials'
import Pricing from '@/components/home/Pricing'

export const metadata: Metadata = {
  title: 'WedInviter — Premium Digital Wedding Invitations',
  description:
    'Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹699 one-time.',
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}
