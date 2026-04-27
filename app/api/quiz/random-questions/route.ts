import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { QuestionCategory } from "@/types/anniversary-quiz.types";

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const categories: QuestionCategory[] = [
      "nostalgia",
      "playful",
      "soul",
      "discovery",
      "future",
    ];

    const perCategory = 2; // 2 from each pattern = 10 total
    let allQuestions: unknown[] = [];

    for (const category of categories) {
      const { data, error } = await supabase
        .from("question_bank")
        .select("*")
        .eq("category", category)
        .limit(perCategory);

      if (error) {
        console.error(`Error fetching ${category} questions:`, error);
        continue;
      }

      if (data) {
        const shuffled = shuffleArray(
          data.map((q) => ({
            id: q.id,
            category: q.category,
            question_text: q.question_text,
            options: q.options,
          })),
        );
        allQuestions.push(...shuffled.slice(0, perCategory));
      }
    }

    // Final shuffle for emotional variety
    const questions = shuffleArray(allQuestions);

    return NextResponse.json({ questions, count: questions.length });
  } catch (error) {
    console.error("Error fetching random questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}
