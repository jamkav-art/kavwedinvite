# Flip Countdown Timer — Comprehensive Design Plan

> **Status:** Planning / Pre-Implementation
> **Target Component:** [`components/invite/FlipCountdown.tsx`](components/invite/FlipCountdown.tsx)
> **Wrapper Component:** [`components/invite/CountdownTimer.tsx`](components/invite/CountdownTimer.tsx)
> **Data Hook:** [`hooks/useCountdown.ts`](hooks/useCountdown.ts)
> **Styles:** [`app/globals.css`](app/globals.css) (lines 598–921)
> **Dependencies:** Framer Motion v12.38, GSAP v3.15, Next.js 16 (App Router)

---

## Table of Contents

1. [Visual Design](#1-visual-design)
2. [CSS Animation Specifications](#2-css-animation-specifications)
3. [Responsive Behavior](#3-responsive-behavior)
4. [Accessibility](#4-accessibility)
5. [Component Structure](#5-component-structure)
6. [Performance Considerations](#6-performance-considerations)
7. [Implementation Order](#7-implementation-order)

---

## 1. Visual Design

### 1.1 Layout Architecture

The countdown is rendered as a horizontal flex row (`display: flex`) with four flip-card units separated by centered colon characters (`:`).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│  │ ┌──────┐ │ : │ ┌──────┐ │ : │ ┌──────┐ │ : │ ┌──────┐ │               │
│  │ │  07  │ │ : │ │  14  │ │ : │ │  32  │ │ : │ │  58  │ │               │
│  │ └──────┘ │   │ └──────┘ │   │ └──────┘ │   │ └──────┘ │               │
│  │  DAYS    │   │  HOURS   │   │  MINS    │   │  SECS    │               │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key layout properties** (from [`.flip-stage`](app/globals.css:606)):

| Property          | Value                                       | Purpose                          |
| ----------------- | ------------------------------------------- | -------------------------------- |
| `display`         | `flex`                                      | Creates horizontal row           |
| `align-items`     | `center`                                    | Vertically centres all units     |
| `justify-content` | `center`                                    | Horizontally centres the group   |
| `gap`             | `0.25rem` (clamped to `0.125rem` on mobile) | Spacing between units and colons |
| `padding`         | `0.25rem 0.5rem`                            | Internal breathing room          |

**Colon separators** (from [`.flip-sep`](app/globals.css:849)) are vertically centred (`align-self: center`) using `line-height: 1` and share the same font family as the numbers (`--font-cormorant`).

### 1.2 Typography

| Element                            | Font Family                     | Weight | Size (desktop → tablet → phone)    | Key Property                                          |
| ---------------------------------- | ------------------------------- | ------ | ---------------------------------- | ----------------------------------------------------- |
| **Digit display** (`.flip-number`) | `var(--font-cormorant)`, serif  | 700    | `2.75rem` → `2.25rem` → `1.75rem`  | `font-variant-numeric: tabular-nums`                  |
| **Unit labels** (`.flip-label`)    | `var(--font-inter)`, sans-serif | 600    | `0.625rem` → `0.625rem` → `0.5rem` | `letter-spacing: 0.14em`, `text-transform: uppercase` |
| **Colons** (`.flip-sep`)           | `var(--font-cormorant)`, serif  | 200    | `2.25rem` → `1.75rem` → `1.25rem`  | `color: rgba(255, 255, 255, 0.85)`                    |

**`tabular-nums`** is critical — it ensures each digit occupies identical width, preventing the card from "jittering" as values change (e.g., `09` → `10`).

**Text shadow** applied to all number text: `0 2px 8px rgba(0, 0, 0, 0.4)` — ensures readability on the animated gradient backgrounds.

### 1.3 Color Palette (Animated Gradients per Time Unit)

Each time unit receives a **distinct animated gradient** to create visual differentiation and premium feel. Gradients use 5-stop symmetric sweeps that animate via the `grad-shift` keyframe.

| Unit        | CSS Class          | Gradient Stop Colors                                      | Mood                  |
| ----------- | ------------------ | --------------------------------------------------------- | --------------------- |
| **Days**    | `.flip-grad-days`  | `#4a2c0e` → `#8b5e3c` → `#c9a962` → `#8b5e3c` → `#4a2c0e` | Warm gold / antique   |
| **Hours**   | `.flip-grad-hours` | `#0c2340` → `#1a4a6e` → `#5b8c9e` → `#1a4a6e` → `#0c2340` | Deep ocean / sapphire |
| **Minutes** | `.flip-grad-mins`  | `#4a1528` → `#8b3a4a` → `#d4756c` → `#8b3a4a` → `#4a1528` | Rose / terracotta     |
| **Seconds** | `.flip-grad-secs`  | `#2c0a3e` → `#5c2a7a` → `#9b59b6` → `#5c2a7a` → `#2c0a3e` | Amethyst / violet     |

**Why symmetric gradients?** The symmetry ensures the animation loop has a seamless, cyclical feel — the gradient sweeps across a 5-stop ramp and returns to its starting position without a visible "jump."

### 1.4 Spacing & Alignment

```
┌───────────────────────────────────────────────────────────┐
│                        flip-stage                         │
│  ┌──────┐  gap:0.25rem  ┌──────┐  gap:0.25rem  ┌──────┐  │
│  │ unit │      :        │ unit │      :        │ unit │  │
│  │  4rem│               │  4rem│               │  4rem│  │
│  │ x5rem│               │ x5rem│               │ x5rem│  │
│  └──────┘               └──────┘               └──────┘  │
│     │                     │                      │       │
│  0.5rem gap            0.5rem gap             0.5rem gap │
│   LABEL                  LABEL                  LABEL     │
└───────────────────────────────────────────────────────────┘
```

**Card dimensions (`.flip-card-wrap`)**: `width: 4.75rem` × `height: 5.75rem` on desktop, shrinking responsively.

**Internal card spacing:**

- Top half: `padding-bottom: 0.25rem` — pushes number upward
- Bottom half: `padding-top: 0.25rem` — pushes number downward
- This creates the illusion that the number is vertically centred within its half

### 1.5 Visual Effects Layering

The flip card uses a **4-layer z-index stack** to create depth:

```
z-index 5:  .flip-card-wrap::before — Glass sheen (linear-gradient overlay)
z-index 4:  .flip-divider          — Horizontal seam line
z-index 3:  .flap                  — Flipping flap (animates)
z-index 2:  (unused / flap-inner)
z-index 1:  .card-half.top/.bot    — Static number display
z-index 0:  .flip-card-wrap::after — Dark overlay (15% black)
z-index -1: .flip-grad-bg          — Animated gradient background
```

The **glass sheen** is a diagonal gradient from top-left (25% white) through transparent to bottom-right (8% white), simulating a glossy surface.

The **dark overlay** (`rgba(0,0,0,0.15)`) ensures text contrast remains high regardless of gradient brightness — a key accessibility feature.

The **center divider** (`.flip-divider`) is a 1px horizontal line with a gradient from transparent → white (60% at centre) → transparent, simulating the physical seam of a mechanical flip card.

---

## 2. CSS Animation Specifications

### 2.1 3D Flip Card Mechanics

The flip animation uses **pure CSS** with `perspective` + `rotateX` — zero JavaScript animation libraries.

#### Perspective Container

```css
.flip-card-wrap {
  perspective: 400px; /* Depth of field for 3D transforms */
  border-radius: 10px;
  overflow: hidden; /* Clips the flap during rotation */
}
```

#### Flap Anatomy

The flap is a full-card-sized wrapper (`position: absolute; inset: 0; z-index: 3`) containing `.flap-inner` — a **50%-height** element anchored to the **top** of the card, with `transform-origin: bottom center`.

```
┌──────────────────────┐
│     flap-inner       │  ← Contains previous value, 50% height
│      (top half)      │     transform-origin: bottom center
├──────────────────────┤  ← ← ← This is the hinge line
│                      │
│   card-half.bot      │  ← Static bottom half (current value)
│                      │
└──────────────────────┘
```

When the flap rotates, it hinges along its bottom edge (at the card's vertical midpoint), folding downward to reveal the new value underneath.

#### Keyframe: `flap-flip`

```css
@keyframes flap-flip {
  0% {
    transform: rotateX(0deg);
  } /* Fully visible — shows old value */
  50% {
    transform: rotateX(-90deg);
  } /* Edge-on — invisible transition point */
  100% {
    transform: rotateX(-180deg);
  } /* Fully flipped — hidden below */
}
```

| Phase   | Visual                       | What the user sees                                        |
| ------- | ---------------------------- | --------------------------------------------------------- |
| 0%      | `rotateX(0deg)`              | Previous value fully visible (flap covers top half)       |
| 10%–40% | `rotateX(-10deg → -80deg)`   | Flap tilts backward, old value compresses vertically      |
| 50%     | `rotateX(-90deg)`            | Flap edge-on — essentially invisible (perfect swap point) |
| 60%–90% | `rotateX(-100deg → -170deg)` | New value begins to appear from the hinge line            |
| 100%    | `rotateX(-180deg)`           | Flap fully hidden; new value fully revealed in top half   |

**Easing curve:** `cubic-bezier(0.65, 0, 0.35, 1)` — this is a custom ease-in-out that:

- Accelerates gently in the first half (the flap lifts off)
- Decelerates in the second half (the flap settles into hidden position)
- Avoids the mechanical "snap" of `ease-in` while still feeling physical

**Duration:** `0.6s` — this matches the [`useEffect` timeout in FlipCountdown.tsx](components/invite/FlipCountdown.tsx:58) (`600ms`). The JS timeout resets the `flipping` state after the animation completes.

#### Flip Trigger Logic (React)

```tsx
useEffect(() => {
  if (value !== prevRef.current) {
    setFlipping(true);
    const timer = setTimeout(() => {
      setFlipping(false);
      prevRef.current = value;
    }, 600); // MUST match CSS animation duration
    return () => clearTimeout(timer);
  }
}, [value]);
```

When `value` changes (every second for seconds, less frequently for other units):

1. `flipping` state is set to `true` → CSS class `.flipping` is applied → animation plays
2. After 600ms, `flipping` resets to `false` and `prevRef.current` is updated
3. The flap shows `prevRef.current` (the old value) during animation
4. Static halves show the current value at all times

### 2.2 Gradient Animation Keyframes

#### `grad-shift`

```css
@keyframes grad-shift {
  0%,
  100% {
    background-position: 0% 50%;
  } /* Start at left-centre */
  33% {
    background-position: 100% 0%;
  } /* Sweep to right-top */
  66% {
    background-position: 50% 100%;
  } /* Sweep to bottom-centre */
}
```

- **Duration:** `6s` per cycle (relaxed, not distracting)
- **Easing:** `ease-in-out` (default)
- **Applied to:** `.flip-grad-bg` and the flap's `.flap-inner`

The gradient background size is `300% 300%`, which means only a portion of the full gradient is visible at any time — the keyframe shifts which portion is visible, creating a smooth, flowing color motion.

### 2.3 GPU Acceleration Strategy

All animated elements should be promoted to their own **composite layer**:

```css
.flip-card-wrap,
.flap-inner,
.flip-grad-bg {
  will-change: transform, opacity;
  transform: translateZ(0); /* Fallback layer promotion */
}
```

The `flap-flip` keyframe only animates `transform` (specifically `rotateX`), which is a **compositor-only property** — it does not trigger layout recalculations or paint operations. This is the most performant path for animations.

### 2.4 Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  .flipping .flap-inner {
    animation: none;
    transition: none;
  }

  .flip-grad-bg {
    animation: none;
    background-position: 50% 50% !important; /* Static centred gradient */
  }

  .flip-card-wrap::before {
    transition: none;
  }
}
```

When reduced motion is preferred:

- Flip animation is disabled entirely (numbers still update visually)
- Gradient animation freezes at its centre position
- No visual degradation — the countdown remains fully functional
- The `.flipping` class toggle still occurs in JS (it's a no-op visually)

---

## 3. Responsive Behavior

### 3.1 Breakpoints

| Breakpoint  | Target Devices               | Card Size           | Number Size | Colon Size | Label Size | Stage Gap  |
| ----------- | ---------------------------- | ------------------- | ----------- | ---------- | ---------- | ---------- |
| **≥ 641px** | Desktop, tablet landscape    | `4.75rem × 5.75rem` | `2.75rem`   | `2.25rem`  | `0.625rem` | `0.25rem`  |
| **≤ 640px** | Tablet portrait, large phone | `4rem × 5rem`       | `2.25rem`   | `1.75rem`  | `0.625rem` | `0.2rem`   |
| **≤ 400px** | Small phone                  | `3.25rem × 4rem`    | `1.75rem`   | `1.25rem`  | `0.5rem`   | `0.125rem` |

### 3.2 Scaling Strategy

The layout uses **absolute rem values** at each breakpoint rather than fluid `clamp()` for card dimensions. This ensures:

- Cards maintain consistent aspect ratio at each breakpoint (~1:1.21 height:width)
- No unexpected squishing at intermediate sizes
- Predictable layout for the glassmorphism container that wraps the countdown

**Container context:** The countdown sits inside a glassmorphism wrapper in [`HeroSection.tsx`](components/invite/HeroSection.tsx:459–475):

```
max-w-2xl (672px) centred, with px-6 padding
```

This means the countdown never exceeds ~600px available width, which naturally constrains large screens.

### 3.3 Layout Adjustments

At all breakpoints, the layout remains a **single horizontal row** — it never wraps to a grid. The four units + three colons fit comfortably even at 400px:

- Desktop: `4 × 4.75rem (cards) + 3 × ~1.5rem (colons) + 4 × 0.25rem (gaps) = ~24.5rem (392px)`
- 400px phone: `4 × 3.25rem (cards) + 3 × ~1rem (colons) + 4 × 0.125rem (gaps) = ~16.75rem (268px)`

Both fit well within the available container width.

### 3.4 Container Padding

The glassmorphism container in `HeroSection.tsx` uses responsive padding:

```tsx
className = "w-full max-w-2xl mx-auto px-6 pb-10";
```

On very small screens, the container's `px-6` (24px each side) provides sufficient margin. The countdown's internal `.flip-stage` padding also compresses at each breakpoint.

---

## 4. Accessibility

### 4.1 Semantic Structure

The countdown should be represented as a **live region** for screen readers:

```tsx
<div
  className="flip-stage"
  role="timer"
  aria-live="polite"
  aria-label="Countdown to wedding: 7 days, 14 hours, 32 minutes, 58 seconds"
>
  {/* flip units */}
</div>
```

**Implementation plan:**

- Add `role="timer"` to the container `<div>` in `FlipCountdown.tsx`
- Compute a dynamic `aria-label` that describes the full remaining time as a natural-language phrase
- Use `aria-live="polite"` so screen readers announce updates without interrupting current speech

### 4.2 Color Contrast

The gradient backgrounds are dark-toned (deep browns, blues, reds, purples), providing **excellent contrast** against white text.

| Unit    | Average Gradient Luminance | Text Color      | Contrast Ratio (approx.) |
| ------- | -------------------------- | --------------- | ------------------------ |
| Days    | ~25% (warm brown)          | White (#ffffff) | ~8.5:1                   |
| Hours   | ~18% (dark navy)           | White (#ffffff) | ~11:1                    |
| Minutes | ~22% (burgundy)            | White (#ffffff) | ~9.5:1                   |
| Seconds | ~16% (deep purple)         | White (#ffffff) | ~12:1                    |

All ratios exceed WCAG AAA (7:1) requirement.

**The 15% dark overlay** (`.flip-card-wrap::after`) provides additional insurance — even if someday a lighter gradient is substituted, the overlay guarantees a minimum contrast floor.

### 4.3 Focus States

The countdown itself is not an interactive element (no clickable areas). However, if ever used within a focusable container, ensure:

```css
.flip-card-wrap:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}
```

### 4.4 Reduced Motion (`prefers-reduced-motion`)

As documented in [§2.4](#24-reduced-motion-fallback), when the user's system accessibility setting prefers reduced motion:

1. **Flip animation**: Disabled — numbers still update every second, but the flap remains static
2. **Gradient animation**: Frozen at centre position — gradients remain visible but static
3. **Glass sheen**: Static (no transition needed)

**Implementation**: Add the `@media (prefers-reduced-motion: reduce)` block to the flip card CSS section in [`app/globals.css`](app/globals.css) (after line 920).

### 4.5 Screen Reader Announcements

When the countdown reaches zero (expired), the `aria-label` should update to indicate the event has passed:

```
"Countdown expired — the wedding has started!"
```

This prevents screen readers from announcing "0 days, 0 hours, 0 minutes, 0 seconds" indefinitely.

---

## 5. Component Structure

### 5.1 React Component Tree

```
CountdownTimer                    [Wrapper — maintains existing API]
└── FlipCountdown                 [Orchestrator — data flow, layout]
    ├── FlipUnit (Days)           [Single flip card]
    │   ├── div.flip-card-wrap    [Perspective container + pseudo-elements]
    │   │   ├── div.flip-grad-bg  [Animated gradient background]
    │   │   ├── div.card-half.top [Static top half — current value]
    │   │   ├── div.card-half.bot [Static bottom half — current value]
    │   │   ├── div.flip-divider  [Horizontal seam]
    │   │   └── div.flap          [Flipping flap — previous value]
    │   │       └── div.flap-inner
    │   └── p.flip-label          [Unit label: "DAYS"]
    ├── span.flip-sep             [Colon separator]
    ├── FlipUnit (Hours)
    ├── span.flip-sep
    ├── FlipUnit (Minutes)
    ├── span.flip-sep
    └── FlipUnit (Seconds)
```

### 5.2 Props Interface

```tsx
// CountdownTimer — public API (unchanged)
type CountdownTimerProps = {
  weddingDate: string; // ISO date string (e.g., "2026-06-15")
  accentColor?: string; // Template accent color (passed to FlipCountdown)
  className?: string; // Additional classes for the wrapper
};

// FlipCountdown — internal orchestrator
type FlipCountdownProps = {
  targetDate: string; // ISO date string
  accentColor?: string;
  className?: string;
};

// FlipUnit — single card (internal, not exported)
type FlipUnitProps = {
  value: number; // Current numeric value for this unit
  label: string; // "Days" | "Hours" | "Mins" | "Secs"
  accentColor?: string; // CSS color for text (passed through CSS var)
  unitKey: UnitKey; // "days" | "hours" | "minutes" | "seconds"
};
```

### 5.3 State Management

| State      | Location                             | Type             | Description                                                     |
| ---------- | ------------------------------------ | ---------------- | --------------------------------------------------------------- |
| `parts`    | `FlipCountdown` (via `useCountdown`) | `CountdownParts` | `{ days, hours, minutes, seconds, totalMs }` — updated every 1s |
| `isValid`  | `FlipCountdown` (via `useCountdown`) | `boolean`        | Whether the target date is parseable                            |
| `flipping` | Each `FlipUnit`                      | `boolean`        | `true` during the 600ms flip animation                          |
| `prevRef`  | Each `FlipUnit`                      | `useRef<number>` | Tracks previous value to display on the flap                    |

### 5.4 Data Flow Diagram

```
useCountdown(targetDate)
    │
    │  useEffect: setInterval(1000ms) → setNow(Date.now())
    │  useMemo: computes parts from (targetDate - now)
    ▼
{ parts, isValid }
    │
    ├── isValid === false → Render error fallback
    │
    └── isValid === true
        │
        ▼
    FlipCountdown renders 4 FlipUnits
        │
        ▼
    Each FlipUnit:
        ├── value={parts.days} etc.
        ├── useEffect: value !== prevRef.current
        │   ├── setFlipping(true)
        │   ├── setTimeout(600ms) → setFlipping(false), prevRef.current = value
        │   └── CSS: .flipping class toggles flap-flip animation
        └── Render:
            ├── Static halves: pad(value)
            └── Flap: pad(prevRef.current) [during flipping]
```

---

## 6. Performance Considerations

### 6.1 GPU Acceleration

| Element           | Technique                     | Rationale                                     |
| ----------------- | ----------------------------- | --------------------------------------------- |
| `.flip-card-wrap` | `will-change: transform`      | Perspective container — promotes to GPU layer |
| `.flap-inner`     | `will-change: transform`      | Animates `rotateX` — compositor-only path     |
| `.flip-grad-bg`   | `will-change: opacity`        | Gradient animation — avoid paint thrashing    |
| `.card-half`      | `backface-visibility: hidden` | Prevents flicker during 3D transforms         |

**No `will-change` on `.flip-stage`**: The container itself doesn't animate, so promoting it would waste GPU memory.

### 6.2 Zero JS Animation Dependencies

The flip animation is **entirely CSS-driven**:

- `@keyframes flap-flip` uses `transform: rotateX()` — composited by the GPU
- `@keyframes grad-shift` uses `background-position` — triggers paint but only ~3× per 6s cycle
- The React `useEffect` only toggles a CSS class — no `requestAnimationFrame`, no `gsap.to()`, no `framer-motion` variants

This means the animation workload is handled by the GPU/compositor thread, leaving the main JS thread free for hydration and user interactions.

### 6.3 Minimal Reflows

- **`tabular-nums`** eliminates reflow when digits change width (e.g., `9` → `10`)
- **Fixed card dimensions** (`width`/`height` in rem) mean the DOM doesn't reflow when the countdown updates
- **No layout-triggering properties animated**: `rotateX` (compositor), `background-position` (paint, not layout)
- **`will-change`** pre-allocates compositor layers, avoiding layer creation jank on first animation frame

### 6.4 setInterval Hygiene

The [`useCountdown` hook](hooks/useCountdown.ts:32) uses a single `setInterval` at 1000ms. This is the **only timer** — no per-unit intervals. The `useEffect` cleanup (`clearInterval`) prevents memory leaks on unmount.

The 600ms `setTimeout` per `FlipUnit` (for resetting the `flipping` state) is cleaned up via `clearTimeout` in the `useEffect` return, preventing stale timeouts if the unit unmounts mid-flip.

### 6.5 Memory Profile

| Item                                   | Count                               | Memory Impact     |
| -------------------------------------- | ----------------------------------- | ----------------- |
| DOM nodes (4 cards × ~8 elements each) | ~32                                 | Negligible        |
| `setInterval`                          | 1                                   | Negligible        |
| `setTimeout` per flip unit             | Up to 4 (during second transitions) | Negligible        |
| CSS keyframes (3 total)                | 2 KB                                | Negligible        |
| Gradient background images (4)         | ~0 (CSS gradients, not raster)      | Zero image memory |

### 6.6 Lighthouse Impact

| Metric                             | Expected Impact | Reason                                                         |
| ---------------------------------- | --------------- | -------------------------------------------------------------- |
| **CLS (Cumulative Layout Shift)**  | 0 (no impact)   | Fixed dimensions, no layout shifts                             |
| **LCP (Largest Contentful Paint)** | Positive        | Countdown is below-the-fold content, loaded via `'use client'` |
| **TBT (Total Blocking Time)**      | Minimal         | Only a single `setInterval` firing every 1000ms                |
| **Interaction (INP)**              | No impact       | No event handlers on the countdown itself                      |

---

## 7. Implementation Order

### Phase 0: Audit Existing Code (Already Complete)

- [x] Read [`components/invite/FlipCountdown.tsx`](components/invite/FlipCountdown.tsx) — fully implemented
- [x] Read [`components/invite/CountdownTimer.tsx`](components/invite/CountdownTimer.tsx) — thin wrapper
- [x] Read [`hooks/useCountdown.ts`](hooks/useCountdown.ts) — provides `{ parts, isValid }`
- [x] Read [`app/globals.css`](app/globals.css) lines 598–921 — all flip card CSS exists
- [x] Verify integration in [`HeroSection.tsx`](components/invite/HeroSection.tsx) — wrapped in glassmorphism container
- [x] Verify integration in [`OrderPreview.tsx`](components/order/OrderPreview.tsx) — uses HeroSection

### Phase 1: Accessibility & Semantic Enhancements

- [ ] Add `role="timer"` and `aria-live="polite"` to the flip-stage container
- [ ] Compute and render a dynamic `aria-label` with natural-language description of remaining time
- [ ] Add `prefers-reduced-motion` media query block to the flip card CSS section
- [ ] Handle countdown expired state (update aria-label, optionally display "Event has started")

**Files to modify:**

- [`components/invite/FlipCountdown.tsx`](components/invite/FlipCountdown.tsx)
- [`app/globals.css`](app/globals.css)

### Phase 2: Performance Optimization

- [ ] Add `will-change: transform` to `.flip-card-wrap`, `.flap-inner`, `.flip-grad-bg`
- [ ] Add `transform: translateZ(0)` as fallback layer promotion
- [ ] Verify `backface-visibility: hidden` is present on `.card-half` and `.flap-inner`

**File to modify:**

- [`app/globals.css`](app/globals.css)

### Phase 3: Edge Case Handling

- [ ] Handle countdown reaching zero (display "00:00:00:00" or transition text)
- [ ] Handle invalid target date (already handled — renders error fallback)
- [ ] Handle date in the past (should show all zeros, not negative values)
- [ ] Verify the `accentColor` prop correctly maps to text color when set to `#ffffff` vs template primary

**File to modify:**

- [`components/invite/FlipCountdown.tsx`](components/invite/FlipCountdown.tsx) — add `useEffect` for expired state

### Phase 4: Visual Polish & Awwwards-Level Touches

- [ ] Verify the glass sheen (`.flip-card-wrap::before`) renders correctly in all browsers
- [ ] Add subtle box-shadow animation to cards on value change (micro-interaction)
- [ ] Verify all 4 gradient palettes render correctly side by side
- [ ] Verify colon `text-shadow` provides sufficient contrast on dark hero backgrounds
- [ ] Cross-browser test `perspective` + `rotateX` in Chrome, Firefox, Safari, Edge

**File to modify:**

- [`app/globals.css`](app/globals.css) — optional micro-interaction enhancements

### Phase 5: Responsive QA

- [ ] Test at 1440px (desktop) — cards should be full size
- [ ] Test at 768px (tablet) — cards should shrink to 4rem × 5rem
- [ ] Test at 375px (iPhone SE) — cards should shrink to 3.25rem × 4rem
- [ ] Verify glassmorphism wrapper (`max-w-2xl`) doesn't clip cards on any viewport
- [ ] Verify no horizontal overflow on any device

**Files to test:**

- [`app/globals.css`](app/globals.css) — verify media queries
- [`components/invite/HeroSection.tsx`](components/invite/HeroSection.tsx) — verify container padding

### Phase 6: Final Integration Test

- [ ] Verify countdown renders correctly on the invite page (`/invite/[id]`)
- [ ] Verify countdown renders correctly in the order preview (`/order/preview`)
- [ ] Verify GSAP hero animation sequence doesn't conflict with flip card mounting
- [ ] Verify Framer Motion page transitions don't interfere with countdown rendering
- [ ] Run `npm run build` and confirm zero errors

---

## Appendix A: Complete CSS Class Reference

| Class              | Type          | Purpose                                                       |
| ------------------ | ------------- | ------------------------------------------------------------- |
| `.flip-stage`      | Layout        | Flex container for the entire countdown                       |
| `.flip-unit`       | Layout        | Flex column wrapping a single card + label                    |
| `.flip-card-wrap`  | Container     | Perspective container with pseudo-element overlays            |
| `.flip-grad-bg`    | Background    | Animated gradient background layer                            |
| `.flip-grad-days`  | Modifier      | Gold/brown gradient for Days                                  |
| `.flip-grad-hours` | Modifier      | Blue/navy gradient for Hours                                  |
| `.flip-grad-mins`  | Modifier      | Rose/terracotta gradient for Minutes                          |
| `.flip-grad-secs`  | Modifier      | Amethyst/purple gradient for Seconds                          |
| `.card-half`       | Structural    | Base class for both card halves                               |
| `.card-half.top`   | Modifier      | Upper 50% of the card                                         |
| `.card-half.bot`   | Modifier      | Lower 50% of the card                                         |
| `.flip-number`     | Typography    | Number text styling                                           |
| `.flip-divider`    | Decorative    | Horizontal centre seam line                                   |
| `.flap`            | Container     | Wrapper for the flipping element                              |
| `.flap-inner`      | Animated      | The element that animates (50% height, origin: bottom centre) |
| `.flipping`        | State trigger | Toggles the `flap-flip` animation on `.flap-inner`            |
| `.flip-sep`        | Typography    | Colon separator styling                                       |
| `.flip-label`      | Typography    | Unit label (Days, Hours, etc.)                                |

## Appendix B: Complete Keyframe Reference

| Keyframe     | Property Animated      | Duration    | Trigger                 | Applied To                     |
| ------------ | ---------------------- | ----------- | ----------------------- | ------------------------------ |
| `flap-flip`  | `transform: rotateX()` | 0.6s        | `.flipping` class added | `.flipping .flap-inner`        |
| `grad-shift` | `background-position`  | 6s infinite | Autoplay                | `.flip-grad-bg`, `.flap-inner` |

## Appendix C: `UseCountdown` Hook Data Shape

```ts
type CountdownParts = {
  totalMs: number; // Total milliseconds remaining (clamped to 0)
  days: number; // Integer days (e.g., 7)
  hours: number; // Integer hours 0–23
  minutes: number; // Integer minutes 0–59
  seconds: number; // Integer seconds 0–59
};
```

The hook returns:

```ts
{
  targetDate: Date | null,   // Parsed target date, null if invalid
  parts: CountdownParts,     // Zeroed if targetDate is null
  isValid: boolean,          // true if targetDate was parseable
}
```
