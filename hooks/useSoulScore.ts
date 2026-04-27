"use client";

import { useMemo } from "react";
import type {
  QuestionCategory,
  QuizAnswer,
  ScoreTier,
  ScoreTierInfo,
} from "@/types/anniversary-quiz.types";
import {
  calculateSoulScore,
  getScoreTier,
  getTierInfo,
  getPatternBreakdown,
  formatSoulPercentage,
} from "@/lib/anniversary-scoring";
import type {
  QuestionBankItem,
  QuizConfigItem,
} from "@/types/anniversary-quiz.types";

export interface UseSoulScoreInput {
  answers: QuizAnswer[];
  config: QuizConfigItem[];
  questions: QuestionBankItem[];
}

export interface PatternBreakdownItem {
  category: QuestionCategory;
  label: string;
  emoji: string;
  percentage: number;
}

export interface UseSoulScoreReturn {
  soulPercentage: number;
  soulPercentageDisplay: string;
  soulTier: ScoreTier;
  tierInfo: ScoreTierInfo;
  scores: Record<QuestionCategory, number>;
  patternBreakdown: PatternBreakdownItem[];
  correctCount: number;
  totalCount: number;
  accuracy: number;
  isPerfectScore: boolean;
  isHighScore: boolean;
}

export function useSoulScore(input: UseSoulScoreInput): UseSoulScoreReturn {
  const result = useMemo(() => {
    if (
      !input.answers.length ||
      !input.config.length ||
      !input.questions.length
    ) {
      return {
        soulPercentage: 0,
        soulTier: "beautiful-strangers" as ScoreTier,
        tierInfo: getTierInfo("beautiful-strangers"),
        scores: {} as Record<QuestionCategory, number>,
        correctCount: 0,
        totalCount: 0,
      };
    }

    const score = calculateSoulScore(
      input.answers,
      input.config,
      input.questions,
    );

    return {
      soulPercentage: score.soul_percentage,
      soulTier: score.soul_tier,
      tierInfo: score.tierInfo,
      scores: score.scores,
      correctCount: score.correctCount,
      totalCount: score.totalCount,
    };
  }, [input.answers, input.config, input.questions]);

  const patternBreakdown = useMemo(
    () => getPatternBreakdown(result.scores),
    [result.scores],
  );

  const accuracy = useMemo(
    () =>
      result.totalCount > 0
        ? Math.round((result.correctCount / result.totalCount) * 100)
        : 0,
    [result.correctCount, result.totalCount],
  );

  return {
    soulPercentage: result.soulPercentage,
    soulPercentageDisplay: formatSoulPercentage(result.soulPercentage),
    soulTier: result.soulTier,
    tierInfo: result.tierInfo,
    scores: result.scores,
    patternBreakdown,
    correctCount: result.correctCount,
    totalCount: result.totalCount,
    accuracy,
    isPerfectScore: result.soulPercentage === 100,
    isHighScore: result.soulPercentage >= 76,
  };
}
