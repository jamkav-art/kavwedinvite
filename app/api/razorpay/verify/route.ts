import { NextResponse } from "next/server";
import { buildInviteId, verifyRazorpaySignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { CURATED_TRACKS } from "@/lib/anniversary-music";
import type {
  EventInsert,
  MediaInsert,
  OrderInsert,
  MediaType,
} from "@/types/database.types";
import type { OrderFormState } from "@/types/order.types";
import type { AnniversaryOrderState } from "@/types/anniversary-order.types";

interface VerifyRequestBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: OrderFormState | AnniversaryOrderState;
  productType?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<VerifyRequestBody>;

    if (
      !body.razorpay_order_id ||
      !body.razorpay_payment_id ||
      !body.razorpay_signature ||
      !body.orderData
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required verification payload.",
        },
        { status: 400 },
      );
    }

    const signatureValid = verifyRazorpaySignature({
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_signature: body.razorpay_signature,
    });

    if (!signatureValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature." },
        { status: 400 },
      );
    }

    const orderData = body.orderData;
    const isAnniversary = "yourName" in orderData && "partnerName" in orderData;

    // All required fields validated above — safe to cast
    const verifiedBody = body as Required<VerifyRequestBody>;

    if (isAnniversary) {
      return await handleAnniversaryVerify(verifiedBody);
    }

    return await handleWeddingVerify(verifiedBody);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment verification failed.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

/** Handles verification for wedding invite orders */
async function handleWeddingVerify(
  body: Pick<
    Required<VerifyRequestBody>,
    | "razorpay_order_id"
    | "razorpay_payment_id"
    | "razorpay_signature"
    | "orderData"
  >,
) {
  const orderData = body.orderData as OrderFormState;
  const inviteId = buildInviteId(
    orderData.couple_name_1,
    orderData.couple_name_2,
  );
  const supabase = createAdminClient();

  const orderInsert: OrderInsert = {
    invite_id: inviteId,
    couple_name_1: orderData.couple_name_1,
    couple_name_2: orderData.couple_name_2,
    wedding_date: orderData.wedding_date,
    template_slug: orderData.template_slug,
    status: "paid",
    razorpay_order_id: body.razorpay_order_id,
    razorpay_payment_id: body.razorpay_payment_id,
    razorpay_signature: body.razorpay_signature,
    payment_id: body.razorpay_payment_id,
    amount_paid: 699,
    phone_number: orderData.phone_number,
    email: orderData.email,
    custom_message: orderData.custom_message,
  };

  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert(orderInsert)
    .select("id, invite_id")
    .single();

  if (orderError || !createdOrder) {
    return NextResponse.json(
      {
        success: false,
        error: orderError?.message ?? "Failed to insert order.",
      },
      { status: 500 },
    );
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
  }));

  if (eventsToInsert.length > 0) {
    const { error: eventsError } = await supabase
      .from("events")
      .insert(eventsToInsert);
    if (eventsError) {
      return NextResponse.json(
        { success: false, error: eventsError.message },
        { status: 500 },
      );
    }
  }

  const mediaToInsert: MediaInsert[] = [
    ...orderData.media.photos.map((photo) => ({
      order_id: createdOrder.id,
      media_type: "photo" as MediaType,
      file_url: photo.url,
      file_name: photo.name,
      file_size: photo.size,
    })),
    ...orderData.media.videos.map((video) => ({
      order_id: createdOrder.id,
      media_type: "video" as MediaType,
      file_url: video.url,
      file_name: video.name,
      file_size: video.size,
    })),
    ...(orderData.media.voice
      ? [
          {
            order_id: createdOrder.id,
            media_type: "voice" as MediaType,
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
            media_type: "song" as MediaType,
            file_url: orderData.media.song.url,
            file_name: orderData.media.song.name,
            file_size: orderData.media.song.size,
          },
        ]
      : []),
  ];

  if (mediaToInsert.length > 0) {
    const { error: mediaError } = await supabase
      .from("media")
      .insert(mediaToInsert);
    if (mediaError) {
      return NextResponse.json(
        { success: false, error: mediaError.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    success: true,
    inviteId: createdOrder.invite_id,
    quizId: createdOrder.id,
    quizUrl: `/invite/${createdOrder.invite_id}`,
  });
}

/** Handles verification for anniversary quiz orders */
async function handleAnniversaryVerify(
  body: Pick<
    Required<VerifyRequestBody>,
    | "razorpay_order_id"
    | "razorpay_payment_id"
    | "razorpay_signature"
    | "orderData"
  >,
) {
  const orderData = body.orderData as AnniversaryOrderState;
  const inviteId = buildInviteId(orderData.yourName, orderData.partnerName);
  const supabase = createAdminClient();

  // Build song media entry from track selection or custom upload
  const songMedia: MediaInsert[] = [];
  if (orderData.customBackgroundMusic) {
    songMedia.push({
      order_id: "", // filled after order is created
      media_type: "song" as MediaType,
      file_url: orderData.customBackgroundMusic.url,
      file_name: orderData.customBackgroundMusic.name,
      file_size: orderData.customBackgroundMusic.size,
    });
  } else if (orderData.backgroundMusic) {
    const track = CURATED_TRACKS.find(
      (t) => t.id === orderData.backgroundMusic,
    );
    if (track) {
      songMedia.push({
        order_id: "",
        media_type: "song" as MediaType,
        file_url: track.src,
        file_name: track.label,
        file_size: null,
      });
    }
  }

  // Build voice note media entry
  const voiceMedia: MediaInsert[] = [];
  if (orderData.voiceNote) {
    voiceMedia.push({
      order_id: "",
      media_type: "voice" as MediaType,
      file_url: orderData.voiceNote.url,
      file_name: orderData.voiceNote.name,
      file_size: orderData.voiceNote.size,
    });
  }

  const orderInsert: OrderInsert = {
    invite_id: inviteId,
    couple_name_1: orderData.yourName,
    couple_name_2: orderData.partnerName,
    wedding_date: orderData.anniversaryDate,
    template_slug: orderData.floralTheme,
    status: "paid",
    razorpay_order_id: body.razorpay_order_id,
    razorpay_payment_id: body.razorpay_payment_id,
    razorpay_signature: body.razorpay_signature,
    payment_id: body.razorpay_payment_id,
    amount_paid: 699,
    phone_number: orderData.phone,
    email: orderData.email,
    custom_message: orderData.loveNote,
  };

  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert(orderInsert)
    .select("id, invite_id")
    .single();

  if (orderError || !createdOrder) {
    return NextResponse.json(
      {
        success: false,
        error: orderError?.message ?? "Failed to insert order.",
      },
      { status: 500 },
    );
  }

  // Insert all media items with the actual order_id
  const allMedia: MediaInsert[] = [
    ...songMedia.map((m) => ({ ...m, order_id: createdOrder.id })),
    ...voiceMedia.map((m) => ({ ...m, order_id: createdOrder.id })),
  ];

  if (allMedia.length > 0) {
    const { error: mediaError } = await supabase.from("media").insert(allMedia);
    if (mediaError) {
      console.error("[Anniversary verify] Media insert error:", mediaError);
      // Non-fatal — continue so payment isn't lost
    }
  }

  return NextResponse.json({
    success: true,
    inviteId: createdOrder.invite_id,
    quizId: createdOrder.id,
    quizUrl: `/invite/${createdOrder.invite_id}`,
  });
}

export const dynamic = "force-dynamic";
