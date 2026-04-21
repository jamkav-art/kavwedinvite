import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { nanoid } from 'nanoid'

const INVITE_NAME_MAX = 20

export function getRazorpayInstance() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are not configured.')
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export function verifyRazorpaySignature(params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) {
    throw new Error('Missing RAZORPAY_KEY_SECRET.')
  }

  const payload = `${params.razorpay_order_id}|${params.razorpay_payment_id}`
  const generatedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  return generatedSignature === params.razorpay_signature
}

export function buildInviteId(coupleOne: string, coupleTwo: string): string {
  return `${slugifyName(coupleOne)}-${slugifyName(coupleTwo)}-${nanoid(16)}`
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, INVITE_NAME_MAX)
}
