"use client";

import React, { useCallback, useState } from "react";
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

  // Local index for one-question-at-a-time flow
  const [localQIndex, setLocalQIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrectReveal, setIsCorrectReveal] = useState(false);

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

  const questions = quizBuilder.currentQuestions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[localQIndex];
  const answeredCount = quizBuilder.answers.length;
  const allAnswered = answeredCount >= totalQuestions;

  // Determine if current question already has an answer selected
  const existingAnswer = currentQuestion
    ? quizBuilder.answers.find((a) => a.q_id === currentQuestion.id)
    : null;

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      // Prevent double-click
      if (selectedIdx !== null || isCorrectReveal || !currentQuestion) return;

      // Set the answer in store
      const existing = quizBuilder.answers.find(
        (a) => a.q_id === currentQuestion.id,
      );
      if (existing && existing.correct_idx === optionIndex) {
        // Already selected — do nothing (shouldn't happen)
        return;
      }

      // Record answer
      setQuizAnswer(currentQuestion.id, optionIndex);
      setSelectedIdx(optionIndex);
      setIsCorrectReveal(true);

      // Auto-advance after celebration delay
      setTimeout(() => {
        setSelectedIdx(null);
        setIsCorrectReveal(false);

        // Move to next question or completion
        if (localQIndex < totalQuestions) {
          setLocalQIndex((prev) => prev + 1);
        }
        // If last question, we stay on the completion state
      }, 800);
    },
    [
      selectedIdx,
      isCorrectReveal,
      currentQuestion,
      quizBuilder.answers,
      setQuizAnswer,
      localQIndex,
      totalQuestions,
    ],
  );

  // Loading state
  if (quizBuilder.isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[#C4497C] border-t-transparent"
          />
          <p className="text-sm text-[#F5C6DA]/60">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Completion state — all 10 answered
  if (allAnswered && localQIndex >= totalQuestions) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
          className="text-6xl mb-6"
        >
          🎉
        </motion.div>
        <h2 className="font-serif text-2xl sm:text-3xl love-story-gradient mb-3 leading-snug">
          All 10 questions set!
        </h2>
        <p className="text-[#F5C6DA]/70 text-sm mb-8">
          Your partner will try to match your answers 💕
        </p>

        <div className="flex gap-3">
          <motion.button
            onClick={prevStep}
            className="flex-1 py-4 rounded-2xl font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all"
            whileTap={{ scale: 0.98 }}
          >
            ← Back
          </motion.button>
          <motion.button
            onClick={nextStep}
            className="flex-1 py-4 rounded-2xl font-semibold anniv-step1-cta-btn text-white shadow-lg shadow-[#C4497C]/30 hover:shadow-xl transition-all"
            whileTap={{ scale: 0.98 }}
          >
            Looks perfect! →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // No questions yet (shouldn't normally happen)
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/40">No questions loaded yet.</p>
      </div>
    );
  }

  // ─── ONE QUESTION PER SCREEN ──────────────────────────────
  const category = currentQuestion.category as QuestionCategory;
  const emoji = CATEGORY_EMOJI[category] ?? "❓";
  const label = CATEGORY_LABEL[category] ?? category;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Progress indicator */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#F5C6DA]/50 uppercase tracking-wider">
            Question {localQIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-[#F5C6DA]/50">
            {answeredCount}/{totalQuestions} selected
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C4497C] to-[#D4AF37] rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${((localQIndex + (selectedIdx !== null ? 1 : 0)) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Category badge */}
      <motion.div
        key={`cat-${currentQuestion.id}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
      >
        <span className="text-lg">{emoji}</span>
        <span className="text-xs font-medium text-[#F5C6DA]/60 uppercase tracking-wider">
          {label}
        </span>
      </motion.div>

      {/* Question text — gradient heading */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={`q-${currentQuestion.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="font-serif text-xl sm:text-2xl md:text-3xl love-story-gradient mb-10 leading-snug max-w-md px-2"
        >
          {currentQuestion.question_text}
        </motion.h2>
      </AnimatePresence>

      {/* Options — three pills */}
      <div className="w-full max-w-md space-y-3">
        <AnimatePresence mode="wait">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedIdx === index;
            const wasAlreadySelected =
              !isSelected &&
              existingAnswer &&
              existingAnswer.correct_idx === index;

            return (
              <motion.button
                key={`opt-${currentQuestion.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  delay: 0.1 + index * 0.07,
                  type: "spring",
                  stiffness: 150,
                }}
                onClick={() => handleSelectOption(index)}
                disabled={selectedIdx !== null || isCorrectReveal}
                className={`w-full p-4 rounded-xl text-base font-medium transition-all border text-left flex items-center gap-3 ${
                  isSelected
                    ? "anniv-option-btn text-white border-transparent shadow-lg shadow-[#C4497C]/30 scale-[1.02]"
                    : wasAlreadySelected
                      ? "bg-[#C4497C]/20 border-[#C4497C]/40 text-[#F5C6DA]"
                      : selectedIdx !== null
                        ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-[#C4497C]/40 hover:text-white active:scale-[0.98] cursor-pointer"
                }`}
                whileTap={selectedIdx !== null ? {} : { scale: 0.98 }}
              >
                {/* Option letter badge */}
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span
                  className={`flex-1 ${
                    isSelected
                      ? "text-white"
                      : wasAlreadySelected
                        ? "text-[#F5C6DA]"
                        : ""
                  }`}
                >
                  {option}
                </span>

                {/* Checkmark on select */}
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Celebration text when correct answer selected */}
      <AnimatePresence>
        {isCorrectReveal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 text-sm text-[#D4AF37] font-medium"
          >
            {localQIndex < totalQuestions - 1
              ? "Got it! 💫"
              : "Last one set! 🎉"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
