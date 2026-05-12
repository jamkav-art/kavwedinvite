# Contact Page — Colorful 3D Wedding/Love Theme Redesign

## Overview

Redesign the existing `/contact` page into an ultra-vibrant, 3D-rich experience with wedding/love themes. The page prominently features WhatsApp number `+919846224086` with a beautifully predefined custom message.

---

## Files to Modify

| File                                                                                | Action                                                          |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`components/layout/Header.tsx`](../components/layout/Header.tsx)                   | Update Contact nav link from `/#contact` → `/contact`           |
| [`app/globals.css`](../app/globals.css)                                             | Add new 3D CSS keyframes & utility classes for the contact page |
| [`components/contact/ContactContent.tsx`](../components/contact/ContactContent.tsx) | Complete rewrite — colorful 3D design                           |
| [`app/(main)/contact/page.tsx`](<../app/(main)/contact/page.tsx>)                   | Update metadata for SEO                                         |

---

## Step-by-step Implementation Plan

### Step 1: Update Header Navigation Link

**File**: [`components/layout/Header.tsx`](../components/layout/Header.tsx)

- Change the "Contact" entry in `navLinks` array from `href: "/#contact"` → `href: "/contact"`
- This ensures the header navigates to the actual contact page instead of the homepage section

### Step 2: Add 3D CSS Animations to globals.css

**File**: [`app/globals.css`](../app/globals.css)

Append the following new animation classes (at the end of the file):

```css
/* ══════════════════════════════════════════════════════════════
   CONTACT PAGE — 3D WEDDING/LOVE THEME EFFECTS
   ══════════════════════════════════════════════════════════════ */

/* ── 3D Card Tilt (perspective) ── */
@keyframes card-3d-float {
  0%,
  100% {
    transform: perspective(1200px) rotateY(-2deg) rotateX(2deg) translateY(0);
  }
  50% {
    transform: perspective(1200px) rotateY(2deg) rotateX(-2deg)
      translateY(-12px);
  }
}

@keyframes card-3d-float-reverse {
  0%,
  100% {
    transform: perspective(1200px) rotateY(2deg) rotateX(-2deg) translateY(0);
  }
  50% {
    transform: perspective(1200px) rotateY(-2deg) rotateX(2deg) translateY(-8px);
  }
}

/* ── 3D Ring Orbit ── */
@keyframes ring-orbit {
  0% {
    transform: rotateX(65deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(65deg) rotateZ(360deg);
  }
}

@keyframes ring-orbit-inner {
  0% {
    transform: rotateX(75deg) rotateZ(360deg);
  }
  100% {
    transform: rotateX(75deg) rotateZ(0deg);
  }
}

/* ── Floating Heart Pulse ── */
@keyframes heart-float-3d {
  0%,
  100% {
    transform: perspective(800px) translateZ(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: perspective(800px) translateZ(60px) scale(1.15);
    opacity: 1;
  }
}

/* ── 3D Sparkle Burst ── */
@keyframes sparkle-burst-3d {
  0% {
    transform: perspective(600px) rotateY(0deg) rotateX(0deg) scale(0);
    opacity: 1;
  }
  100% {
    transform: perspective(600px) rotateY(180deg) rotateX(90deg) scale(1.5);
    opacity: 0;
  }
}

/* ── Gradient ring shimmer ── */
@keyframes ring-shimmer {
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

/* ── 3D Petal Drift ── */
@keyframes petal-drift-3d {
  0% {
    transform: perspective(600px) rotateY(0deg) translateY(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.7;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    transform: perspective(600px) rotateY(360deg) translateY(-120px)
      rotate(180deg);
    opacity: 0;
  }
}

/* ── Floating 3D Orb ── */
@keyframes orb-3d-float {
  0%,
  100% {
    transform: perspective(800px) translateZ(0) translate(0, 0);
  }
  25% {
    transform: perspective(800px) translateZ(40px) translate(10px, -15px);
  }
  50% {
    transform: perspective(800px) translateZ(-10px) translate(-8px, 10px);
  }
  75% {
    transform: perspective(800px) translateZ(20px) translate(12px, -5px);
  }
}

/* ── Mystic Ring Spin (conic) ── */
@property --contact-ring-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
.contact-ring-spin {
  --contact-ring-angle: 0deg;
  background: conic-gradient(
    from var(--contact-ring-angle),
    #e8638c,
    #c9a962,
    #a855f7,
    #f7e7ce,
    #e8638c
  );
  animation: contact-ring-spin 8s linear infinite;
}
@keyframes contact-ring-spin {
  to {
    --contact-ring-angle: 360deg;
  }
}

/* ── 3D Button Glow ── */
@keyframes contact-btn-glow {
  0%,
  100% {
    box-shadow:
      0 0 20px rgba(232, 99, 140, 0.3),
      0 0 40px rgba(201, 169, 98, 0.15),
      0 8px 32px rgba(0, 0, 0, 0.12);
    transform: perspective(800px) translateZ(0);
  }
  50% {
    box-shadow:
      0 0 30px rgba(232, 99, 140, 0.5),
      0 0 60px rgba(201, 169, 98, 0.25),
      0 12px 40px rgba(0, 0, 0, 0.15);
    transform: perspective(800px) translateZ(20px);
  }
}

/* ── Shooting Star ── */
@keyframes shooting-star {
  0% {
    transform: translateX(0) translateY(0) rotate(-35deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-300px) translateY(300px) rotate(-35deg);
    opacity: 0;
  }
}

/* ── Wave Divider ── */
@keyframes wave-move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* ── Text Gradient Shimmer for Contact ── */
.contact-grad-text {
  background: linear-gradient(
    135deg,
    #e8638c,
    #c9a962,
    #a855f7,
    #f7e7ce,
    #e8638c
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: contact-grad-shimmer 5s ease-in-out infinite;
}
@keyframes contact-grad-shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

### Step 3: Redesign ContactContent.tsx

**File**: [`components/contact/ContactContent.tsx`](../components/contact/ContactContent.tsx)

Complete rewrite with:

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│               3D ORB BACKGROUND                  │
│  (floating colored orbs with parallax depth)     │
├─────────────────────────────────────────────────┤
│                                                  │
│   ✨ "Let's Create Magic" (gradient title)       │
│   💫 Subtitle with love theme                    │
│                                                  │
│        ┌──────────────────────┐                  │
│        │   💬 WhatsApp Card   │  ← 3D tilt card  │
│        │  +91 98462 24086     │  (mouse-reactive) │
│        │  "Send us a message" │                  │
│        │  [Chat on WhatsApp →]│                  │
│        └──────────────────────┘                  │
│                                                  │
│        ┌──────────────────────┐                  │
│        │   ✉️ Email Card      │  ← 3D tilt card  │
│        │  happy@...           │  (reverse float) │
│        └──────────────────────┘                  │
│                                                  │
│   ⚡ Response time: under 2 hours                │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│    3 RING ORNAMENTS (3D rotating rings)          │
│    "Why couples love WedInviter"                 │
│    3 stat cards with icons                       │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│    💝 CTA SECTION                                │
│    "Ready to create your dream invite?"          │
│    [Create Your Invite — ₹399]  ← 3D pulse btn  │
│                                                  │
└─────────────────────────────────────────────────┘
```

