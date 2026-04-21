import { NextResponse } from 'next/server'
import { buildInviteId, verifyRazorpaySignature } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import type { EventInsert, MediaInsert, OrderInsert } from '@/types/database.types'
import type { OrderFormState } from '@/types/order.types'

interface VerifyRequestBody {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  orderData: OrderFormState
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<VerifyRequestBody>

    if (
      !body.razorpay_order_id ||
      !body.razorpay_payment_id ||
      !body.razorpay_signature ||
      !body.orderData
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required verification payload.' },
        { status: 400 }
      )
    }

    const signatureValid = verifyRazorpaySignature({
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
    })

    if (!signatureValid) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature.' }, { status: 400 })
    }

    const orderData = body.orderData
    const inviteId = buildInviteId(orderData.couple_name_1, orderData.couple_name_2)
    const supabase = createAdminClient()

    const orderInsert: OrderInsert = {
      invite_id: inviteId,
      couple_name_1: orderData.couple_name_1,
      couple_name_2: orderData.couple_name_2,
      wedding_date: orderData.wedding_date,
      template_slug: orderData.template_slug,
      status: 'paid',
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
      payment_id: body.razorpay_payment_id,
      amount_paid: 699,
      phone_number: orderData.phone_number,
      email: orderData.email,
      custom_message: orderData.custom_message,
    }

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select('id, invite_id')
      .single()

    if (orderError || !createdOrder) {
      return NextResponse.json(
        { success: false, error: orderError?.message ?? 'Failed to insert order.' },
        { status: 500 }
      )
    }

    const eventsToInsert: EventInsert[] = orderData.events.map((event) => ({
      order_id: createdOrder.id,
      event_name: event.event_name,
      event_date: event.event_date,
      event_time: event.event_time || null,
      venue_name: event.venue_name,
      venue_address: event.venue_address,
      venue_city: event.venue_city || null,
      venue_map_link: event.venue_map_link || null,
    }))

    if (eventsToInsert.length > 0) {
      const { error: eventsError } = await supabase.from('events').insert(eventsToInsert)
      if (eventsError) {
        return NextResponse.json({ success: false, error: eventsError.message }, { status: 500 })
      }
    }

    const mediaToInsert: MediaInsert[] = [
      ...orderData.media.photos.map((photo) => ({
        order_id: createdOrder.id,
        media_type: 'photo' as const,
        file_url: photo.url,
        file_name: photo.name,
        file_size: photo.size,
      })),
      ...orderData.media.videos.map((video) => ({
        order_id: createdOrder.id,
        media_type: 'video' as const,
        file_url: video.url,
        file_name: video.name,
        file_size: video.size,
      })),
      ...(orderData.media.voice
        ? [
            {
              order_id: createdOrder.id,
              media_type: 'voice' as const,
              file_url: orderData.media.voice.url,
              file_name: orderData.media.voice.name,
              file_size: orderData.media.voice.size,
            },
          ]
        : []),
      ...(orderData.media.song
        ? [
            {
              order_id: createdOrder.id,
              media_type: 'song' as const,
              file_url: orderData.media.song.url,
              file_name: orderData.media.song.name,
              file_size: orderData.media.song.size,
            },
          ]
        : []),
    ]

    if (mediaToInsert.length > 0) {
      const { error: mediaError } = await supabase.from('media').insert(mediaToInsert)
      if (mediaError) {
        return NextResponse.json({ success: false, error: mediaError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      inviteId: createdOrder.invite_id,
      inviteUrl: `/invite/${createdOrder.invite_id}`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment verification failed.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
