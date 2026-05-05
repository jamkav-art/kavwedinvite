// ── Question Bank Types ──

export type QuestionCategory =
  | "nostalgia"
  | "playful"
  | "soul"
  | "discovery"
  | "future";

export const QUESTION_CATEGORIES: {
  value: QuestionCategory;
  label: string;
  emoji: string;
}[] = [
  { value: "nostalgia", label: "Nostalgia & The Spark", emoji: "❤️" },
  { value: "playful", label: "The LOL Challenge", emoji: "😂" },
  { value: "soul", label: "Soul Layers", emoji: "🔥" },
  { value: "discovery", label: "Did You Know?", emoji: "🤔" },
  { value: "future", label: "Hopes & Challenges", emoji: "🚀" },
];

export const CATEGORY_EMOJI: Record<QuestionCategory, string> = {
  nostalgia: "❤️",
  playful: "😂",
  soul: "🔥",
  discovery: "🤔",
  future: "🚀",
};

export const CATEGORY_LABEL: Record<QuestionCategory, string> = {
  nostalgia: "Nostalgia & The Spark",
  playful: "The LOL Challenge",
  soul: "Soul Layers",
  discovery: "Did You Know?",
  future: "Hopes & Challenges",
};

export interface QuestionBankItem {
  id: string;
  category: QuestionCategory;
  question_text: string;
  options: [string, string, string]; // Exactly 3 strings: [sincere, funny, absurd]
}

// ── Quiz Config (what creator chooses) ──

export interface QuizConfigItem {
  /** Question ID from question_bank */
  q_id: string;
  /** Index of the correct answer (0, 1, or 2) */
  correct_idx: number;
}

// ── Quiz Session (DB record) ──

export interface QuizSession {
  id: string;
  invite_id: string;
  couple_name_1: string;
  couple_name_2: string;
  config: QuizConfigItem[];
  couple_photo_url: string | null;
  love_note: string | null;
  floral_theme: string;
  color_mood: string;
  background_music: string | null;
  payment_id: string | null;
  paid: boolean;
  challenger_quiz_id: string | null;
  combined_score: number | null;
  created_at: string;
  expires_at: string | null;
}

// ── Quiz Taker Session (when someone takes the quiz) ──

export interface QuizAnswer {
  /** Index into the quiz config array (0-9) */
  question_index: number;
  /** Selected option index (0, 1, or 2) */
  selected_idx: number;
}

export interface QuizTakerSession {
  id: string;
  quiz_id: string;
  taker_name: string;
  answers: QuizAnswer[];
  scores: Record<QuestionCategory, number>;
  soul_percentage: number;
  soul_tier: ScoreTier;
  is_challenge: boolean;
  challenge_completed: boolean;
  created_at: string;
}

// ── Score Tiers ──

export type ScoreTier =
  | "beautiful-strangers"
  | "twin-flames"
  | "architects"
  | "unified-soul";

export interface ScoreTierInfo {
  id: ScoreTier;
  range: [number, number]; // [min, max] inclusive
  title: string;
  emoji: string;
  description: string;
}

export const SCORE_TIERS: ScoreTierInfo[] = [
  {
    id: "beautiful-strangers",
    range: [80, 85],
    title: "The Beautiful Strangers",
    emoji: "🌟",
    description: "A beautiful mystery waiting to unfold",
  },
  {
    id: "twin-flames",
    range: [86, 90],
    title: "The Twin Flames",
    emoji: "🔥",
    description: "Two souls, one flame — growing brighter",
  },
  {
    id: "architects",
    range: [91, 99],
    title: "The Architects",
    emoji: "🏛️",
    description: "Built on understanding, brick by brick",
  },
  {
    id: "unified-soul",
    range: [100, 100],
    title: "The Unified Soul",
    emoji: "💫",
    description: "Rare. Resonant. One in a million.",
  },
];

// ── Order Store Extension ──

export interface QuizBuilderState {
  /** Questions fetched from the question bank (randomized set) */
  currentQuestions: QuestionBankItem[];
  /** User's selected correct answers */
  answers: QuizConfigItem[];
  /** Whether the questions have been loaded */
  questionsLoaded: boolean;
  /** Loading state */
  isLoadingQuestions: boolean;
}

// ── Wizard Steps ──

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WIZARD_STEPS = [
  { step: 1, label: "Your Name", emoji: "💫" },
  { step: 2, label: "Partner", emoji: "💕" },
  { step: 3, label: "Date", emoji: "📅" },
  { step: 4, label: "Photo", emoji: "📸" },
  { step: 5, label: "Quiz", emoji: "🎯" },
  { step: 6, label: "Message", emoji: "💌" },
  { step: 7, label: "Pay", emoji: "✨" },
] as const;
