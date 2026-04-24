# Plan: Update Anniversary Order Stepper Colors & Animation

## Overview

Update the `OrderStepper` component at [`components/anniversary-order/OrderStepper.tsx`](components/anniversary-order/OrderStepper.tsx) with:

1. New step-specific gradient colors as specified by the user
2. Staggered entrance animation for the step number indicators (1, 2, 3, 4)

---

## Task 1: Update Step Color Gradients

### Current Colors (in `STEP_COLORS` array)

| Step | Label         | Current Gradient                    |
| ---- | ------------- | ----------------------------------- |
| 1    | Couple        | `--color-magenta` → `--color-gold`  |
| 2    | Quiz          | `--color-gold` → `#d4756c`          |
| 3    | Theme & Music | `#e8638c` → `--color-magenta`       |
| 4    | Message       | `--color-magenta` → `--color-blush` |

### New Colors (user-specified)

| Step | Label         | New Gradient                                |
| ---- | ------------- | ------------------------------------------- |
| 1    | Couple        | `#F0CB35` (gold) → `#C02425` (red)          |
| 2    | Quiz          | `#8DC26F` (light green) → `#76b852` (green) |
| 3    | Theme & Music | `#dc2430` (red) → `#7b4397` (purple)        |
| 4    | Message       | `#185a9d` (blue) → `#43cea2` (teal)         |

### Changes needed in `STEP_COLORS`

Each color config has 4 Tailwind class fields:

- `circleBg` — background gradient for the step circle
- `ringColor` — ring glow for the current step
- `labelGradient` — gradient for the step label text
- `connectorBg` — gradient for the connector line fill

Since the new colors are specific hex values not in the CSS custom property palette, we'll need to use inline `style` objects (via Framer Motion `motion.div` `style` prop) OR define custom CSS classes. The cleanest approach: add a `style` field to `StepColorConfig` and use it for gradient backgrounds where Tailwind arbitrary values aren't sufficient, OR switch to using Tailwind arbitrary value syntax like `bg-[linear-gradient(to_right,#F0CB35,#C02425)]`.

**Recommended approach:** Since Tailwind v4 with `@import "tailwindcss"` supports arbitrary values, use inline style objects for gradients that need specific direction control, since the existing Tailwind `bg-gradient-to-r` approach combined with arbitrary color values may not support multi-stop gradients cleanly.

**Better approach:** Keep using Tailwind's gradient direction classes (`bg-gradient-to-r`, `bg-gradient-to-br`) but use arbitrary color values directly:

- Step 1: `bg-gradient-to-r from-[#F0CB35] to-[#C02425]`
- Step 2: `bg-gradient-to-r from-[#8DC26F] to-[#76b852]`
- Step 3: `bg-gradient-to-r from-[#dc2430] to-[#7b4397]`
- Step 4: `bg-gradient-to-r from-[#185a9d] to-[#43cea2]`

---

## Task 2: Add Staggered Entrance Animation

### Requirements

- Numbers 1, 2, 3, 4 animate in sequentially when the page loads
- Animation: fade in + scale up
- Stagger delay: ~100ms between each step indicator

### Implementation

- Use Framer Motion's `motion.div` with `initial` / `animate` states
- Add a `staggerChildren` variant on the parent `<ol>` element
- Each step `<li>` gets `variants` with `hidden` → `visible` states
- Animation: `opacity: 0, scale: 0.6` → `opacity: 1, scale: 1`
- Stagger delay: `0.1s` per child
- Only animate on initial mount (not on step changes)

### Key Considerations

- The current animation on the active step already has a `scale: 1.08` pulse — ensure staggered entrance doesn't conflict
- The staggered entrance should only play once on page load, not on every step navigation
- Use `useAnimationControls` or `whileInView` with `once: true` to control this

---

## Files to Modify

| File                                                                                             | Changes                                                                                   |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [`components/anniversary-order/OrderStepper.tsx`](components/anniversary-order/OrderStepper.tsx) | Update `STEP_COLORS` gradient values; add staggered entrance animation to step indicators |

---

## What NOT to change

- The `StepColorConfig` interface structure (keep same fields)
- The step page content files (`step1.tsx` through `step4.tsx`)
- Global CSS gradient classes (`anniversary-gradient-text`, `love-story-gradient`)
- The `OrderStepperProps` interface
- The connector line animation logic
- Any other components or pages
