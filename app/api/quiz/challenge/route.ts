import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { original_quiz_id, taker_name } = body;

    if (!original_quiz_id) {
      return NextResponse.json(
        { error: "Missing original_quiz_id" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Fetch the original quiz to duplicate its config
    const { data: originalQuiz, error: fetchError } = await supabase
      .from("quiz_sessions")
      .select("*")
      .eq("id", original_quiz_id)
      .single();

    if (fetchError || !originalQuiz) {
      return NextResponse.json(
        { error: "Original quiz not found" },
        { status: 404 },
      );
    }

    // Create a challenge quiz (free, no payment needed)
    const invite_id = nanoid(10);

    // Swap the names for the challenge (the taker becomes the creator)
    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        invite_id,
        couple_name_1: originalQuiz.couple_name_2,
        couple_name_2: originalQuiz.couple_name_1,
        config: originalQuiz.config,
        couple_photo_url: originalQuiz.couple_photo_url,
        love_note: null,
        floral_theme: originalQuiz.floral_theme,
        color_mood: originalQuiz.color_mood,
        background_music: null,
        payment_id: null,
        paid: false,
        challenger_quiz_id: original_quiz_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating challenge quiz:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      url: `/quiz/${invite_id}`,
      id: data.id,
      invite_id: data.invite_id,
    });
  } catch (error) {
    console.error("Error in challenge create:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
