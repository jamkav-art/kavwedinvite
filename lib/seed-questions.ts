// ── Soul-Sync Quiz Engine: 50 Pre-Defined Questions ──
// 5 Patterns × 10 Questions Each
// Each question has 3 ultra-short options: [sincere, funny, absurd]
// Organized by category for Matrix Randomization Engine

import type {
  QuestionCategory,
  QuestionBankItem,
} from "@/types/anniversary-quiz.types";

export interface SeedQuestion {
  category: QuestionCategory;
  question_text: string;
  options: [string, string, string];
}

// ── Pattern 1: Nostalgia & The Spark ❤️ ──
const NOSTALGIA_QUESTIONS: SeedQuestion[] = [
  {
    category: "nostalgia",
    question_text: "What was the very first thing I noticed about you?",
    options: ["Your smile", "Your shoes", "Your snack choice"],
  },
  {
    category: "nostalgia",
    question_text: "Where did our first date happen?",
    options: ["That cozy café", "The grocery store", "Your dreams"],
  },
  {
    category: "nostalgia",
    question_text: "What song was playing when we first kissed?",
    options: ["A slow love song", "Elevator music", "My nervous heartbeat"],
  },
  {
    category: "nostalgia",
    question_text: "What did I wear on our first meeting?",
    options: [
      "That blue outfit",
      "Something borrowed",
      "A full tuxedo obviously",
    ],
  },
  {
    category: "nostalgia",
    question_text: "Who said 'I love you' first?",
    options: ["You did", "The cat did", "Neither, it was typed"],
  },
  {
    category: "nostalgia",
    question_text: "What's the first gift I ever gave you?",
    options: ["Something handmade", "A high-five", "Emotional damage"],
  },
  {
    category: "nostalgia",
    question_text: "Where was our first trip together?",
    options: ["A weekend getaway", "The balcony", "Imagination land"],
  },
  {
    category: "nostalgia",
    question_text: "What did we cook together the first time?",
    options: ["Burnt pasta", "Instant noodles", "A five-star disaster"],
  },
  {
    category: "nostalgia",
    question_text: "What movie did we watch on our first movie night?",
    options: ["A rom-com classic", "Whatever was on TV", "I was watching you"],
  },
  {
    category: "nostalgia",
    question_text: "What inside joke started it all?",
    options: ["That weird accent", "A typo text", "Your dance moves"],
  },
];

// ── Pattern 2: The LOL Challenge 😂 ──
const PLAYFUL_QUESTIONS: SeedQuestion[] = [
  {
    category: "playful",
    question_text: "We're in a horror movie. Who dies first?",
    options: ["You for sure", "Me, I'm too nice", "The dog lives"],
  },
  {
    category: "playful",
    question_text: "Who is the better dancer?",
    options: ["Definitely me", "Nobody wins here", "The washing machine"],
  },
  {
    category: "playful",
    question_text: "What's my most annoying habit?",
    options: [
      "Stealing the blanket",
      "Leaving lights on",
      "Breathing too loud",
    ],
  },
  {
    category: "playful",
    question_text: "If our relationship was a movie genre?",
    options: ["Rom-com", "Chaos documentary", "Silent film"],
  },
  {
    category: "playful",
    question_text: "Who is more likely to cry at a commercial?",
    options: ["You, softie", "Me, obviously", "Both, full ugly cry"],
  },
  {
    category: "playful",
    question_text: "What's the weirdest thing I eat?",
    options: ["Pizza with pineapple", "Dry cereal", "Your last slice"],
  },
  {
    category: "playful",
    question_text: "Who takes longer to get ready?",
    options: ["Me, worth the wait", "You, forever", "We're both disasters"],
  },
  {
    category: "playful",
    question_text: "If we were a reality show, what would it be called?",
    options: ["Love & Laughter", "Chaos Central", "Who Snored Last Night"],
  },
  {
    category: "playful",
    question_text: "Who is more competitive during board games?",
    options: [
      "I am the champion",
      "You cheat nicely",
      "We both lose gracefully",
    ],
  },
  {
    category: "playful",
    question_text: "What's my go-to karaoke song?",
    options: ["A power ballad", "The national anthem", "Silence"],
  },
];

// ── Pattern 3: Soul Layers 🔥 ──
const SOUL_QUESTIONS: SeedQuestion[] = [
  {
    category: "soul",
    question_text: "What do I do that makes you feel safest?",
    options: ["Your warm hug", "Making me tea", "Existing in the same room"],
  },
  {
    category: "soul",
    question_text: "What's my biggest dream I haven't achieved yet?",
    options: ["Travel the world", "Own a pet sloth", "World domination"],
  },
  {
    category: "soul",
    question_text: "What is my primary love language?",
    options: ["Quality time", "Free food", "Sarcastic compliments"],
  },
  {
    category: "soul",
    question_text: "What am I most afraid of losing?",
    options: ["My family", "My phone battery", "The TV remote"],
  },
  {
    category: "soul",
    question_text: "What's one thing I wish you understood without me saying?",
    options: ["When I need space", "That I'm always right", "My food order"],
  },
  {
    category: "soul",
    question_text: "What does our future look like in 10 years?",
    options: [
      "A cozy home with kids",
      "Living in a van",
      "Same chaos, older faces",
    ],
  },
  {
    category: "soul",
    question_text: "What's the deepest secret I've shared with you?",
    options: [
      "My childhood fear",
      "I fake-laughed at your jokes",
      "My hidden snack stash",
    ],
  },
  {
    category: "soul",
    question_text: "What makes me feel most understood?",
    options: [
      "When you just listen",
      "When you agree with me",
      "When you bring snacks",
    ],
  },
  {
    category: "soul",
    question_text: "What's my biggest insecurity?",
    options: [
      "Not being enough",
      "My terrible dance moves",
      "Losing at Mario Kart",
    ],
  },
  {
    category: "soul",
    question_text: "What moment brought us closest together?",
    options: ["That tough conversation", "The WiFi went out", "Shared dessert"],
  },
];

