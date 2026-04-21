export const PRICING = {
  basePrice: 699,
  basePricePaise: 69900,
  currency: 'INR',
  features: [
    'Choose from 8 premium templates',
    'Unlimited events & venues',
    'Photo & video gallery',
    'Voice message from couple',
    'Background music',
    'Live countdown timer',
    'Digital RSVP collection',
    'WhatsApp sharing',
    'Valid for 1 year',
  ],
} as const

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'

export const WHATSAPP_OWNER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919846224086'

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? 'invite-media'

export const ORDER_STEPS = ['Details', 'Events', 'Media', 'Review'] as const

export const EVENT_TYPES = [
  'Wedding',
  'Mehendi',
  'Sangeet',
  'Haldi',
  'Reception',
  'Engagement',
  'Other',
] as const

export const INVITE_EXPIRY_DAYS = 365
