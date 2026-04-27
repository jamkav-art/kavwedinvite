"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useAnniversaryQuiz } from "@/hooks/useAnniversaryQuiz";
import type {
  QuestionBankItem,
  QuizConfigItem,
} from "@/types/anniversary-quiz.types";
import QuizEntranceScreen from "@/components/anniversary-quiz/QuizEntranceScreen";
import QuizProgressBar from "@/components/anniversary-quiz/QuizProgressBar";
import QuizSlideQuestion from "@/components/anniversary-quiz/QuizSlideQuestion";
import QuizCompletionLoader from "@/components/anniversary-quiz/QuizCompletionLoader";
import SoulCertificate from "@/components/anniversary-quiz/SoulCertificate";

interface QuizPageContentProps {
  quizData: {
    id: string;
    invite_id: string;
    couple_name_1: string;
    couple_name_2: string;
    questions: QuestionBankItem[];
    config: QuizConfigItem[];
    couple_photo_url: string | null;
    love_note: string | null;
  };
}

type QuizPhase = "entrance" | "quiz" | "loading" | "certificate";

export default function QuizPageContent({ quizData }: QuizPageContentProps) {
  const [phase, setPhase] = useState<QuizPhase>("entrance");

  const quiz = useAnniversaryQuiz({
    questions: quizData.questions,
    config: quizData.config.map((c) => ({
      q_id: c.q_id,
      correct_idx: c.correct_idx,
    })),
    couple_name_1: quizData.couple_name_1,
    couple_name_2: quizData.couple_name_2,
  });

  const handleStart = useCallback(() => {
    setPhase("quiz");
  }, []);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      quiz.selectOption(optionIndex);
    },
    [quiz],
  );

  // Watch for completion
  React.useEffect(() => {
    if (quiz.isComplete && quiz.result) {
      setPhase("loading");
      // Short delay for the loading animation, then show certificate
      const timer = setTimeout(() => {
        setPhase("certificate");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [quiz.isComplete, quiz.result]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream] overflow-y-auto">
      <AnimatePresence mode="wait">
        {phase === "entrance" && (
          <QuizEntranceScreen
            key="entrance"
            coupleName1={quizData.couple_name_1}
            coupleName2={quizData.couple_name_2}
            couplePhotoUrl={quizData.couple_photo_url}
            onStart={handleStart}
          />
        )}

        {phase === "quiz" && (
          <div key="quiz" className="min-h-screen px-4 py-8">
            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8 pt-4">
              <QuizProgressBar
                current={
                  quiz.currentQuestionIndex +
                  (quiz.selectedOption !== null ? 1 : 0)
                }
                total={quiz.totalQuestions}
              />
            </div>

            {/* Question Slide */}
            <AnimatePresence mode="wait">
              {quiz.currentQuestion && (
                <QuizSlideQuestion
                  key={quiz.currentQuestion.id}
                  question={quiz.currentQuestion}
                  questionIndex={quiz.currentQuestionIndex}
                  totalQuestions={quiz.totalQuestions}
                  selectedOption={quiz.selectedOption}
                  onSelectOption={handleSelectOption}
                />
              )}
            </AnimatePresence>

            {/* Love Note teaser at bottom */}
            {quizData.love_note && (
              <div className="max-w-md mx-auto mt-12 text-center">
                <p className="text-xs text-gray-300 italic">
                  "{quizData.love_note.slice(0, 80)}
                  {quizData.love_note.length > 80 ? "..." : ""}"
                </p>
                <p className="text-[10px] text-gray-200 mt-1">
                  — A message from {quizData.couple_name_1} &{" "}
                  {quizData.couple_name_2}
                </p>
              </div>
            )}
          </div>
        )}

        {phase === "loading" && <QuizCompletionLoader key="loading" />}

        {phase === "certificate" && quiz.result && (
          <div
            key="certificate"
            className="min-h-screen px-4 py-12 flex items-center justify-center"
          >
            <SoulCertificate
              result={quiz.result}
              coupleName1={quizData.couple_name_1}
              coupleName2={quizData.couple_name_2}
              quizId={quizData.id}
              inviteId={quizData.invite_id}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
