"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { WIZARD_STEPS } from "@/types/anniversary-quiz.types";

export default function SlideReviewPay() {
  const store = useAnniversaryOrderStore();
  const prevStep = useAnniversaryOrderStore((s) => s.prevStep);

  const yearsTogether = useMemo(() => {
    if (!store.anniversaryDate) return 0;
    const date = new Date(store.anniversaryDate);
    const today = new Date();
    let years = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      years--;
    }
    return Math.max(0, years);
  }, [store.anniversaryDate]);

  const questionCount = store.quizBuilder.answers.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      {/* Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-5xl mb-6"
      >
        ✨
      </motion.div>

      {/* Title */}
      <h1 className="font-serif text-2xl sm:text-3xl text-[--color-charcoal] mb-1 leading-snug">
        Your Love Story Quiz
      </h1>
      <p className="text-sm text-gray-400 mb-6">Review & bring it to life</p>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 mb-6 text-left"
      >
        {/* Couple */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[--color-blush] to-[--color-gold]/20 flex items-center justify-center text-2xl">
            {store.couplePhoto ? (
              <img
                src={store.couplePhoto.url}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              "💑"
            )}
          </div>
          <div>
            <p className="font-serif text-lg text-[--color-charcoal]">
              {store.yourName || "You"} ❤️ {store.partnerName || "Them"}
            </p>
            {yearsTogether > 0 && (
              <p className="text-sm text-gray-400">
                {yearsTogether} {yearsTogether === 1 ? "year" : "years"}{" "}
                together
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-[--color-blush]/20">
            <p className="text-xl font-bold text-[--color-rose]">
              {questionCount}
            </p>
            <p className="text-xs text-gray-400">Questions</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[--color-gold]/10">
            <p className="text-xl font-bold text-[--color-gold]">🎨</p>
            <p className="text-xs text-gray-400">{store.floralTheme}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-purple-50">
            <p className="text-xl font-bold text-purple-400">🎵</p>
            <p className="text-xs text-gray-400">
              {store.backgroundMusic ? "Music" : "No music"}
            </p>
          </div>
        </div>

        {/* Love note preview */}
        {store.loveNote && (
          <div className="pt-3 border-t border-gray-50">
            <p className="text-xs text-gray-400 mb-1">💌 Love Note</p>
            <p className="text-sm text-gray-500 italic line-clamp-2">
              "{store.loveNote}"
            </p>
          </div>
        )}
      </motion.div>

      {/* Price & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[--color-gold]/10 to-[--color-rose]/10 border border-[--color-gold]/20">
          <span className="text-2xl font-bold font-serif text-[--color-rose]">
            ₹399
          </span>
          <span className="text-sm text-gray-400">one-time</span>
        </div>

        {/* Pay Button */}
        <motion.button
          className="w-full py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-[--color-gold] to-[--color-rose] text-white shadow-lg shadow-[--color-rose]/20 hover:shadow-xl hover:scale-[1.02] transition-all"
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // TODO: Integrate Razorpay payment
            alert("Payment integration coming soon!");
          }}
        >
          Pay & Create ✨
        </motion.button>

        {/* Back button */}
        <motion.button
          onClick={prevStep}
          className="w-full py-3 rounded-2xl font-medium text-sm text-gray-400 hover:text-gray-600 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          ← Edit something
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
