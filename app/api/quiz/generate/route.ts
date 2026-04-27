import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      couple_name_1,
      couple_name_2,
      config,
      couple_photo_url,
      love_note,
      floral_theme,
      color_mood,
      background_music,
      payment_id,
      challenger_quiz_id,
    } = body;

    // Validate required fields
    if (!couple_name_1 || !couple_name_2 || !config || !payment_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const invite_id = nanoid(10);

    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        invite_id,
        couple_name_1,
        couple_name_2,
        config,
        couple_photo_url: couple_photo_url ?? null,
        love_note: love_note ?? null,
        floral_theme: floral_theme ?? "rose",
        color_mood: color_mood ?? "romantic-pink",
        background_music: background_music ?? null,
        payment_id,
        paid: true,
        challenger_quiz_id: challenger_quiz_id ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating quiz session:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      url: `/quiz/${invite_id}`,
      id: data.id,
      invite_id: data.invite_id,
    });
  } catch (error) {
    console.error("Error in quiz generate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
