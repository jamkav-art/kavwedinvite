# "Soul-Sync" Viral Quiz Engine — Complete Architecture & Implementation Plan

## Project Context

Product: **WedInviter** (Premium Digital Wedding Invitation SaaS)  
Feature: Anniversary Quiz — Viral Top-of-Funnel Acquisition Loop  
Price: **₹399** (no changes)

---

## 1. Design Philosophy

**"Fashion Magazine" Aesthetic**

- Colorfull UI Experience
- Fluid typography (Cormorant Garamond serif headings, Inter sans-serif options)
- Zero visual clutter
- Mobile-first, full-bleed layouts
- Every pixel intentional

---

## 2. The 5 Quiz Patterns (50 Questions Total)

The master question bank has **50 questions** across **5 emotional patterns**:

| #   | Pattern                   | Emotion              | Questions | Example                                              |
| --- | ------------------------- | -------------------- | --------- | ---------------------------------------------------- |
| ❤️  | **Nostalgia & The Spark** | Warmth, Sentimental  | 10        | "What was the very first thing I noticed about you?" |
| 😂  | **The LOL Challenge**     | Laughter, Playful    | 10        | "We're in a horror movie. Who dies first?"           |
| 🔥  | **Soul Layers**           | Depth, Vulnerability | 10        | "What do I do that makes you feel safest?"           |
| 🤔  | **Did You Know?**         | Curiosity, Discovery | 10        | "What was the name of my first ever pet?"            |
| 🚀  | **Hopes & Challenges**    | Future, Growth       | 10        | "What will we be arguing about when we are 80?"      |

Each question has **3 ultra-short options** (1-3 words max): 1 sincere, 2 funny/absurd.

---

## 3. The Hook

> **"My Love, Predict my heart 😊"**

---

## 4. Database Schema (Supabase)

### Table 1: `question_bank`

```sql
CREATE TABLE question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('nostalgia', 'playful', 'soul', 'discovery', 'future')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,  -- Array of exactly 3 strings: ["Sincere", "Funny", "Absurd"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table 2: `quiz_sessions`

```sql
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id TEXT UNIQUE NOT NULL,         -- nanoid for URL: wedinvite.in/quiz/[invite_id]
  couple_name_1 TEXT NOT NULL,
  couple_name_2 TEXT NOT NULL,
  config JSONB NOT NULL,                   -- [{ "q_id": "uuid-1", "correct_idx": 0 }, ...]
  couple_photo_url TEXT,
  love_note TEXT,
  floral_theme TEXT DEFAULT 'rose',
  color_mood TEXT DEFAULT 'romantic-pink',
  background_music TEXT,
  payment_id TEXT,
  paid BOOLEAN DEFAULT FALSE,
  challenger_quiz_id UUID REFERENCES quiz_sessions(id),  -- Viral loop FK
  combined_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

---

## 5. Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│                    CREATOR FLOW                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Landing Page] → Click "Create Anniversary Quiz"       │
│       ↓                                                 │
│  [Wizard Slide 1] "What's your name?"                   │
│       ↓                                                 │
│  [Wizard Slide 2] "Who's your forever person?"          │
│       ↓                                                 │
│  [Wizard Slide 3] "When did forever begin?"             │
│       ↓                                                 │
│  [Wizard Slide 4] "Show us your smile" (photo)          │
│       ↓                                                 │
│  [Wizard Slide 5] ❗ Matrix Randomization Engine ❗      │
│       → Backend fetches 10 random questions from 50     │
│       → Rendered as clean feed                          │
│       → Creator taps correct answer for each (toggle)   │
│       → State stored in Zustand (no DB writes)          │
│       ↓                                                 │
│  [Wizard Slide 6] "Write from your heart" (love note)   │
│       ↓                                                 │
│  [Review & Pay] → ₹399 Razorpay                         │
│       ↓                                                 │
│  [PAYMENT SUCCESS] → Server Action writes to DB         │
│       → Zustand payload → quiz_sessions table           │
│       → URL generated: wedinvite.in/quiz/[invite_id]    │
│       → Share link                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Matrix Randomization Engine

**Core mechanic:** We do NOT ask users to type questions or answers.

