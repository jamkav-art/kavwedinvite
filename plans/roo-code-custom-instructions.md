# Roo Code Custom Instructions — WedInviter

> **How to use:** Copy this entire document into Roo Code's **Global Custom Instructions** field (VS Code Settings → Extensions → Roo Code → Custom Instructions → Edit in settings.json → `roo.customInstructions`). These apply to ALL modes. Mode-specific enhancements can be added in each mode's own custom instructions field.

---

## 1. PROJECT IDENTITY

```
Project:  WedInviter — Premium Digital Wedding Invitation SaaS
Domain:   https://wedinviter.wasleen.com
Stack:    Next.js 16 (App Router) | TypeScript (strict) | Tailwind CSS v4 | Supabase | Razorpay | GSAP v3 | Framer Motion v12
Pricing:  ₹399 (wedding) / ₹399 (anniversary quiz) — fixed, one-time, no tiers
Flow:     Stateless order form → Razorpay payment → Database insertion → Live invite URL
```

**Two products:**

1. **Wedding Invites** — `/order` (4 steps: details → events → media → review/pay)
2. **Anniversary Quiz** — `/wed-anniversary-wish/order` (quiz-based love test)

---

## 2. CORE BEHAVIOR RULES (ALL MODES)

### 2.1 Zero-Error Policy

- Write **complete files only**. Never use `// rest of code unchanged` or `...` placeholders.
- Every file must pass TypeScript strict mode — no `any`, no `@ts-ignore`, no `// @ts-nocheck`.
- Every component must render without console errors in both dev and production builds.

### 2.2 Mobile-First Mandate

- Design for **380px width first**, enhance for tablet (768px) and desktop (1440px).
- Use responsive `clamp()` values for typography and spacing (see Design System).
- All interactive elements must have touch targets ≥44px.
- Test all layout changes at 380px, 768px, and 1440px viewports.

### 2.3 Performance Budget

- **LCP < 2s**, **Zero CLS**, **TBT < 200ms** on mobile 3G.
- All images must use `next/image` with explicit `width`/`height` and `sizes` attributes.
- Lazy-load below-fold components with `dynamic(() => import(...), { ssr: false })`.
- Use `will-change-transform` on animated elements to promote compositor layers.
- Prefer CSS animations/transitions for simple effects over JS-driven animation.

### 2.4 File Change Discipline

- Change **minimum files needed**. Prefer surgical edits over rewrites.
- If a task touches more than 5 files, stop and request confirmation before proceeding.
- Never rewrite entire files if targeted diff is sufficient.

### 2.5 Ask First, Code Later

- Before any implementation, list which files will be changed and why.
- When requirements are ambiguous, ask clarifying questions — never assume.

---

## 3. ARCHITECTURE RULES

### 3.1 Next.js App Router

- **App Router ONLY.** No `pages/` directory, no `getServerSideProps`, no `getStaticProps`.
- Server components by default. Add `"use client"` only when needed (hooks, browser APIs, Razorpay, event handlers, state).
- Metadata via `generateMetadata()` or exported `metadata` object — never `<Helmet>` or `next/head`.
- Route handlers in `app/api/*/route.ts` format.

### 3.2 Supabase Data Access

