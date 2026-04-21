import { z } from 'zod'

export const step1Schema = z.object({
  couple_name_1: z.string().min(2, 'Enter at least 2 characters'),
  couple_name_2: z.string().min(2, 'Enter at least 2 characters'),
  wedding_date: z.string().min(1, 'Please select a date'),
  template_slug: z.string().min(1, 'Please choose a template'),
})

export const eventSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  event_date: z.string().min(1, 'Date is required'),
  event_time: z.string().min(1, 'Time is required'),
  venue_name: z.string().min(1, 'Venue name is required'),
  venue_address: z.string().default(''),
  venue_city: z.string().min(1, 'City is required'),
  venue_map_link: z
    .string()
    .refine((val) => val === '' || /^https?:\/\//.test(val), {
      message: 'Enter a valid URL (https://...)',
    })
    .default(''),
})

export const step2Schema = z.object({
  events: z.array(eventSchema).min(1, 'Please add at least one event'),
})

export const step3Schema = z.object({
  photos: z.array(z.object({ url: z.string().url() })).default([]),
  videos: z.array(z.object({ url: z.string().url() })).default([]),
  voice: z.object({ url: z.string().url() }).nullable().optional(),
  song: z.object({ url: z.string().url() }).nullable().optional(),
})

export const step4Schema = z.object({
  phone_number: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .max(15, 'Phone number too long')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  custom_message: z.string().max(500, 'Message too long (max 500 characters)').default(''),
})

export type Step1Data = z.infer<typeof step1Schema>
export type EventData = z.infer<typeof eventSchema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step4Data = z.infer<typeof step4Schema>
