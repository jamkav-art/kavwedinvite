import { APP_URL } from '@/lib/constants'

export const SITE = {
  name: 'WedInviter',
  url: APP_URL,
  tagline: 'Premium Digital Wedding Invitations',
  description:
    'Create stunning digital wedding invitations in minutes. 8 premium templates, WhatsApp sharing, live RSVP. ₹699 one-time.',
  ogImage: `${APP_URL}/og-default.png`,
  twitterHandle: '@wedinviter',
} as const

export function buildCanonical(path: string): string {
  return new URL(path, APP_URL).toString()
}

export function buildInviteTitle(name1: string, name2: string): string {
  return `${name1} & ${name2} — Wedding Invitation`
}

export function buildInviteDescription(name1: string, name2: string, date: string): string {
  return `You're invited to the wedding of ${name1} & ${name2} on ${date}. View events, gallery, RSVP, and share this invite.`
}