| File                     | Key                             | Usage                                         |
| ------------------------ | ------------------------------- | --------------------------------------------- |
| `lib/supabase/server.ts` | `SUPABASE_SERVICE_ROLE_KEY`     | Server components, server actions, API routes |
| `lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-side reads/writes with RLS            |
| `lib/supabase/admin.ts`  | `SUPABASE_SERVICE_ROLE_KEY`     | Admin-only operations (bypasses RLS)          |

### 3.3 Database Schema

- **4 tables:** `orders`, `events`, `media`, `rsvps`
- `order_status` enum: `pending_payment | paid | building | live | expired | refunded`
- Invite IDs: `slugify(bride_name)-slugify(groom_name)-nanoid(16)` — stored in `orders.invite_id`

### 3.4 Payment Flow

```
Frontend → POST /api/razorpay/create-order → rzp_order_id
→ Razorpay modal opens → user pays
→ POST /api/razorpay/verify (HMAC SHA-256 check) → save to Supabase
→ Redirect to /order/success?orderId=xxx&inviteId=xxx...
```

### 3.5 Template System

- **1 component tree, 8 visual variations.** Config lives in `lib/templates.ts`.
- Each template config: colors, fonts, borders, layout flags, animation particle types.
- Bug fix in one template component = fixed for all 8. Never create separate template pages.

---

## 4. ANIMATION RULES

### 4.1 GSAP (Heavy Scroll Choreography)

- Text reveals, ScrollTrigger parallax, countdown flip digits, horizontal scroll-jacking, timeline sequences.
- Register plugins once: `gsap.registerPlugin(ScrollTrigger)` in a singleton pattern (see `hooks/useGSAPTimeline.ts`).
- Use `useGSAPTimeline()` hook for standard `data-gsap="reveal"` scroll animations.
- For per-component custom timelines, use `useLayoutEffect` + `gsap.context()` with cleanup.
- Never use GSAP SplitText plugin — implement manual letter-splitting via DOM manipulation.
- Animate CSS custom properties via GSAP when needed (e.g., `--border-angle`, `--ring-angle`).

### 4.2 Framer Motion (Micro-Interactions)

- Mount/unmount animations via `AnimatePresence`.
- Hover/tap animations (spring physics: `stiffness: 400, damping: 18`).
- Page transitions, stagger children, `useInView` for intersection-driven entries.
- Use Variants pattern for coordinated child animations.

### 4.3 Golden Rule

> **NEVER mix GSAP and Framer Motion on the same DOM element.** Choose one per element.

### 4.4 CSS Animations (Preferred for Simple Effects)

- Use CSS `@keyframes` for: shimmer, pulse, float, petal-fall, skeletion-glimmer, blur-up.
- Define shared animations in `app/globals.css`.
- Define component-specific scoped animations via `<style dangerouslySetInnerHTML>` inside the component file.
- Use `@property` for animatable custom properties (conic-gradient borders, color cycling).
- Always provide `@media (prefers-reduced-motion: reduce)` fallbacks.

### 4.5 Unique Animated Gradient Buttons

Each CTA button must have its **own unique** animated gradient (different colors, different shimmer direction, different timing):

- Name: `.[component]-[purpose]-btn` e.g., `hero-primary-btn`, `anniv-hero-cta-btn`
- Keyframe: `@keyframes [component]-[purpose]-shimmer { ... }`
- Pattern: `background-size: 400% 400%` + `animation: ... 6s ease-in-out infinite`
- Always add a `::after` pseudo-element with a subtle diagonal glass sheen overlay.

---

## 5. DESIGN SYSTEM

### 5.1 Brand Palette

```
--color-cream:       #fbf7f0  (backgrounds)
--color-sage:        #9ca986  (accents)
--color-terracotta:  #d4756c  (warnings, danger)
--color-charcoal:    #2d2d2d  (text, foreground)
--color-gold:        #c9a962  (primary accent, highlights)
--color-blush:       #fff5f5  (anniversary sections)
--color-champagne:   #f7e7ce  (warm overlays)
--color-magenta:     #c0185f  (anniversary primary)
--color-rose:        #e8638c  (anniversary secondary)
--color-deep-gold:   #a8720a  (dark gold)
```

### 5.2 Typography

```
Headings:  Cormorant Garamond (--font-cormorant) — serif, elegant
Body:      Inter (--font-inter) — sans-serif, clean
CSS variables via next/font/local, loaded in app/layout.tsx
Font files in: public/fonts/
```

### 5.3 Fluid Type Scale

```
--text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
--text-xl:   clamp(1.5rem, 1.3rem + 1vw, 2rem)
--text-3xl:  clamp(2rem, 1.5rem + 2.5vw, 3.5rem)
Heading hero: clamp(2.8rem, 5.5vw + 1rem, 5.5rem)
```

### 5.4 Spacing

```
Mobile:   16px / 24px / 32px
Desktop:  24px / 48px / 96px
```

### 5.5 Glassmorphism Utilities (in globals.css)

- `.glass-card` — heavy blur, white glass, gold shadow
- `.glass-feature-card` — medium blur, cream glass, subtle shadow
- `.pricing-glass` — very light blur, white glass
- `.glass-counter` — medium blur, light glass with inset highlight

### 5.6 Animation Timing

```
--duration-fast:   200ms
--duration-normal: 300ms
--duration-slow:   500ms
--ease-default:    cubic-bezier(0.4, 0, 0.2, 1)
```

### 5.7 Button System

Base `Button` component in `components/ui/Button.tsx` with variants:

- `primary` — charcoal bg, cream text
- `secondary` — bordered, charcoal text
- `ghost` — transparent, subtle hover
- `danger` — terracotta bg, white text

Special CTA buttons use unique animated gradients (see section 4.5), NOT the base Button component.

---

## 6. CODING CONVENTIONS

### 6.1 File Naming

- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useCountdown.ts`)
- API routes: always `route.ts` inside a folder
- Template slugs: `kebab-case` (e.g., `royal-maroon`, `garden-floral`)
- Types: `kebab-case.types.ts` (e.g., `template.types.ts`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)

