# Anniversary Page Gradient & UI Enhancements — Implementation Plan

## Overview

Apply animated gradient backgrounds, gradient text colors, dynamic date calculations, and canvas-based photo previews to the `/wed-anniversary-wish` landing page and order wizard. No changes are made outside these files.

---

## Files to Modify (in execution order)

| #   | File                                                    | Changes                                                                                                                                                        |
| --- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `app/globals.css`                                       | Add missing CSS utility classes + new animated gradient button classes                                                                                         |
| 2   | `components/anniversary/HeroSection.tsx`                | Unique animated gradient on "Create Your Anniversary Quiz ₹399" button                                                                                         |
| 3   | `components/anniversary/FinalCtaSection.tsx`            | Gradient title (no animation), animated gradient on "Start Building Your Quiz" button                                                                          |
| 4   | `app/(main)/wed-anniversary-wish/order/steps/step1.tsx` | "Your anniversary" → "Your Marriage Date", dynamic years+months+days, gradient text on all black fonts, animated gradient on "Continue to Quiz Builder" button |
| 5   | `app/(main)/wed-anniversary-wish/order/steps/step2.tsx` | Gradient text on all black fonts, merge "choose your correct option" into description                                                                          |
| 6   | `components/anniversary-order/QuizQuestionCard.tsx`     | Animated gradient on option buttons, "Correct Option" green text, red/green toggle switch                                                                      |
| 7   | `components/anniversary-order/PhotoUploadDropzone.tsx`  | Canvas element for photo preview within frame                                                                                                                  |

---

## Step 1: `app/globals.css` — Add Missing CSS Classes

### 1a. Add `.anniversary-gradient-text` (currently referenced but NOT defined)

Insert after the existing `.memorable-gradient-text` block (around line 159):

```css
/* ── Anniversary Quiz: Gradient text — animated shimmer ── */
.anniversary-gradient-text {
  background: linear-gradient(
    135deg,
    #e8638c 0%,
    #c0185f 25%,
    #c9a962 50%,
    #f7e7ce 70%,
    #c9a962 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: bridal-shimmer 6s ease-in-out infinite;
}
```

### 1b. Add `.love-story-gradient` (currently referenced but NOT defined)

```css
/* ── Anniversary Quiz: Love story heading gradient ── */
.love-story-gradient {
  background: linear-gradient(
    135deg,
    #c0185f 0%,
    #e8638c 30%,
    #c9a962 65%,
    #f7e7ce 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: bridal-shimmer 7s ease-in-out infinite;
}
```

### 1c. Add `.anniversary-gradient-text-static` (no animation — for Final CTA title)

