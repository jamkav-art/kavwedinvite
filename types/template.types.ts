export type FontFamily =
  | 'cormorant'
  | 'playfair'
  | 'lora'
  | 'merriweather'
  | 'josefin-sans'
  | 'cinzel'
  | 'inter'
  | 'montserrat'
  | 'libre-baskerville'
  | 'lato'

export interface TemplateColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
}

export interface TemplateDecorations {
  borderSvg: string
  patternOpacity: number
  hasFloralAccent: boolean
  hasGoldLeaf: boolean
}

export interface TemplateFeatures {
  hasVideoHero: boolean
  hasParallax: boolean
  hasFullBleed: boolean
  hasSidebarLayout: boolean
}

export interface TemplateLayout {
  heroFullBleed: boolean
  sidebarEvents: boolean
  galleryGrid: boolean
  floatingRsvp: boolean
}

export interface TemplateConfig {
  slug: string
  name: string
  tagline: string
  description: string
  colors: TemplateColors
  fonts: {
    heading: FontFamily
    body: FontFamily
    accent: FontFamily
  }
  borders: {
    style: 'none' | 'thin' | 'double' | 'ornamental'
    svgPath: string
    patternOpacity: number
  }
  decorations: TemplateDecorations
  features: TemplateFeatures
  layout: TemplateLayout
  tags: string[]
  mood: string
}