### 6.2 Component Structure

```tsx
// 1. Imports (grouped: React → Next → libraries → local)
// 2. Types/interfaces
// 3. Constants (if applicable)
// 4. Component function
// 5. Export default
```

### 6.3 Client Component Markers

- Always mark with `"use client"` as the **first line**.
- Use `"use client"` sparingly — prefer server components.

### 6.4 TypeScript

- **Strict mode** enabled in `tsconfig.json`.
- All interfaces/types in `types/` directory.
- No `any`, no `as unknown`, no `@ts-ignore`.
- Use `interface` over `type` for object shapes.
- Export all shared types.

### 6.5 State Management

- **Zustand** for order form state (see `hooks/useOrderStore.ts`, `hooks/useAnniversaryOrderStore.ts`).
- **localStorage** backup for resilience across browser refreshes.
- No Redux, no Context for global state.
- Server state fetched in server components via Supabase.

### 6.6 CSS Approach

- Tailwind utility classes for layout and spacing.
- CSS variables (via `@theme` in `globals.css`) for brand tokens.
- Scoped `<style>` tags inside components for unique animations.
- `cn()` utility from `lib/utils.ts` for conditional class merging.

---

## 7. FILE STRUCTURE REFERENCE

```
app/
├── (main)/                     # Public routes
│   ├── templates/              # Template gallery
│   ├── contact/                # Contact page
│   └── wed-anniversary-wish/   # Anniversary quiz landing + order
├── invite/[id]/                # Dynamic invitation display (the actual invite)
├── order/                      # Wedding order flow (4 steps)
├── admin/                      # Admin dashboard (guarded by middleware)
└── api/                        # API routes (razorpay, rsvp, admin)
components/
├── ui/                         # Base primitives (Button, Card, Input, Modal, Skeleton)
├── invite/                     # Invite display components
├── order/                      # Wedding order flow components
├── anniversary/                # Anniversary landing page components
├── anniversary-order/          # Anniversary order flow components
├── home/                       # Homepage sections (Hero, Features, Pricing, Testimonials)
├── admin/                      # Admin dashboard components
└── layout/                     # Header, Footer
hooks/                          # Custom hooks (useGSAPTimeline, useCountdown, useScrollAnimation, etc.)
lib/                            # Utilities, constants, templates config, Supabase clients
types/                          # TypeScript type definitions
plans/                          # Implementation plans and design docs
public/
├── fonts/                      # Local font files
├── sounds/                     # Audio effects
└── templates/                  # SVG border assets
```

