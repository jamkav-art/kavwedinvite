"use client";

import React, { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "@/types/anniversary-quiz.types";
import type { QuestionCategory } from "@/types/anniversary-quiz.types";
import type { QuizQuestion } from "@/types/anniversary-order.types";
import { createCustomQuestion } from "@/lib/anniversary-questions";

// ── 3-State Quiz Phase ──
type QuizPhase = "choose" | "random" | "custom";

const MAX_CUSTOM_QUESTIONS = 10;
const OPTION_LABELS = ["A", "B", "C"] as const;

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
  const clearQuizBuilder = useAnniversaryOrderStore((s) => s.clearQuizBuilder);
  const storeQuestions = useAnniversaryOrderStore((s) => s.questions);
  const setQuestions = useAnniversaryOrderStore((s) => s.setQuestions);
  const nextStep = useAnniversaryOrderStore((s) => s.nextStep);

  // ── Phase state ──
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("choose");

  // ── Random quiz state (unchanged) ──
  const [localQIndex, setLocalQIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrectReveal, setIsCorrectReveal] = useState(false);

  // ── Custom quiz builder state ──
  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>([]);
  const [customIndex, setCustomIndex] = useState(0);
  const [customComplete, setCustomComplete] = useState(false);

  // Track if we've initialised custom questions
  const customInitRef = useRef(false);

  // ── Fetch random questions on choosing "random" ──
  React.useEffect(() => {
    if (
      quizPhase === "random" &&
      !quizBuilder.questionsLoaded &&
      !quizBuilder.isLoadingQuestions
    ) {
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
  }, [quizPhase]);

  // ── Initialise custom questions on entering custom mode ──
  React.useEffect(() => {
    if (quizPhase === "custom" && !customInitRef.current) {
      customInitRef.current = true;
      // Check if store already has saved custom questions (e.g. when coming back from Step 6)
      const savedCustom = storeQuestions.filter(
        (q) => q.isCustom && q.text.trim().length > 0,
      );
      if (savedCustom.length > 0) {
        setCustomQuestions(savedCustom);
        setCustomIndex(savedCustom.length - 1);
        setCustomComplete(true);
      } else {
        // Start with one empty question
        setCustomQuestions([createCustomQuestion()]);
        setCustomIndex(0);
        setCustomComplete(false);
      }
    }
  }, [quizPhase, storeQuestions]);

  // ── Handle choosing quiz mode ──
  const handleChooseRandom = useCallback(() => {
    clearQuizBuilder();
    setQuizPhase("random");
  }, [clearQuizBuilder]);

  const handleChooseCustom = useCallback(() => {
    setQuizPhase("custom");
    customInitRef.current = false;
  }, []);

  // ── Custom question mutation helpers ──
  const updateCustomQuestion = useCallback(
    (index: number, data: Partial<Omit<QuizQuestion, "id" | "isCustom">>) => {
      setCustomQuestions((prev) =>
        prev.map((q, i) => (i === index ? { ...q, ...data } : q)),
      );
    },
    [],
  );

  const addCustomQuestion = useCallback(() => {
    setCustomQuestions((prev) => [...prev, createCustomQuestion()]);
    setCustomIndex((prev) => prev + 1);
  }, []);

  const saveCustomToStore = useCallback(() => {
    // Save all drafted custom questions into the store's questions array
    setQuestions(customQuestions);
  }, [customQuestions, setQuestions]);

  // ── Back to choose screen (saves custom questions first) ──
  const handleBackToChoose = useCallback(() => {
    saveCustomToStore();
    setQuizPhase("choose");
    customInitRef.current = false;
  }, [saveCustomToStore]);

  // ── Complete custom quiz ──
  const handleCustomComplete = useCallback(() => {
    saveCustomToStore();
    setCustomComplete(true);
  }, [saveCustomToStore]);

  // ── Check if current custom question is valid ──
  const currentCustom = customQuestions[customIndex];
  const isCurrentValid =
    currentCustom &&
    currentCustom.text.trim().length > 0 &&
    currentCustom.options.every((o) => o.trim().length > 0);

  // ══════════════════════════════════════════════
  //  RENDER: CHOOSE SCREEN
  // ══════════════════════════════════════════════
  if (quizPhase === "choose") {
    return (
      <ChooseQuizScreen
        onRandom={handleChooseRandom}
        onCustom={handleChooseCustom}
      />
    );
  }

  // ══════════════════════════════════════════════
  //  RENDER: CUSTOM QUIZ BUILDER
  // ══════════════════════════════════════════════
  if (quizPhase === "custom") {
    // Completion state
    if (customComplete && customQuestions.length > 0) {
      return (
        <CustomCompletionScreen
          questionCount={customQuestions.length}
          onBack={() => {
            setCustomComplete(false);
          }}
          onNext={() => {
            saveCustomToStore();
            nextStep();
          }}
        />
      );
    }

    return (
      <CustomQuizBuilder
        questions={customQuestions}
        currentIndex={customIndex}
        onUpdate={updateCustomQuestion}
        onAdd={addCustomQuestion}
        onBack={handleBackToChoose}
        onComplete={handleCustomComplete}
        isValid={isCurrentValid}
        maxQuestions={MAX_CUSTOM_QUESTIONS}
      />
    );
  }

  // ══════════════════════════════════════════════
  //  RENDER: RANDOM QUIZ (EXISTING LOGIC)
  // ══════════════════════════════════════════════

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

  const questions = quizBuilder.currentQuestions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[localQIndex];
  const answeredCount = quizBuilder.answers.length;
  const allAnswered = answeredCount >= totalQuestions;

  const existingAnswer = currentQuestion
    ? quizBuilder.answers.find((a) => a.q_id === currentQuestion.id)
    : null;

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (selectedIdx !== null || isCorrectReveal || !currentQuestion) return;

      const existing = quizBuilder.answers.find(
        (a) => a.q_id === currentQuestion.id,
      );
      if (existing && existing.correct_idx === optionIndex) {
        return;
      }

      setQuizAnswer(currentQuestion.id, optionIndex);
      setSelectedIdx(optionIndex);
      setIsCorrectReveal(true);

      setTimeout(() => {
        setSelectedIdx(null);
        setIsCorrectReveal(false);

        if (localQIndex < totalQuestions) {
          setLocalQIndex((prev) => prev + 1);
        }
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

  // Completion — all 10 random answered
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
          All {totalQuestions} questions set!
        </h2>
        <p className="text-[#F5C6DA]/70 text-sm mb-8">
          Your partner will try to match your answers 💕
        </p>

        <div className="flex gap-3">
          <motion.button
            onClick={handleBackToChoose}
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

  // No questions yet
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/40">No questions loaded yet.</p>
      </div>
    );
  }

  // ─── ONE QUESTION PER SCREEN (Random) ─────────────
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

      {/* Question text */}
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

      {/* Options */}
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

      {/* Celebration text */}
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

// ══════════════════════════════════════════════════
//  SUB-COMPONENT: Choose Quiz Screen
// ══════════════════════════════════════════════════
function ChooseQuizScreen({
  onRandom,
  onCustom,
}: {
  onRandom: () => void;
  onCustom: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      {/* Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-6xl mb-6"
      >
        🎯
      </motion.div>

      {/* Heading */}
      <h2 className="font-serif text-2xl sm:text-3xl love-story-gradient mb-3 leading-snug">
        Choose quiz option
      </h2>
      <p className="text-sm text-[#F5C6DA]/60 mb-10 max-w-sm">
        Pick how you'd like to build your love story quiz
      </p>

      {/* Buttons */}
      <div className="w-full max-w-sm space-y-4">
        {/* Random button */}
        <motion.button
          onClick={onRandom}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-5 rounded-2xl anniv-step1-cta-btn text-white shadow-lg shadow-[#C4497C]/30 hover:shadow-xl transition-all text-left"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🎲</span>
            <div>
              <p className="text-lg font-semibold">Random</p>
              <p className="text-sm text-white/60">
                Surprise me with curated questions
              </p>
            </div>
          </div>
        </motion.button>

        {/* Custom button */}
        <motion.button
          onClick={onCustom}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#C4497C]/40 transition-all text-left"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">✍️</span>
            <div>
              <p className="text-lg font-semibold">Custom</p>
              <p className="text-sm text-white/50">
                Write your own questions & answers
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Bottom hint */}
      <p className="mt-10 text-xs text-[#F5C6DA]/40">
        You can always go back and change your choice
      </p>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════
//  SUB-COMPONENT: Custom Quiz Builder
// ══════════════════════════════════════════════════
function CustomQuizBuilder({
  questions,
  currentIndex,
  onUpdate,
  onAdd,
  onBack,
  onComplete,
  isValid,
  maxQuestions,
}: {
  questions: QuizQuestion[];
  currentIndex: number;
  onUpdate: (
    index: number,
    data: Partial<Omit<QuizQuestion, "id" | "isCustom">>,
  ) => void;
  onAdd: () => void;
  onBack: () => void;
  onComplete: () => void;
  isValid: boolean;
  maxQuestions: number;
}) {
  const q = questions[currentIndex];
  const isLast = currentIndex >= questions.length - 1;
  const canAddMore = questions.length < maxQuestions;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Progress */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#F5C6DA]/50 uppercase tracking-wider">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs text-[#F5C6DA]/50">Max {maxQuestions}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C4497C] to-[#D4AF37] rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / maxQuestions) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question Editor Card */}
      <motion.div
        key={`custom-q-${currentIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-5"
      >
        {/* Question text input */}
        <div>
          <label className="text-xs font-semibold text-[#F5C6DA]/70 uppercase tracking-wider mb-2 block">
            Your Question
          </label>
          <input
            type="text"
            value={q?.text ?? ""}
            onChange={(e) => onUpdate(currentIndex, { text: e.target.value })}
            placeholder="e.g. What is my favourite dessert?"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4497C]/40 focus:border-[#C4497C]/60 transition-all"
          />
        </div>

        {/* Options */}
        <div>
          <label className="text-xs font-semibold text-[#F5C6DA]/70 uppercase tracking-wider mb-3 block">
            Answer Options
          </label>
          <div className="space-y-2.5">
            {OPTION_LABELS.map((label, oi) => {
              const isCorrect = q?.correctAnswer === oi;
              return (
                <div key={oi} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate(currentIndex, { correctAnswer: oi })
                    }
                    className={`shrink-0 rounded-full text-xs font-bold flex items-center justify-center gap-1 px-3 transition-all min-w-[80px] h-9 ${
                      isCorrect
                        ? "anniv-option-btn text-white shadow-md"
                        : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10"
                    }`}
                    aria-label={`Mark option ${label} as correct`}
                  >
                    <span>{label}</span>
                    {isCorrect && (
                      <span className="text-[10px] font-semibold text-green-300">
                        ✓
                      </span>
                    )}
                  </button>
                  <input
                    type="text"
                    value={q?.options[oi] ?? ""}
                    onChange={(e) => {
                      const next = [...(q?.options ?? ["", "", ""])];
                      next[oi] = e.target.value;
                      onUpdate(currentIndex, { options: next });
                    }}
                    placeholder={`Option ${label}...`}
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-white/5 placeholder:text-white/20 ${
                      isCorrect
                        ? "border-[#C4497C]/40 bg-[#C4497C]/10 text-white"
                        : "border-white/10 text-white/70 focus:ring-[#C4497C]/30 focus:border-[#C4497C]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#F5C6DA]/40 mt-2 font-medium">
            Tap the letter to mark the correct answer
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="w-full max-w-md mt-6 space-y-3">
        {/* Main row: Add / Complete */}
        {isLast && canAddMore ? (
          <motion.button
            onClick={onAdd}
            disabled={!isValid}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isValid
                ? "anniv-step1-cta-btn text-white shadow-lg shadow-[#C4497C]/30 hover:shadow-xl"
                : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            Add next question
          </motion.button>
        ) : !isLast ? (
          <p className="text-center text-sm text-[#F5C6DA]/40 py-2">
            Swipe or use the buttons below to navigate
          </p>
        ) : null}

        {/* Navigation row */}
        <div className="flex gap-3">
          {/* Back to quiz options */}
          <motion.button
            onClick={onBack}
            className="w-full py-3 rounded-2xl font-medium text-sm text-white/30 hover:text-white/60 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            ← Back to quiz options
          </motion.button>

          {/* Complete / Done button (only on last question) */}
          {isLast && (
            <motion.button
              onClick={onComplete}
              disabled={!isValid}
              whileTap={isValid ? { scale: 0.98 } : {}}
              className={`flex-1 py-4 rounded-2xl font-semibold transition-all ${
                isValid
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#C4497C] text-white shadow-lg"
                  : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {questions.length >= maxQuestions ? "Done! →" : "Finish quiz →"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
//  SUB-COMPONENT: Custom Completion Screen
// ══════════════════════════════════════════════════
function CustomCompletionScreen({
  questionCount,
  onBack,
  onNext,
}: {
  questionCount: number;
  onBack: () => void;
  onNext: () => void;
}) {
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
        All {questionCount} questions set!
      </h2>
      <p className="text-[#F5C6DA]/70 text-sm mb-8">
        Your partner will try to match your answers 💕
      </p>

      <div className="flex gap-3">
        <motion.button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all"
          whileTap={{ scale: 0.98 }}
        >
          ← Back
        </motion.button>
        <motion.button
          onClick={onNext}
          className="flex-1 py-4 rounded-2xl font-semibold anniv-step1-cta-btn text-white shadow-lg shadow-[#C4497C]/30 hover:shadow-xl transition-all"
          whileTap={{ scale: 0.98 }}
        >
          Looks perfect! →
        </motion.button>
      </div>
    </motion.div>
  );
}
