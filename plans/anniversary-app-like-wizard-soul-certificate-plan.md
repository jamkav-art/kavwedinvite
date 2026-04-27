# Anniversary Quiz — App-Like Wizard & Soul Certificate Redesign Plan

## 1. Executive Summary

Transform the current traditional 4-step form into an **immersive, app-like, one-field-at-a-time wizard** with cinematic transitions, and redesign the generated quiz URL as a multi-slide experience culminating in a **Soul Certificate** with viral "Challenge Your Partner" loop.

---

## 2. Current Architecture Analysis

**Current Order Flow** (form-based, boring):

- [`app/(main)/wed-anniversary-wish/order/page.tsx`] — 4-step form with stepper header
- Steps: Couple Details → Quiz Builder → Theme & Music → Personal Message/Payment
- All fields visible at once within each step
- Traditional "Next"/"Back" button navigation
- Max width container (`max-w-3xl`), not full-screen

**Current Quiz Page** (generated URL):

- [`app/invite/[id]/InvitePageContent.client.tsx`] — Wedding invite page, NOT anniversary-specific
- Anniversary quiz has NO dedicated dynamic route yet
- The quiz experience is embedded in `Step2` of the order flow only

**Current Tech Stack:**

- Next.js 16 (App Router) with React 19
- Zustand store with localStorage persistence
- Framer Motion for animations
- Tailwind CSS v4
- Razorpay for payments
- Supabase for data

---

## 3. Proposed New Architecture

### 3.1 Order Flow: "Love Story Wizard" (Full-Screen, One-Field-At-A-Time)

**Route:** [`app/(main)/wed-anniversary-wish/order/page.tsx`] → Complete rewrite

**UX Pattern:** Like a mobile app onboarding / Instagram story — one question per "slide", full-height, centered, with smooth page transitions.

```
┌─────────────────────────────┐
│  ● ○ ○ ○ ○ ○   (6 dots)    │  ← Progress indicator
│                             │
│         ✨                   │
│                             │
│    "What's your name?"      │  ← Question
│                             │
│    ┌─────────────────┐      │
│    │  Type here...    │      │  ← Single input
│    └─────────────────┘      │
│                             │
│         ↓  Next             │  ← Large tap target
│                             │
│  Keyboard: Enter → next     │
└─────────────────────────────┘
```

**6 Slides (one field each):**

| Slide | Field             | Input Type           | Notes                                                              |
| ----- | ----------------- | -------------------- | ------------------------------------------------------------------ |
| 1     | Your Name         | Text input           | Auto-focus, placeholder romance                                    |
| 2     | Your Lover's Name | Text input           | Animated heart icon appears                                        |
| 3     | Marriage Date     | Date picker          | Beautiful calendar, auto-calc years together with animated counter |
| 4     | Couple Photo      | Drag-n-drop / camera | Full-bleed upload zone, preview shows instantly                    |
| 5     | Quiz Selections   | Swipeable cards      | See Section 3.1.1 below                                            |
| 6     | Personal Message  | Textarea             | Hearts floating animation, character count                         |

**3.1.1 Quiz Selections (Slide 5) — The Innovation**

Instead of a complex quiz builder form, show **swipeable question cards** where users:

1. See a question card
2. Tap to toggle ON/OFF (keep or skip)
3. Swipe left/right or tap arrow to see next
4. Can tap "Edit" to customize the question text/options on the spot via a bottom sheet
5. See a counter: "5 of 15 selected (min 5)"

**Visual:**

```
┌─────────────────────────────┐
│  ◄  5 of 15 selected  ►     │  ← Swipe indicator
│                             │
│  ┌─────────────────────┐    │
│  │ "What is my biggest │    │
│  │  dream vacation?"   │    │  ← Question card
│  │                     │    │
│  │  Keep ✅  |  Skip ❌ │    │  ← Toggle
│  │                     │    │
│  │  [✏️ Edit Question] │    │  ← Bottom sheet trigger
│  └─────────────────────┘    │
│                             │
│      ↓  Next Slide          │
└─────────────────────────────┘
```

