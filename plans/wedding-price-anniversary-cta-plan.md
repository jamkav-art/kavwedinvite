# Plan: Price Update + Anniversary CTA Additions

## Overview

Three targeted changes to the WedInviter app:

1. **Price change**: ₹699 → ₹399 for wedding invitations (everywhere)
2. **Hero section**: Add Wedding Anniversary CTA button in home hero
3. **Header**: Add Wedding Anniversary button alongside existing CTA

---

## Change 1: ₹699 → ₹399 Price Update (Wedding Invitation)

### Core constants (source of truth)

| File                                   | Line(s) | Current                                   | New                                       |
| -------------------------------------- | ------- | ----------------------------------------- | ----------------------------------------- |
| [`lib/constants.ts`](lib/constants.ts) | 2,3     | `basePrice: 699`, `basePricePaise: 69900` | `basePrice: 399`, `basePricePaise: 39900` |

### Backend / Payment API

| File                                                                       | Line(s) | Current                      | New              |
| -------------------------------------------------------------------------- | ------- | ---------------------------- | ---------------- |
| [`app/api/razorpay/create/route.ts`](app/api/razorpay/create/route.ts)     | 21      | `amount !== 699` validation  | `amount !== 399` |
| [`hooks/useRazorpay.ts`](hooks/useRazorpay.ts)                             | 77      | `amount: 699`                | `amount: 399`    |
| [`hooks/useRazorpay.ts`](hooks/useRazorpay.ts)                             | 94      | `69900` (fallback paise)     | `39900`          |
| [`components/order/AnimatedPrice.tsx`](components/order/AnimatedPrice.tsx) | 11      | `price = 699` (default prop) | `price = 399`    |

### UI Components — Hero, Pricing, Header, Order flow

| File                                                                                       | Line(s) | Current text                   | New text               |
| ------------------------------------------------------------------------------------------ | ------- | ------------------------------ | ---------------------- |
| [`components/home/Hero.tsx`](components/home/Hero.tsx)                                     | 242     | `All for just ₹699`            | `All for just ₹399`    |
| [`components/home/Hero.tsx`](components/home/Hero.tsx)                                     | 260     | `₹699` (badge on CTA)          | `₹399`                 |
| [`components/home/Pricing.tsx`](components/home/Pricing.tsx)                               | 48      | Comment `₹699 every 4 seconds` | `₹399 every 4 seconds` |
| [`components/home/Pricing.tsx`](components/home/Pricing.tsx)                               | 105     | `699` (price digits)           | `399`                  |
| [`components/home/Pricing.tsx`](components/home/Pricing.tsx)                               | 155     | `Get Started — ₹699`           | `Get Started — ₹399`   |
| [`components/layout/Header.tsx`](components/layout/Header.tsx)                             | 92      | `Create Invite — ₹699`         | `Create Invite — ₹399` |
| [`components/layout/Header.tsx`](components/layout/Header.tsx)                             | 159     | `Create Invite — ₹699`         | `Create Invite — ₹399` |
| [`components/order/PaymentButton.tsx`](components/order/PaymentButton.tsx)                 | 25      | `'Pay ₹699 Securely'`          | `'Pay ₹399 Securely'`  |
| [`components/order/PaymentButtonEnhanced.tsx`](components/order/PaymentButtonEnhanced.tsx) | 144     | `₹699`                         | `₹399`                 |
| [`app/order/layout.tsx`](app/order/layout.tsx)                                             | 26      | `₹699 one-time`                | `₹399 one-time`        |

### SEO / Metadata

| File                                                                             | Line(s)            | Change type                                        |
| -------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------- |
| [`app/layout.tsx`](app/layout.tsx)                                               | 98, 116, 131       | Replace `₹699` → `₹399` in 3 metadata descriptions |
| [`app/page.tsx`](app/page.tsx)                                                   | 12                 | Replace `₹699` → `₹399` in description             |
| [`app/(main)/templates/page.tsx`](<app/(main)/templates/page.tsx>)               | 9, 16, 24, 44, 128 | Replace all `₹699` → `₹399` (5 occurrences)        |
| [`components/contact/ContactContent.tsx`](components/contact/ContactContent.tsx) | 37, 335            | Replace `₹699` → `₹399` (FAQ + CTA)                |
| [`lib/seo.ts`](lib/seo.ts)                                                       | 8                  | Replace `₹699` → `₹399` in seo description         |

**Total: ~25 occurrences across 14 files.** Each change is a simple string replacement of `₹699` → `₹399` or `699` → `399` (in numeric contexts). No structural changes.

---

## Change 2: Wedding Anniversary CTA in Hero Section

**File:** [`components/home/Hero.tsx`](components/home/Hero.tsx)

