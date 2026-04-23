import type { TemplateConfig } from "@/types/template.types";

export const TEMPLATES: TemplateConfig[] = [
  {
    slug: "royal-gold",
    name: "Royal Gold",
    tagline: "Timeless tradition, golden grace",
    description:
      "A regal template with deep crimson and gold accents, evoking the grandeur of royal North Indian weddings.",
    colors: {
      primary: "#8B1A1A",
      secondary: "#C9A962",
      accent: "#F5E6C8",
      background: "#FBF7F0",
      text: "#1A0A00",
      border: "#C9A962",
    },
    fonts: {
      heading: "cormorant",
      body: "lato",
      accent: "cinzel",
    },
    animations: {
      heroEntrance: "scale",
      particleType: "sparkles",
      scrollEffect: "parallax",
    },
    music: {
      waveformColor: "#C9A962",
    },
    borders: {
      style: "ornamental",
      svgPath: "/templates/royal-gold-border.svg",
      patternOpacity: 0.06,
    },
    decorations: {
      borderSvg: "/templates/royal-gold-border.svg",
      patternOpacity: 0.06,
      hasFloralAccent: true,
      hasGoldLeaf: true,
      heroBorder: "border-royal-gold",
      sectionDivider: "divider-royal-gold",
    },
    features: {
      hasVideoHero: false,
      hasParallax: true,
      hasFullBleed: false,
      hasSidebarLayout: false,
    },
    layout: {
      heroFullBleed: false,
      sidebarEvents: false,
      galleryGrid: true,
      floatingRsvp: false,
    },
    tags: ["traditional", "royal", "gold", "north-indian"],
    mood: "Majestic & Grand",
  },
  {
    slug: "modern-sage",
    name: "Modern Sage",
    tagline: "Clean lines, natural calm",
    description:
      "A contemporary design with sage green tones and geometric typography for the modern couple.",
    colors: {
      primary: "#7C8C6E",
      secondary: "#4A5240",
      accent: "#D4C5A9",
      background: "#F5F5F0",
      text: "#2D2D2D",
      border: "#9CA986",
    },
    fonts: {
      heading: "josefin-sans",
      body: "lato",
      accent: "josefin-sans",
    },
    animations: {
      heroEntrance: "slide",
      particleType: "leaves",
      scrollEffect: "reveal",
    },
    music: {
      waveformColor: "#7C8C6E",
    },
    borders: {
      style: "thin",
      svgPath: "/templates/modern-sage-border.svg",
      patternOpacity: 0.03,
    },
    decorations: {
      borderSvg: "/templates/modern-sage-border.svg",
      patternOpacity: 0.03,
      hasFloralAccent: false,
      hasGoldLeaf: false,
      heroBorder: "border-modern-sage",
      sectionDivider: "divider-modern-sage",
    },
    features: {
      hasVideoHero: false,
      hasParallax: false,
      hasFullBleed: false,
      hasSidebarLayout: true,
    },
    layout: {
      heroFullBleed: false,
      sidebarEvents: true,
      galleryGrid: false,
      floatingRsvp: true,
    },
    tags: ["modern", "minimal", "sage", "contemporary"],
    mood: "Calm & Contemporary",
  },
  {
    slug: "sunset-terracotta",
    name: "Sunset Terracotta",
    tagline: "Warm earth, golden hour",
    description:
      "Warm terracotta and peach tones inspired by a golden-hour sunset — perfect for boho-chic celebrations.",
    colors: {
      primary: "#C05A3A",
      secondary: "#E8A87C",
      accent: "#F0D4B0",
      background: "#FDF5ED",
      text: "#2C1810",
      border: "#D4756C",
    },
    fonts: {
      heading: "playfair",
      body: "lato",
      accent: "playfair",
    },
    animations: {
      heroEntrance: "fade",
      particleType: "bokeh",
      scrollEffect: "parallax",
    },
    music: {
      waveformColor: "#C05A3A",
    },
    borders: {
      style: "ornamental",
      svgPath: "/templates/sunset-terracotta-border.svg",
      patternOpacity: 0.05,
    },
    decorations: {
      borderSvg: "/templates/sunset-terracotta-border.svg",
      patternOpacity: 0.05,
      hasFloralAccent: true,
      hasGoldLeaf: false,
      heroBorder: "border-sunset-terracotta",
      sectionDivider: "divider-sunset-terracotta",
    },
    features: {
      hasVideoHero: false,
      hasParallax: true,
      hasFullBleed: false,
      hasSidebarLayout: false,
    },
    layout: {
      heroFullBleed: false,
      sidebarEvents: false,
      galleryGrid: true,
      floatingRsvp: false,
    },
    tags: ["boho", "terracotta", "warm", "trendy"],
    mood: "Warm & Earthy",
  },
  {
    slug: "classic-ivory",
    name: "Classic Ivory",
    tagline: "Pure elegance, timeless beauty",
    description:
      "Ivory and gold classic that channels the elegance of traditional South Indian wedding aesthetics.",
    colors: {
      primary: "#8B4513",
      secondary: "#C9A962",
      accent: "#FBF7F0",
      background: "#FFFEF9",
      text: "#1A0A00",
      border: "#C9A962",
    },
    fonts: {
      heading: "cormorant",
      body: "lora",
      accent: "cinzel",
    },
    animations: {
      heroEntrance: "scale",
      particleType: "sparkles",
      scrollEffect: "parallax",
    },
    music: {
      waveformColor: "#C9A962",
    },
    borders: {
      style: "double",
      svgPath: "/templates/classic-ivory-border.svg",
      patternOpacity: 0.04,
    },
    decorations: {
      borderSvg: "/templates/classic-ivory-border.svg",
      patternOpacity: 0.04,
      hasFloralAccent: true,
      hasGoldLeaf: true,
      heroBorder: "border-classic-ivory",
      sectionDivider: "divider-classic-ivory",
    },
    features: {
      hasVideoHero: false,
      hasParallax: false,
      hasFullBleed: false,
      hasSidebarLayout: false,
    },
    layout: {
      heroFullBleed: false,
      sidebarEvents: false,
      galleryGrid: true,
      floatingRsvp: false,
    },
    tags: ["classic", "ivory", "south-indian", "elegant"],
    mood: "Pure & Timeless",
  },
  {
    slug: "bohemian-wildflower",
    name: "Bohemian Wildflower",
    tagline: "Free spirit, wild beauty",
    description:
      "A vibrant bohemian design with wildflower motifs, blending rose pink and meadow green for a romantic garden feel.",
    colors: {
      primary: "#C45C8A",
      secondary: "#7BAE7F",
      accent: "#F9D56E",
      background: "#FDF9F0",
      text: "#2D1B1B",
      border: "#C45C8A",
    },
    fonts: {
      heading: "playfair",
      body: "lato",
      accent: "lora",
    },
    animations: {
      heroEntrance: "slide",
      particleType: "leaves",
      scrollEffect: "reveal",
    },
    music: {
      waveformColor: "#C45C8A",
    },
    borders: {
      style: "ornamental",
      svgPath: "/templates/bohemian-wildflower-border.svg",
      patternOpacity: 0.07,
    },
    decorations: {
      borderSvg: "/templates/bohemian-wildflower-border.svg",
      patternOpacity: 0.07,
      hasFloralAccent: true,
      hasGoldLeaf: false,
      heroBorder: "border-bohemian-wildflower",
      sectionDivider: "divider-bohemian-wildflower",
    },
    features: {
      hasVideoHero: false,
      hasParallax: true,
      hasFullBleed: false,
      hasSidebarLayout: false,
    },
    layout: {
      heroFullBleed: false,
      sidebarEvents: false,
      galleryGrid: true,
      floatingRsvp: false,
    },
    tags: ["boho", "floral", "romantic", "garden"],
    mood: "Wild & Romantic",
  },
  {
    slug: "minimalist-mono",
    name: "Minimalist Mono",
    tagline: "Less is more. Always.",
    description:
      "Stark editorial minimalism in black and white. Typography-first design for the architecturally minded couple.",
    colors: {
      primary: "#1A1A1A",
      secondary: "#666666",
      accent: "#F0F0F0",
      background: "#FFFFFF",
      text: "#1A1A1A",
      border: "#E0E0E0",
    },
    fonts: {
      heading: "inter",
      body: "inter",
      accent: "inter",
    },
    animations: {
      heroEntrance: "fade",
      particleType: "bokeh",
      scrollEffect: "reveal",
    },
    music: {
      waveformColor: "#1A1A1A",
    },
    borders: {
      style: "thin",
      svgPath: "/templates/minimalist-mono-border.svg",
      patternOpacity: 0.02,
    },
    decorations: {
      borderSvg: "/templates/minimalist-mono-border.svg",
      patternOpacity: 0.02,
      hasFloralAccent: false,
      hasGoldLeaf: false,
      heroBorder: "border-minimalist-mono",
      sectionDivider: "divider-minimalist-mono",
    },
    features: {
      hasVideoHero: false,
      hasParallax: false,
      hasFullBleed: true,
      hasSidebarLayout: false,
    },
    layout: {
      heroFullBleed: true,
      sidebarEvents: false,
      galleryGrid: false,
      floatingRsvp: true,
    },
    tags: ["minimal", "modern", "black-white", "editorial"],
    mood: "Bold & Editorial",
  },
  {
    slug: "vintage-rose",
    name: "Vintage Rose",
    tagline: "Dusty petals, timeless love",
    description:
      "Soft dusty rose and blush tones with vintage typography create an intimate, romantic atmosphere.",
    colors: {
      primary: "#B5768A",
      secondary: "#C4957A",
      accent: "#F5E8E0",
      background: "#FDF8F6",
      text: "#2D1A1A",
      border: "#DEB8C2",
    },
    fonts: {
      heading: "playfair",
      body: "lora",
      accent: "cormorant",
    },
    animations: {
      heroEntrance: "fade",
      particleType: "sparkles",
      scrollEffect: "parallax",
    },
    music: {
      waveformColor: "#B5768A",
    },
    borders: {
      style: "ornamental",
      svgPath: "/templates/vintage-rose-border.svg",
      patternOpacity: 0.05,
    },
    decorations: {
      borderSvg: "/templates/vintage-rose-border.svg",
      patternOpacity: 0.05,
      hasFloralAccent: true,
      hasGoldLeaf: false,
      heroBorder: "border-vintage-rose",
      sectionDivider: "divider-vintage-rose",
    },
    features: {
      hasVideoHero: false,
      hasParallax: true,
      hasFullBleed: false,
      hasSidebarLayout: false,
    },
    layout: {
      heroFullBleed: false,
      sidebarEvents: false,
      galleryGrid: true,
      floatingRsvp: false,
    },
    tags: ["vintage", "rose", "romantic", "blush"],
    mood: "Romantic & Nostalgic",
  },
  {
    slug: "celestial-navy",
    name: "Celestial Navy",
    tagline: "Written in the stars",
    description:
      "Deep navy and gold celestial motifs evoke the magic of a starlit night, perfect for evening ceremonies.",
    colors: {
      primary: "#1B2C4E",
      secondary: "#C9A962",
      accent: "#E8E0F0",
      background: "#F5F7FC",
      text: "#0A0E1A",
      border: "#1B2C4E",
    },
    fonts: {
      heading: "libre-baskerville",
      body: "montserrat",
      accent: "cinzel",
    },
    animations: {
      heroEntrance: "scale",
      particleType: "stars",
      scrollEffect: "parallax",
    },
    music: {
      waveformColor: "#1B2C4E",
    },
    borders: {
      style: "ornamental",
      svgPath: "/templates/celestial-navy-border.svg",
      patternOpacity: 0.06,
    },
    decorations: {
      borderSvg: "/templates/celestial-navy-border.svg",
      patternOpacity: 0.06,
      hasFloralAccent: false,
      hasGoldLeaf: true,
      heroBorder: "border-celestial-navy",
      sectionDivider: "divider-celestial-navy",
    },
    features: {
      hasVideoHero: false,
      hasParallax: true,
      hasFullBleed: false,
      hasSidebarLayout: false,
    },
    layout: {
      heroFullBleed: false,
      sidebarEvents: false,
      galleryGrid: true,
      floatingRsvp: false,
    },
    tags: ["celestial", "navy", "night", "luxury"],
    mood: "Mystical & Luxurious",
  },
];

export function getTemplateBySlug(slug: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export const DEFAULT_TEMPLATE = TEMPLATES[0];
