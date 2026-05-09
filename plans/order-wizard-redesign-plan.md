# Order Wizard Redesign — Complete UI Plan

> **Status:** Planning Phase — Ready for review and approval
> **Goal:** Transform the current 4-step `/order` page into a 24-slide cinematic one-input-per-slide wizard with a dark romantic theme, animated particles, gradient effects, and a swipeable template carousel with pay buttons.

---

## Table of Contents

1. [Visual Design System](#1-visual-design-system)
2. [Slide-by-Slide UI Blueprint](#2-slide-by-slide-ui-blueprint)
3. [Animation & Transition Specifications](#3-animation--transition-specifications)
4. [Component Architecture](#4-component-architecture)
5. [Data Flow & State Management](#5-data-flow--state-management)
6. [File Structure](#6-file-structure)
7. [CSS Keyframes to Add](#7-css-keyframes-to-add)
8. [Implementation Order](#8-implementation-order)

---

## 1. Visual Design System

### 1.1 Color Palette

| Token                     | Hex                      | Usage                                                    |
| ------------------------- | ------------------------ | -------------------------------------------------------- |
| `--wiz-bg-start`          | `#0D0A0A`                | Deepest background base — near-black with warm undertone |
| `--wiz-bg-end`            | `#1A0F0F`                | Background gradient end — dark burgundy                  |
| `--wiz-bg-mid`            | `#2D1B1B`                | Mid-gradient layer for depth                             |
| `--wiz-accent-gold`       | `#D4AF37`                | Primary accent — gold for highlights, progress           |
| `--wiz-accent-gold-light` | `#F5D876`                | Lighter gold for shimmer effects                         |
| `--wiz-accent-rose`       | `#C4497C`                | Secondary accent — rose for active states                |
| `--wiz-accent-rose-light` | `#E8789A`                | Hover/glow rose                                          |
| `--wiz-accent-burgundy`   | `#8B1A2B`                | Deep burgundy for buttons, borders                       |
| `--wiz-text-primary`      | `#FBF7F0`                | Cream-white for primary text                             |
| `--wiz-text-secondary`    | `#D4C5B5`                | Warm beige for secondary text                            |
| `--wiz-text-muted`        | `#8B7D72`                | Muted brown for placeholders                             |
| `--wiz-glass-bg`          | `rgba(255,255,255,0.06)` | Glassmorphism base fill                                  |
| `--wiz-glass-border`      | `rgba(255,255,255,0.12)` | Glassmorphism border                                     |
| `--wiz-input-bg`          | `rgba(255,255,255,0.05)` | Input field background                                   |
| `--wiz-input-focus`       | `rgba(212,175,55,0.25)`  | Input focus glow — gold                                  |

### 1.2 Gradients

```
# Slide background (animated, slow-shifting):
background: linear-gradient(
  135deg,
  var(--wiz-bg-start),
  var(--wiz-bg-mid),
  var(--wiz-bg-end)
);
background-size: 400% 400%;
animation: wiz-bg-shift 12s ease infinite;

# Heading gradient text (each slide heading):
background: linear-gradient(
  90deg,
  var(--wiz-accent-gold),
  var(--wiz-accent-rose-light),
  var(--wiz-accent-gold-light),
  var(--wiz-accent-gold)
);
background-size: 300% 100%;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
animation: wiz-heading-shimmer 4s ease infinite;

# Primary CTA button gradient:
background: linear-gradient(
  135deg,
  var(--wiz-accent-burgundy),
  var(--wiz-accent-rose),
  var(--wiz-accent-gold)
);
background-size: 200% 200%;
animation: wiz-btn-glow 3s ease infinite;

# Carousel border gradient (per-template dynamic):
background: conic-gradient(
  var(--template-primary),
  var(--template-secondary),
  var(--template-accent),
  var(--template-primary)
);
animation: wiz-border-rotate 4s linear infinite;
```

### 1.3 Typography

| Element                | Font                       | Size                         | Weight | Letter-spacing     |
| ---------------------- | -------------------------- | ---------------------------- | ------ | ------------------ |
| Slide heading          | Cormorant Garamond (serif) | `clamp(1.5rem, 4vw, 2.2rem)` | 600    | `0.02em`           |
| Input label            | System sans-serif          | `0.875rem`                   | 500    | `0.08em` uppercase |
| Input value            | System sans-serif          | `1.125rem`                   | 400    | normal             |
| Slide emoji            | Native emoji               | `clamp(2.5rem, 6vw, 3.5rem)` | —      | —                  |
| CTA button             | System sans-serif          | `1rem`                       | 600    | `0.05em`           |
| Back button            | System sans-serif          | `0.875rem`                   | 500    | `0.04em`           |
| Progress dot count     | System sans-serif          | `0.7rem`                     | 700    | normal             |
| Carousel template name | Cormorant Garamond         | `1.1rem`                     | 600    | `0.03em`           |

### 1.4 Spacing & Sizing

```
Slide container max-width:    480px (w-full max-w-lg)
Input height:                 52px
Input border-radius:          14px
Button height:                52px
Button border-radius:         14px (full for pill shape)
Progress dots size:           10px (active), 6px (inactive)
Progress dot gap:             8px
Progress dot border-radius:   9999px (pill-shaped connector bars)
Glass padding:                24px
Glass border-radius:          20px
Carousel border width:        3px
Carousel corner radius:       20px
```

### 1.5 Glassmorphism Token (Tailwind-safe)

```css
.wiz-glass {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.wiz-glass-input {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: var(--wiz-text-primary);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}
.wiz-glass-input:focus {
  border-color: var(--wiz-accent-gold);
  box-shadow:
    0 0 20px rgba(212, 175, 55, 0.15),
    inset 0 0 20px rgba(212, 175, 55, 0.05);
  outline: none;
}
```

### 1.6 Particle Atmosphere

Three concurrent particle systems running in the background (Canvas + CSS):

```
1. Gold Sparkles (Canvas)
   - 40-60 small diamond-shaped particles
   - Drift upward slowly with slight horizontal sway
   - Opacity oscillates 0.2 → 0.8 → 0.2
   - Colors: #D4AF37, #F5D876, #FFF8DC
   - Size: 2-4px

2. Rose Petals (CSS absolute divs)
   - 12-18 petal-shaped divs with SVG petal mask
   - Float upward with rotation (animate-petal CSS)
   - Colors: #C4497C, #8B1A2B, #E8789A (varying opacities)
   - Duration: 8-14s each, staggered delay

3. Floating Orbs (CSS blurred circles)
   - 3 large blurred gradient orbs
   - Drift slowly across background
   - Use existing .anniversary-bg-animated pattern adapted for wedding colors
   - Colors: burgundy 15% opacity, gold 10% opacity, rose 12% opacity
```

---

## 2. Slide-by-Slide UI Blueprint

Each slide follows a consistent pattern. Here's the exact layout for each of the 24 slides.

### 2.1 Common Slide Container (Slides 1-16)

```
┌──────────────────────────────────────────────────┐
│                                                   │
│   [Progress Dots Bar — 24 dots, connector bars]   │
│                                                   │
│   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐     │
│                                                   │
│   │             🎯 (Slide Emoji)              │     │
│                                                   │
│   │   "What's your name?"                   │     │
│   │   (Animated gradient heading — springs)  │     │
│                                                   │
│   │         [  Input Field  ]                │     │
│   │    (glassmorphism, centered, focus glow) │     │
│                                                   │
│   │     [  ✨ Continue  →  ]                 │     │
│   │   (gradient animated button, spring hover)│     │
│                                                   │
│   │     "press Enter or tap Continue"         │     │
│   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘     │
│                                                   │
│   [Back Button] ← appears on slides 2-16         │
└──────────────────────────────────────────────────┘
```

**Notes:**

- The dashed border represents the invisible slide boundary (no visible container card — the background itself is the stage)
- Emoji, heading, input, and button stack vertically with `gap` spacing
- Back button: bottom-left, ghost style, uses `prevStep()`
- Enter key on keyboard triggers "Continue" action

---

### 2.2 Slides 1-7: Simple Input Fields

#### Slide 1 — `SlideYourName.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│                💍                                │
│                                                   │
│    "What's your name?"                            │
│    (gradient shimmer heading)                     │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  Your Full Name     │ ← glass input    │
│         └──────────────────────┘                  │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │ ← gradient btn  │
│         └──────────────────────┘                  │
│                                                   │
│         press Enter or tap Continue               │
│                                                   │
└──────────────────────────────────────────────────┘
```

- **Field:** `couple_name_1` — text input, autofocus on mount
- **Validation:** non-empty, 2+ characters
- **Animation:** Emoji springs in from top (-20px → 0), heading fades up, input scales in from 0.95
- **Continue:** `updateCouple({ couple_name_1 })` → `nextStep()`

#### Slide 2 — `SlidePartnerName.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               👰                                │
│                                                   │
│    "Your partner's name?"                         │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  Partner's Name    │                    │
│         └──────────────────────┘                  │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                               continue   │
└──────────────────────────────────────────────────┘
```

- **Field:** `couple_name_2` — text input, autofocus
- **Validation:** non-empty, 2+ characters
- **Back arrow:** bottom-left, ghost text button "← Back" calling `prevStep()`

#### Slide 3 — `SlideWeddingDate.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               📅                                │
│                                                   │
│    "When's the big day?"                          │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  [MM / DD / YYYY]   │ ← date input     │
│         └──────────────────────┘                  │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `wedding_date` — native `<input type="date">` styled with glassmorphism
- **Validation:** required, must be today or later, max +2 years
- **Behavior:** If date is selected and valid, button glows brighter; show brief "❤️ \_days until wedding!" after selection

#### Slide 4 — `SlideTemplateSelect.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               🎨                                │
│                                                   │
│    "Choose your style"                            │
│                                                   │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│   │ 🪐  │ │ 🌹  │ │ 👑  │ │ 🌅  │               │
│   │Celes│ │Vint │ │Royal│ │Sunse│               │
│   └─────┘ └─────┘ └─────┘ └─────┘               │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│   │ 🌸  │ │ ⚫  │ │ 🌿  │ │ 🤍  │               │
│   │Boho │ │Mini │ │Sage │ │Ivory│               │
│   └─────┘ └─────┘ └─────┘ └─────┘               │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `template_slug` — 8 template cards in 2×4 grid
- **Interaction:** Tap to select — selected card gets gold border + scale(1.05) + checkmark overlay
- **Mini previews:** Each card shows: emoji icon, truncated name, a tiny color dot strip
- **Validation:** one must be selected
- **Continue:** disabled until a template is chosen

#### Slide 5 — `SlidePhone.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               📞                                │
│                                                   │
│    "Your phone number"                            │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  +1 (555) 123-4567 │ ← tel input       │
│         └──────────────────────┘                  │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `phone_number` — `<input type="tel">` with country code dropdown (optional)
- **Validation:** 10+ digits, valid phone format
- **Format hint:** Shown as muted placeholder text

#### Slide 6 — `SlideEmail.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               ✉️                                │
│                                                   │
│    "Your email address"                           │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  you@example.com   │ ← email input     │
│         └──────────────────────┘                  │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `email` — `<input type="email">`
- **Validation:** valid email regex

#### Slide 7 — `SlideCustomMessage.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               💌                                │
│                                                   │
│    "A personal message?"                          │
│    (optional)                                     │
│                                                   │
│         ┌──────────────────────────┐              │
│         │                          │              │
│         │  Write your love note.. │ ← textarea   │
│         │                          │              │
│         │                          │              │
│         └──────────────────────────┘              │
│           0/300 characters                        │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `custom_message` — `<textarea>` with 4 rows, character counter
- **Validation:** optional, max 300 characters
- **Behavior:** Live character count turns amber >250, red at 300

---

### 2.3 Slide 8: Events (Grouped)

#### Slide 8 — `SlideEvents.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               🎉                                │
│                                                   │
│    "Your wedding events"                          │
│                                                   │
│   ┌──────────────────────────────────────┐       │
│   │  Quick add:                          │       │
│   │  [Mehendi] [Haldi] [Sangeet]         │       │
│   │  [Wedding] [Reception] [+ Custom]   │       │
│   └──────────────────────────────────────┘       │
│                                                   │
│   ┌─ Event Card ─────────────────────────┐       │
│   │  🎊 Mehendi                          │       │
│   │  📅 Apr 12, 2026 · ⏰ 10:00 AM       │       │
│   │  📍 Community Hall, Downtown         │       │
│   │                    [Edit] [Remove]   │       │
│   └──────────────────────────────────────┘       │
│                                                   │
│   ┌─ Event Card ─────────────────────────┐       │
│   │  💒 Wedding                          │       │
│   │  📅 Apr 13, 2026 · ⏰ 6:00 PM        │       │
│   │  📍 Grand Ballroom, Hotel Taj        │       │
│   │                    [Edit] [Remove]   │       │
│   └──────────────────────────────────────┘       │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Quick-add pills:** `Motion.button` badges with spring tap. `bg-white/10 hover:bg-white/20` with gold text
- **Event cards:** Glassmorphism background, each shows `event_name` emoji + fields
- **Expansion:** Tapping a card or the [+ Custom] pill opens an inline `EventForm` from `components/order/EventForm.tsx`
- **EventForm fields:** event_name, event_date, event_time, venue_name, venue_address, venue_city, venue_map_link
- **Validation:** At least 1 event required; each event's name, date, time required
- **Store:** `addEvent()`, `updateEvent()`, `removeEvent()` from useOrderStore
- **Scroll:** Container is scrollable if many events added

---

### 2.4 Slides 9-13: Individual Photo Uploads

Each photo slide is nearly identical, differing only in:

- **Label text** (1st, 2nd, 3rd...)
- **Progress indicator** (1/5, 2/5...)
- **Thumbnail preview** of previously uploaded photo shown as navigable mini-card

#### Slide 9 — `SlidePhoto1.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               📸                                │
│                                                   │
│    "Your first wedding photo"                     │
│    Photo 1 of 5                                   │
│                                                   │
│         ┌──────────────────────┐                  │
│         │                     │                   │
│         │     📷 Drop zone    │ ← large upload    │
│         │   Tap to upload    │   area w/ dashed  │
│         │   Max: 8MB each    │   border + icon   │
│         │                     │                   │
│         └──────────────────────┘                  │
│                                                   │
│    [Preview thumbnail if uploaded w/ ✕ remove]   │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Upload zone:** Glassmorphism dropzone, 200px height, `dashed border-white/20`, hover state scales 1.02
- **File input:** Hidden `<input type="file" accept="image/*">`
- **Upload logic:** Uses existing `useMediaUpload` hook → stores to Supabase → gets URL → `updateMedia({ photos: [...prev, asset] })`
- **Preview:** After upload, shows image thumbnail (200×150 rounded) with remove button overlay
- **Continue:** Enabled only after photo uploaded (or skip allowed? — confirm with user)

#### Slide 10 — `SlidePhoto2.tsx`

Same as Slide 9 but:

- Label: "Add a second photo" / "Photo 2 of 5"
- Shows small thumbnail strip of previously uploaded photos at top for context
- e.g., `[📷 Photo 1 ✓]  →  [ 📷 Choose Photo 2 ]`

#### Slide 11-13 — `SlidePhoto3.tsx`, `SlidePhoto4.tsx`, `SlidePhoto5.tsx`

Progressive pattern continues:

- Slide 13 (Photo 5 of 5) includes an **"Add More +"** button after upload that allows going beyond 5 photos
- If user taps "Add More +", we increment a `photoCount` limit and they can continue uploading

---

### 2.5 Slides 14-16: Media Uploads

#### Slide 14 — `SlideVideos.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               🎥                                │
│                                                   │
│    "Your wedding videos"                          │
│    Optional — up to 30MB each                     │
│                                                   │
│         ┌──────────────────────┐                  │
│         │     🎬 Drop zone     │                  │
│         │   Tap to upload     │                  │
│         │   or drag & drop   │                  │
│         └──────────────────────┘                  │
│                                                   │
│   ┌─ Video thumbnail ─────────────────────┐       │
│   │  ▶ wedding-reception.mp4        ✕    │       │
│   │  00:00 / 02:34                        │       │
│   └──────────────────────────────────────┘       │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `media.videos` — array of `MediaAsset`
- **Multiple uploads:** Allow multiple file selection
- **Thumbnails:** Show video icon + filename + duration
- **Validation:** Optional, max 30MB each

#### Slide 15 — `SlideVoiceMessage.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ○ ○ ○ ○ ○ ○ ○  │
│                                                   │
│               🎤                                │
│                                                   │
│    "Record a voice message"                       │
│    Optional — make it personal!                   │
│                                                   │
│         ┌──────────────────────┐                  │
│         │                     │                   │
│         │     🎤 Record      │ ← rec/upload      │
│         │   or upload audio │   zone             │
│         │                     │                   │
│         └──────────────────────┘                  │
│                                                   │
│    [Playback bar if uploaded: ▶ 0:12 ────────]   │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Continue →       │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `media.voice` — single `MediaAsset | null`
- **Two modes:** Upload file OR record via browser microphone (MediaRecorder API)
- **Playback:** Audio element with waveform visualization (simple bars)
- **Validation:** Optional

#### Slide 16 — `SlideBackgroundSong.tsx`

```
┌──────────────────────────────────────────────────┐
│  ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ○ ○ ○ ○ ○ ○  │
│                                                   │
│               🎵                                │
│                                                   │
│    "Background music"                             │
│    Choose a romantic song for your invite         │
│                                                   │
│         ┌──────────────────────┐                  │
│         │     🎵 Upload zone   │                  │
│         │   .mp3 / .wav / .m4a│                  │
│         │   Max: 15MB          │                  │
│         └──────────────────────┘                  │
│                                                   │
│    [Playback bar if uploaded]                    │
│                                                   │
│         ┌──────────────────────┐                  │
│         │  ✨ Preview Invite → │                  │
│         └──────────────────────┘                  │
│                                                   │
│  ← Back                                           │
└──────────────────────────────────────────────────┘
```

- **Field:** `media.song` — single `MediaAsset | null`
- **Note:** The CTAs label changes to "✨ Preview Invite →" since this is the last data entry slide

---

### 2.6 Slides 17-24: Template Carousel (Preview + Pay)

This is the **centerpiece** of the wizard. After all data is entered, the user enters a full-screen immersive carousel.

#### Carousel Container — `SlideTemplateCarousel.tsx`

```
┌──────────────────────────────────────────────────────┐
│  ◄ Back to Editing         3/8                    │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  ┌ ─ ─ ─ [Gradient Animated Border] ─ ─ ─ ┐ │   │
│  │                                              │   │
│  │  │    FULL TEMPLATE PREVIEW              │   │   │
│  │    (rendered with user's data)             │   │   │
│  │  │                                         │   │   │
│  │    ┌──────────────────────────────────┐    │   │   │
│  │  │ │ Template: Celestial Nights      │  │   │   │
│  │    │ 💍 John & Jane                   │    │   │   │
│  │  │ │ 📅 April 12, 2026              │  │   │   │
│  │    │ 🎊 5 Events · 3 Photos · 1 Video│    │   │   │
│  │  │ │ 💌 "To love and to cherish..." │  │   │   │
│  │    └──────────────────────────────────┘    │   │   │
│  │  │                                         │   │   │
│  │    ┌──────────────────────────────────┐    │   │   │
│  │  │ │  ✨ Pay & Create Invitation ✨   │  │   │   │
│  │    │  (Animated gradient button)      │    │   │   │
│  │  │ └──────────────────────────────────┘  │   │   │
│  │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ◄  ● ● ● ○ ● ● ● ●  ►                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Carousel Behavior

| Gesture / Action     | Result                                         |
| -------------------- | ---------------------------------------------- |
| Swipe left (touch)   | Next template preview (slide +1)               |
| Swipe right (touch)  | Previous template preview (slide -1)           |
| ← Left arrow button  | Previous template preview (slide -1)           |
| Right arrow button → | Next template preview (slide +1)               |
| Keyboard ← / →       | Previous / Next                                |
| Dot indicator tap    | Jump to that template                          |
| Back to Editing      | Returns to slide 16, preserves all state       |
| Pay & Create ✨      | Triggers payment with selected `template_slug` |

#### Template Info Card (floating on each preview)

A small translucent card overlay at the bottom of the preview area showing:

```
┌────────────────────────────────────────────┐
│ 🌙 Celestial Nights                        │
│ Navy & Gold · Starfield particles          │
│ ✨ Parallax · 🎵 Music · 🌸 Falling Stars  │
└────────────────────────────────────────────┘
```

#### Gradient Animated Border Implementation

```tsx
// GradientAnimatedBorder.tsx
<div className="relative rounded-2xl p-[3px] overflow-hidden">
  {/* Animated conic gradient layer */}
  <div
    className="absolute inset-0 rounded-2xl animate-wiz-border-rotate"
    style={{
      background: `conic-gradient(
        ${template.colors.primary},
        ${template.colors.secondary},
        ${template.colors.accent},
        ${template.colors.primary}
      )`,
    }}
  />
  {/* Inner content — masks out the center so only border shows */}
  <div className="relative rounded-2xl bg-[var(--wiz-bg-start)] h-full overflow-hidden">
    {children}
  </div>
</div>
```

#### Pay Button Specifications

```tsx
// Inside each TemplatePreviewSlide
<motion.button
  onClick={handlePay}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  className="relative w-full h-[56px] rounded-2xl overflow-hidden font-semibold text-white"
>
  {/* Animated gradient background */}
  <div
    className="absolute inset-0 bg-gradient-to-r from-[--wiz-accent-burgundy] 
                  via-[--wiz-accent-rose] to-[--wiz-accent-gold] 
                  bg-[length:200%_200%] animate-wiz-btn-glow"
  />

  {/* Shimmer overlay */}
  <div
    className="absolute inset-0 bg-gradient-to-r from-transparent 
                  via-white/10 to-transparent bg-[length:200%_100%] 
                  animate-wiz-shimmer"
  />

  {/* Content */}
  <span className="relative z-10 flex items-center justify-center gap-2">
    <SparkleIcon className="w-5 h-5" />
    Pay & Create Invitation
    <SparkleIcon className="w-5 h-5" />
  </span>
</motion.button>
```

---

## 3. Animation & Transition Specifications

### 3.1 Slide Transitions (Framer Motion)

All slide changes use horizontal spring slides modeled after the anniversary `WizardContainer`:

```typescript
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

// Transition config
transition={{
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
}}
```

### 3.2 Per-Element Entrance Animations

Within each slide, elements stagger-enter using `useAnimation()`:

| Element            | Delay | Animation                                       |
| ------------------ | ----- | ----------------------------------------------- |
| Slide emoji        | 0ms   | Spring from top: `y: -20 → 0`, `opacity: 0 → 1` |
| Heading text       | 100ms | Fade up: `y: 15 → 0`, `opacity: 0 → 1`          |
| Input field        | 200ms | Scale in: `scale: 0.95 → 1`, `opacity: 0 → 1`   |
| Continue button    | 300ms | Fade up + scale: `y: 10 → 0`, `scale: 0.97 → 1` |
| "press Enter" hint | 400ms | Fade in: `opacity: 0 → 0.6`                     |
| Back button        | 0ms   | Always visible, no entrance anim                |

### 3.3 Input Focus Animations

```
On focus:
- Border: white/12 → gold/D4AF37
- Box-shadow: none → 0 0 20px rgba(212,175,55,0.15)
- Label (if floating): moves up 8px, scales to 0.85
- Duration: 0.3s ease

On blur (if empty):
- Reverse of above
- Duration: 0.3s ease

On valid input:
- Subtle green glow at edge: 0 0 0 1px rgba(74,222,128,0.2)
```

### 3.4 Progress Dots Animation

```typescript
// Each dot:
<motion.div
  animate={{
    width: isActive ? 24 : isCompleted ? 10 : 6,
    opacity: isActive ? 1 : isCompleted ? 0.7 : 0.35,
    scale: isActive ? 1.2 : 1,
  }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
/>

// Connector bars between dots:
<motion.div
  animate={{
    opacity: isCompleted ? 1 : 0.2,
    background: isCompleted
      ? 'var(--wiz-accent-gold)'
      : 'rgba(255,255,255,0.1)',
  }}
  transition={{ duration: 0.3 }}
/>
```

### 3.5 Carousel Swipe Animation

Uses Framer Motion's `useDragControls` or a library like `embla-carousel-react` for native-feeling touch swipe:

```typescript
// Option A: Framer Motion drag="x"
<motion.div
  drag="x"
  dragConstraints={{ left: -width, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.x < -100) goNext()
    if (info.offset.x > 100) goPrev()
  }}
>

// Option B: embla-carousel-react (recommended for carousels)
// embla handles momentum, physics, snap points natively
```

### 3.6 Background Animation

Three layers of background animation controlled via CSS:

```css
/* Layer 1: Gradient shift */
@keyframes wiz-bg-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Layer 2: Gold shimmer sweep */
@keyframes wiz-shimmer-sweep {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

/* Layer 3: Petal float */
@keyframes wiz-petal-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-20vh) rotate(720deg);
    opacity: 0;
  }
}
```

---

## 4. Component Architecture

### 4.1 Component Tree

```
app/order/layout.tsx                    ← Dark theme wrapper
└── app/order/page.tsx                   ← SLIDE_MAP orchestrator
    └── WeddingWizardContainer            ← Full-screen bg + particles
        ├── <WeddingParticleBackground>   ← Canvas gold + CSS petals + orbs
        ├── <WizardProgressBar>           ← 24-dot step indicator
        ├── AnimatePresence
        │   └── {currentSlideComponent}   ← One of 24 slides
        │       ├── SlideYourName
        │       ├── SlidePartnerName
        │       ├── SlideWeddingDate
        │       ├── SlideTemplateSelect
        │       ├── SlidePhone
        │       ├── SlideEmail
        │       ├── SlideCustomMessage
        │       ├── SlideEvents
        │       │   └── EventForm (existing)
        │       ├── SlidePhoto1
        │       ├── SlidePhoto2
        │       ├── SlidePhoto3
        │       ├── SlidePhoto4
        │       ├── SlidePhoto5
        │       ├── SlideVideos
        │       ├── SlideVoiceMessage
        │       ├── SlideBackgroundSong
        │       ├── SlideTemplateCarousel    ← Orchestrator for 17-24
        │       │   └── CarouselNavigation   ← Swipe wrapper
        │       │       └── TemplatePreviewSlide (×8)
        │       │           ├── GradientAnimatedBorder
        │       │           ├── TemplateInfoCard
        │       │           └── PayButton (gradient animated)
        │       └── (SlideNavigation arrows / dots)
        └── <WeddingPetalOverlay>         ← Foreground petal layer
```

### 4.2 Props Interfaces

```typescript
// === Wizard Container ===
interface WeddingWizardContainerProps {
  children: React.ReactNode;
}

// === Slide Base Props (passed to every slide) ===
interface SlideBaseProps {
  onNext: () => void; // Validates + advances
  onBack: () => void; // Goes to previous slide
  isFirstSlide: boolean; // Hides back button if true
  direction: number; // 1 or -1 for animation direction
}

// === Progress Bar ===
interface WizardProgressBarProps {
  totalSteps: number; // 24
  currentStep: number; // 1-24
}

// === Carousel ===
interface TemplateCarouselProps {
  slides: TemplatePreviewData[]; // 8 templates with user data
  onBackToEditing: () => void;
}

interface TemplatePreviewData {
  template: TemplateConfig;
  index: number; // 0-7
  total: number; // 8
  userData: OrderFormState;
}

interface TemplatePreviewSlideProps {
  template: TemplateConfig;
  userData: OrderFormState;
  onPay: (slug: string) => void;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
}

// === Gradient Border ===
interface GradientAnimatedBorderProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  children: React.ReactNode;
  className?: string;
}

// === Pay Button ===
interface PayButtonProps {
  templateSlug: string;
  onPay: (slug: string) => void;
  isLoading?: boolean;
}

// === Particle Background ===
interface WeddingParticleBackgroundProps {
  goldDensity?: number; // default 40
  petalDensity?: number; // default 12
  orbCount?: number; // default 3
}
```

### 4.3 Reusable Components to Create

All placed in `components/order/`:

| Component                       | Lines (est.) | Purpose                                                                   |
| ------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `WeddingWizardContainer.tsx`    | ~100         | Full-screen dark bg + particles + gradient orbs + AnimatePresence wrapper |
| `WizardProgressBar.tsx`         | ~80          | 24-step animated dots with gold connector bars                            |
| `SlideYourName.tsx`             | ~60          | Single text input with emoji + gradient heading                           |
| `SlidePartnerName.tsx`          | ~55          | Same pattern, partner field                                               |
| `SlideWeddingDate.tsx`          | ~65          | Date input with day-count feedback                                        |
| `SlideTemplateSelect.tsx`       | ~100         | 2×4 template grid with selection state                                    |
| `SlidePhone.tsx`                | ~60          | Tel input with validation                                                 |
| `SlideEmail.tsx`                | ~55          | Email input with validation                                               |
| `SlideCustomMessage.tsx`        | ~65          | Textarea with character counter                                           |
| `SlideEvents.tsx`               | ~180         | Quick-add pills + event cards + EventForm reuse                           |
| `SlidePhotoUpload.tsx`          | ~120         | REUSABLE — generic single photo upload, parameterized by index/total      |
| `SlideVideos.tsx`               | ~80          | Multiple video upload zone                                                |
| `SlideVoiceMessage.tsx`         | ~100         | Record or upload audio with playback                                      |
| `SlideBackgroundSong.tsx`       | ~70          | Single audio upload with playback                                         |
| `SlideTemplateCarousel.tsx`     | ~150         | Orchestrator: tracks carousel index, renders current + nav                |
| `TemplatePreviewSlide.tsx`      | ~100         | Renders template data summary + pay button inside gradient border         |
| `GradientAnimatedBorder.tsx`    | ~40          | Conic gradient border animation wrapper                                   |
| `CarouselNavigation.tsx`        | ~120         | Touch swipe + arrow + dot indicators                                      |
| `WeddingParticleBackground.tsx` | ~150         | Canvas gold particles + CSS floating petals + gradient orbs               |
| `SlideSlideWrapper.tsx`         | ~50          | REUSABLE — consistent slide layout: emoji, heading, children, button      |

### 4.4 SLIDE_MAP Definition (in `app/order/page.tsx`)

```typescript
const SLIDE_MAP: React.ComponentType[] = [
  SlideYourName, // 1
  SlidePartnerName, // 2
  SlideWeddingDate, // 3
  SlideTemplateSelect, // 4
  SlidePhone, // 5
  SlideEmail, // 6
  SlideCustomMessage, // 7
  SlideEvents, // 8
  SlidePhoto1, // 9
  SlidePhoto2, // 10
  SlidePhoto3, // 11
  SlidePhoto4, // 12
  SlidePhoto5, // 13
  SlideVideos, // 14
  SlideVoiceMessage, // 15
  SlideBackgroundSong, // 16
  SlideTemplateCarousel, // 17-24 (internal carousel state)
];
```

Note: `SlideTemplateCarousel` internally manages its own sub-step (0-7 for 8 templates), so the outer step count stays at 17 for the carousel entry point.

---

## 5. Data Flow & State Management

### 5.1 useOrderStore Changes

**Minimal changes required.** The existing store already has all needed fields:

```typescript
// Current maxStep is 4 — needs to be updated to 24:
nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 24) })),
prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
```

The store's `partialize` already persists all fields needed. No new fields are required.

### 5.2 Data Flow Diagram

```
 ┌─────────────┐    ┌──────────────────────┐    ┌──────────────┐
 │  Slide 1-7   │    │   Slide 8: Events    │    │  Slide 9-13  │
 │  Simple text │───▶│  Quick-add pills     │───▶│ Photo uploads│
 │  inputs      │    │  Event cards w/ form │    │  Individual  │
 └─────────────┘    └──────────────────────┘    └──────┬───────┘
                                                        │
 ┌──────────────┐    ┌──────────────────────┐           │
 │  Slide 14-16 │◀───│  Updated useOrderStore │◀──────────┘
 │  Media       │    │  (Zustand persist)    │
 │  uploads     │    └──────────┬───────────┘
 └──────────────┘               │
                                ▼
 ┌─────────────────────────────────────────────────┐
 │          Slides 17-24: Template Carousel         │
 │                                                  │
 │  TEMPLATES.map((t) => ({                         │
 │    template: t,                                  │
 │    userData: store state,                        │
 │  }))                                             │
 │                                                  │
 │  Each slide shows a summary card with:           │
 │  - Template name + tagline                       │
 │  - Couple names, date, event count               │
 │  - Photo count, video count                      │
 │  - Custom message preview                        │
 │  - Gradient animated border (template colors)    │
 │  - Pay & Create button                           │
 └────────────────────────┬────────────────────────┘
                          │
                          ▼
 ┌─────────────────────────────────────────────────┐
 │  User taps "Pay & Create" on template X          │
 │  1. selectTemplate(template.slug)                │
 │  2. useRazorpay.initializePayment(formState)      │
 │  3. Razorpay checkout opens                      │
 │  4. On success → redirect to /order/success      │
 └─────────────────────────────────────────────────┘
```

### 5.3 Validation Per Slide

Each slide validates its own field before allowing "Continue":

| Slide | Validation                     | Error Display                                           |
| ----- | ------------------------------ | ------------------------------------------------------- |
| 1-2   | `trim().length >= 2`           | Red border pulse + "Please enter your name" below input |
| 3     | Valid date, >= today, <= +2yr  | "Please select a valid date"                            |
| 4     | `template_slug !== ''`         | Button disabled until selection                         |
| 5     | `/^\+?[\d\s\-\(\)]{7,15}$/`    | "Please enter a valid phone number"                     |
| 6     | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "Please enter a valid email"                            |
| 7     | Optional, `length <= 300`      | Character counter warning                               |
| 8     | `events.length >= 1`           | "Please add at least one event"                         |
| 9-13  | Optional (photos can be 0)     | No error, skip allowed                                  |
| 14-16 | Optional                       | No error, skip allowed                                  |

---

## 6. File Structure

### 6.1 New Files to Create

```
components/order/
├── WeddingWizardContainer.tsx     # Full-screen animated wrapper
├── WizardProgressBar.tsx          # 24-dot progress indicator
├── SlideYourName.tsx              # Slide 1
├── SlidePartnerName.tsx           # Slide 2
├── SlideWeddingDate.tsx           # Slide 3
├── SlideTemplateSelect.tsx        # Slide 4
├── SlidePhone.tsx                 # Slide 5
├── SlideEmail.tsx                 # Slide 6
├── SlideCustomMessage.tsx         # Slide 7
├── SlideEvents.tsx                # Slide 8
├── SlidePhotoUpload.tsx           # Slides 9-13 (reusable, parameterized)
├── SlideVideos.tsx                # Slide 14
├── SlideVoiceMessage.tsx          # Slide 15
├── SlideBackgroundSong.tsx        # Slide 16
├── SlideTemplateCarousel.tsx      # Slides 17-24 orchestrator
├── TemplatePreviewSlide.tsx       # Single preview with pay button
├── GradientAnimatedBorder.tsx     # Conic gradient border wrapper
├── CarouselNavigation.tsx         # Swipe + arrows + dots
├── WeddingParticleBackground.tsx  # Canvas gold + CSS petals
└── SlideSlideWrapper.tsx          # Consistent slide layout wrapper
```

### 6.2 Files to Modify

```
app/order/page.tsx          # Replace STEP_COMPONENTS with SLIDE_MAP (24)
app/order/layout.tsx        # Change to dark theme, update header
hooks/useOrderStore.ts      # Update maxStep: 4 → 24, add goToSlide helper
app/globals.css             # Add new keyframes (see Section 7)
```

### 6.3 Files to DELETE (existing step components)

```
app/order/steps/step1.tsx   # Replaced by slides 1-7
app/order/steps/step2.tsx   # Replaced by slide 8
app/order/steps/step3.tsx   # Replaced by slides 9-16
app/order/steps/step4.tsx   # Replaced by slides 17-24
components/order/StepIndicator.tsx  # Replaced by WizardProgressBar
```

---

## 7. CSS Keyframes to Add

Add these to [`app/globals.css`](app/globals.css:1990):

```css
/* === Order Wizard Background Shift === */
@keyframes wiz-bg-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* === Order Wizard Heading Gold Shimmer === */
@keyframes wiz-heading-shimmer {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
  100% {
    background-position: 0% center;
  }
}

/* === Order Wizard Button Glow Pulse === */
@keyframes wiz-btn-glow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* === Order Wizard Border Rotation (conic) === */
@keyframes wiz-border-rotate {
  to {
    transform: rotate(360deg);
  }
}

/* === Order Wizard Shimmer Sweep Overlay === */
@keyframes wiz-shimmer-sweep {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}

/* === Order Wizard Petal Float Up === */
@keyframes wiz-petal-float {
  0% {
    transform: translateY(100vh) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-20vh) rotate(720deg) scale(1.2);
    opacity: 0;
  }
}