**3.1.2 Slide Transitions:**

- Horizontal slide (push left) for "Next", push right for "Back"
- Content animates: current fades out + slides left, next fades in from right
- Progress dots animate with spring physics
- Background gradient subtly shifts per slide (e.g., pink → gold → rose)
- Floating particles or subtle sparkle effect in background

**3.1.3 Payment Integration:**

After Slide 6 (Personal Message), instead of routing to a separate payment step, show a **beautiful "Review & Pay" summary screen** as the final slide:

```
┌─────────────────────────────┐
│  ❤️ Your Love Story Quiz    │
│                             │
│  Priya ❤️ Rahul             │
│  5 years 2 months together  │
│  8 questions selected       │
│                             │
│  ┌─────────────────────┐    │
│  │  ₹399  One-time      │    │
│  │  [Pay & Create ✨]   │    │
│  └─────────────────────┘    │
│                             │
│  ← Back to edit             │
└─────────────────────────────┘
```

### 3.2 Generated URL: Quiz Experience Page (Multi-Slide)

**New Route:** [`app/anniversary-quiz/[id]/page.tsx`] — New dedicated anniversary quiz page

**UX Pattern:** Cinematic multi-slide quiz — one question per slide, auto-advance animation, progress tracker, background music.

```
┌─────────────────────────────┐
│  ● ● ● ○ ○ ○ ○ ○  (3/8)   │  ← Progress dots
│                             │
│  ┌─────────────────────┐    │
│  │ "What is my biggest │    │
│  │  dream vacation?"   │    │
│  │                     │    │
│  │  ○ Santorini, Greece│    │
│  │  ○ Kashmir, India   │    │  ← Tap to select
│  │  ○ Bali, Indonesia  │    │
│  │                     │    │
│  │     [Next →]        │    │
│  └─────────────────────┘    │
│                             │
│  ❤️ Priya's Quiz            │
└─────────────────────────────┘
```

**Quiz Flow Details:**

1. **Entrance Animation:** Couple names + photo fade in with romantic particle effects, "How well do you know [Name]?" text
2. **Quiz Slides:** One question at a time, full-screen, with:
   - Progress indicator (dots or fraction)
   - Question text with gentle entrance animation
   - 3 option buttons that expand on tap with ripple effect
   - Next button or auto-advance after selection
   - Background music playing softly
3. **Transition:** Selected option highlights in gold, checkmark appears, then slide transitions to next
4. **Completion:** After last question:
   - Loading animation "Calculating your Love Score..."
   - Confetti burst
   - Soul Certificate reveal

### 3.3 Soul Certificate (Auto-Generated)

**After quiz completion:**

```
┌─────────────────────────────┐
│                             │
│    ✨ Soul Certificate ✨    │
│                             │
│     ┌─────────────────┐     │
│     │    ♥ 87% ♥      │     │  ← Giant Soul % with glow
│     └─────────────────┘     │
│                             │
│   Priya & Rahul             │
│                             │
│   "You know them better     │
│    than 87% of partners"    │
│                             │
│   Breakdown:                │
│   ━━━━━━━━━━━━━━━━━━━━━    │
│   Romance    ████████░ 80%  │
│   Memories   █████████ 92%  │
│   Dreams     ████████░ 85%  │
│   Habits     ███████░░ 70%  │
│   ━━━━━━━━━━━━━━━━━━━━━    │
│                             │
│   📸 Save as Image          │
│   📤 Share to Story         │
│   🔄 Challenge Partner      │  ← VIRAL LOOP
│                             │
└─────────────────────────────┘
```

**Soul Certificate Features:**

- Animated percentage counter (0 → 87%)
- Category breakdown bars (animate in sequence)
- Theme-appropriate floral/ornamental border
- QR code or link to original quiz
- "Save as Image" button (using `html-to-image` or canvas)
- Direct share to WhatsApp/Instagram