```css
/* ── Anniversary Quiz: Gradient text — static (no animation) ── */
.anniversary-gradient-text-static {
  background: linear-gradient(
    135deg,
    #e8638c 0%,
    #c0185f 30%,
    #c9a962 70%,
    #f7e7ce 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

### 1d. Add `.anniv-hero-cta-btn` — unique animated gradient for HeroSection button

```css
/* ── Anniversary Hero CTA — unique animated gradient ── */
@keyframes anniv-hero-shimmer {
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
.anniv-hero-cta-btn {
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
  animation: anniv-hero-shimmer 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}
.anniv-hero-cta-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.12) 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.06) 60%,
    transparent 100%
  );
  pointer-events: none;
}
```

### 1e. Add `.anniv-final-cta-btn` — unique animated gradient for FinalCtaSection button

```css
/* ── Anniversary Final CTA — unique animated gradient ── */
@keyframes anniv-final-shimmer {
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
.anniv-final-cta-btn {
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
  animation: anniv-final-shimmer 8s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}
.anniv-final-cta-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.05) 60%,
    transparent 100%
  );
  pointer-events: none;
}
```

### 1f. Add `.anniv-step1-cta-btn` — unique animated gradient for Step 1 "Continue to Quiz Builder"

```css
/* ── Anniversary Step 1 CTA — unique animated gradient ── */
@keyframes anniv-step1-shimmer {
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
.anniv-step1-cta-btn {
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
  animation: anniv-step1-shimmer 7s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  border: 1.5px solid rgba(201, 169, 98, 0.55);
  box-shadow:
    0 4px 20px rgba(192, 24, 95, 0.2),
    inset 0 1px rgba(255, 255, 255, 0.12);
}
.anniv-step1-cta-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.08) 60%,
    transparent 100%
  );
  pointer-events: none;
}
```

### 1g. Add `.anniv-option-btn` — animated gradient for quiz option buttons (Step 2)

```css
/* ── Anniversary Quiz Option Button — animated gradient ── */
@keyframes anniv-option-shimmer {
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
.anniv-option-btn {
  background: linear-gradient(135deg, #c9a962 0%, #e8638c 50%, #c0185f 100%);
  background-size: 300% 300%;
  animation: anniv-option-shimmer 4s ease-in-out infinite;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.anniv-option-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}
```

### 1h. Add `.anniv-toggle-on` (green) and `.anniv-toggle-off` (red)

```css
/* ── Anniversary Quiz Question Toggle — Red/Green ── */
.anniv-toggle-on {
  background-color: #22c55e; /* green-500 */
}
.anniv-toggle-off {
  background-color: #ef4444; /* red-500 */
}
```

---

## Step 2: `components/anniversary/HeroSection.tsx`

### 2a. Replace button className

Current (line 210):

```tsx
className =
  "inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full cta-gradient-btn text-white font-semibold text-base tracking-wide anniversary-heartbeat-btn shadow-lg";
```

Replace with:

```tsx
className =
  "inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full anniv-hero-cta-btn text-white font-semibold text-base tracking-wide anniversary-heartbeat-btn shadow-lg";
```

**Why**: Replaces shared `cta-gradient-btn` with unique `anniv-hero-cta-btn` so this button has its own distinct animated gradient palette and animation.

---

## Step 3: `components/anniversary/FinalCtaSection.tsx`

### 3a. Change title to gradient (no animation)

Current (line 50-58):

```tsx
<motion.h2
  ...
  className="font-[--font-cormorant] text-[clamp(2rem,5vw,3.5rem)] font-semibold text-[--color-charcoal] leading-tight mb-4"
>
  Ready to surprise
  <br />
  your dearest person?
</motion.h2>
```

Replace className `text-[--color-charcoal]` with `anniversary-gradient-text-static`:

```tsx
className =
  "font-[--font-cormorant] text-[clamp(2rem,5vw,3.5rem)] font-semibold anniversary-gradient-text-static leading-tight mb-4";
```

### 3b. Replace button className

Current (line 81):

```tsx
className =
  "inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full cta-gradient-btn text-white font-semibold text-base tracking-wide anniversary-heartbeat-btn shadow-lg";
```

Replace with:

```tsx
className =
  "inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full anniv-final-cta-btn text-white font-semibold text-base tracking-wide anniversary-heartbeat-btn shadow-lg";
```

---

## Step 4: `app/(main)/wed-anniversary-wish/order/steps/step1.tsx`

### 4a. Change "Your anniversary" heading to "Your Marriage Date"

Current (line 105-106):

```tsx
<h2 className="text-base font-semibold anniversary-gradient-text">
  Your anniversary
</h2>
```

Change to:

```tsx
<h2 className="text-base font-semibold anniversary-gradient-text">
  Your Marriage Date
</h2>
```

### 4b. Make "Years together" dynamic — show years, months, days

Current (lines 18-29) — simple year calculation:

```tsx
const yearsTogether = useMemo(() => {
  if (!store.anniversaryDate) return 0;
  const anniv = new Date(store.anniversaryDate);
  const now = new Date();
  let years = now.getFullYear() - anniv.getFullYear();
  const monthDiff = now.getMonth() - anniv.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < anniv.getDate())) {
    years--;
  }
  return Math.max(0, years);
}, [store.anniversaryDate]);
```

Replace with calculation returning `{ years, months, days }`:

```tsx
const timeTogether = useMemo(() => {
  if (!store.anniversaryDate) return null;
  const anniv = new Date(store.anniversaryDate);
  const now = new Date();

  let years = now.getFullYear() - anniv.getFullYear();
  let months = now.getMonth() - anniv.getMonth();
  let days = now.getDate() - anniv.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
}, [store.anniversaryDate]);
```

Then update the display (lines 126-138):

```tsx
{
  timeTogether && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col justify-center items-center rounded-2xl bg-[--color-blush] border border-[--color-gold]/20 p-4"
    >
      <span className="text-3xl font-[var(--font-cormorant)] font-bold anniversary-gradient-text">
        {timeTogether.years}
      </span>
      <span className="text-xs anniversary-gradient-text">
        {timeTogether.years === 1 ? "year" : "years"}
      </span>
      <div className="flex gap-3 mt-1">
        <span className="text-xs anniversary-gradient-text">
          {timeTogether.months} {timeTogether.months === 1 ? "month" : "months"}
        </span>
        <span className="text-xs anniversary-gradient-text">
          {timeTogether.days} {timeTogether.days === 1 ? "day" : "days"}
        </span>
      </div>
    </motion.div>
  );
}
```

### 4c. Change all black font color to gradient

Affected elements and their changes:

| Current className                                          | New className                                   | Location                               |
| ---------------------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| `text-[--color-charcoal]/55` on step description paragraph | `anniversary-gradient-text text-xs font-normal` | Lines 62-64                            |
| `text-[--color-charcoal]/55` on "years together" label     | `anniversary-gradient-text text-xs`             | Line 134 (becomes part of new display) |
| Input labels in `PhotoUploadDropzone` (separate component) | See Step 7                                      | -                                      |

Also update the `store.updateCouple({ yearsTogether })` call to use the new structure:

- The store's `yearsTogether` field is `number`. We need to either update the store type or keep storing just years.
- **Recommendation**: Keep storing `yearsTogether` as total years for backward compatibility, use the new `timeTogether` for display only.

### 4d. Replace "Continue to Quiz Builder" button className

Current (line 186):

```tsx
className =
  "order-cta-btn inline-flex items-center gap-2 h-14 px-8 text-base font-semibold rounded-full text-white";
