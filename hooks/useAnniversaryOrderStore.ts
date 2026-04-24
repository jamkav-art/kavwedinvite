"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AnniversaryOrderState,
  QuizQuestion,
  FloralTheme,
  ColorMood,
  UploadedAsset,
} from "@/types/anniversary-order.types";
import {
  createDefaultQuestions,
  createCustomQuestion,
} from "@/lib/anniversary-questions";

type CoupleFields = Pick<
  AnniversaryOrderState,
  | "yourName"
  | "partnerName"
  | "anniversaryDate"
  | "yearsTogether"
  | "couplePhoto"
>;
type PersonalFields = Pick<
  AnniversaryOrderState,
  "loveNote" | "voiceNote" | "backgroundMusic" | "customBackgroundMusic"
>;
type ContactFields = Pick<AnniversaryOrderState, "phone" | "email">;

export interface AnniversaryOrderStore extends AnniversaryOrderState {
  currentStep: number;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  // Step 1
  updateCouple: (data: Partial<CoupleFields>) => void;

  // Step 2
  toggleQuestion: (id: string) => void;
  updateQuestion: (
    id: string,
    data: Partial<Omit<QuizQuestion, "id" | "isCustom">>,
  ) => void;
  addCustomQuestion: () => void;
  removeQuestion: (id: string) => void;

  // Step 3
  setFloralTheme: (theme: FloralTheme) => void;
  setColorMood: (mood: ColorMood) => void;
  setCustomBgPhoto: (asset: UploadedAsset | null) => void;
  setCustomBackgroundMusic: (asset: UploadedAsset | null) => void;

  // Step 4
  updatePersonalMessage: (data: Partial<PersonalFields>) => void;
  updateContact: (data: Partial<ContactFields>) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const initial: AnniversaryOrderState & { currentStep: number } = {
  currentStep: 1,
  yourName: "",
  partnerName: "",
  anniversaryDate: "",
  yearsTogether: 0,
  couplePhoto: null,
  questions: createDefaultQuestions(),
  floralTheme: "rose",
  colorMood: "romantic-pink",
  customBgPhoto: null,
  loveNote: "",
  voiceNote: null,
  backgroundMusic: null,
  customBackgroundMusic: null,
  phone: "",
  email: "",
};

export const useAnniversaryOrderStore = create<AnniversaryOrderStore>()(
  persist(
    (set) => ({
      ...initial,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      // Step 1
      updateCouple: (data) => set(data),

      // Step 2
      toggleQuestion: (id) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, enabled: !q.enabled } : q,
          ),
        })),
      updateQuestion: (id, data) =>
        set((s) => ({
          questions: s.questions.map((q) =>
            q.id === id ? { ...q, ...data } : q,
          ),
        })),
      addCustomQuestion: () =>
        set((s) => ({
          questions: [...s.questions, createCustomQuestion()],
        })),
      removeQuestion: (id) =>
        set((s) => ({
          questions: s.questions.filter((q) => q.id !== id),
        })),

      // Step 3
      setFloralTheme: (theme) => set({ floralTheme: theme }),
      setColorMood: (mood) => set({ colorMood: mood }),
      setCustomBgPhoto: (asset) => set({ customBgPhoto: asset }),
      setCustomBackgroundMusic: (asset) =>
        set({ customBackgroundMusic: asset }),

      // Step 4
      updatePersonalMessage: (data) => set(data),
      updateContact: (data) => set(data),

      // Navigation
      nextStep: () =>
        set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
      goToStep: (step) => set({ currentStep: step }),
      reset: () => set(initial),
    }),
    {
      name: "wedinviter-anniversary-order",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        hasHydrated: state.hasHydrated,
        currentStep: state.currentStep,
        yourName: state.yourName,
        partnerName: state.partnerName,
        anniversaryDate: state.anniversaryDate,
        yearsTogether: state.yearsTogether,
        couplePhoto: state.couplePhoto,
        questions: state.questions,
        floralTheme: state.floralTheme,
        colorMood: state.colorMood,
        customBgPhoto: state.customBgPhoto,
        loveNote: state.loveNote,
        voiceNote: state.voiceNote,
        backgroundMusic: state.backgroundMusic,
        customBackgroundMusic: state.customBackgroundMusic,
        phone: state.phone,
        email: state.email,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        state?.setHasHydrated(true);
      },
    },
  ),
);
