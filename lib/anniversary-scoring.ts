import type {
  QuestionCategory,
  QuizAnswer,
  QuizConfigItem,
  QuestionBankItem,
  ScoreTier,
  ScoreTierInfo,
} from "@/types/anniversary-quiz.types";
import {
  SCORE_TIERS,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
} from "@/types/anniversary-quiz.types";

// ── Calculate Quiz Results ──
export function calculateSoulScore(
  answers: QuizAnswer[],
  config: QuizConfigItem[],
  questions: QuestionBankItem[],
): {
  soul_percentage: number;
  soul_tier: ScoreTier;
  tierInfo: ScoreTierInfo;
  scores: Record<QuestionCategory, number>;
  correctCount: number;
  totalCount: number;
} {
  // Build category map from questions
  const questionCategoryMap = new Map<
    QuestionCategory,
    { correct: number; total: number }
  >();
  for (const q of questions) {
    if (!questionCategoryMap.has(q.category)) {
      questionCategoryMap.set(q.category, { correct: 0, total: 0 });
    }
  }

  let totalCorrect = 0;
  const totalCount = config.length;

  // Score each answer
  for (const answer of answers) {
    const configItem = config[answer.question_index];
    if (!configItem) continue;

    // Find the question to get its category
    const question = questions[answer.question_index];
    if (!question) continue;

    const catScore = questionCategoryMap.get(question.category);
    if (catScore) {
      catScore.total += 1;
      if (answer.selected_idx === configItem.correct_idx) {
        catScore.correct += 1;
        totalCorrect += 1;
      }
    }
  }

  // Calculate per-category percentages
  const scores: Record<string, number> = {};
  for (const [category, score] of questionCategoryMap.entries()) {
    scores[category] =
      score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  }

  // Calculate overall soul percentage
  const soul_percentage =
    totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0;

  // Determine tier
  const soul_tier = getScoreTier(soul_percentage);
  const tierInfo = getTierInfo(soul_tier);

  return {
    soul_percentage,
    soul_tier,
    tierInfo,
    scores: scores as Record<QuestionCategory, number>,
    correctCount: totalCorrect,
    totalCount,
  };
}

// ── Get Score Tier from Percentage ──
export function getScoreTier(percentage: number): ScoreTier {
  for (const tier of SCORE_TIERS) {
    const [min, max] = tier.range;
    if (percentage >= min && percentage <= max) {
      return tier.id;
    }
  }
  return "beautiful-strangers";
}

// ── Get Tier Info ──
export function getTierInfo(tierId: ScoreTier): ScoreTierInfo {
  return SCORE_TIERS.find((t) => t.id === tierId) ?? SCORE_TIERS[0];
}

// ── Calculate Combined Challenge Score ──
export function calculateCombinedScore(
  scoreA: number,
  scoreB: number,
): {
  combined: number;
  ultimateTier: ScoreTier;
  ultimateTierInfo: ScoreTierInfo;
} {
  const combined = Math.round((scoreA + scoreB) / 2);
  const ultimateTier = getScoreTier(combined);
  const ultimateTierInfo = getTierInfo(ultimateTier);

  return { combined, ultimateTier, ultimateTierInfo };
}

// ── Get Pattern Breakdown for Certificate ──
export function getPatternBreakdown(
  scores: Record<QuestionCategory, number>,
): Array<{
  category: QuestionCategory;
  label: string;
  emoji: string;
  percentage: number;
}> {
  const categories = Object.keys(scores) as QuestionCategory[];

  return categories.map((category) => ({
    category,
    label: CATEGORY_LABEL[category] ?? category,
    emoji: CATEGORY_EMOJI[category] ?? "❓",
    percentage: scores[category] ?? 0,
  }));
}

// ── Format Percentage for Display ──
export function formatSoulPercentage(percentage: number): string {
  return `${percentage}%`;
}
