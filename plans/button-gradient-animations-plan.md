# Button Animated Gradient Effects — Implementation Plan

## Overview

Add **distinct animated background gradients** to three buttons across two components, giving each its own unique gradient palette and animation keyframes.

## Current State Analysis

### Global CSS (compiled)

- `.cta-gradient-btn` — shared by ~7 buttons across the project
  - Gradient: `linear-gradient(135deg, #c0185f 0%, #e8638c 22%, #c9a962 44%, #9b59b6 66%, #e8638c 88%, #c0185f 100%)` at `300% 300%`
  - Animation: `bridal-shimmer 4s ease-in-out infinite` (simple background-position 0% → 100% → 0%)
- **Problem**: All CTA buttons look visually identical. No button has its own identity.

### Header (`components/layout/Header.tsx`)

- **Button 1** ("Create Invite — ₹399", line 95-100): Uses `cta-gradient-btn` — shared generic gradient
- **Button 2** ("💝 Anniversary", line 113-120): Uses `border` styling only — NO gradient background at all
- Mobile menu copies (lines 180-194) mirror desktop styles

### Home Hero (`components/home/Hero.tsx`)

- **Button** ("💝 Wedding Anniversary Quiz", line 347-355): Uses `cta-gradient-btn` with shared generic gradient
- Component already uses scoped `<style>` injection via `HERO_CSS` constant

## Files to Modify

| File                           | Changes                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `components/layout/Header.tsx` | Add scoped `<style>` block + update 4 button classNames (2 desktop + 2 mobile) |
| `components/home/Hero.tsx`     | Add new CSS to `HERO_CSS` + update 1 button className                          |

## Design Specifications

### Button A — Header "Create Invite — ₹399" (`.header-cta-btn`)

- **Gradient palette**: Deep magenta → rose → gold → rose → deep magenta
- **Animation**: Multi-directional diagonal sweep (4-direction cycle)
- **Duration**: 6s, ease-in-out, infinite
- **Intent**: Warm, premium, confident — the primary revenue CTA

### Button B — Header "💝 Anniversary" (`.header-anniv-btn`)

- **Gradient palette**: Warm bronze → gold → champagne → gold → bronze
- **Animation**: Gentle diagonal cross-fade (slower, softer)
- **Duration**: 8s, ease-in-out, infinite
- **Intent**: Romantic, soft, inviting — the secondary/exploratory CTA

### Button C — Home Hero Quiz (`.hero-quiz-btn`)

- **Gradient palette**: Deep purple → magenta → gold → magenta → deep purple
- **Animation**: Circular/triangular shimmer with glass sheen overlay
- **Duration**: 7s, ease-in-out, infinite
- **Intent**: Celebratory, vibrant, distinct — stands out in the hero section
- **Extra**: Includes `::after` pseudo-element for a glass-reflective sheen layer

## Implementation Steps

### Step 1: `components/layout/Header.tsx`

**1a.** Add a `<style dangerouslySetInnerHTML>` block inside the component (after the `useEffect`, before the return), containing:

```css
/* ── Header "Create Invite" CTA — distinct animated gradient ── */
@keyframes header-cta-shimmer {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.header-cta-btn {
  background: linear-gradient(
    135deg,
    #4a1528 0%,
    #8b3a4a 15%,
    #c0185f 30%,
    #e8638c 45%,
    #c9a962 60%,
    #e8638c 75%,
    #c0185f 85%,
    #4a1528 100%
  );
  background-size: 400% 400%;
  animation: header-cta-shimmer 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}
.header-cta-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0.06) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

/* ── Header "Anniversary" CTA — distinct animated gradient ── */
@keyframes header-anniv-shimmer {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
.header-anniv-btn {
  background: linear-gradient(
    135deg,
    #8b5e3c 0%,
    #b8864e 15%,
    #c9a962 35%,
    #f7e7ce 55%,
    #c9a962 70%,
    #e8638c 85%,
    #8b5e3c 100%
  );
  background-size: 300% 300%;
  animation: header-anniv-shimmer 8s ease-in-out infinite;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.header-anniv-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0.05) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}
```

**1b.** Update desktop Button 1 (line 97):

- Replace `cta-gradient-btn` with `header-cta-btn`

**1c.** Update desktop Button 2 (line 115):

- Replace `className` from border-styled to:
  ```
  "header-anniv-btn inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-white text-sm font-semibold tracking-wide shadow-md"
  ```

**1d.** Update mobile Button 1 (line 182):

- Replace `cta-gradient-btn` with `header-cta-btn`

**1e.** Update mobile Button 2 (line 188-194):

- Replace border-styled className with `header-anniv-btn` equivalent:
  ```
  "header-anniv-btn flex items-center justify-center gap-2 h-12 rounded-full text-white font-semibold"
  ```

### Step 2: `components/home/Hero.tsx`

**2a.** Add to existing `HERO_CSS` constant (after the `.hero-title-word` block, before the closing backtick):

```css
/* ── Hero "Wedding Anniversary Quiz" CTA — unique animated gradient ── */
@keyframes hero-quiz-shimmer {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 25%;
  }
  50% {
    background-position: 50% 100%;
  }
  75% {
    background-position: 0% 75%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.hero-quiz-btn {
  background: linear-gradient(
    135deg,
    #2c0a3e 0%,
    #5c2a7a 18%,
    #c0185f 38%,
    #c9a962 58%,
    #c0185f 72%,
    #5c2a7a 86%,
    #2c0a3e 100%
  );
  background-size: 400% 400%;
  animation: hero-quiz-shimmer 7s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}
.hero-quiz-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0.08) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}
```

**2b.** Update the quiz button's className (line 347-355):

- Replace `cta-gradient-btn` with `hero-quiz-btn`

## Design Rationale

| Button                  | Palette Inspiration              | Animation Style                  | Rationale                                              |
| ----------------------- | -------------------------------- | -------------------------------- | ------------------------------------------------------ |
| Header "Create Invite"  | Deep wine → rose → gold          | 4-direction diagonal sweep       | Rich, premium feel matching the primary revenue action |
| Header "💝 Anniversary" | Bronze → gold → champagne → rose | Gentle diagonal cross-fade       | Softer, romantic, inviting — exploratory CTA           |
| Hero "💝 Quiz"          | Deep purple → magenta → gold     | Triangular shimmer + glass sheen | Celebratory, vibrant, distinct from others in hero     |

## Files NOT Modified

The following remain untouched:

- `app/globals.css` — no changes to global styles
- `components/anniversary/HeroSection.tsx` — not in scope
- `components/anniversary/FinalCtaSection.tsx` — not in scope
- `components/home/Pricing.tsx` — not in scope
- Any other component or configuration file

## Verification

1. All three buttons have **visually distinct** gradient animations
2. Each animation uses **different** `@keyframes` names
3. Each uses **different** color palettes
4. Animations loop continuously without visual jarring
5. Hover/focus states maintained (scale transforms still work via existing Tailwind classes)
6. Mobile menu variant buttons are updated to match desktop
7. No existing functionality, layout, or user flow is altered
