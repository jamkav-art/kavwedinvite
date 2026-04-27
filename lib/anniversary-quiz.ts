"use server";

import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import type {
  QuestionCategory,
  QuestionBankItem,
  QuizConfigItem,
  QuizSession,
  ScoreTier,
} from "@/types/anniversary-quiz.types";

// ── Helper: Fisher-Yates Shuffle ──
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ── Server Action: Fetch Random Questions (Matrix Randomization) ──
// Fetches 2 questions from each of the 5 patterns = 10 total
// Then shuffles for emotional variety
export async function fetchRandomQuestions(
  count: number = 10,
): Promise<QuestionBankItem[]> {
  const supabase = await createClient();
  const categories: QuestionCategory[] = [
    "nostalgia",
    "playful",
    "soul",
    "discovery",
    "future",
  ];

  // Minimum 2 per category for diversity
  const perCategory = Math.max(2, Math.floor(count / categories.length));
  let allQuestions: QuestionBankItem[] = [];

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
      // Shuffle the fetched data for randomness
      const shuffled = shuffleArray(
        data.map((q) => ({
          id: q.id,
          category: q.category as QuestionCategory,
          question_text: q.question_text,
          options: q.options as [string, string, string],
        })),
      );
      allQuestions.push(...shuffled.slice(0, perCategory));
    }
  }

  // If we don't have enough questions, fill remaining from all categories
  if (allQuestions.length < count) {
    const remaining = count - allQuestions.length;
    const { data: extraData } = await supabase
      .from("question_bank")
      .select("*")
      .limit(remaining * 3); // Fetch extra to ensure variety

    if (extraData) {
      const usedIds = new Set(allQuestions.map((q) => q.id));
      const extra = extraData
        .filter((q) => !usedIds.has(q.id))
        .map((q) => ({
          id: q.id,
          category: q.category as QuestionCategory,
          question_text: q.question_text,
          options: q.options as [string, string, string],
        }));
      allQuestions.push(...extra.slice(0, remaining));
    }
  }

  // Final shuffle for emotional variety
  return shuffleArray(allQuestions);
}

// ── Server Action: Create Quiz Session (after payment) ──
export async function createQuizSession(payload: {
  couple_name_1: string;
  couple_name_2: string;
  config: QuizConfigItem[];
  couple_photo_url?: string | null;
  love_note?: string | null;
  floral_theme?: string;
  color_mood?: string;
  background_music?: string | null;
  payment_id: string;
  challenger_quiz_id?: string | null;
}): Promise<{ url: string; id: string } | { error: string }> {
  const supabase = await createClient();

  // Generate short, unique invite ID
  const invite_id = nanoid(10);

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      invite_id,
      couple_name_1: payload.couple_name_1,
      couple_name_2: payload.couple_name_2,
      config: payload.config,
      couple_photo_url: payload.couple_photo_url ?? null,
      love_note: payload.love_note ?? null,
      floral_theme: payload.floral_theme ?? "rose",
      color_mood: payload.color_mood ?? "romantic-pink",
      background_music: payload.background_music ?? null,
      payment_id: payload.payment_id,
      paid: true,
      challenger_quiz_id: payload.challenger_quiz_id ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating quiz session:", error);
    return { error: error.message };
  }

  return {
    url: `/quiz/${invite_id}`,
    id: data.id,
  };
}

// ── Server Action: Fetch Quiz Session by invite_id ──
export async function fetchQuizSession(
  inviteId: string,
): Promise<(QuizSession & { questions: QuestionBankItem[] }) | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("invite_id", inviteId)
    .single();

  if (error || !data) {
    console.error("Error fetching quiz session:", error);
    return null;
  }

  // Fetch the full question data from config
  const questionIds = (data.config as QuizConfigItem[]).map((c) => c.q_id);
  const { data: questions } = await supabase
    .from("question_bank")
    .select("*")
    .in("id", questionIds);

  return {
    id: data.id,
    invite_id: data.invite_id,
    couple_name_1: data.couple_name_1,
    couple_name_2: data.couple_name_2,
    config: data.config as QuizConfigItem[],
    couple_photo_url: data.couple_photo_url,
    love_note: data.love_note,
    floral_theme: data.floral_theme,
    color_mood: data.color_mood,
    background_music: data.background_music,
    payment_id: data.payment_id,
    paid: data.paid,
    challenger_quiz_id: data.challenger_quiz_id,
    combined_score: data.combined_score,
    created_at: data.created_at,
    expires_at: data.expires_at,
    questions: (questions ?? []).map((q) => ({
      id: q.id,
      category: q.category as QuestionCategory,
      question_text: q.question_text,
      options: q.options as [string, string, string],
    })),
  };
}

// ── Server Action: Submit Quiz Answers ──
export async function submitQuizAnswers(payload: {
  quiz_id: string;
  taker_name?: string;
  answers: { question_index: number; selected_idx: number }[];
}): Promise<
  | {
      soul_percentage: number;
      soul_tier: ScoreTier;
      scores: Record<QuestionCategory, number>;
    }
  | { error: string }
> {
  const supabase = await createClient();

  // Fetch quiz session to get the config (correct answers)
  const { data: quiz, error: quizError } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", payload.quiz_id)
    .single();

  if (quizError || !quiz) {
    return { error: "Quiz session not found" };
  }

  const config = quiz.config as QuizConfigItem[];

  // Fetch full question data to get categories
  const questionIds = config.map((c) => c.q_id);
  const { data: questions } = await supabase
    .from("question_bank")
    .select("id, category")
    .in("id", questionIds);

  const questionCategoryMap = new Map(
    (questions ?? []).map((q) => [q.id, q.category as QuestionCategory]),
  );

  // Calculate scores per category
  const categoryScores: Record<string, { correct: number; total: number }> = {};
  let totalCorrect = 0;
  const totalQuestions = config.length;

  for (const answer of payload.answers) {
    const configItem = config[answer.question_index];
    if (!configItem) continue;

    const category = questionCategoryMap.get(configItem.q_id) || "nostalgia";
    if (!categoryScores[category]) {
      categoryScores[category] = { correct: 0, total: 0 };
    }
    categoryScores[category].total += 1;

    if (answer.selected_idx === configItem.correct_idx) {
      categoryScores[category].correct += 1;
      totalCorrect += 1;
    }
  }

  // Calculate category percentages
  const scores: Record<string, number> = {};
  for (const [cat, score] of Object.entries(categoryScores)) {
    scores[cat] = Math.round((score.correct / score.total) * 100);
  }

  // Calculate overall soul percentage
  const soul_percentage =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Determine score tier
  const soul_tier = getScoreTier(soul_percentage);

  // Save to quiz_taker_sessions
  const { error: insertError } = await supabase
    .from("quiz_taker_sessions")
    .insert({
      quiz_id: payload.quiz_id,
      taker_name: payload.taker_name ?? "Anonymous",
      answers: payload.answers,
      scores,
      soul_percentage,
      soul_tier,
    });

  if (insertError) {
    console.error("Error saving quiz taker session:", insertError);
  }

  return {
    soul_percentage,
    soul_tier,
    scores: scores as Record<QuestionCategory, number>,
  };
}

// ── Helper: Get Score Tier ──
export function getScoreTier(percentage: number): ScoreTier {
  if (percentage === 100) return "unified-soul";
  if (percentage >= 76) return "architects";
  if (percentage >= 41) return "twin-flames";
  return "beautiful-strangers";
}
