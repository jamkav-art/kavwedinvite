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
  animations?: {
    heroEntrance: "fade" | "slide" | "scale";
    particleType: "sparkles" | "leaves" | "bokeh" | "stars";
    scrollEffect: "parallax" | "fade" | "reveal";
  };
  music?: {
    defaultTrack?: string;
    waveformColor: string;
  };
  borders: {
    style: "none" | "thin" | "double" | "ornamental";
    svgPath: string;
    patternOpacity: number;
  };
  decorations: TemplateDecorations;
  features: TemplateFeatures;
  layout: TemplateLayout;
  tags: string[];
  mood: string;
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
