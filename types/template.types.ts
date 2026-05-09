export type FontFamily =
  | "cormorant"
  | "playfair"
  | "lora"
  | "merriweather"
  | "josefin-sans"
  | "cinzel"
  | "inter"
  | "montserrat"
  | "libre-baskerville"
  | "lato";

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

export interface TemplateDecorations {
  borderSvg: string;
  patternOpacity: number;
  hasFloralAccent: boolean;
  hasGoldLeaf: boolean;
  heroBorder?: string;
  sectionDivider?: string;
}

export interface TemplateFeatures {
  hasVideoHero: boolean;
  hasParallax: boolean;
  hasFullBleed: boolean;
  hasSidebarLayout: boolean;
}

export interface TemplateLayout {
  heroFullBleed: boolean;
  sidebarEvents: boolean;
  galleryGrid: boolean;
  floatingRsvp: boolean;
}

// ─── New types for template mega-plan ────────────────────────────────────

export type LayoutType = "centered" | "split" | "full-bleed" | "sidebar";
export type BackgroundAnimationType =
  | "stars"
  | "petals"
  | "bokeh"
  | "gold"
  | "none";
export type FontAnimationType =
  | "shimmer"
  | "gradient"
  | "typewriter"
  | "reveal"
  | "none";

export interface TemplateParticleConfig {
  component: string; // component name to render (e.g. "StarfieldParticles")
  density: "low" | "medium" | "high";
  colors: string[]; // particle color palette
  speed: number; // animation speed multiplier 0.1-2
}

export interface TemplateAnimations {
  heroEntrance: "fade" | "slide" | "scale" | "zoom";
  particleType: "sparkles" | "leaves" | "bokeh" | "stars" | "petals" | "gold";
  scrollEffect: "parallax" | "fade" | "reveal" | "none";
  fontAnimation: FontAnimationType;
  backgroundAnimation: BackgroundAnimationType;
  has3DEffects: boolean;
}

export interface TemplateConfig {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  colors: TemplateColors;
  fonts: {
    heading: FontFamily;
    body: FontFamily;
    accent: FontFamily;
  };
  animations: TemplateAnimations;
  particles: TemplateParticleConfig;
  music?: {
    defaultTrack?: string;
    waveformColor: string;
  };
  borders: {
    style: "none" | "thin" | "double" | "ornamental" | "gradient";
    svgPath: string;
    patternOpacity: number;
  };
  decorations: TemplateDecorations;
  features: TemplateFeatures;
  layout: TemplateLayout & {
    type: LayoutType;
  };
  tags: string[];
  mood: string;
  heroComponent: string; // component name for hero section
  sectionDividerStyle: string; // SVG divider identifier
  scrollReveal: "fade-up" | "fade-in" | "zoom-in" | "slide-up";
}

export interface InviteData {
  id: string;
  inviteId: string;
  couple: {
    name1: string;
    name2: string;
  };
  weddingDate: string;
  template: TemplateConfig;
  events: Event[];
  media: {
    photos: MediaItem[];
    videos: MediaItem[];
    voiceNote?: MediaItem;
    backgroundMusic?: MediaItem;
  };
  customMessage?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: "photo" | "video" | "voice" | "song";
  fileName?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
  venueName: string;
  venueAddress: string;
  venueCity?: string;
  mapLink?: string;
}