### Current Hero CTA section (lines 245-269):

```tsx
<div
  data-gsap="reveal"
  className="flex flex-col sm:flex-row items-center justify-center gap-4"
>
  <Link href="/order" className="...">
    Create Your Invite
    <motion.span className="...">₹399</motion.span>
  </Link>
  <Link href="/templates" className="...">
    Browse Templates →
  </Link>
</div>
```

### Change: Add a third CTA for Wedding Anniversary

Insert a new `<Link>` after the "Browse Templates" link, pointing to `/wed-anniversary-wish`.

**Design intent:** A premium, romantic gradient button with a heart icon that matches the anniversary theme. Use `anniversary-gradient-text` / `cta-gradient-btn` classes already defined in the global CSS.

**Proposed button:**

```tsx
<Link
  href="/wed-anniversary-wish"
  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full cta-gradient-btn text-white font-semibold text-base tracking-wide shadow-lg hover:scale-[1.03] transition-all duration-300"
>
  <span>💝</span>
  Wedding Anniversary
  <span className="inline-flex items-center justify-center bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
    Quiz
  </span>
</Link>
```

**Layout strategy:** The existing flex container `flex-col sm:flex-row` will naturally accommodate 3 buttons. On mobile they stack vertically, on desktop they're in a row. If spacing feels tight, we can adjust `gap-4` to `gap-3`.

**No changes to:**

- Existing button links or hrefs
- Hero structure or animation logic
- The `data-gsap="reveal"` wrapper

---

## Change 3: Wedding Anniversary Button in Header

**File:** [`components/layout/Header.tsx`](components/layout/Header.tsx)

### Current state:

- Desktop nav has 4 links: Home, Templates, Pricing, Contact
- Desktop CTA: A single "Create Invite — ₹399" button (the `motion.div` wrapper at lines 79-94)
- Mobile menu has same 4 nav links + a bottom CTA "Create Invite — ₹399"

### Change: Add "Wedding Anniversary" CTA button alongside existing CTA

**Desktop approach:** Add a second CTA button next to the existing one inside the `flex items-center gap-3` div (line 78). The existing CTA is wrapped in a `motion.div`, so we add another similar `motion.div` with a different gradient style.

**Mobile approach:** Add a second CTA link in the mobile nav menu below the existing "Create Invite" button.

**Proposed desktop button (insert after the existing CTA motion.div):**

```tsx
<motion.div
  className="hidden md:inline-flex"
  initial={{ filter: "drop-shadow(0 0px 0px rgba(192,24,95,0))" }}
  whileHover={{
    scale: 1.05,
    filter: "drop-shadow(0 4px 22px rgba(192,24,95,0.5))",
  }}
  transition={{ type: "spring", stiffness: 400, damping: 18 }}
>
  <Link
    href="/wed-anniversary-wish"
    className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-[--color-gold]/40 text-[--color-charcoal] text-sm font-semibold tracking-wide hover:bg-[--color-gold]/10 transition-all duration-300"
  >
    <span className="text-xs">💝</span>
    Anniversary
  </Link>
</motion.div>
```

**Proposed mobile CTA (insert after the existing mobile CTA link at line 160):**

```tsx
<Link
  href="/wed-anniversary-wish"
  className="flex items-center justify-center gap-2 h-12 rounded-full border border-[--color-gold]/40 text-[--color-charcoal] font-semibold"
  onClick={() => setMenuOpen(false)}
>
  <span>💝</span>
  Anniversary Quiz — ₹399
</Link>
```

**No changes to:**

- Existing nav links array or their hrefs
- Existing CTA button styling or behavior
- Logo or header structure

---

## Execution Order

1. **Price update first** (14 files, simple find+replace) — ensures no ₹699 remains
2. **Hero CTA addition** — single file change
3. **Header CTA addition** — single file change

Each change is isolated and does not depend on the others, so they could be done in any order. However, doing price first avoids accidentally reverting or missing price references.

## Files NOT modified (for safety)

- `app/(main)/wed-anniversary-wish/*` — Anniversary page structure remains untouched
- `components/anniversary/*` — Anniversary components unchanged
- `hooks/useAnniversaryOrderStore.ts` — Anniversary store unchanged
- `hooks/useAnniversaryPayment.ts` — Anniversary payment unchanged (already uses `ANNIVERSARY_PRICE` constant)
- `lib/anniversary-constants.ts` — Already has correct `₹399` value
- `app/api/razorpay/webhook/route.ts` — No hardcoded price
- `app/api/razorpay/verify/route.ts` — No hardcoded price
- `app/order/success/page.tsx` — No price display
- Any `.sql`, `.js`, `.json`, config files