**Scoring Algorithm:**

- Each correct answer = points
- Total possible = number of questions
- Soul % = (correct / total) × 100
- Category breakdown: group similar questions into categories (Romance, Memories, Dreams, Habits, Fun)

### 3.4 Viral Engagement Loop: "Challenge Your Partner"

This is the **revenue multiplier**. The flow:

```
Partner A creates quiz → Shares URL
        ↓
Partner B takes quiz → Sees Soul Certificate
        ↓
  [Challenge Your Partner] button
        ↓
  Partner B gets their OWN quiz URL
  (New entry in DB, linked to Partner A)
        ↓
  Partner B shares with Partner A
        ↓
  Partner A takes Partner B's quiz
        ↓
  BOTH scores combined → "Ultimate Soul Certificate"
        ↓
  Shareable as a couple's combined score
```

**Implementation:**

1. After Partner B sees their Soul Certificate, show a prominent CTA: "Challenge **[Partner Name]** to take YOUR quiz"
2. Clicking creates a new quiz order record in `pending` state with:
   - `challenger_id` = original quiz ID
   - `partner_a_name` = original's `partnerName`
   - `partner_b_name` = original's `yourName`
3. The new challenger quiz URL is generated
4. Share button copies the new URL
5. When Partner A completes the challenge quiz:
   - System calculates combined score
   - Shows "Ultimate Soul Certificate" with both scores averaged
   - "You two are XX% soulmates!"

**Revenue Model for Challenges:**

- First quiz: ₹399 (paid)
- Challenge quiz for Partner B: **FREE** (viral growth)
- BUT: Offer premium "Soul Certificate HD download" or "Video message reveal" as upsell (₹99)
- Alternatively: Partner B gets free challenge, but to unlock the "Ultimate Soul Certificate HD" they pay ₹99

---

## 4. Detailed File Changes

### 4.1 New Files to Create

