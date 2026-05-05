# 🎨 Anniversary Quiz — Mega UI Enhancement Plan

> **Goal:** Transform the post-payment quiz experience into a world-class, colorful, cheerful, and highly engaging animated UI without touching payment flow, backend functions, or business logic.

---

## 🔍 Overview of Changes (6 Major Updates)

| #   | Update                                                                                                               | Files to Modify/Create                                                                                                                                                                                                                                                            | Complexity |
| --- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | Dynamic OG Image using user's uploaded photo                                                                         | [`app/quiz/[id]/opengraph-image.tsx`](app/quiz/[id]/opengraph-image.tsx)                                                                                                                                                                                                          | Medium     |
| 2   | 4-second "Love Opening" scene with golden petals, gradient text, animated background                                 | **New:** [`components/anniversary-quiz/QuizLoveOpening.tsx`](components/anniversary-quiz/QuizLoveOpening.tsx) + CSS in [`app/globals.css`](app/globals.css) + modify [`app/quiz/[id]/QuizPageContent.client.tsx`](app/quiz/[id]/QuizPageContent.client.tsx)                       | High       |
| 3   | Colorful quiz pages — animated backgrounds, gradient option buttons, correct/wrong answer effects, 3D question cards | Modify [`components/anniversary-quiz/QuizSlideQuestion.tsx`](components/anniversary-quiz/QuizSlideQuestion.tsx) + CSS in [`app/globals.css`](app/globals.css) + **New:** [`components/anniversary-quiz/AnswerFeedbackSVG.tsx`](components/anniversary-quiz/AnswerFeedbackSVG.tsx) | High       |
| 4   | Soul Sync score formula change: base 80% + 20% from correct answers                                                  | Modify [`lib/anniversary-scoring.ts`](lib/anniversary-scoring.ts)                                                                                                                                                                                                                 | Low        |
| 5   | University Graduation Certificate design below existing Soul Sync fields                                             | Modify [`components/anniversary-quiz/SoulCertificate.tsx`](components/anniversary-quiz/SoulCertificate.tsx)                                                                                                                                                                       | Medium     |
| 6   | Add "Challenge [your name]" button (dynamic name)                                                                    | Modify [`components/anniversary-quiz/ChallengePartnerCTA.tsx`](components/anniversary-quiz/ChallengePartnerCTA.tsx)                                                                                                                                                               | Low        |

---

## 1️⃣ Dynamic OG Image with User Photo

### Current State

[`app/quiz/[id]/opengraph-image.tsx`](app/quiz/[id]/opengraph-image.tsx) generates a generic OG image with couple names and decorative borders. It already fetches `couple_photo_url` from the DB but **does not use it**.

### Changes Required

1. Modify the `Image` function to check `couple_photo_url` and use it as the main visual
2. If photo exists: show the couple photo as a circular/rounded image with gradient border
3. If no photo: fall back to current generic design
4. Overlay text (couple names, "Soul-Sync Quiz") on top or below the photo

### Implementation Details

```tsx
// In opengraph-image.tsx
const hasPhoto = quiz?.couple_photo_url;

return new ImageResponse(
  <div style={{ /* full-size container */ }}>
    {hasPhoto ? (
      <img
        src={quiz.couple_photo_url}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    ) : (
      /* fallback generic design */
    )}
    {/* Gradient overlay for text readability */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
    {/* Names overlay */}
  </div>
);
```

---

## 2️⃣ Love Opening Scene (4-Second Animated Splash)

### Current State

[`QuizEntranceScreen.tsx`](components/anniversary-quiz/QuizEntranceScreen.tsx) shows a static entrance with couple photo, "How well do you know [name]?" text, and a start button.

### New Component: [`QuizLoveOpening.tsx`](components/anniversary-quiz/QuizLoveOpening.tsx)

This component replaces the entrance screen entirely. It auto-plays for **4 seconds** then transitions to quiz.

#### Visual Design

**A. Background**

- Animated gradient background shifting through warm love colors (blush → rose → gold → lavender)
- Feather/flowers animation floating in the background at low opacity (`opacity: 0.15`)
- Use CSS keyframes for smooth color cycling

**B. Golden Petals Effect**

- Petals spawn from the **center of the screen** and burst outward in all directions
- Each petal has a unique color: gold, pink, rose, magenta, champagne, deep gold
- Use [`framer-motion`] with staggered animations
- 30-40 petals generated randomly, each with:
  - Random rotation
  - Random drift direction
  - Random fall duration (2-4s)
  - Fade in from center, fade out at edges
