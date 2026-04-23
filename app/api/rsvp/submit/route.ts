import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

const rsvpSchema = z.object({
  invite_id: z.string().min(1, "Invite ID is required"),
  guest_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  attending: z.boolean(),
  guest_count: z.number().min(0).max(20),
  message: z.string().max(500, "Message too long").optional().nullable(),
  phone_number: z.string().max(20, "Phone too long").optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0]?.message ?? "Validation error.",
        },
        { status: 400 },
      );
    }

    const data = result.data;
    const supabase = await createServerClient();

    // Validate invite_id exists and is not expired
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("status, expires_at")
      .eq("invite_id", data.invite_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Invite not found." },
        { status: 404 },
      );
    }

    const expiresAt = order.expires_at ? new Date(order.expires_at) : null;
    if (expiresAt && expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, error: "This invite is no longer active." },
        { status: 410 },
      );
    }

    // Insert into rsvps table using anon client
    const { data: inserted, error: insertError } = await supabase
      .from("rsvps")
      .insert({
        ...data,
        message: data.message?.trim() || null,
        phone_number: data.phone_number?.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      // 23505 is PostgreSQL unique violation code
      if (
        insertError.code === "23505" ||
        insertError.message.includes("unique")
      ) {
        return NextResponse.json(
          { success: false, error: "You've already RSVPed! Thank you." },
          { status: 409 },
        );
      }
      throw new Error(insertError.message);
    }

    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error("RSVP Submit Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit RSVP. Please try again later.",
      },
      { status: 500 },
    );
  }
}
