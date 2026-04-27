"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import type { UploadedAsset } from "@/types/anniversary-order.types";

export default function SlideCouplePhoto() {
  const couplePhoto = useAnniversaryOrderStore((s) => s.couplePhoto);
  const updateCouple = useAnniversaryOrderStore((s) => s.updateCouple);
  const nextStep = useAnniversaryOrderStore((s) => s.nextStep);
  const prevStep = useAnniversaryOrderStore((s) => s.prevStep);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const asset: UploadedAsset = {
        url: event.target?.result as string,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        path: `couple-photo-${Date.now()}`,
      };
      updateCouple({ couplePhoto: asset });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    updateCouple({ couplePhoto: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
        📸
      </motion.div>

      {/* Question */}
      <h1 className="font-serif text-2xl sm:text-3xl text-[--color-charcoal] mb-2 leading-snug">
        Show us your smile
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Add a couple photo (optional, you can skip)
      </p>

      {/* Photo Upload Area */}
      <div className="space-y-6">
        {couplePhoto ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] max-w-sm mx-auto shadow-lg"
          >
            <img
              src={couplePhoto.url}
              alt="Couple"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Remove photo"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 hover:border-[--color-gold] bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-all hover:bg-[--color-gold]/5 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[--color-blush] to-[--color-gold]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 text-[--color-rose]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-400">
              Tap to upload your photo
            </span>
            <span className="text-xs text-gray-300">JPG, PNG or WebP</span>
          </motion.button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Navigation Buttons */}
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
            className="flex-1 py-4 rounded-2xl font-semibold bg-gradient-to-r from-[--color-gold] to-[--color-rose] text-white shadow-lg shadow-[--color-rose]/20 hover:shadow-xl hover:scale-[1.02] transition-all"
            whileTap={{ scale: 0.98 }}
          >
            {couplePhoto ? "Looks great! →" : "Skip →"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