| File                                                        | Purpose                                |
| ----------------------------------------------------------- | -------------------------------------- |
| [`app/anniversary-quiz/[id]/page.tsx`]                      | New dynamic route for anniversary quiz |
| [`app/anniversary-quiz/[id]/layout.tsx`                     | Layout for quiz page with music player |
| [`components/anniversary-quiz/QuizSlide.tsx`]               | Single quiz question slide component   |
| [`components/anniversary-quiz/QuizProgress.tsx`]            | Progress dots/fraction indicator       |
| [`components/anniversary-quiz/QuizEntrance.tsx`]            | Cinematic entrance animation           |
| [`components/anniversary-quiz/SoulCertificate.tsx`]         | Full Soul Certificate component        |
| [`components/anniversary-quiz/CertificateBreakdown.tsx`]    | Category breakdown bars                |
| [`components/anniversary-quiz/ChallengePartner.tsx`]        | Challenge CTA + share buttons          |
| [`components/anniversary-quiz/UltimateSoulCertificate.tsx`] | Combined score certificate             |
| [`components/anniversary-wizard/WizardSlide.tsx`]           | Single slide wrapper for order wizard  |
| [`components/anniversary-wizard/WizardProgress.tsx`]        | Progress dots for wizard               |
| [`components/anniversary-wizard/SlideName.tsx`]             | Slide 1: Your Name                     |
| [`components/anniversary-wizard/SlidePartner.tsx`]          | Slide 2: Partner Name                  |
| [`components/anniversary-wizard/SlideDate.tsx`]             | Slide 3: Marriage Date                 |
| [`components/anniversary-wizard/SlidePhoto.tsx`]            | Slide 4: Couple Photo                  |
| [`components/anniversary-wizard/SlideQuizSelect.tsx`]       | Slide 5: Quiz Question Selection       |
| [`components/anniversary-wizard/SlideMessage.tsx`]          | Slide 6: Personal Message              |
| [`components/anniversary-wizard/SlideReviewPay.tsx`]        | Final: Review & Pay                    |
| [`hooks/useAnniversaryQuiz.ts`]                             | Quiz-taking logic hook                 |
| [`hooks/useSoulScore.ts`]                                   | Scoring algorithm + category breakdown |
| [`lib/anniversary-scoring.ts`]                              | Scoring utilities                      |
| [`lib/anniversary-quiz-categories.ts`]                      | Category definitions for questions     |
| [`types/anniversary-quiz.types.ts`]                         | Quiz session types                     |

### 4.2 Files to Modify

| File                                                 | Changes                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| [`app/(main)/wed-anniversary-wish/order/page.tsx`]   | Complete rewrite — full-screen wizard                      |
| [`app/(main)/wed-anniversary-wish/order/layout.tsx`] | Remove max-width constraint, full-screen layout            |
| [`hooks/useAnniversaryOrderStore.ts`]                | Add quiz session data, challenge tracking fields           |
| [`types/anniversary-order.types.ts`]                 | Add challenge-related types                                |
| [`app/globals.css`]                                  | Add wizard-specific animations, certificate styles         |
| [`next.config.ts`                                    | Add `html-to-canvas` or image generation support if needed |

### 4.3 Files to Remove/Deprecate

| File                                                      | Reason                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| [`components/anniversary-order/OrderStepper.tsx`]         | Replaced by WizardProgress                                    |
| [`app/(main)/wed-anniversary-wish/order/steps/step1.tsx`] | Replaced by SlideName + SlidePartner + SlideDate + SlidePhoto |
| [`app/(main)/wed-anniversary-wish/order/steps/step2.tsx`] | Replaced by SlideQuizSelect                                   |
| [`app/(main)/wed-anniversary-wish/order/steps/step3.tsx`] | Integrated into slide experience or simplified                |
| [`app/(main)/wed-anniversary-wish/order/steps/step4.tsx`] | Replaced by SlideMessage + SlideReviewPay                     |

---

## 5. Component Architecture & Data Flow

### 5.1 Order Wizard Flow

```
AnniversaryOrderPage (client component, full-screen)
  ├── WizardProgress (6 dots + label)
  ├── AnimatePresence (slide transitions)
  │   ├── SlideName        → store.yourName
  │   ├── SlidePartner     → store.partnerName
  │   ├── SlideDate        → store.anniversaryDate
  │   ├── SlidePhoto       → store.couplePhoto
  │   ├── SlideQuizSelect  → store.questions (toggle/enable)
  │   ├── SlideMessage     → store.loveNote
  │   └── SlideReviewPay   → store + payment
  └── Background (subtle gradient, particles)
```

**State Flow:**

- Each slide reads/writes directly to [`useAnniversaryOrderStore`]
- Validation happens per-slide before advancing
- SlideReviewPay triggers Razorpay via [`useAnniversaryPayment`]
- After payment → redirect to success page (existing flow)

### 5.2 Quiz Page Flow

```
AnniversaryQuizPage (server component, fetches data)
  └── AnniversaryQuizClient (client component)
      ├── GlobalMusicPlayer
      ├── QuizEntrance (cinematic intro)
      ├── AnimatePresence (slide transitions)
      │   ├── QuizSlide (× N questions)
      │   └── SoulCertificate (results)
      └── ChallengePartner (viral CTA)
```

**Data Fetching:**

- Server component fetches quiz data from Supabase by `[id]`
- Passes to client component
- Client manages quiz session state via [`useAnniversaryQuiz`] hook

---

## 6. Animation & Interaction Specifications

### 6.1 Wizard Slide Transitions

- **Direction:** Horizontal push (left for forward, right for back)
- **Duration:** 350ms ease-in-out
- **Spring:** stiffness: 200, damping: 25
- **Background:** Subtle gradient morph per slide
- **Progress dots:** Spring-animated active dot with pulse

### 6.2 Quiz Slide Transitions

- **Direction:** Cards scale up from bottom with slight rotation
- **Option reveal:** Staggered entrance (50ms delay between each)
- **Selection:** Ripple effect + highlight border + subtle scale
- **Correct/Incorrect:** Green glow / red shake (but hidden until end)
- **Completion:** Confetti burst (canvas-confetti library already installed)

### 6.3 Soul Certificate Animations

- **Percentage counter:** Animated counting (GSAP or framer-motion with `useSpring`)
- **Category bars:** Animate width from 0 to target sequentially
- **Entrance:** Scale up from 0.8 with glow effect
- **Particles:** Floating hearts/sparkles around certificate
- **Share button:** Pulse animation to draw attention

---

## 7. Viral Engagement Implementation Details

### 7.1 Challenge Flow State Machine

```
[Quiz Completed]
      ↓
[Show Soul Certificate]
      ↓
[Show "Challenge [Partner]" CTA] ───→ [Copy Share Link]
      ↓
[Partner B clicks] ───→ [Create Challenge Quiz in DB]
      ↓
[Partner B gets unique URL] ───→ [Share with Partner A]
      ↓
[Partner A completes challenge] ───→ [Combine Scores]
      ↓
[Ultimate Soul Certificate] ───→ [Share as Couple]
```

### 7.2 Database Schema Additions

Need to add to existing Supabase schema:

**anniversary_quizzes table** (new or extend orders):

```
- id: UUID (PK)
- invite_id: string (unique, short nanoid)
- partner_a_name: string
- partner_b_name: string
- anniversary_date: string
- couple_photo_url: string?
- questions: JSON (array of questions)
- love_note: string?
- theme: string (floral theme)
- color_mood: string
- music_track: string?
- challenger_quiz_id: UUID? (FK to self — the challenge originated from)
- combined_score: number?
- created_at: timestamp
- paid: boolean
- payment_id: string?
```

**quiz_sessions table** (tracks who took the quiz):

```
- id: UUID (PK)
- quiz_id: UUID (FK to anniversary_quizzes)
- taker_name: string
- answers: JSON (array of selected answer indices)
- score: number
- soul_percentage: number
- category_breakdown: JSON
- is_challenge_response: boolean
- challenge_completed: boolean
- created_at: timestamp
```

---

## 8. Implementation Order

### Phase 1: Order Wizard Redesign

1. Create [`components/anniversary-wizard/WizardSlide.tsx`] — reusable slide wrapper with animation
2. Create [`components/anniversary-wizard/WizardProgress.tsx`] — progress dots
3. Create individual slide components (SlideName → SlideReviewPay)
4. Rewrite [`app/(main)/wed-anniversary-wish/order/page.tsx`] — full-screen wizard
5. Update [`app/(main)/wed-anniversary-wish/order/layout.tsx`] — remove container constraints
6. Update styles in [`app/globals.css`]

### Phase 2: Quiz Page Experience

1. Create [`types/anniversary-quiz.types.ts`] — types for quiz session
2. Create [`hooks/useAnniversaryQuiz.ts`] — quiz state management
3. Create [`lib/anniversary-scoring.ts`] — scoring algorithm
4. Create [`lib/anniversary-quiz-categories.ts`] — question categorization
5. Create [`components/anniversary-quiz/QuizSlide.tsx`] — question slide
6. Create [`components/anniversary-quiz/QuizProgress.tsx`] — progress dots
7. Create [`components/anniversary-quiz/QuizEntrance.tsx`] — entrance animation
8. Create [`app/anniversary-quiz/[id]/page.tsx`] + layout — dynamic route
9. Create [`components/anniversary-quiz/SoulCertificate.tsx`] — certificate
10. Create [`components/anniversary-quiz/CertificateBreakdown.tsx`] — breakdown

### Phase 3: Viral Challenge Loop

1. Create [`components/anniversary-quiz/ChallengePartner.tsx`] — challenge CTA
2. Create [`components/anniversary-quiz/UltimateSoulCertificate.tsx`] — combined score
3. Add Supabase schema migrations
4. Wire up challenge creation API endpoint
5. Implement "Save as Image" functionality
6. Add share-to-social buttons

### Phase 4: Polish & Testing

1. Responsive testing (mobile-first)
2. Animation performance optimization
3. Payment flow integration testing
4. Challenge loop end-to-end testing
5. Edge cases: browser back, refresh, incomplete data

---

## 9. Key Design Decisions

| Decision                       | Choice                                             | Rationale                                         |
| ------------------------------ | -------------------------------------------------- | ------------------------------------------------- |
| One-field-per-slide vs grouped | One-field-per-slide                                | Maximum focus, mobile-friendly, app-like feel     |
| Slide direction                | Horizontal push                                    | Industry standard for onboarding/stories          |
| Quiz selection UX              | Swipeable cards with toggle                        | More interactive than a list; mobile-native feel  |
| Quiz page route                | `/anniversary-quiz/[id]` instead of `/invite/[id]` | Separate from wedding invites, clean URL          |
| Certificate image generation   | `html-to-image` library                            | Server-side or client-side canvas rendering       |
| Challenge pricing model        | Free challenge, premium HD certificate             | Maximum viral growth with monetization option     |
| State management               | Zustand (existing)                                 | No need to change, already works with persistence |
| Animation library              | Framer Motion (existing)                           | Already used throughout, spring physics support   |

---

## 10. Mermaid Diagrams

### 10.1 Order Wizard Data Flow

```mermaid
flowchart LR
    A[Click Anniversary Button] --> B[Wizard Slide 1: Name]
    B -- Enter --> C[Wizard Slide 2: Partner]
    C -- Enter --> D[Wizard Slide 3: Date]
    D -- Enter --> E[Wizard Slide 4: Photo]
    E -- Enter --> F[Wizard Slide 5: Quiz Select]
    F -- Enter --> G[Wizard Slide 6: Message]
    G -- Continue --> H[Review and Pay]
    H -- Pay --> I[Razorpay]
    I -- Success --> J[Redirect to Success]
    J --> K[Share Quiz URL]
```

### 10.2 Quiz & Challenge Flow

```flowchart TD
    A[Partner A shares quiz URL] --> B[Partner B opens link]
    B --> C[Entrance Animation]
    C --> D[Quiz Slides 1..N]
    D --> E[Calculate Score]
    E --> F[Show Soul Certificate]
    F --> G{Challenge Partner?}
    G -->|Yes| H[Generate Challenge Quiz]
    H --> I[Partner B gets new URL]
    I --> J[Partner B shares with Partner A]
    J --> K[Partner A takes challenge quiz]
    K --> L[Combine Both Scores]
    L --> M[Ultimate Soul Certificate]
    G -->|No| N[Share Certificate]
    M --> N
```

---

## 11. Risk Mitigation

| Risk                                | Mitigation                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| User loses progress on page refresh | Zustand persistence via localStorage already in place                          |
| Large quiz data in URL params       | Use DB storage, URL only contains short nanoid                                 |
| Image upload before payment         | Store in localStorage as object URL, upload to Supabase after payment          |
| Challenge loop infinite recursion   | Limit to 1 level of challenge (A→B only, not B→C→D)                            |
| Quiz page SEO                       | Server-render OG metadata from DB, use Next.js generateMetadata                |
| Mobile performance with animations  | Use `will-change` hints, GPU-accelerated CSS properties, reduce JS thread load |

---

## 12. Success Metrics

- **Order Conversion:** % of users who complete wizard → payment
- **Viral Coefficient:** Number of challenges generated per paid quiz
- **Quiz Completion Rate:** % of users who finish the full quiz
- **Share Rate:** % of Soul Certificates shared to social
- **Revenue per User:** Including challenge upsells
