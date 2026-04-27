"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "@/types/anniversary-quiz.types";
import type { QuestionCategory } from "@/types/anniversary-quiz.types";

export default function SlideQuizMatrix() {
  const quizBuilder = useAnniversaryOrderStore((s) => s.quizBuilder);
  const setQuizAnswer = useAnniversaryOrderStore((s) => s.setQuizAnswer);
  const removeQuizAnswer = useAnniversaryOrderStore((s) => s.removeQuizAnswer);
  const setCurrentQuestions = useAnniversaryOrderStore(
    (s) => s.setCurrentQuestions,
  );
  const setIsLoadingQuestions = useAnniversaryOrderStore(
    (s) => s.setIsLoadingQuestions,
  );
  const nextStep = useAnniversaryOrderStore((s) => s.nextStep);
  const prevStep = useAnniversaryOrderStore((s) => s.prevStep);

  // Fetch questions on mount if not loaded
  React.useEffect(() => {
    if (!quizBuilder.questionsLoaded && !quizBuilder.isLoadingQuestions) {
      setIsLoadingQuestions(true);
      fetch("/api/quiz/random-questions")
        .then((res) => res.json())
        .then((data) => {
          if (data.questions) {
            setCurrentQuestions(data.questions);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch questions:", err);
          setIsLoadingQuestions(false);
        });
    }
  }, []);

  const handleOptionSelect = useCallback(
    (questionId: string, optionIndex: number) => {
      const existing = quizBuilder.answers.find((a) => a.q_id === questionId);
      if (existing && existing.correct_idx === optionIndex) {
        // Toggle off
        removeQuizAnswer(questionId);
      } else {
        setQuizAnswer(questionId, optionIndex);
      }
    },
    [quizBuilder.answers, setQuizAnswer, removeQuizAnswer],
  );

  const answeredCount = quizBuilder.answers.length;
  const canProceed = answeredCount >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="text-4xl mb-3"
        >
          🎯
        </motion.div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[--color-charcoal] mb-1 leading-snug">
          Set the correct answers
        </h1>
        <p className="text-sm text-gray-400">
          Tap the right answer for each question
        </p>
      </div>

      {/* Progress counter */}
      <div className="flex-shrink-0 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[--color-blush]/30 to-[--color-gold]/10 border border-[--color-gold]/20">
          <span className="text-sm font-semibold text-[--color-rose]">
            {answeredCount}/10 selected
          </span>
          {answeredCount >= 10 && <span className="text-green-500">✅</span>}
        </div>
      </div>

      {/* Questions list (scrollable) */}
      <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-4 space-y-4 scrollbar-thin">
        {quizBuilder.isLoadingQuestions && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[--color-gold] border-t-transparent"
              />
              <p className="text-sm text-gray-400">Loading questions...</p>
            </div>
          </div>
        )}

        {!quizBuilder.isLoadingQuestions &&
          quizBuilder.currentQuestions.map((question, index) => {
            const category = question.category as QuestionCategory;
            const emoji = CATEGORY_EMOJI[category] ?? "❓";
            const label = CATEGORY_LABEL[category] ?? category;
            const selectedAnswer = quizBuilder.answers.find(
              (a) => a.q_id === question.id,
            );

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm text-left"
              >
                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">{emoji}</span>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="text-xs text-gray-300 ml-auto">
                    Q{index + 1}
                  </span>
                </div>

                {/* Question */}
                <p className="font-serif text-base sm:text-lg text-[--color-charcoal] mb-3 leading-snug">
                  {question.question_text}
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {question.options.map((option, optIndex) => {
                    const isSelected = selectedAnswer?.correct_idx === optIndex;
                    return (
                      <motion.button
                        key={optIndex}
                        onClick={() =>
                          handleOptionSelect(question.id, optIndex)
                        }
                        className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                          isSelected
                            ? "bg-[--color-gold]/10 border-[--color-gold] ring-2 ring-[--color-gold]/20 text-[--color-gold]"
                            : "bg-white border-gray-100 text-gray-600 hover:border-[--color-gold]/50 hover:bg-[--color-gold]/5"
                        }`}
                        whileTap={{ scale: 0.97 }}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 pt-3 border-t border-gray-100">
        <div className="flex gap-3">
          <motion.button
            onClick={prevStep}
            className="flex-1 py-4 rounded-2xl font-semibold bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            whileTap={{ scale: 0.98 }}
          >
            ← Back
          </motion.button>
          <motion.button
            onClick={nextStep}
            disabled={!canProceed}
            className={`flex-1 py-4 rounded-2xl font-semibold transition-all ${
              canProceed
                ? "bg-gradient-to-r from-[--color-gold] to-[--color-rose] text-white shadow-lg shadow-[--color-rose]/20 hover:shadow-xl hover:scale-[1.02]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            whileTap={{ scale: canProceed ? 0.98 : 1 }}
          >
            {canProceed ? "Looks perfect! →" : "Select all 10 →"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
