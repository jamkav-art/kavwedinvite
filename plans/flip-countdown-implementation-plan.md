# 3D Flip Card Countdown — Implementation Plan

## Overview

Replace the existing circular SVG ring countdown (`CountdownTimer.tsx`) with a premium **3D Flip Card** design that mirrors a classic flip clock. The flip card delivers a satisfying "ticking" mechanical feel, is immediately recognisable as a countdown, and photographs beautifully when guests screenshot the invite.

There are **zero runtime dependencies** — the flip animation is pure CSS using `perspective` + `rotateX`.

---

## Architecture

### Component tree (before → after)

```
Before:                          After:
HeroSection                      HeroSection
└── CountdownTimer                └── CountdownTimer
    └── Ring × 4 (SVG circles)        └── FlipCountdown
                                           └── FlipUnit × 4
```

- `CountdownTimer` (wrapper) keeps its existing API: `{ weddingDate, accentColor, className }`
- `FlipCountdown` (new) receives parsed time parts and renders the 4 flip cards
- `FlipUnit` (internal to `FlipCountdown`) renders a single flip card

### Data flow

```
useCountdown(weddingDate)
    ↓
{ d, h, m, s } ──→ FlipCountdown ──→ FlipUnit(days) : FlipUnit(hours) : FlipUnit(mins) : FlipUnit(secs)
```

---

## File Changes

### 1. NEW: `components/invite/FlipCountdown.tsx`

A `'use client'` component that:

- Uses the existing `useCountdown` hook (`@/hooks/useCountdown`)
- Renders 4 `FlipUnit` instances for Days, Hours, Minutes, Seconds
- Each `FlipUnit` tracks its current & previous value via `useRef`
- On value change, sets a `flipping` state to `true`, then resets after ~380ms via `setTimeout`
- Flip animation uses CSS classes, no JS animation libraries

**Props accepted (same as user's spec):**

```tsx
{
  targetDate: string;
} // ISO date string
```

But to maintain backward compatibility with `CountdownTimer.tsx`, the actual usage will be:

```tsx
// Inside CountdownTimer.tsx — passes parsed parts down
<FlipCountdown targetDate={weddingDate} accentColor={accentColor} />
```

**FlipUnit rendering (per card):**

```tsx
<div className="flip-unit">
  <div className="flip-card-wrap">
    <div className="card-half top">
      <span>{pad(value)}</span>
    </div>
    <div className="card-half bot">
      <span>{pad(value)}</span>
    </div>
    <div className={`flap ${flipping ? "flipping" : ""}`}>
      <div className="flap-inner">
        <span>{pad(prev)}</span>
      </div>
    </div>
  </div>
  <p className="flip-label">{label}</p>
</div>
```

**Key details:**

- `pad(n)` → `String(n).padStart(2, '0')` for consistent width
- Values update every second via `useCountdown` (already handled by parent)
- Colons (`:`) between units use a styled `<span className="flip-sep">:</span>`
- Accent color passed through CSS custom property for theme compatibility

---

### 2. MODIFY: `components/invite/CountdownTimer.tsx`

**Changes:**

- Remove the `Ring` sub-component entirely (SVG circles with stroke-dasharray)
- Replace the grid of `Ring` components with a `FlipCountdown` component
- Keep all props identical (`weddingDate`, `accentColor`, `className`)
- Keep the `isValid` guard and error state unchanged
- Keep the existing glassmorphism wrapper container

The rendered output changes from:

```tsx
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
  <Ring label="Days" ... />
  <Ring label="Hours" ... />
  <Ring label="Minutes" ... />
  <Ring label="Seconds" ... />
</div>
```

To:

```tsx
<FlipCountdown targetDate={weddingDate} accentColor={accentColor} />
```

This ensures **zero consumer changes** — both `HeroSection.tsx` and `OrderPreview.tsx` import `CountdownTimer` and use it identically.

---

### 3. MODIFY: `app/globals.css`

Add flip card animation classes at the bottom of the file (after line 883):

```css
/* ============================================================
   3D FLIP CARD COUNTDOWN — Pure CSS flip clock
   ============================================================ */

.flip-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 1rem 0.5rem;
}

.flip-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.flip-card-wrap {
  position: relative;
  width: 4rem;
  height: 5rem;
  perspective: 300px;
  border-radius: 8px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-half {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  backface-visibility: hidden;
  background: inherit;
}

.card-half span {
  font-size: 2.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.card-half.top {
  height: 50%;
  align-items: flex-end;
  padding-bottom: 0.125rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.12);
}

.card-half.bot {
  top: 50%;
  height: 50%;
  align-items: flex-start;
  padding-top: 0.125rem;
  background: rgba(0, 0, 0, 0.04);
}

/* The flipping flap */
.flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.flap-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.125rem;
  background: rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  transform-origin: bottom center;
  backface-visibility: hidden;
  transform: rotateX(0deg);
  transition: none;
}

.flap-inner span {
  font-size: 2.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.flipping .flap-inner {
  animation: flip-down 0.38s ease-in-out forwards;
}

@keyframes flip-down {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(-180deg);
  }
}

.flip-sep {
  font-size: 2rem;
  font-weight: 300;
  align-self: flex-start;
  margin-top: 1.25rem;
  opacity: 0.5;
}

.flip-label {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.6;
  text-align: center;
}

/* Responsive: shrink cards on small screens */
@media (max-width: 480px) {
  .flip-card-wrap {
    width: 3.25rem;
    height: 4rem;
  }
  .card-half span,
  .flap-inner span {
    font-size: 1.75rem;
  }
  .flip-sep {
    font-size: 1.5rem;
    margin-top: 0.875rem;
  }
  .flip-stage {
    gap: 0.125rem;
    padding: 0.75rem 0.25rem;
  }
}
```

---

## Files NOT modified

| File                                           | Reason                                                  |
| ---------------------------------------------- | ------------------------------------------------------- |
| `components/invite/HeroSection.tsx`            | No API change — still imports `CountdownTimer` same way |
| `components/order/OrderPreview.tsx`            | No API change — same `HeroSection` usage                |
| `components/order/TemplatePreview.tsx`         | Doesn't use CountdownTimer; is a static template card   |
| `hooks/useCountdown.ts`                        | Already provides the correct data shape                 |
| `app/invite/[id]/InvitePageContent.client.tsx` | Passes `weddingDate` to `HeroSection`, no change needed |

---

## Accessibility & Theme Compatibility

- `tabular-nums` ensures numbers don't jitter the card width as they change
- The flip card color adapts via the existing `accentColor` prop mapped to CSS variables
- On photo hero backgrounds, `accentColor` is `#ffffff` (white on dark overlay)
- On plain backgrounds, `accentColor` is the template's primary color
- The center 1px horizontal line (border-bottom on `.card-half.top`) simulates physical card construction — this is the "premium touch" that differentiates it from a basic digital display

---

## Risk Assessment

| Risk                                              | Mitigation                                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| CSS `perspective` not supported in older browsers | Auto-fallback — flip degrades to a simple number display (no broken layout) |
| Flip animation timing mismatch                    | `setTimeout` 380ms matches CSS `animation-duration` 0.38s exactly           |
| Server-side rendering conflict                    | Component is `'use client'`, animation only runs after hydration            |
| 2-digit overflow (days > 99)                      | CSS handles naturally; `tabular-nums` keeps width stable                    |