```

Replace with:

```tsx
className =
  "anniv-step1-cta-btn inline-flex items-center gap-2 h-14 px-8 text-base font-semibold rounded-full text-white";
```

---

## Step 5: `app/(main)/wed-anniversary-wish/order/steps/step2.tsx`

### 5a. Change all black font color to gradient

Affected elements:

| Current className                                              | New className                                   | Location   |
| -------------------------------------------------------------- | ----------------------------------------------- | ---------- |
| `text-[--color-charcoal]/55` on description `<p>`              | `anniversary-gradient-text text-xs font-normal` | Line 36-37 |
| `text-[--color-charcoal]` on question text in QuizQuestionCard | Handled separately in QuizQuestionCard          | -          |
| Various other elements in QuizQuestionCard                     | Handled separately                              | -          |

### 5b. Merge "choose your correct option" into description

Current (line 36-38):

```tsx
<p className="mt-1 text-sm text-[--color-charcoal]/55">
  Step 2 of 4 — toggle, edit, and create questions about yourself
</p>
```

Change to:

```tsx
<p className="mt-1 text-sm anniversary-gradient-text">
  Step 2 of 4 — toggle, edit, and create questions about yourself. Choose your
  correct option for each question.
</p>
```

---

## Step 6: `components/anniversary-order/QuizQuestionCard.tsx`

### 6a. Change toggle switch to red/green

Current (line 52-54):

```tsx
className={cn(
  "relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200",
  question.enabled ? "bg-[--color-magenta]" : "bg-gray-300",
)}
```

Replace `"bg-[--color-magenta]" : "bg-gray-300"` with `"anniv-toggle-on" : "anniv-toggle-off"`:

```tsx
className={cn(
  "relative shrink-0 w-10 h-6 rounded-full transition-all duration-200",
  question.enabled ? "anniv-toggle-on" : "anniv-toggle-off",
)}
```

### 6b. Give option buttons animated gradient background + show "Correct Option" text

Current (lines 149-183) — option buttons with gold/plain background:

Replace the option rendering block (lines 148-183) with:

```tsx
{
  question.options.map((opt, oi) => (
    <div key={oi} className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onUpdate(question.id, { correctAnswer: oi })}
        className={cn(
          "shrink-0 min-w-[100px] h-9 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 px-3 transition-all",
          question.correctAnswer === oi
            ? "anniv-option-btn shadow-md"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200",
        )}
        aria-label={`Mark option ${OPTION_LABELS[oi]} as correct`}
      >
        <span>{OPTION_LABELS[oi]}</span>
        {question.correctAnswer === oi && (
          <span className="text-[10px] font-semibold text-green-300">
            Correct Option
          </span>
        )}
      </button>
      <input
        type="text"
        value={opt}
        onChange={(e) => {
          const next = [...question.options];
          next[oi] = e.target.value;
          onUpdate(question.id, { options: next });
        }}
        placeholder={`Option ${OPTION_LABELS[oi]}...`}
        className={cn(
          "flex-1 px-3 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
          question.correctAnswer === oi
            ? "border-[--color-gold]/40 bg-[--color-gold]/10"
            : "border-gray-200 bg-white/60 focus:ring-[--color-gold]/30 focus:border-[--color-gold]",
        )}
      />
    </div>
  ));
}
```

**Key changes**:

1. Option button: `shrink-0 w-7 h-7` → `shrink-0 min-w-[100px] h-9 px-3` to accommodate text
2. When selected: applies `anniv-option-btn` (animated gradient) instead of `bg-[--color-gold]`
3. When selected: appends `"Correct Option"` text in `text-green-300` after the letter
4. The `correct-answer-badge` class is removed (replaced by `anniv-option-btn`)

---

## Step 7: `components/anniversary-order/PhotoUploadDropzone.tsx`

### 7a. Replace Image component with Canvas for preview

Current (lines 93-127) — uses `next/image` with `Image` component:

Replace the preview block to use a `<canvas>` element:

```tsx
{preview ? (
  <motion.div
    key="preview"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="relative w-full h-full min-h-[140px] flex items-center justify-center"
  >
    <canvas
      ref={canvasRef}
      className="max-w-full max-h-full rounded-xl object-contain"
    />
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleRemove();
      }}
      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
      aria-label="Remove photo"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
      </svg>
    </button>
  </motion.div>
) : (...)}
```

And add a `useRef` + `useEffect` to draw the image onto the canvas:

```tsx
import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";

