import type { TemplateConfig } from "@/types/template.types";

export const TEMPLATES: TemplateConfig[] = [
  // ══════════════════════════════════════════════════════════════════════
  // Template 1: Celestial Nights — Starfield + Gold
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "celestial-navy",
    name: "Celestial Nights",
    tagline: "Written in the stars",
    description:
      "Deep navy and gold celestial motifs evoke the magic of a starlit night, perfect for evening ceremonies.",
    colors: {
      primary: "#C9A962",
      secondary: "#E8E0F0",
      accent: "#FFF8E7",
      background: "#0A0E1A",
      text: "#FFF8E7",
      border: "#C9A962",
    },
    fonts: {
      heading: "cinzel",
      body: "montserrat",
      accent: "cinzel",
    },
    animations: {
      heroEntrance: "scale",
      particleType: "stars",
      scrollEffect: "parallax",
      fontAnimation: "shimmer",
      backgroundAnimation: "stars",
      has3DEffects: false,
    },
    particles: {
      component: "StarfieldParticles",
      density: "high",
      colors: ["#C9A962", "#FFF8E7", "#E8E0F0"],
      speed: 0.8,
    },
    music: {
      waveformColor: "#C9A962",
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
      type: "centered",
    },
    tags: ["celestial", "navy", "night", "luxury", "gold"],
    mood: "Mystical & Luxurious",
    heroComponent: "HeroSectionCelestial",
    sectionDividerStyle: "divider-celestial-navy",
    scrollReveal: "fade-up",
  },

  // ══════════════════════════════════════════════════════════════════════
  // Template 2: Vintage Rose — Dusty Rose + Botanical
  // ══════════════════════════════════════════════════════════════════════
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
      fontAnimation: "reveal",
      backgroundAnimation: "none",
      has3DEffects: false,
    },
    particles: {
      component: "none",
      density: "low",
      colors: ["#B5768A", "#C4957A", "#F5E8E0"],
      speed: 0.5,
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
      type: "centered",
    },
    tags: ["vintage", "rose", "romantic", "blush", "botanical"],
    mood: "Romantic & Nostalgic",
    heroComponent: "HeroSectionVintage",
    sectionDividerStyle: "divider-vintage-rose",
    scrollReveal: "fade-up",
  },

  // ══════════════════════════════════════════════════════════════════════
  // Template 3: Royal Heritage — Crimson + Gold Mughal
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "royal-gold",
    name: "Royal Heritage",
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
      particleType: "gold",
      scrollEffect: "parallax",
      fontAnimation: "gradient",
      backgroundAnimation: "gold",
      has3DEffects: false,
    },
    particles: {
      component: "GoldParticleEffect",
      density: "medium",
      colors: ["#C9A962", "#FFF8E7", "#F5E6C8"],
      speed: 0.6,
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
      type: "centered",
    },
    tags: ["traditional", "royal", "gold", "north-indian", "mughal"],
    mood: "Majestic & Grand",
    heroComponent: "HeroSectionRoyal",
    sectionDividerStyle: "divider-royal-gold",
    scrollReveal: "fade-up",
  },

  // ══════════════════════════════════════════════════════════════════════
  // Template 4: Golden Hour — Terracotta + Sunset
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "sunset-terracotta",
    name: "Golden Hour",
    tagline: "Warm earth, golden light",
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
      fontAnimation: "shimmer",
      backgroundAnimation: "none",
      has3DEffects: false,
    },
    particles: {
      component: "BokehParticles",
      density: "medium",
      colors: ["#F0D4B0", "#E8A87C", "#C05A3A", "#FDF5ED", "#FFE0B2"],
      speed: 0.7,
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
      type: "centered",
    },
    tags: ["boho", "terracotta", "warm", "sunset", "golden-hour"],
    mood: "Warm & Earthy",
    heroComponent: "HeroSectionSunset",
    sectionDividerStyle: "divider-sunset-terracotta",
    scrollReveal: "fade-up",
  },

  // ══════════════════════════════════════════════════════════════════════
  // Template 5: Wildflower Meadow — Boho Pink + Green
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "bohemian-wildflower",
    name: "Wildflower Meadow",
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
      particleType: "petals",
      scrollEffect: "reveal",
      fontAnimation: "reveal",
      backgroundAnimation: "petals",
      has3DEffects: false,
    },
    particles: {
      component: "FloatingPetals",
      density: "medium",
      colors: ["#C45C8A", "#7BAE7F", "#F9D56E", "#E8A87C", "#F5E0E9"],
      speed: 0.8,
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
      type: "centered",
    },
    tags: ["boho", "floral", "romantic", "garden", "wildflower"],
    mood: "Wild & Romantic",
    heroComponent: "HeroSectionBohemian",
    sectionDividerStyle: "divider-bohemian-wildflower",
    scrollReveal: "fade-up",
  },

  // ══════════════════════════════════════════════════════════════════════
  // Template 6: Noir Editorial — Black & White Minimalist
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "minimalist-mono",
    name: "Noir Editorial",
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
      fontAnimation: "typewriter",
      backgroundAnimation: "none",
      has3DEffects: false,
    },
    particles: {
      component: "none",
      density: "low",
      colors: ["#1A1A1A", "#666666"],
      speed: 0.3,
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
      type: "full-bleed",
    },
    tags: ["minimal", "modern", "black-white", "editorial", "typography"],
    mood: "Bold & Editorial",
    heroComponent: "HeroSectionMinimalist",
    sectionDividerStyle: "divider-minimalist-mono",
    scrollReveal: "fade-in",
  },

  // ══════════════════════════════════════════════════════════════════════
  // Template 7: Botanical Modern — Sage + Split Screen
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "modern-sage",
    name: "Botanical Modern",
    tagline: "Clean lines, natural calm",
    description:
      "A contemporary design with sage green tones and botanical typography for the modern couple who loves nature.",
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
      fontAnimation: "reveal",
      backgroundAnimation: "none",
      has3DEffects: false,
    },
    particles: {
      component: "none",
      density: "low",
      colors: ["#7C8C6E", "#D4C5A9", "#F5F5F0"],
      speed: 0.5,
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
      type: "split",
    },
    tags: ["modern", "minimal", "sage", "contemporary", "botanical"],
    mood: "Calm & Contemporary",
    heroComponent: "HeroSectionModernSage",
    sectionDividerStyle: "divider-modern-sage",
    scrollReveal: "slide-up",
  },

  // ══════════════════════════════════════════════════════════════════════
  // Template 8: Ivory Elegance — Classic South Indian
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "classic-ivory",
    name: "Ivory Elegance",
    tagline: "Pure elegance, timeless beauty",
    description:
      "Ivory and gold classic that channels the elegance of traditional South Indian wedding aesthetics with mandala motifs.",
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
      fontAnimation: "gradient",
      backgroundAnimation: "none",
      has3DEffects: false,
    },
    particles: {
      component: "none",
      density: "low",
      colors: ["#C9A962", "#8B4513", "#FBF7F0"],
      speed: 0.4,
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
      type: "centered",
    },
    tags: ["classic", "ivory", "south-indian", "elegant", "traditional"],
    mood: "Pure & Timeless",
    heroComponent: "HeroSectionClassicIvory",
    sectionDividerStyle: "divider-classic-ivory",
    scrollReveal: "fade-up",
  },
];

export function getTemplateBySlug(slug: string): TemplateConfig | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export const DEFAULT_TEMPLATE = TEMPLATES[0];