/* === Order Wizard Gold Sparkle Pop === */
@keyframes wiz-gold-sparkle {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0.6;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
}

/* === Order Wizard Input Focus Glow === */
@keyframes wiz-focus-glow {
  0% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(212, 175, 55, 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
  }
}
```

---

## 8. Implementation Order

### Phase 1: Foundation (Core Infrastructure)

| Step | File                                               | Description                                                                |
| ---- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| 1    | [`app/globals.css`](app/globals.css)               | Add all new `wiz-*` keyframes + glassmorphism utility classes              |
| 2    | [`hooks/useOrderStore.ts`](hooks/useOrderStore.ts) | Update `nextStep()`/`prevStep()` max from 4 to 24                          |
| 3    | `components/order/WeddingParticleBackground.tsx`   | Create Canvas gold sparkle system + CSS petal float + gradient orbs        |
| 4    | `components/order/SlideSlideWrapper.tsx`           | Create reusable slide layout wrapper (emoji + heading + children + button) |
| 5    | `components/order/WizardProgressBar.tsx`           | Create 24-dot animated progress indicator                                  |
| 6    | `components/order/WeddingWizardContainer.tsx`      | Create full-screen container with bg, particles, progress, AnimatePresence |

### Phase 2: Simple Input Slides (1-7)

| Step | File                                       | Description                         |
| ---- | ------------------------------------------ | ----------------------------------- |
| 7    | `components/order/SlideYourName.tsx`       | Text input for `couple_name_1`      |
| 8    | `components/order/SlidePartnerName.tsx`    | Text input for `couple_name_2`      |
| 9    | `components/order/SlideWeddingDate.tsx`    | Date picker with day-count feedback |
| 10   | `components/order/SlideTemplateSelect.tsx` | 2×4 template grid with selection    |
| 11   | `components/order/SlidePhone.tsx`          | Phone input with validation         |
| 12   | `components/order/SlideEmail.tsx`          | Email input with validation         |
| 13   | `components/order/SlideCustomMessage.tsx`  | Textarea with char counter          |

### Phase 3: Complex Input Slides (8-16)

| Step  | File                                                             | Description                                     |
| ----- | ---------------------------------------------------------------- | ----------------------------------------------- |
| 14    | `components/order/SlideEvents.tsx`                               | Quick-add pills + event cards + EventForm reuse |
| 15    | `components/order/SlidePhotoUpload.tsx`                          | Reusable single photo upload component          |
| 16-20 | Instantiate `SlidePhotoUpload` for slides 9-13 in page SLIDE_MAP |                                                 |
| 21    | `components/order/SlideVideos.tsx`                               | Multiple video upload zone                      |
| 22    | `components/order/SlideVoiceMessage.tsx`                         | Record/upload audio with playback               |
| 23    | `components/order/SlideBackgroundSong.tsx`                       | Single audio upload                             |

### Phase 4: Preview + Pay Carousel (17-24)

| Step | File                                          | Description                                                               |
| ---- | --------------------------------------------- | ------------------------------------------------------------------------- |
| 24   | `components/order/GradientAnimatedBorder.tsx` | Conic gradient border wrapper                                             |
| 25   | `components/order/TemplatePreviewSlide.tsx`   | Single preview card with user data summary + gradient border + pay button |
| 26   | `components/order/CarouselNavigation.tsx`     | Swipe/arrow/dot carousel wrapper                                          |
| 27   | `components/order/SlideTemplateCarousel.tsx`  | Orchestrator: maps TEMPLATES to TemplatePreviewSlide, handles swipe state |

### Phase 5: Integration & Cleanup

| Step | File                                           | Description                                                                |
| ---- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| 28   | [`app/order/page.tsx`](app/order/page.tsx)     | Replace STEP_COMPONENTS with SLIDE_MAP, wire up WeddingWizardContainer     |
| 29   | [`app/order/layout.tsx`](app/order/layout.tsx) | Change to dark theme header, update metadata, remove cream bg              |
| 30   | Delete old files                               | Remove `app/order/steps/step1-4.tsx`, `components/order/StepIndicator.tsx` |
| 31   | Test full flow                                 | `npx tsc --noEmit --pretty`, manual flow test, payment test                |

---

## Appendix A: Key Design Decisions

1. **Canvas vs CSS for particles:** Use Canvas API for gold sparkles (performance with 40+ particles) and CSS for petals (fewer elements, benefit from CSS animation hardware acceleration)

2. **embla-carousel vs Framer Motion drag:** Recommend `embla-carousel-react` for the template carousel — it provides native-feeling momentum scrolling, snap points, and is already used elsewhere in the codebase pattern

3. **Slide 17 as carousel entry:** Rather than having slides 17-24 as separate SLIDE_MAP entries, use a single component that internally manages its own carousel index (0-7). This keeps the outer step logic clean and allows the carousel to maintain its own animation state

4. **Zustand maxStep:** Increase from 4 to 24, but note the carousel occupies a single step slot (17). The carousel's internal index doesn't affect the outer progress bar

5. **No new store fields:** All data fields already exist in `OrderFormState` — the wizard redesign only changes the UI presentation, not the data model

6. **Upload flow:** Reuse existing `useMediaUpload` hook from `hooks/useMediaUpload.ts` — it handles Supabase storage upload, returns `MediaAsset` objects that can be pushed to `updateMedia()`

---

## Appendix B: Reference Implementations

The anniversary quiz wizard at [`components/anniversary-wizard/WizardContainer.tsx`](components/anniversary-wizard/WizardContainer.tsx:31) serves as the reference for:

- Spring-based horizontal slide transitions
- Direction tracking via `useRef` + `useEffect`
- `AnimatePresence` with custom `direction` prop
- Gradient orb background layers

The existing [`components/order/FlowerPetalEffect.tsx`](components/order/FlowerPetalEffect.tsx:42) serves as reference for:

- Animated petal particles with Framer Motion
- SVG petal shapes
- Randomized animation durations and positions