1. Creator enters wizard Slide 5
2. [Backend Server Action] fetches `10 random questions` from `question_bank` using PostgreSQL `ORDER BY RANDOM() LIMIT 10`
3. Ensures **pattern diversity** — at least 2 questions from each of the 5 patterns
4. Rendered as a **clean vertical feed** (scrollable)
5. Each question shows:
   - Pattern emoji badge (❤️/😂/🔥/🤔/🚀)
   - Question text
   - 3 option buttons in CSS Grid (`grid-cols-1 sm:grid-cols-3`)
   - Creator **taps correct answer** → highlighted state
6. Zustand stores: `{ q_id: uuid, correct_idx: 0 }` for each
7. No DB writes until payment finalization

**Why this wins:**

- Zero friction (tap, don't type)
- Guaranteed quality (pre-written expert questions)
- Consistent UX
- Buttery smooth performance

---

## 7. The Stateless Builder

- **No login required** until checkout/payment
- All wizard state in **Zustand with localStorage persistence**
- If user closes browser → resume where they left off
- Session only written to DB AFTER successful payment
- This eliminates abandonment friction

---

## 8. Server Actions (Next.js)

### `fetchRandomQuestions()`

```typescript
// Server Action
async function fetchRandomQuestions(count: number = 10) {
  const supabase = createClient();

  // Fetch 2 questions from each pattern for diversity
  const categories = ["nostalgia", "playful", "soul", "discovery", "future"];
  let allQuestions = [];

  for (const category of categories) {
    const { data } = await supabase
      .from("question_bank")
      .select("*")
      .eq("category", category)
      .order("random()")
      .limit(2);
    allQuestions.push(...data);
  }

  // Shuffle the combined set
  return shuffleArray(allQuestions);
}
```

### `createQuizSession()`

```typescript
// Server Action — called after payment success
async function createQuizSession(payload: {
  couple_name_1: string;
  couple_name_2: string;
  config: QuizConfig[]; // [{q_id, correct_idx}]
  couple_photo_url?: string;
  love_note?: string;
  floral_theme?: string;
  color_mood?: string;
  background_music?: string;
  payment_id: string;
}) {
  const supabase = createClient();
  const invite_id = nanoid(10); // short URL

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({ ...payload, invite_id, paid: true })
    .select()
    .single();

  return { url: `/quiz/${invite_id}`, id: data.id };
}
```

---

## 9. Dynamic OG Tags (Viral SEO)

### Route: `app/quiz/[id]/page.tsx`

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { id } = await params;
  const quiz = await fetchQuizSession(id);

  return {
    title: `${quiz.couple_name_1} & ${quiz.couple_name_2}: Predict my heart 😊`,
    description: "Think you know our story? Take the Soul-Sync challenge.",
    openGraph: {
      title: `${quiz.couple_name_1} & ${quiz.couple_name_2} 💕 Soul-Sync Challenge`,
      description:
        "How well do you know them? Take the quiz and find your score!",
      images: [{ url: `/api/og/quiz?id=${id}`, width: 1200, height: 630 }],
    },
  };
}
```

### OG Image Route: `app/api/og/quiz/route.tsx`

Use **Vercel @satori** to server-render a beautiful branded preview card:

- Couple names with elegant typography
- Pattern emojis across the bottom
- "Soul-Sync Challenge" watermark
- Brand colors (magenta, gold, rose)

---

## 10. The Guest Experience (Participant Flow)

### Route: `app/quiz/[id]/page.tsx`

```
[Link shared] → User opens URL
      ↓
[OG tags render in preview → high tap-through rate]
      ↓
[ENTRANCE SCREEN]
  - Couple photo as hero background (soft blur)
  - Names displayed colorful elegantly
  - "How well do you know your [partner Name]?"
  - [Start the Journey →] button with pulse animation
      ↓
[QUIZ — 10 questions, one per slide], no next button. after option select, goto next slide with petals and rose gold plates throwing effects (or best other effects)
  - Framer Motion <AnimatePresence> slide transitions
  - Pattern emoji badge top-left
  - Progress: "Love progress bar with effects"
  - Question text (serif, elegant)
  - 3 option buttons (grid-cols-3, large tap targets p-4 rounded-xl)
  - Selected: ring-2 ring-primary bg-primary/5
  - Auto-advance after selection with 0.5s delay
      ↓ (repeats for all 10 questions)
      ↓