- Continuous animation loop

**C. Text Content (Center Screen)**

```
"Hey [partnerName] 💕"          ← elegant serif font, subtle gold
"[yourName] told..."            ← smaller, italic, champagne color
"I Love You"                    ← LARGE, animated gradient text (gold → rose → magenta → gold shimmer)
❤️ (smiling love emoji)          ← zoom in/out animation (2s cycle)
```

**D. Typography & Effects**

- "Hey [partnerName] 💕": [`font-serif`], warm white, staggered fade-in
- "[yourName] told...": italic, smaller, soft gold
- **"I Love You"**: Use [`anniversary-gradient-text`] class (already exists in [`app/globals.css`](app/globals.css)) with animated shimmer
- ❤️ emoji: `scale: [1, 1.3, 1]` repeated animation with `duration: 2s`

**E. Auto-Transition Logic**

- `useEffect` with `setTimeout` for 4000ms
- After 4s: call `onComplete` prop
- Transition effect: cheerful "burst" — scale up + fade out opening, then scale in quiz

### Flow Integration

Modify [`QuizPageContent.client.tsx`](app/quiz/[id]/QuizPageContent.client.tsx):

```typescript
type QuizPhase = "love-opening" | "quiz" | "loading" | "certificate";
//                                    ↑ changed from "entrance"
```

Replace [`QuizEntranceScreen`] with [`QuizLoveOpening`] for the "love-opening" phase.

---

## 3️⃣ Colorful Quiz Pages — Enhanced UI

### Current State

[`QuizSlideQuestion.tsx`](components/anniversary-quiz/QuizSlideQuestion.tsx) has a simple white background with gold/rose accent buttons. Options are plain with minimal animation.

### Changes to [`QuizSlideQuestion.tsx`](components/anniversary-quiz/QuizSlideQuestion.tsx)

**A. Animated Background**

- Replace static gradient with animated background using CSS
- Floating hearts, sparkles, or soft orb animations at low opacity
- Use the existing [`anniversary-bg-animated`] patterns or create a new love-themed animated background class

**B. 3D Question Card Effect**

- Wrap question text in a card with:
  - `perspective: 1000px`
  - Gentle floating animation (translateY oscillation)
  - Subtle 3D rotation on hover (`rotateX(2deg) rotateY(2deg)`)
  - Glassmorphism background with blur
  - Gradient border (animated)

```css
@keyframes question-card-float {
  0%,
  100% {
    transform: perspective(800px) rotateX(1deg) translateY(0);
  }
  50% {
    transform: perspective(800px) rotateX(-1deg) translateY(-8px);
  }
}
```

**C. Option Buttons — Individual Gradient Animations**

Each of the 3 option buttons gets a **different** animated gradient:

| Button      | Gradient Direction | Colors                | Animation Speed |
| ----------- | ------------------ | --------------------- | --------------- |
| A (index 0) | Left-to-right      | Gold → Rose → Magenta | 4s              |
| B (index 1) | Right-to-left      | Rose → Magenta → Gold | 5s              |
| C (index 2) | Diagonal           | Magenta → Gold → Rose | 4.5s            |

Each button has:

- Rounded-xl with glassmorphism
- Animated gradient background with different direction
- Hover scale effect (1.02)
- Border glow on hover
- Letter indicator (A, B, C) in a colored circle

**D. Answer Feedback Effects**

When user selects an option:

| Scenario          | Effect                                                                        | Duration | SVG                                       |
| ----------------- | ----------------------------------------------------------------------------- | -------- | ----------------------------------------- |
| ✅ Correct Answer | Golden petals burst from center + happy SVG animation + green glow on button  | 1.5s     | Smiling heart/love face SVG with sparkles |
| ❌ Wrong Answer   | Soft sad SVG animation (coded) + gentle red tint + loving sad emoji animation | 1.5s     | Sad but cute love-coded SVG face          |

**New Component: [`AnswerFeedbackSVG.tsx`](components/anniversary-quiz/AnswerFeedbackSVG.tsx)**

```tsx
// Props: type: 'correct' | 'wrong'
// Renders coded SVG animations instead of emoji strings
// Correct: heart with sparkles, smiling face with love eyes
// Wrong: heart with gentle crack (lovingly sad), soft tear
```

**E. Auto-Advance Logic**

- Keep existing 600ms delay + 2s suspense
- Add feedback animation during the delay

