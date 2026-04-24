import type { QuizQuestion } from "@/types/anniversary-order.types";

const PRESET_QUESTIONS: Omit<QuizQuestion, "id" | "enabled" | "isCustom">[] = [
  {
    text: "What is my favorite way to spend a Sunday morning?",
    options: ["Sleeping in late", "Going for a long drive", "Cooking together"],
    correctAnswer: 0,
  },
  {
    text: "Where did we have our first date?",
    options: [
      "The coffee shop on Hill Road",
      "That rooftop restaurant",
      "The bookstore café",
    ],
    correctAnswer: 1,
  },
  {
    text: "What's my go-to comfort food?",
    options: ["Pizza", "Mom's homemade biryani", "Dark chocolate"],
    correctAnswer: 1,
  },
  {
    text: "Which is my dream vacation destination?",
    options: ["Santorini, Greece", "Kashmir, India", "Bali, Indonesia"],
    correctAnswer: 2,
  },
  {
    text: "What is my primary love language?",
    options: ["Words of affirmation", "Quality time", "Acts of service"],
    correctAnswer: 1,
  },
  {
    text: "What's my all-time favorite movie?",
    options: ["A romantic comedy", "An epic drama", "A thriller mystery"],
    correctAnswer: 0,
  },
  {
    text: "What is my biggest pet peeve?",
    options: ["Loud chewing", "Being interrupted", "Late arrivals"],
    correctAnswer: 2,
  },
  {
    text: "What's the one thing I'm most afraid of?",
    options: ["Heights", "Losing loved ones", "Failure"],
    correctAnswer: 1,
  },
  {
    text: "What is my fondest childhood memory?",
    options: [
      "Family vacations",
      "Grandma's stories at bedtime",
      "Playing in the rain",
    ],
    correctAnswer: 2,
  },
  {
    text: "How would I ideally want to celebrate our anniversary?",
    options: [
      "A fancy dinner date",
      "A quiet weekend getaway",
      "A surprise party with friends",
    ],
    correctAnswer: 1,
  },
  {
    text: "What is a secret talent I have?",
    options: ["Singing", "Dancing", "Imitating accents"],
    correctAnswer: 0,
  },
  {
    text: "Which season makes me the happiest?",
    options: [
      "Spring — flowers bloom",
      "Monsoon — cozy rains",
      "Winter — chilly nights",
    ],
    correctAnswer: 1,
  },
  {
    text: "What is my favorite flower?",
    options: ["Rose", "Jasmine", "Lily"],
    correctAnswer: 0,
  },
  {
    text: "What is my happiest memory with you?",
    options: [
      "The day we first met",
      "Our first trip together",
      "The day you proposed",
    ],
    correctAnswer: 2,
  },
  {
    text: "What's my guilty pleasure?",
    options: [
      "Binge-watching reality TV",
      "Midnight ice cream runs",
      "Online shopping at 2 AM",
    ],
    correctAnswer: 1,
  },
];

export function createDefaultQuestions(): QuizQuestion[] {
  return PRESET_QUESTIONS.map((q, i) => ({
    ...q,
    id: `preset-${i}`,
    enabled: true,
    isCustom: false,
  }));
}

export function createCustomQuestion(): QuizQuestion {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: "",
    options: ["", "", ""],
    correctAnswer: 0,
    enabled: true,
    isCustom: true,
  };
}
