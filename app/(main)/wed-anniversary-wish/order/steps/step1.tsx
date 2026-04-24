"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { Input } from "@/components/ui/Input";
import PhotoUploadDropzone from "@/components/anniversary-order/PhotoUploadDropzone";
import { step1Schema } from "@/lib/anniversary-order-validation";

type FieldErrors = Partial<
  Record<"yourName" | "partnerName" | "anniversaryDate", string>
>;

export default function Step1() {
  const store = useAnniversaryOrderStore();
  const [errors, setErrors] = useState<FieldErrors>({});

  // Auto-calculate years together
  const yearsTogether = useMemo(() => {
    if (!store.anniversaryDate) return 0;
    const anniv = new Date(store.anniversaryDate);
    const now = new Date();
    let years = now.getFullYear() - anniv.getFullYear();
    const monthDiff = now.getMonth() - anniv.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < anniv.getDate())) {
      years--;
    }
    return Math.max(0, years);
  }, [store.anniversaryDate]);

  const handleNext = () => {
    const result = step1Schema.safeParse({
      yourName: store.yourName,
      partnerName: store.partnerName,
      anniversaryDate: store.anniversaryDate,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof FieldErrors;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    store.updateCouple({ yearsTogether });
    store.nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold love-story-gradient leading-tight">
          Tell us about your love
        </h1>
        <p className="mt-1 text-sm text-[--color-charcoal]/55">
          Step 1 of 4 — your names, anniversary, and a photo
        </p>
      </div>

      {/* Names */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold anniversary-gradient-text">
          The couple
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your name"
            placeholder="e.g. Priya"
            required
            colorful
            autoFocus
            value={store.yourName}
            onChange={(e) => {
              store.updateCouple({ yourName: e.target.value });
              if (errors.yourName)
                setErrors((p) => ({ ...p, yourName: undefined }));
            }}
            error={errors.yourName}
          />
          <Input
            label="Partner's name"
            placeholder="e.g. Rahul"
            required
            colorful
            value={store.partnerName}
            onChange={(e) => {
              store.updateCouple({ partnerName: e.target.value });
              if (errors.partnerName)
                setErrors((p) => ({ ...p, partnerName: undefined }));
            }}
            error={errors.partnerName}
          />
        </div>
      </div>

      {/* Anniversary date + years */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold anniversary-gradient-text">
          Your anniversary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Anniversary date"
              type="date"
              required
              colorful
              value={store.anniversaryDate}
              onChange={(e) => {
                store.updateCouple({ anniversaryDate: e.target.value });
                if (errors.anniversaryDate)
                  setErrors((p) => ({ ...p, anniversaryDate: undefined }));
              }}
              error={errors.anniversaryDate}
              hint="The date you became each other's forever"
            />
          </div>
          {store.anniversaryDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col justify-center items-center rounded-2xl bg-[--color-blush] border border-[--color-gold]/20 p-4"
            >
              <span className="text-3xl font-[var(--font-cormorant)] font-bold anniversary-gradient-text">
                {yearsTogether}
              </span>
              <span className="text-xs text-[--color-charcoal]/55">
                {yearsTogether === 1 ? "year" : "years"} together
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Photo upload */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold anniversary-gradient-text">
          Couple photo{" "}
          <span className="text-xs text-gray-400 font-normal">
            (optional — becomes hero background)
          </span>
        </h2>
        <PhotoUploadDropzone
          value={store.couplePhoto}
          onChange={(file) => {
            // In production, upload to Supabase storage here
            if (file) {
              const previewUrl = URL.createObjectURL(file);
              store.updateCouple({
                couplePhoto: {
                  name: file.name,
                  url: previewUrl,
                  path: previewUrl,
                  mimeType: file.type,
                  size: file.size,
                },
              });
            } else {
              store.updateCouple({ couplePhoto: null });
            }
          }}
          label="Upload your couple photo"
          hint="This becomes the hero background of your quiz"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-2 border-t border-gray-100">
        <motion.button
          onClick={handleNext}
          whileHover={{
            scale: 1.04,
            y: -2,
            boxShadow:
              "0 12px 40px rgba(192,24,95,0.45), 0 0 0 3px rgba(201,169,98,0.35)",
          }}
          whileTap={{ scale: 0.97, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="order-cta-btn inline-flex items-center gap-2 h-14 px-8 text-base font-semibold rounded-full text-white"
        >
          Continue to Quiz Builder
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