[LOADING] "Calculating your Soul-Sync..."
  - 2 seconds of suspense
  - Animated heart pulse
      ↓
[SOUL CERTIFICATE REVEAL with both name and soul-sync Percentage with amazing certificate design with full colorful] 🎊
```

---

## 11. Soul Certificate (Viral Growth Engine)

### Server-Side Rendered PNG via Vercel @satori

```typescript
// app/api/certificate/route.tsx
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quizId = searchParams.get('id');
  const score = searchParams.get('score');

  // Fetch quiz data
  const quiz = await fetchQuizSession(quizId);

  // Determine score tier
  const tier = getScoreTier(Number(score));

  // Render with satori
  const svg = await satori(
    <CertificateComponent quiz={quiz} score={score} tier={tier} />,
    { width: 800, height: 600, fonts: [...] }
  );

  const resvg = new Resvg(svg);
  const pngBuffer = resvg.render().asPng();

  return new Response(pngBuffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}
```

### Score Tiers & Badges

| Score Range | Title                       | Badge Emoji | Description                               |
| ----------- | --------------------------- | ----------- | ----------------------------------------- |
| 0-40%       | **The Beautiful Strangers** | 🌟          | "A beautiful mystery waiting to unfold"   |
| 41-75%      | **The Twin Flames**         | 🔥          | "Two souls, one flame — growing brighter" |
| 76-99%      | **The Architects**          | 🏛️          | "Built on understanding, brick by brick"  |
| 100%        | **The Unified Soul**        | 💫          | "Rare. Resonant. One in a million."       |

### Certificate Visual Layout (800×600 PNG)

```
┌──────────────────────────────────────────────┐
│              ✨ Soul Certificate ✨            │
│                                              │
│             ┌──────────────────┐              │
│             │    ♥ 87% ♥       │  ← Animated  │
│             └──────────────────┘              │
│                                              │
│        The Architects 🏛️                      │
│                                              │
│    Priya  ❤  Rahul                            │
│                                              │
│    ──── Pattern Breakdown ────                │
│    ❤️ Nostalgia        ████████░░ 80%         │
│    😂 LOL              ██████░░░ 66%          │
│    🔥 Soul             ███████░░ 74%          │
│    🤔 Discovery        ████████░░ 82%         │
│    🚀 Future           ██████░░░ 60%          │
│                                              │
│    ┌─────────────────────────────┐            │
│    │  📱 Start Your Own Story    │  ← QR Code │
│    │  Built with WedInviter      │    + CTA   │
│    └─────────────────────────────┘            │
│                                              │
└──────────────────────────────────────────────┘
```

### THE VIRAL KICKER

Every certificate includes: **"Start Your Own Story — Built with WedInviter"** with either:

- A QR code linking back to the quiz creator
- A clickable CTA button

**This turns every quiz-taker into a potential lead.** Every share = free acquisition.

---

## 12. The Viral Challenge Loop

```
Partner A creates quiz → Pays ₹399 → Shares URL
        ↓
Partner B takes quiz → Sees Soul Certificate
        ↓
"🔁 Challenge [Partner A] to take YOUR quiz?"
  [Yes, Create My Quiz!]   [Share Certificate]
        ↓
FREE challenge quiz created (no payment)
  → Same 10-question random selection from bank
  → Different randomized set (ensures fresh experience)
  → New URL: wedinvite.in/quiz/[new_invite_id]
        ↓
Partner B shares new URL with Partner A
        ↓
Partner A takes challenge quiz
        ↓
Both scores combined → Ultimate Soul Certificate
  → "You two are XX% Soul-Synced!"
  → Premium shareable image