---

## 8. QUALITY CHECKLIST

Before considering any task complete, verify:

- [ ] All TypeScript types defined — no implicit `any`
- [ ] Zero console errors in dev and production
- [ ] Mobile responsive at 380px, 768px, 1440px
- [ ] Components wrapped in error boundaries where applicable
- [ ] Loading states implemented (skeleton or spinner)
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard navigation, focus rings
- [ ] Performance: no render-blocking resources, lazy-loaded below-fold content
- [ ] `will-change-transform` on animated elements
- [ ] `prefers-reduced-motion` media query fallbacks for all animations
- [ ] No GSAP and Framer Motion on the same DOM element
- [ ] Images use `next/image` with explicit dimensions
- [ ] All text content uses responsive `clamp()` values

---

## 9. MODE-SPECIFIC BEHAVIOR ENHANCEMENTS

### 🏗️ Architect Mode

- Read `CLAUDE.md`, `AI_CONTEXT.md`, and `lib/` constants before planning.
- Save plans as markdown files in `plans/` directory with descriptive names.
- Always list files that will be changed before implementation.
- Include Mermaid diagrams for complex flows (state machines, payment flow, animation sequences).
- Never estimate time (hours/days) for tasks.

### 💻 Code Mode

- Read `app/globals.css` and relevant component files before making changes.
- Use `apply_diff` for surgical edits on existing files; use `write_to_file` for new files only.
- Always import `cn` from `@/lib/utils` for class merging.
- Test build with `npm run build` before marking complete.
- Write complete files — no truncation, no placeholders.

### ❓ Ask Mode

- Reference source files with line numbers in responses.
- Use `[filename](relative/path/file.ts:line)` format for all references.
- When explaining concepts, reference actual project code as examples.

### 🪲 Debug Mode

- Check `.env.local` for required vars first.
- Check Supabase RLS policies if database operations fail.
- Check Razorpay webhook signature verification if payments fail.
- Check `StrictMode` double-mounting effects for GSAP issues.
- Check `localStorage` for stale Zustand state.

### 🪃 Orchestrator Mode

- Break tasks into subtasks and delegate to appropriate modes.
- First read all relevant source files to understand current state.
- Generate todo lists that are specific enough for other modes to execute independently.
- Coordinate between frontend (components) and backend (API routes) work.

---

## 10. ENVIRONMENT VARIABLES REFERENCE

```env
NEXT_PUBLIC_SUPABASE_URL=          # Browser-safe Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Browser-safe anon key
SUPABASE_SERVICE_ROLE_KEY=         # Server-only — NEVER NEXT_PUBLIC_
SUPABASE_STORAGE_BUCKET=           # invite-media
NEXT_PUBLIC_RAZORPAY_KEY_ID=       # Browser-safe
RAZORPAY_KEY_SECRET=               # Server-only
NEXT_PUBLIC_APP_URL=               # Deployed URL
NEXT_PUBLIC_WHATSAPP_NUMBER=       # 919846224086
ADMIN_SECRET=                      # Cookie value for admin auth
```

---

## 11. COMMON PITFALLS TO AVOID

- ❌ Using `pages/` directory instead of App Router
- ❌ Mixing GSAP and Framer Motion on the same element
- ❌ Exposing service role key to the browser
- ❌ Using `any` type instead of defining proper interfaces
- ❌ Creating separate pages per template instead of using config-driven approach
- ❌ Truncating code with `// rest remains the same` comments
- ❌ Forgetting `prefers-reduced-motion` fallbacks for CSS animations
- ❌ Using `img` tag instead of `next/image`
- ❌ Writing non-responsive pixel values instead of `clamp()`
- ❌ Creating new color variables instead of using the existing design system tokens
