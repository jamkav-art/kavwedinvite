"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  QuestionBankItem,
  QuizAnswer,
  QuestionCategory,
  ScoreTier,
  ScoreTierInfo,
} from "@/types/anniversary-quiz.types";
import { calculateSoulScore } from "@/lib/anniversary-scoring";

export interface QuizTakerConfig {
  questions: QuestionBankItem[];
  config: { q_id: string; correct_idx: number }[];
  couple_name_1: string;
  couple_name_2: string;
}

export interface UseAnniversaryQuizReturn {
  // State
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  selectedOption: number | null;
  isTransitioning: boolean;
  isComplete: boolean;
  isCalculating: boolean;
  result: QuizResult | null;

  // Actions
  selectOption: (optionIndex: number) => void;
  nextQuestion: () => void;
  goToQuestion: (index: number) => void;
  reset: () => void;

  // Derived
  currentQuestion: QuestionBankItem | null;
  progress: number;
  totalQuestions: number;
}

export interface QuizResult {
  soul_percentage: number;
  soul_tier: ScoreTier;
  tierInfo: ScoreTierInfo;
  scores: Record<QuestionCategory, number>;
  correctCount: number;
  totalCount: number;
}

export function useAnniversaryQuiz(
  quizConfig: QuizTakerConfig | null,
): UseAnniversaryQuizReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const totalQuestions = quizConfig?.questions?.length ?? 0;
  const currentQuestion = quizConfig?.questions?.[currentQuestionIndex] ?? null;

  const progress = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round(
      ((currentQuestionIndex + (selectedOption !== null ? 1 : 0)) /
        totalQuestions) *
        100,
    );
  }, [currentQuestionIndex, selectedOption, totalQuestions]);

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null || isTransitioning || !quizConfig) return;

      setSelectedOption(optionIndex);

      // Record answer
      const newAnswer: QuizAnswer = {
        question_index: currentQuestionIndex,
        selected_idx: optionIndex,
      };
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      // Check if this was the last question
      const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

      // Auto-advance after short delay
      setIsTransitioning(true);
      setTimeout(() => {
        if (isLastQuestion) {
          // Calculate results
          setIsCalculating(true);
          setTimeout(() => {
            const configItems = quizConfig.config.map((c) => ({
              q_id: c.q_id,
              correct_idx: c.correct_idx,
            }));
            const scoreResult = calculateSoulScore(
              updatedAnswers,
              configItems,
              quizConfig.questions,
            );
            setResult({
              soul_percentage: scoreResult.soul_percentage,
              soul_tier: scoreResult.soul_tier,
              tierInfo: scoreResult.tierInfo,
              scores: scoreResult.scores,
              correctCount: scoreResult.correctCount,
              totalCount: scoreResult.totalCount,
            });
            setIsComplete(true);
            setIsCalculating(false);
            setIsTransitioning(false);
          }, 2000); // 2 seconds of suspense
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsTransitioning(false);
        }
      }, 600); // 0.6s delay for celebration effect
    },
    [
      selectedOption,
      isTransitioning,
      currentQuestionIndex,
      totalQuestions,
      answers,
      quizConfig,
    ],
  );

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentQuestionIndex(index);
        setSelectedOption(null);
      }
    },
    [totalQuestions],
  );

  const reset = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsTransitioning(false);
    setIsComplete(false);
    setIsCalculating(false);
    setResult(null);
  }, []);

  return {
    currentQuestionIndex,
    answers,
    selectedOption,
    isTransitioning,
    isComplete,
    isCalculating,
    result,

    selectOption,
    nextQuestion,
    goToQuestion,
    reset,

    currentQuestion,
    progress,
    totalQuestions,
  };
}