```

**Revenue Model:** Challenge quiz is FREE → but HD certificate download or video reaction reveal can be ₹99 upsell (future).

---

## 13. UI/UX Specifications

### Buttons & Inputs

- Option buttons: CSS Grid `grid-cols-1 sm:grid-cols-3`
- Large tap targets: `p-4 rounded-xl`
- Selected state: `ring-2 ring-[--color-gold] bg-[--color-gold]/5`
- Hover: subtle scale transform `hover:scale-[1.02]`

### Typography

- Headings: **Cormorant Garamond** (serif, elegant) — already loaded
- Options/UI: **Inter** (sans-serif, clean) — already loaded
- Fluid sizing via CSS clamp (existing setup)

### Animations (Framer Motion)

- Slide transitions: `AnimatePresence` with horizontal push
- Option buttons: staggered entrance (50ms delay each)
- Selection: spring scale (1→1.05→1) + ring highlight
- Certificate counter: `useSpring` animation
- Confetti: `canvas-confetti` library (already installed)
- `will-change: transform, opacity` on animated elements for 60fps

### Mobile-First

- Full-screen slides (no max-width on wizard)
- Bottom-anchored buttons for thumb reach
- Swipe gesture support (optional via framer-motion)

---

## 14. Implementation Phases

### Phase 1: Foundation (question_bank + DB)

1. Create Supabase migration for `question_bank` table
2. Create Supabase migration for `quiz_sessions` table
3. Seed 50 questions into `question_bank` (the dataset provided)
4. Create types in [`types/anniversary-quiz.types.ts`]
5. Create Supabase client utilities

### Phase 2: Matrix Randomization Engine

1. Create Server Action [`fetchRandomQuestions()`] in [`lib/anniversary-questions.ts`]
2. Create Server Action [`createQuizSession()`] in [`lib/anniversary-quiz.ts`]
3. Create Zustand store for quiz builder state
4. Build question feed UI component

### Phase 3: Wizard Redesign

1. Create [`components/anniversary-wizard/`] components
2. Rewrite order page as full-screen wizard
3. Integrate Matrix Randomization Engine into Slide 5
4. Payment flow integration

### Phase 4: Quiz Experience Route

1. Create [`app/quiz/[id]/page.tsx`] — dynamic route
2. Create quiz slide components with AnimatePresence
3. Implement score calculation
4. Dynamic OG tags with `generateMetadata`

### Phase 5: Soul Certificate

1. Create [`app/api/certificate/route.tsx`] — satori PNG generation
2. Create [`app/api/og/quiz/route.tsx`] — OG image generation
3. Build certificate component with satori-compatible JSX
4. Implement score tiers & badge logic
5. Certificate download functionality

### Phase 6: Viral Challenge Loop

1. Create challenge quiz creation API
2. Implement challenge flow in quiz UI
3. Ultimate Soul Certificate for combined scores
4. Share + QR code integration

### Phase 7: Polish

1. Animations and transitions refinement
2. Loading/error/empty states
3. SEO optimization
4. Performance testing on low-end mobile
5. Analytics tracking

---

## 15. File Map

### New Files to Create

```
app/
  quiz/
    [id]/
      page.tsx              ← Quiz experience (server + client)
      layout.tsx            ← Quiz-specific layout
      loading.tsx           ← Skeleton loading
      opengraph-image.tsx   ← Dynamic OG image
  api/
    quiz/
      generate/route.tsx    ← Server Action: create quiz
      random-questions/route.tsx ← Server Action: fetch random 10
    certificate/route.tsx   ← satori PNG generation
    og/
      quiz/route.tsx        ← OG image generation

components/
  anniversary-wizard/
    WizardContainer.tsx     ← Full-screen wrapper
    WizardProgress.tsx      ← Progress dots (6 dots)
    SlideName.tsx           ← Slide 1
    SlidePartnerName.tsx    ← Slide 2
    SlideAnniversaryDate.tsx ← Slide 3
    SlideCouplePhoto.tsx    ← Slide 4
    SlideQuizMatrix.tsx     ← Slide 5 — Matrix Randomization Engine
    SlideLoveNote.tsx       ← Slide 6
    SlideReviewPay.tsx      ← Final — summary + ₹399

  anniversary-quiz/
    QuizEntranceScreen.tsx  ← Cinematic entrance
    QuizSlideQuestion.tsx   ← Single question slide
    QuizProgressBar.tsx     ← "3 of 10" progress
    QuizCompletionLoader.tsx ← Loading with heartbeat
    SoulCertificate.tsx     ← Certificate (client preview)
    CertificateBreakdown.tsx ← Pattern bars
    ChallengePartnerCTA.tsx ← "Start Your Own Story" CTA
    QuizShareButtons.tsx    ← Social share