#### 3D Effects to Implement

1. **Parallax Background Orbs**: 8-10 large colored orbs (pink, gold, violet, magenta, champagne) floating at different depths using `perspective()` CSS transforms with differing animation speeds and delays.

2. **3D Tilt Contact Cards**: Both the WhatsApp and Email cards use `perspective(1200px)` with `rotateY`/`rotateX` transforms that animate on a loop. On hover, they get a more dramatic tilt effect.

3. **Floating Heart/Sparkle Particles**: Small decorative elements (❤️, ✨, 💫, 🌸) floating upward with 3D rotation.

4. **3D Rotating Rings**: Ornamental ring elements in the mid-section that rotate in 3D space (`rotateX(65deg) rotateZ(...)`).

5. **Animated Gradient Border**: The WhatsApp card gets a conic gradient animated border (rainbow-shifting gold/pink/purple).

6. **3D Button Pulse**: The CTA button at the bottom has a 3D glow pulse effect.

7. **Shooting Stars**: Occasional shooting star streaks across the dark CTA section.

8. **Wave Divider**: A smooth SVG wave divider between sections.

9. **Mouse-reactive 3D tilt** on the main WhatsApp card (using Framer Motion's `useMotionValue`/`useTransform` similar to the existing [`EtherealParallaxBackground`](../components/EtherealParallaxBackground.tsx) pattern).

#### WhatsApp Predefined Message

The predefined WhatsApp message should be romantic and warm:

```
"Hello WedInviter! 💌 We're dreaming of our perfect wedding and would love your magic to create our digital invitation. Could you help us bring our love story to life? ✨🌸"
```

Used via [`buildWhatsAppUrl`](../lib/utils.ts:44) with [`WHATSAPP_OWNER`](../lib/constants.ts:21) (`919846224086`).

#### Color Palette for 3D Effects

| Element             | Colors                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| Background orbs     | `#e8638c` (rose), `#c9a962` (gold), `#a855f7` (violet), `#f7e7ce` (champagne), `#c0185f` (magenta) |
| WhatsApp card       | `#059669` → `#047857` (green base) with rainbow conic border                                       |
| Email card          | `#7C3AED` → `#5B21B6` (purple base)                                                                |
| Gradient text       | Rose → Gold → Violet → Champagne                                                                   |
| Section backgrounds | Cream → Blush → Champagne gradient                                                                 |
| CTA section         | Dark charcoal with gold accents                                                                    |

### Step 4: Update Page Metadata

**File**: [`app/(main)/contact/page.tsx`](<../app/(main)/contact/page.tsx>)

- Update `title` to something more romantic: `"Contact Us — Let's Create Your Dream Wedding Invite"`
- Update `description` to reflect the love/wedding theme
- Keep canonical URL and OG tags consistent

---

## Implementation Order

1. **Header.tsx** — Quick change, update nav link href
2. **globals.css** — Add all 3D CSS keyframes and utility classes
3. **ContactContent.tsx** — Complete component rewrite with all 3D effects
4. **page.tsx** — Update metadata
5. **Verify** — Test WhatsApp link, navigation, mobile responsiveness, and 3D animations

---

## Technical Notes

- **Framer Motion** is already available — use `motion.div`, `useMotionValue`, `useSpring`, `useTransform` for mouse-reactive 3D tilt on the WhatsApp card (pattern from [`EtherealParallaxBackground`](../components/EtherealParallaxBackground.tsx))
- **Tailwind CSS v4** with `@theme` tokens — use existing color variables (`--color-rose`, `--color-gold`, `--color-magenta`, etc.)
- **Fonts**: Cormorant (serif headings) via `font-[--font-cormorant]`, Inter (body) is default
- **All 3D CSS uses `perspective()` + `rotateX()`/`rotateY()`/`translateZ()`** — no Three.js needed
- **Mobile**: All 3D effects degrade gracefully (reduced motion query already exists in globals.css), cards stack vertically on small screens
- **`@property` for conic gradient animation** already used in existing codebase (see `--border-angle` in pricing cards)