---

## 4️⃣ Soul Sync Score — Base 80% Formula

### Current State

[`lib/anniversary-scoring.ts`](lib/anniversary-scoring.ts#L69-L70) calculates:

```typescript
const soul_percentage =
  totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0;
```

This can produce scores from 0-100%.

### New Formula

```typescript
// Base 80% guaranteed + 20% based on actual accuracy
const basePercentage = 80;
const variablePercentage =
  totalCount > 0 ? Math.round((totalCorrect / totalCount) * 20) : 0;
const soul_percentage = Math.min(100, basePercentage + variablePercentage);
```

**Effect:** Minimum score is 80% (even with 0 correct), maximum is 100% (all correct).

Example mappings:

- 0/10 correct → 80%
- 5/10 correct → 80 + 10 = 90%
- 8/10 correct → 80 + 16 = 96%
- 10/10 correct → 80 + 20 = 100%

**CRITICAL:** The [`SCORE_TIERS`](types/anniversary-quiz.types.ts#L113-L142) ranges also need updating since the minimum is now 80%:

| Tier                | Current Range | New Range |
| ------------------- | ------------- | --------- |
| Beautiful Strangers | 0-40          | 80-85     |
| Twin Flames         | 41-75         | 86-90     |
| Architects          | 76-99         | 91-99     |
| Unified Soul        | 100           | 100       |

This ensures all tiers are still reachable and meaningful.

---

## 5️⃣ University Graduation Certificate Design

### Current State

[`SoulCertificate.tsx`](components/anniversary-quiz/SoulCertificate.tsx) shows a score card with percentage circle, tier badge, pattern breakdown bars, and challenge CTA. [`CertificateBreakdown.tsx`](components/anniversary-quiz/CertificateBreakdown.tsx) shows category bars.

### Changes to [`SoulCertificate.tsx`](components/anniversary-quiz/SoulCertificate.tsx)

**A. Keep existing Soul Sync fields** (score circle, tier, pattern breakdown, correct count)
**B. Make all existing fields more colorful:**

- Score circle: Use multi-color gradient ring (gold → rose → magenta → purple)
- Pattern breakdown bars: Each category gets a **unique gradient color** instead of all gold-rose:
  - Nostalgia: `gold → peach`
  - Playful: `rose → magenta`
  - Soul: `purple → magenta`
  - Discovery: `teal → gold`
  - Future: `gold → coral`

**C. Add University Graduation Certificate Design** (below existing fields, after dividing line)

#### Design Specifications

```
┌─────────────────────────────────────────┐
│  🎓 SOUL-SYNC CERTIFICATE 🎓            │
│                                         │
│  University of Souls                    │
│  wedinviter.wasleen.com                 │
│                                         │
│  ──── Certificate Presented To ────     │
│                                         │
│     [Your Name] ❤️ [Partner Name]       │
│                                         │
│  For the successful completion of the    │
│  sacred Soul-Sync quiz — a journey of   │
│  love, laughter, and deep connection.   │
│                                         │
│  "Love is not about how many days,      │
│   months, or years you've been together.│
│   It's about how much you love each     │
│   other every single day."              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Signature                     │   │
│  │  ── Soul Sync Chancellor ──    │   │
│  │  (beautiful cursive signature) │   │
│  │                                 │   │
│  │  ── President, University      │   │
│  │      of Souls ──               │   │
│  │  (beautiful cursive signature) │   │
│  └─────────────────────────────────┘  │
│                                         │
│  🎉 Soul Score: 96% | Tier: Architects  │
└─────────────────────────────────────────┘
```

**Visual Elements:**

- Certificate has a **paper/parchment background** with subtle texture
- **Gold decorative border** with corner ornaments
- University seal/crest emoji (🎓, ✨, 💫)
- Signatures: Use SVG cursive paths to create beautiful-looking signatures
  - "Soul Sync Chancellor" — elegant looping script
  - "President of University of Souls" — formal roundhand style
- Content text should be warm, funny, and heartwarming — making the reader smile

**Suggested Certificate Content:**

> For the successful completion of the sacred Soul-Sync Quiz — a journey of love, laughter, midnight snacks, inside jokes, and proving once again that you really _do_ know what's in their heart (or at least you're getting warmer).
>
> May your love continue to grow, your arguments stay silly, and your partner never finds out you guessed half of these answers.
>
> _"Love is not about how many days, months, or years you've been together. It's about how much you love each other every single day."_

---

## 6️⃣ Challenge Partner Button Enhancement

### Current State

[`ChallengePartnerCTA.tsx`](components/anniversary-quiz/ChallengePartnerCTA.tsx) has:

- "Challenge [coupleName2]" button (challenges the partner to take quiz)
- Copy Link button
- WhatsApp Share button

### Changes

1. **Keep all existing buttons** as they are
2. **Add new button:** "Challenge [yourName] 🔄" (where `yourName` = `coupleName1`)
   - This button links to the main anniversary quiz creation page: [`/wed-anniversary-wish`](<app/(main)/wed-anniversary-wish/page.tsx>)
   - Purpose: Let the quiz taker create their OWN quiz to challenge back
   - Style: Animated gradient similar to existing buttons but distinct color

```tsx
<Link href="/wed-anniversary-wish" target="_blank">
  <motion.button className="...">Challenge {coupleName1} 🔄</motion.button>
</Link>
```

3. Update component props to accept `coupleName1` — it already does via existing interface.

---

## 📁 Files Summary

### Files to Create (3 new)

| File                                                                                                             | Purpose                                                 |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [`components/anniversary-quiz/QuizLoveOpening.tsx`](components/anniversary-quiz/QuizLoveOpening.tsx)             | 4-second animated love opening scene with golden petals |
| [`components/anniversary-quiz/AnswerFeedbackSVG.tsx`](components/anniversary-quiz/AnswerFeedbackSVG.tsx)         | Coded SVG animations for correct/wrong answer feedback  |
| [`components/anniversary-quiz/UniversityCertificate.tsx`](components/anniversary-quiz/UniversityCertificate.tsx) | University graduation style certificate design          |

### Files to Modify (7 existing)

| File                                                                                                         | Changes                                                                                      |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| [`app/quiz/[id]/opengraph-image.tsx`](app/quiz/[id]/opengraph-image.tsx)                                     | Use `couple_photo_url` as OG image                                                           |
| [`app/quiz/[id]/QuizPageContent.client.tsx`](app/quiz/[id]/QuizPageContent.client.tsx)                       | Add "love-opening" phase, replace EntranceScreen with LoveOpening                            |
| [`components/anniversary-quiz/QuizSlideQuestion.tsx`](components/anniversary-quiz/QuizSlideQuestion.tsx)     | Animated backgrounds, 3D question cards, unique gradient per option button, feedback effects |
| [`lib/anniversary-scoring.ts`](lib/anniversary-scoring.ts)                                                   | Base 80% + 20% variable scoring                                                              |
| [`types/anniversary-quiz.types.ts`](types/anniversary-quiz.types.ts)                                         | Update [`SCORE_TIERS`] ranges                                                                |
| [`components/anniversary-quiz/SoulCertificate.tsx`](components/anniversary-quiz/SoulCertificate.tsx)         | Colorful fields + add University Certificate                                                 |
| [`components/anniversary-quiz/ChallengePartnerCTA.tsx`](components/anniversary-quiz/ChallengePartnerCTA.tsx) | Add "Challenge [coupleName1]" button                                                         |
| [`app/globals.css`](app/globals.css)                                                                         | Add new CSS animations (petal burst, option gradients, 3D card float, feedback SVGs)         |

---

## 🧩 Data Flow Diagram

```
User uploads photo in wizard
       ↓
Payment → Quiz Session created (photo_url stored in DB)
       ↓
Success Page → User shares /quiz/[invite_id] link
       ↓
Recipient opens link
       ↓
OG Image (shows user's uploaded photo)
       ↓
QuizPageContent.client.tsx
       ↓
[Phase: love-opening] ← NEW
  → QuizLoveOpening (4s auto-play)
  → Golden petals, gradient "I Love You", animated bg
       ↓ auto-transition (4s)
[Phase: quiz]
  → QuizSlideQuestion (enhanced)
  → Animated background, 3D cards, gradient options
  → Correct: golden petals + happy SVG
  → Wrong: sad SVG effect
       ↓ all answered
[Phase: loading]
  → QuizCompletionLoader (existing)
       ↓ 1.2s
[Phase: certificate]
  → SoulCertificate (existing fields enhanced)
  → + UniversityCertificate (new)
  → + ChallengePartnerCTA (enhanced with new button)
```

---

## 🎨 CSS Animation Classes to Add

Add these to [`app/globals.css`](app/globals.css):

```css
/* ── Golden Petal Burst ── */
@keyframes petal-burst {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--drift-x), var(--drift-y)) scale(1)
      rotate(var(--rotation));
    opacity: 0;
  }
}

/* ── Love Opening Text Fade ── */
@keyframes love-text-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* ── 3D Question Card Float ── */
@keyframes card-float {
  0%,
  100% {
    transform: perspective(800px) rotateX(1deg) translateY(0);
  }
  50% {
    transform: perspective(800px) rotateX(-1deg) translateY(-10px);
  }
}

/* ── Option Button Gradients ── */
.option-btn-a {
  background: linear-gradient(135deg, #c9a962, #e8638c, #c0185f);
  background-size: 300% 300%;
  animation: option-shimmer-a 4s ease infinite;
}
.option-btn-b {
  background: linear-gradient(135deg, #e8638c, #c0185f, #c9a962);
  background-size: 300% 300%;
  animation: option-shimmer-b 5s ease infinite;
}
.option-btn-c {
  background: linear-gradient(135deg, #c0185f, #c9a962, #e8638c);
  background-size: 300% 300%;
  animation: option-shimmer-c 4.5s ease infinite;
}

/* ── Love Emoji Zoom ── */
@keyframes love-emoji-zoom {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

/* ── Animated Background for Quiz ── */
@keyframes quiz-bg-shift {
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
```

---

## ⚠️ Constraints & Guardrails

1. **Do NOT modify** any payment flow files:
   - [`lib/razorpay.ts`](lib/razorpay.ts)
   - [`hooks/useAnniversaryPayment.ts`](hooks/useAnniversaryPayment.ts)
   - [`app/api/razorpay/verify/route.ts`](app/api/razorpay/verify/route.ts)
   - [`app/api/razorpay/webhook/route.ts`](app/api/razorpay/webhook/route.ts)
   - [`components/anniversary-wizard/SlideReviewPay.tsx`](components/anniversary-wizard/SlideReviewPay.tsx)

2. **Do NOT modify** any server actions or API routes that handle quiz creation/submission logic:
   - [`lib/anniversary-quiz.ts`](lib/anniversary-quiz.ts) — only UI-side changes
   - [`app/api/quiz/random-questions/route.ts`](app/api/quiz/random-questions/route.ts)

3. **Do NOT modify** database schemas or migrations

4. **Do NOT modify** the wizard/order flow files:
   - [`components/anniversary-wizard/`](components/anniversary-wizard/) directory

5. All changes should be **purely UI/CSS/Animation** enhancements except:
   - Score calculation formula change (point 4) — this is a math change only
   - Score tiers range update — constant change only

---

## 📋 Implementation Order

| Step | Task                                                                                                                  | Dependency |
| ---- | --------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1    | Implement score formula change + SCORE_TIERS update                                                                   | None       |
| 2    | Add CSS animation classes to [`app/globals.css`](app/globals.css)                                                     | None       |
| 3    | Create [`QuizLoveOpening.tsx`](components/anniversary-quiz/QuizLoveOpening.tsx)                                       | Step 2     |
| 4    | Modify [`QuizPageContent.client.tsx`](app/quiz/[id]/QuizPageContent.client.tsx) to integrate love-opening phase       | Step 3     |
| 5    | Enhance [`QuizSlideQuestion.tsx`](components/anniversary-quiz/QuizSlideQuestion.tsx) with 3D cards, gradient options  | Step 2     |
| 6    | Create [`AnswerFeedbackSVG.tsx`](components/anniversary-quiz/AnswerFeedbackSVG.tsx)                                   | Step 2     |
| 7    | Integrate feedback effects into [`QuizSlideQuestion.tsx`](components/anniversary-quiz/QuizSlideQuestion.tsx)          | Step 6     |
| 8    | Update [`opengraph-image.tsx`](app/quiz/[id]/opengraph-image.tsx) with user photo                                     | None       |
| 9    | Enhance [`SoulCertificate.tsx`](components/anniversary-quiz/SoulCertificate.tsx) with colorful fields                 | None       |
| 10   | Create [`UniversityCertificate.tsx`](components/anniversary-quiz/UniversityCertificate.tsx)                           | Step 2     |
| 11   | Integrate University Certificate into [`SoulCertificate.tsx`](components/anniversary-quiz/SoulCertificate.tsx)        | Step 10    |
| 12   | Add "Challenge [yourName]" button to [`ChallengePartnerCTA.tsx`](components/anniversary-quiz/ChallengePartnerCTA.tsx) | None       |