hooks/
  useAnniversaryOrderStore.ts ← UPDATE: Add question config, pattern selections
  useAnniversaryQuiz.ts     ← NEW: Quiz-taking state
  useSoulScore.ts           ← NEW: Score calculation with tiers

lib/
  anniversary-questions.ts  ← UPDATE: Server Action for random fetch
  anniversary-quiz.ts       ← NEW: Quiz session CRUD
  anniversary-scoring.ts    ← NEW: Score algorithm + tiers
  anniversary-types.ts      ← NEW: TypeScript types
  seed-questions.ts         ← NEW: 50-question seed data
```

### Files to Modify

```
app/(main)/wed-anniversary-wish/order/page.tsx   ← Complete rewrite
app/(main)/wed-anniversary-wish/order/layout.tsx  ← Full-screen layout
hooks/useAnniversaryOrderStore.ts                 ← Add fields
types/anniversary-order.types.ts                  ← Add types
app/globals.css                                   ← Add quiz animations
```

---

## 16. Key Design Decisions Summary

| Decision               | Choice                        | Why                                            |
| ---------------------- | ----------------------------- | ---------------------------------------------- |
| Question source        | Pre-defined bank of 50        | Zero typing, guaranteed quality, consistent UX |
| Randomization          | 10 random from 50             | Fresh every time, pattern-diverse              |
| State before payment   | Zustand + localStorage        | No login friction, fast, zero DB writes        |
| State after payment    | Server Action → Supabase      | Secure, persistent, URL generation             |
| Quiz URL format        | `/quiz/[nanoid]`              | Short, clean, shareable                        |
| Certificate generation | Vercel @satori (server-side)  | High-res PNG, no client dependency, fast       |
| OG images              | @satori (server-side)         | Dynamic, branded, SEO-optimized                |
| Score tiers            | 4 tiers with poetic names     | Shareable identity ("I'm an Architect!")       |
| Viral mechanism        | CTA on every certificate      | Every taker = potential lead                   |
| Challenge pricing      | FREE                          | Maximize viral coefficient                     |
| Transitions            | Framer Motion AnimatePresence | Buttery smooth, 60fps with GPU hints           |
| Design aesthetic       | "Fashion Magazine"            | Massive whitespace, zero clutter, premium feel |
| Price                  | ₹399 (unchanged)              | As specified by user                           |

---

## 17. Risk Matrix

| Risk                        | Probability | Impact | Mitigation                                               |
| --------------------------- | ----------- | ------ | -------------------------------------------------------- |
| satori font loading failure | Low         | High   | Preload fonts, fallback to system fonts                  |
| Random question repetition  | Low         | Medium | Track used question IDs per session                      |
| Large localStorage size     | Low         | Low    | Only store config (10 IDs + indices), not full questions |
| Payment before DB write     | Medium      | High   | Webhook verification (existing)                          |
| Mobile animation jank       | Medium      | Medium | will-change hints, reduce JS thread work                 |
| QR code generation          | Low         | Low    | Use lightweight QR library or satori SVG                 |
| Challenge loop abuse        | Low         | Medium | Rate limit: 1 challenge per quiz, IP tracking            |

---

## 18. Success Metrics

| Metric                   | Target | Why                  |
| ------------------------ | ------ | -------------------- |
| Wizard completion rate   | >60%   | Frictionless builder |
| Quiz completion rate     | >80%   | Engaging experience  |
| Certificate share rate   | >40%   | Viral coefficient    |
| Challenge conversion     | >25%   | Loop growth          |
| Challenge completion     | >60%   | Full loop            |
| Payment conversion       | >15%   | Revenue              |
| OG tag CTR               | >5%    | Social virality      |
| Bounce rate on quiz page | <30%   | Strong entrance      |
