import type { Metadata } from 'next'
import ContactContent from '@/components/contact/ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with WedInviter via WhatsApp or email. Questions about your wedding invite? We respond within hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact WedInviter',
    description: 'Chat with us on WhatsApp or email happy@wedinviter.wasleen.com — we reply within hours.',
    url: '/contact',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return <ContactContent />
}
