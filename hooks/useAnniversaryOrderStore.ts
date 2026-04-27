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
import type {
  QuestionBankItem,
  QuizConfigItem,
  QuizBuilderState,
  WizardStep,
} from "@/types/anniversary-quiz.types";
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

const MAX_STEP: WizardStep = 7;

const initialQuizBuilder: QuizBuilderState = {
  currentQuestions: [],
  answers: [],
  questionsLoaded: false,
  isLoadingQuestions: false,
};

export interface AnniversaryOrderStore extends AnniversaryOrderState {
  // ── Wizard Navigation ──
  currentStep: WizardStep;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  // ── Quiz Builder State (Matrix Randomization) ──
  quizBuilder: QuizBuilderState;
  setCurrentQuestions: (questions: QuestionBankItem[]) => void;
  setQuizAnswer: (q_id: string, correct_idx: number) => void;
  removeQuizAnswer: (q_id: string) => void;
  clearQuizBuilder: () => void;
  setIsLoadingQuestions: (loading: boolean) => void;

  // Step 1
  updateCouple: (data: Partial<CoupleFields>) => void;

  // Step 2 (legacy - kept for compatibility)
  toggleQuestion: (id: string) => void;
  updateQuestion: (
    id: string,
    data: Partial<Omit<QuizQuestion, "id" | "isCustom">>,
  ) => void;
  addCustomQuestion: () => void;
  removeQuestion: (id: string) => void;

  // Step 3 (theme/music)
  setFloralTheme: (theme: FloralTheme) => void;
  setColorMood: (mood: ColorMood) => void;
  setCustomBgPhoto: (asset: UploadedAsset | null) => void;
  setCustomBackgroundMusic: (asset: UploadedAsset | null) => void;

  // Step 4 (personal message)
  updatePersonalMessage: (data: Partial<PersonalFields>) => void;
  updateContact: (data: Partial<ContactFields>) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: WizardStep) => void;
  reset: () => void;
}

const initial: AnniversaryOrderState & {
  currentStep: WizardStep;
  quizBuilder: QuizBuilderState;
} = {
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
  quizBuilder: initialQuizBuilder,
};

export const useAnniversaryOrderStore = create<AnniversaryOrderStore>()(
  persist(
    (set) => ({
      ...initial,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      // ── Quiz Builder Actions ──
      setCurrentQuestions: (questions) =>
        set((s) => ({
          quizBuilder: {
            ...s.quizBuilder,
            currentQuestions: questions,
            questionsLoaded: true,
            isLoadingQuestions: false,
          },
        })),
      setQuizAnswer: (q_id, correct_idx) =>
        set((s) => {
          const existing = s.quizBuilder.answers.findIndex(
            (a) => a.q_id === q_id,
          );
          let answers: QuizConfigItem[];
          if (existing >= 0) {
            answers = s.quizBuilder.answers.map((a) =>
              a.q_id === q_id ? { q_id, correct_idx } : a,
            );
          } else {
            answers = [...s.quizBuilder.answers, { q_id, correct_idx }];
          }
          return { quizBuilder: { ...s.quizBuilder, answers } };
        }),
      removeQuizAnswer: (q_id) =>
        set((s) => ({
          quizBuilder: {
            ...s.quizBuilder,
            answers: s.quizBuilder.answers.filter((a) => a.q_id !== q_id),
          },
        })),
      clearQuizBuilder: () => set({ quizBuilder: initialQuizBuilder }),
      setIsLoadingQuestions: (loading) =>
        set((s) => ({
          quizBuilder: { ...s.quizBuilder, isLoadingQuestions: loading },
        })),

      // Step 1
      updateCouple: (data) => set(data),

      // Step 2 (legacy)
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

      // Step 4 (now Slide 6 in wizard)
      updatePersonalMessage: (data) => set(data),
      updateContact: (data) => set(data),

      // Navigation
      nextStep: () =>
        set((s) => ({
          currentStep: Math.min(
            (s.currentStep as number) + 1,
            MAX_STEP,
          ) as WizardStep,
        })),
      prevStep: () =>
        set((s) => ({
          currentStep: Math.max((s.currentStep as number) - 1, 1) as WizardStep,
        })),
      goToStep: (step) => set({ currentStep: step }),
      reset: () => set({ ...initial, quizBuilder: initialQuizBuilder }),
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
        quizBuilder: {
          currentQuestions: state.quizBuilder.currentQuestions,
          answers: state.quizBuilder.answers,
          questionsLoaded: state.quizBuilder.questionsLoaded,
          isLoadingQuestions: state.quizBuilder.isLoadingQuestions,
        },
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        state?.setHasHydrated(true);
      },
    },
  ),
);
