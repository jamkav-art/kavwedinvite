import type { FloralTheme, ColorMood } from "@/types/anniversary-order.types";

export interface FloralThemeDef {
  label: string;
  description: string;
  gradient: string;
  emoji: string;
}

export interface ColorMoodDef {
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
}

export const FLORAL_THEMES: Record<FloralTheme, FloralThemeDef> = {
  rose: {
    label: "Rose",
    description: "Classic romantic crimson blooms",
    gradient: "from-rose-400 via-pink-500 to-red-600",
    emoji: "🌹",
  },
  jasmine: {
    label: "Jasmine",
    description: "Delicate white & subtle fragrance",
    gradient: "from-stone-100 via-amber-50 to-white",
    emoji: "🌼",
  },
  marigold: {
    label: "Marigold",
    description: "Vibrant golden-orange festive glow",
    gradient: "from-orange-300 via-yellow-400 to-amber-500",
    emoji: "🌻",
  },
  mogra: {
    label: "Mogra",
    description: "Tiny white blossoms, timeless elegance",
    gradient: "from-emerald-50 via-teal-100 to-white",
    emoji: "💮",
  },
};

export const COLOR_MOODS: Record<ColorMood, ColorMoodDef> = {
  "romantic-pink": {
    label: "Romantic Pink",
    primary: "#e8638c",
    secondary: "#fff5f5",
    accent: "#c0185f",
    description: "Soft blush tones with a passionate heart",
  },
  "royal-gold": {
    label: "Royal Gold",
    primary: "#c9a962",
    secondary: "#fef3e2",
    accent: "#a8720a",
    description: "Warm golden hues fit for royalty",
  },
  "garden-green": {
    label: "Garden Green",
    primary: "#9ca986",
    secondary: "#f0f5eb",
    accent: "#5d7350",
    description: "Fresh botanical vibes straight from nature",
  },
};

export const FLORAL_THEME_ORDER: FloralTheme[] = [
  "rose",
  "jasmine",
  "marigold",
  "mogra",
];
export const COLOR_MOOD_ORDER: ColorMood[] = [
  "romantic-pink",
  "royal-gold",
  "garden-green",
];
