"use client";

import React from "react";
import { motion } from "framer-motion";
import type {
  QuestionBankItem,
  QuestionCategory,
} from "@/types/anniversary-quiz.types";
import { CATEGORY_EMOJI, CATEGORY_LABEL } from "@/types/anniversary-quiz.types";

interface QuizSlideQuestionProps {
  question: QuestionBankItem;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
}

const optionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      type: "spring" as const,
      stiffness: 150,
    },
  }),
};

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

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-6"
    >
      {/* Category Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm mb-6"
      >
        <span className="text-lg">{emoji}</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      </motion.div>

      {/* Question Text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-serif text-2xl sm:text-3xl text-[--color-charcoal] text-center mb-8 leading-snug max-w-md"
      >
        {question.question_text}
      </motion.h2>

      {/* Options Grid */}
      <div className="w-full max-w-md space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <motion.button
              key={index}
              custom={index}
              variants={optionVariants}
              initial="initial"
              animate="animate"
              onClick={() => !selectedOption && onSelectOption(index)}
              disabled={selectedOption !== null}
              className={`w-full p-4 rounded-xl text-base font-medium transition-all border-2 text-left ${
                isSelected
                  ? "border-[--color-gold] bg-[--color-gold]/5 ring-2 ring-[--color-gold]/20 shadow-lg"
                  : selectedOption !== null
                    ? "border-gray-100 bg-gray-50/50 text-gray-300 cursor-not-allowed"
                    : "border-gray-100 bg-white/80 backdrop-blur-sm hover:border-[--color-gold]/50 hover:bg-[--color-gold]/5 hover:shadow-sm active:scale-[0.98] cursor-pointer"
              }`}
              whileTap={selectedOption ? {} : { scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isSelected
                      ? "bg-[--color-gold] text-white"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={isSelected ? "text-[--color-gold]" : ""}>
                  {option}
                </span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="ml-auto text-[--color-gold]"
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
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
