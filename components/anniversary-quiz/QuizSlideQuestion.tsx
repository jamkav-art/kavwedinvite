"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  QuestionBankItem,
  QuestionCategory,
} from "@/types/anniversary-quiz.types";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "@/types/anniversary-quiz.types";
import AnswerFeedbackSVG from "./AnswerFeedbackSVG";

interface QuizSlideQuestionProps {
  question: QuestionBankItem;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
}

const optionVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.1 + i * 0.1,
      type: "spring" as const,
      stiffness: 150,
      damping: 20,
    },
  }),
};

const OPTION_CLASSES = ["option-btn-a", "option-btn-b", "option-btn-c"];
const OPTION_LETTERS = ["A", "B", "C"];

export default function QuizSlideQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
}: QuizSlideQuestionProps) {
  const category = question.category as QuestionCategory;
  const emoji = CATEGORY_EMOJI[category] ?? "❓";
  const label = CATEGORY_LABEL[category] ?? category;

  // Determine if selected answer was correct or wrong
  // This would need the correct_idx from somewhere - we can pass it or infer
  // For now we show feedback based on selection state

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6 relative"
    >
      {/* Question Number */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-xs text-gray-400 mb-4 font-mono"
      >
        Question {questionIndex + 1} of {totalQuestions}
      </motion.div>

      {/* Category Badge — Glassmorphism with animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-lg shadow-[--color-rose]/5 mb-6"
      >
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg"
        >
          {emoji}
        </motion.span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
      </motion.div>

      {/* 3D Question Card with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="question-card-3d w-full max-w-md mb-8"
      >
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/60 shadow-xl shadow-[--color-rose]/5">
          {/* Gradient border overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[--color-gold]/10 via-transparent to-[--color-rose]/10 pointer-events-none" />

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

          <h2 className="font-serif text-xl sm:text-2xl text-[--color-charcoal] text-center leading-relaxed relative z-10">
            {question.question_text}
          </h2>
        </div>
      </motion.div>

      {/* Options Grid */}
      <div className="w-full max-w-md space-y-3 relative z-10">
        <AnimatePresence>
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isDisabled = selectedOption !== null && !isSelected;
            const optionClass = OPTION_CLASSES[index];

            return (
              <motion.button
                key={`${question.id}-${index}`}
                custom={index}
                variants={optionVariants}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                onClick={() => !selectedOption && onSelectOption(index)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-xl text-base font-medium transition-all text-left relative overflow-hidden ${
                  isSelected
                    ? `${optionClass} shadow-lg shadow-[--color-rose]/20 scale-[1.02] ring-2 ring-white/30`
                    : isDisabled
                      ? "border border-gray-200 bg-gray-100/50 text-gray-300 cursor-not-allowed backdrop-blur-sm"
                      : "bg-white/70 backdrop-blur-md border border-white/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-[--color-gold]/10 active:scale-[0.98] cursor-pointer glass-card"
                }`}
                whileTap={selectedOption ? {} : { scale: 0.97 }}
              >
                <div className="flex items-center gap-3">
                  {/* Letter indicator */}
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isSelected
                        ? "bg-white/30 text-white"
                        : "bg-white/80 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {OPTION_LETTERS[index]}
                  </span>
                  <span
                    className={`flex-1 ${
                      isSelected ? "text-white" : "text-[--color-charcoal]"
                    }`}
                  >
                    {option}
                  </span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="shrink-0 text-white"
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
                </div>

                {/* Shine overlay for selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="mt-8 flex flex-col items-center"
          >
            <AnswerFeedbackSVG type="correct" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium mt-2 text-[--color-rose]"
            >
              {selectedOption !== null ? "Great choice! 💕" : ""}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