// ── Pattern 4: Did You Know? 🤔 ──
const DISCOVERY_QUESTIONS: SeedQuestion[] = [
  {
    category: "discovery",
    question_text: "What was the name of my first ever pet?",
    options: ["A cute dog name", "A creative cat name", "I had a pet rock"],
  },
  {
    category: "discovery",
    question_text: "What's my go-to comfort food?",
    options: ["Warm home-cooked meal", "Midnight ice cream", "Whatever's free"],
  },
  {
    category: "discovery",
    question_text: "What's my secret hidden talent?",
    options: [
      "I can sing decently",
      "I can sleep anywhere",
      "Parallel parking",
    ],
  },
  {
    category: "discovery",
    question_text: "What's my guilty pleasure TV show?",
    options: ["Cheesy reality TV", "Kids cartoons", "Infomercials at 3 AM"],
  },
  {
    category: "discovery",
    question_text: "If I could have any superpower?",
    options: [
      "Teleportation",
      "The power to nap forever",
      "Flying while eating",
    ],
  },
  {
    category: "discovery",
    question_text: "What's my favorite way to spend a Sunday?",
    options: [
      "Sleeping in late",
      "Doing absolutely nothing",
      "Planning next week",
    ],
  },
  {
    category: "discovery",
    question_text: "Which season makes me happiest?",
    options: ["Spring with blooms", "Monsoon with cozy rains", "AC season"],
  },
  {
    category: "discovery",
    question_text: "What's my biggest pet peeve?",
    options: ["People chewing loudly", "Slow walkers", "Unsolicited advice"],
  },
  {
    category: "discovery",
    question_text: "What was my childhood dream job?",
    options: [
      "Astronaut or doctor",
      "Professional video gamer",
      "Full-time dreamer",
    ],
  },
  {
    category: "discovery",
    question_text: "What's the one food I absolutely refuse to eat?",
    options: [
      "Cilantro or liver",
      "Anything green",
      "Leftovers from last week",
    ],
  },
];

// ── Pattern 5: Hopes & Challenges 🚀 ──
const FUTURE_QUESTIONS: SeedQuestion[] = [
  {
    category: "future",
    question_text: "What will we be arguing about when we are 80?",
    options: [
      "TV remote control",
      "Who forgot the dentures",
      "Who loves whom more",
    ],
  },
  {
    category: "future",
    question_text: "Where do I want us to retire?",
    options: ["A beachside cottage", "A fancy retirement home", "Mars colony"],
  },
  {
    category: "future",
    question_text: "What's the number one thing on my bucket list?",
    options: [
      "Skydiving or safari",
      "Eating at every restaurant",
      "Napping for a week",
    ],
  },
  {
    category: "future",
    question_text: "What hobby do I want us to take up together?",
    options: [
      "Cooking classes",
      "Competitive napping",
      "Learning TikTok dances",
    ],
  },
  {
    category: "future",
    question_text: "How many kids do I want?",
    options: ["Two little ones", "Furry four-legged kids", "A small army"],
  },
  {
    category: "future",
    question_text: "What's my biggest hope for our relationship?",
    options: [
      "Growing old together",
      "Never running out of snacks",
      "Always laughing",
    ],
  },
  {
    category: "future",
    question_text: "What skill do I most want to learn?",
    options: [
      "A new language",
      "The art of patience",
      "How to fold fitted sheets",
    ],
  },
  {
    category: "future",
    question_text: "What travel destination is at the top of my list?",
    options: [
      "Santorini or Bali",
      "The moon probably",
      "Anywhere with good Wi-Fi",
    ],
  },
  {
    category: "future",
    question_text: "What kind of home do I dream of?",
    options: [
      "A cozy bungalow",
      "A tiny house on wheels",
      "A castle with moat",
    ],
  },
  {
    category: "future",
    question_text: "What's one promise I want us to keep forever?",
    options: [
      "Always be honest",
      "Always share dessert",
      "Never sing in public",
    ],
  },
];

// ── Master Question Bank ──
export const SEED_QUESTIONS: SeedQuestion[] = [
  ...NOSTALGIA_QUESTIONS,
  ...PLAYFUL_QUESTIONS,
  ...SOUL_QUESTIONS,
  ...DISCOVERY_QUESTIONS,
  ...FUTURE_QUESTIONS,
];

// ── Utility: Convert seed questions to QuestionBankItem format ──
export function seedToBankItem(
  seed: SeedQuestion,
  index: number,
): QuestionBankItem {
  return {
    id: `seed-${index + 1}`,
    category: seed.category,
    question_text: seed.question_text,
    options: seed.options,
  };
}

// ── Utility: Get questions by category ──
export function getQuestionsByCategory(
  category: QuestionCategory,
): SeedQuestion[] {
  return SEED_QUESTIONS.filter((q) => q.category === category);
}

// ── Utility: Get category count ──
export function getCategoryCounts(): Record<QuestionCategory, number> {
  const counts: Record<string, number> = {};
  for (const q of SEED_QUESTIONS) {
    counts[q.category] = (counts[q.category] || 0) + 1;
  }
  return counts as Record<QuestionCategory, number>;
}