// Inside component:
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  if (!preview || !canvasRef.current) return;
  const img = new window.Image();
  img.onload = () => {
    const canvas = canvasRef.current!;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }
  };
  img.src = preview;
}, [preview]);
```

**Why**: The user specifically requested that the photo preview "must accept the canvas as the original photo within the frame." This ensures the photo is rendered via canvas element, preserving the original dimensions within the frame container.

---

## Step 8: Verify No Black/White Button Backgrounds

Audit all buttons across the modified files:

| Component             | Button                              | Current Background                       | Action                 |
| --------------------- | ----------------------------------- | ---------------------------------------- | ---------------------- |
| `HeroSection.tsx`     | "Create Your Anniversary Quiz ₹399" | `cta-gradient-btn` (gradient, OK)        | Already gradient       |
| `FinalCtaSection.tsx` | "Start Building Your Quiz"          | `cta-gradient-btn` (gradient, OK)        | Already gradient       |
| `Step1`               | "Continue to Quiz Builder"          | `order-cta-btn` (gradient, OK)           | Already gradient       |
| `Step2`               | "Back" button                       | `variant="secondary"` (Button component) | Check if white/black   |
| `Step2`               | "Continue to Theme"                 | `<Button>` component                     | Check Button component |
| `Step4`               | "Pay ₹399 & Create Quiz"            | `cta-gradient-btn` (gradient, OK)        | Already gradient       |

**Note**: The `<Button>` component with `variant="secondary"` may use white/black backgrounds. Since the user specified "on /wed-anniversary-wish", only check the `wed-anniversary-wish` related pages, not the entire app. The secondary buttons ("Back") and `<Button>` component should have their backgrounds changed to gradient if they currently use black/white.

---

## Summary of All CSS Classes to Add to `globals.css`

| Class                               | Type          | Animation                                   |
| ----------------------------------- | ------------- | ------------------------------------------- |
| `.anniversary-gradient-text`        | Text gradient | `bridal-shimmer 6s`                         |
| `.love-story-gradient`              | Text gradient | `bridal-shimmer 7s`                         |
| `.anniversary-gradient-text-static` | Text gradient | None                                        |
| `.anniv-hero-cta-btn`               | Button bg     | `anniv-hero-shimmer 6s` (4-direction sweep) |
| `.anniv-final-cta-btn`              | Button bg     | `anniv-final-shimmer 8s` (cross-fade)       |
| `.anniv-step1-cta-btn`              | Button bg     | `anniv-step1-shimmer 7s` (triangular)       |
| `.anniv-option-btn`                 | Button bg     | `anniv-option-shimmer 4s` (diagonal)        |
| `.anniv-toggle-on`                  | Toggle bg     | None (green `#22c55e`)                      |
| `.anniv-toggle-off`                 | Toggle bg     | None (red `#ef4444`)                        |

---

## Files NOT Modified

- `app/globals.css` — only ADDING new classes, not modifying existing ones
- `lib/anniversary-constants.ts` — no changes
- `hooks/useAnniversaryOrderStore.ts` — no changes (keep storing `yearsTogether` as number)
- `components/anniversary/VisualShowcase.tsx` — not in scope
- `components/anniversary/HowItWorks.tsx` — not in scope
- `components/anniversary/SocialProof.tsx` — not in scope
- `components/anniversary-order/OrderStepper.tsx` — not in scope
- `Step3`, `Step4` — not in scope per user's strict instructions
- `app/(main)/wed-anniversary-wish/order/layout.tsx` — not in scope

---

## Risk Assessment

| Risk                                                                            | Mitigation                                                         |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Missing `.anniversary-gradient-text` class means gradient text currently broken | Adding it to globals.css fixes all existing references             |
| Dynamic date calculation may break existing store interface                     | Keep `yearsTogether` as number in store; only change display logic |
| Canvas-based preview loses `next/image` optimization                            | Acceptable — user explicitly requested canvas-based rendering      |
| Toggle changing from magenta/gray to red/green is a visual breaking change      | User explicitly requested this                                     |
