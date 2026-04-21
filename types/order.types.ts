export interface EventFormData {
  event_name: string
  event_date: string
  event_time: string
  venue_name: string
  venue_address: string
  venue_city: string
  venue_map_link: string
}

export interface MediaAsset {
  name: string
  url: string
  path: string
  mimeType: string
  size: number
}

export interface MediaFiles {
  photos: MediaAsset[]
  videos: MediaAsset[]
  voice: MediaAsset | null
  song: MediaAsset | null
}

export interface OrderFormState {
  // Step 1
  couple_name_1: string
  couple_name_2: string
  wedding_date: string
  template_slug: string

  // Step 2
  events: EventFormData[]

  // Step 3
  media: MediaFiles

  // Step 4
  phone_number: string
  email: string
  custom_message: string
}

export interface RazorpayOrderResponse {
  id: string
  amount: number
  currency: string
  receipt: string
}

export interface PaymentVerifyPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  orderData: OrderFormState
}

export interface PaymentVerifyResponse {
  success: boolean
  inviteUrl?: string
  orderId?: string
  inviteId?: string
  error?: string
}

export interface OrderSuccessParams {
  orderId: string
  inviteId: string
  coupleNames: string
  weddingDate: string
  template: string
  phone: string
  message: string
}
