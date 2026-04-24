export const ANNIVERSARY_PRICE = 399;
export const ANNIVERSARY_PRICE_DISPLAY = "₹399";
export const ANNIVERSARY_ROUTE = "/wed-anniversary-wish";
export const ANNIVERSARY_ORDER_ROUTE = "/wed-anniversary-wish/order";

export const ANNIVERSARY_COLORS = {
  primary: "#c0185f", // magenta
  secondary: "#e8638c", // rose
  accent: "#c9a962", // gold
  light: "#f7e7ce", // champagne
  bg: "#fff5f5", // blush
} as const;

export const ANNIVERSARY_FEATURES = [
  {
    icon: "📱",
    title: "No Apps to Download",
    desc: "Works instantly in any mobile browser. Just share the link — no app store required.",
  },
  {
    icon: "🔄",
    title: "Reverse Challenge",
    desc: "Once they finish, they can challenge you back! See if you know them just as well.",
  },
  {
    icon: "📸",
    title: "Shareable Results",
    desc: "Gorgeous Love Level scorecards designed perfectly for Instagram or WhatsApp stories.",
  },
] as const;

export const QUIZ_PHASES = [
  {
    label: "Phase 1",
    title: "Entrance",
    sub: '"To My Love"',
    gradient: "from-[#c0185f] via-[#e8638c] to-[#c9a962]",
    description: "A romantic animated entrance screen",
  },
  {
    label: "Phase 2",
    title: "Quiz UI",
    sub: '"What is my biggest dream?"',
    gradient: "from-[#c9a962] via-[#f7e7ce] to-[#e8638c]",
    description: "Smooth, interactive quiz interface",
  },
  {
    label: "Phase 3",
    title: "Love Level",
    sub: "95% Match",
    gradient: "from-[#e8638c] via-[#c0185f] to-[#c9a962]",
    description: "Floral percentage results diagram",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Customize",
    description:
      "Enter your names, upload a beautiful photo, and pick our curated questions (or write your own!).",
  },
  {
    step: "02",
    title: "Preview & Publish",
    description:
      "See exactly how it looks. Pay a simple ₹399 one-time fee to unlock your unique quiz link.",
  },
  {
    step: "03",
    title: "Play & Share",
    description:
      "Send the link to your partner. Let them play the quiz and reveal their final Love Level score!",
  },
] as const;
