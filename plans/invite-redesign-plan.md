# Invite Page Redesign — Completion Summary

## Architectural Decisions (Executed)

| Decision             | Choice                                                                            |
| -------------------- | --------------------------------------------------------------------------------- |
| Gatekeeper placement | Replaces PreLoader entirely — shows immediately when data is ready                |
| GSAP SplitText       | Vanilla JS letter splitting (no Club GSAP plugin)                                 |
| Hero image source    | Dedicated `hero_photo` field on `orders` table — fallback to first media photo    |
| RSVP button labels   | Props from InvitePageContent; defaults: "Joyfully Accept" / "Regretfully Decline" |

---

## ✅ Step 1: Gatekeeper Screen

### Files

- **CREATED:** `components/invite/Gatekeeper.tsx`
- **DELETED:** `components/invite/PreLoader.tsx`

### Implementation

- Full-screen monogram overlay (`z-[100]`) with `var(--template-bg)` background
- `MonogramInitial` component — framer-motion scale-in with `easeOutBack`
- `TapToOpenButton` — pulsing CTA with `box-shadow` glow using template primary color
- 12 floating `GatekeeperParticles` with random orbit animation
- State machine: `locked` → `unlocking` → `fading-out` → `revealed`
- On tap: `AudioContext.resume()` unlocks Web Audio API, then signals `GlobalMusicPlayer` via `play` prop
- Exit animation: `opacity: 0, scale: 1.05, filter: blur(8px)` over 800ms

### Audio Architecture

- Gatekeeper handles Web Audio unlock only (no direct audio playback)
- `GlobalMusicPlayer` receives `play` prop to begin music on unlock
- Audio starts with fade-in (0 → target volume over 2s) via `useAudioPlayer`

---

## ✅ Step 2: Cinematic Hero & Countdown

### Files Modified

- `components/invite/HeroSection.tsx` — Major rewrite
- `components/invite/CountdownTimer.tsx` — Fix + glassmorphism integration

### Hero Changes

- Full-bleed `<Image>` with `fill` + `object-cover` using `heroPhoto` prop
- Dark gradient overlay: `bg-gradient-to-b from-transparent via-transparent to-black/60`
- GSAP letter-splitting: two name lines + ampersand bullet, staggered with `stagger: 0.03`
- `FallingParticles` component — GSAP timeline with `repeat: -1`, particle types: sparkles/leaves/bokeh/stars
- Subtitle ("are getting married!") fades up after names via GSAP timeline
- Date displayed with template accent font
- `BorderFrame` component preserved with template styling
- Scroll-down chevron at bottom

### Countdown Integration

- Rendered inside Hero at bottom: `backdrop-blur-md bg-white/10 rounded-2xl border border-white/20`
- **Fixed:** `initial={{ strokeDashoffset: c }}` on `motion.circle` (was missing, causing `strokeDashoffset from "undefined"`)
- **Added:** `willChange: 'stroke-dashoffset'` on animated circle
- **Added:** `style={{ color: accentColor ?? undefined }}` on numeric value text
- Separate `Ring` component for each time unit (days, hours, minutes, seconds)
- Standalone countdown section removed from `InvitePageContent.client.tsx`

---

## ✅ Step 3: Parallax Gallery & Horizontal Events

### Files Modified

- `components/invite/MediaGallery.tsx` — Refactor
- `components/invite/EventTimeline.tsx` — Refactor
- `components/invite/EventCard.tsx` — iOS button styling

### Gallery Changes

- Replaced grid with `react-masonry-css` Masonry component (already in deps)
- GSAP ScrollTrigger: `.masonry-column` elements drift in opposite `y` directions with `scrub: 1.5`
- Lightbox: prev/next navigation buttons, backdrop blur, `layoutId` animation
- `whileTap={{ scale: 0.98 }}` on thumbnails
- Videos rendered full-width above masonry

### Events Changes

- Converted vertical timeline to horizontal scroll-snap container
- CSS: `scroll-snap-type: x mandatory; overflow-x: auto;`
- Each card: `scroll-snap-align: start; min-width: 85vw;` on mobile
- iOS-style pill buttons with template primary color fill for "Save" (calendar) and "Directions"
- Scroll indicator dots with active state
- "Next" badge on upcoming event
- Removed vertical timeline SVG line and GSAP ScrollTrigger usage

### EventCard Updates

- `rounded-full` iOS-style pill buttons using template accent color
- SVG icons for calendar (add to calendar) and map pin (directions)
- `active:scale-[0.97]` for tap feedback
- ICS file generation preserved

---

## ✅ Step 4: Voice Note & Bottom-Sheet RSVP

### Files Modified

- `components/invite/VoiceMessage.tsx` — Refactor
- `components/invite/RSVPForm.tsx` — Added label props
- `app/invite/[id]/InvitePageContent.client.tsx` — Added RSVP button + sheet

### Voice Note Changes

- Dark card: `bg-gray-900 text-white rounded-3xl p-6 sm:p-8 border border-white/5`
- `EqualizerBars` component: 4 Framer Motion bars with different height arrays and durations
- `canvas-confetti` burst on finish (two-stage burst at 0ms and 200ms)
- `hasFiredConfetti` ref prevents double-fire on replay
- WaveSurfer restyled for dark theme: `waveColor: ${color}30`, `progressColor: color`
- Floating hearts preserved with dark theme styling

### RSVP Bottom Sheet

- **Data layer UNCHANGED** — RSVP form submission logic is sacred
- Floating CTA button: `fixed bottom-6 left-1/2 -translate-x-1/2 z-40`
- Gradient background using template colors, ring icon SVG, uppercase "RSVP NOW"
- Framer Motion spring animation on mount (delay: 1.5s)
- On click → bottom sheet slides up with spring animation (stiffness: 300, damping: 30)
- Sheet: `rounded-t-3xl bg-white shadow-2xl max-h-[90vh]` with drag handle pill
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Header with template-colored title and close X button
- `RSVPForm` rendered inside sheet with `acceptLabel="Joyfully Accept"` / `declineLabel="Regretfully Decline"`
- Inline RSVP section replaced with `<div id="rsvp" />` placeholder

### RSVPForm Updates

- Added `acceptLabel?: string` and `declineLabel?: string` props
- Defaults: `"Joyfully Accept"`, `"Regretfully Decline"`
- Button rendering uses `{choice === "yes" ? acceptLabel : declineLabel}`

### InvitePageContent Wiring

- Removed `<PreLoader>` import and usage
- Wrapped content in `<Gatekeeper>` with `coupleName1`, `coupleName2`, `template`, `onUnlock`
- `showContent` state driven by Gatekeeper's `onUnlock` callback
- Removed inline `CountdownTimer` section
- Removed `inviteUrl` variable
- Added `rsvpOpen` state for bottom sheet
- Floating "RSVP Now" button + bottom sheet with spring animations

---

## File Change Summary (Final)

| Action      | File                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| **CREATE**  | `components/invite/Gatekeeper.tsx`                                     |
| **DELETE**  | `components/invite/PreLoader.tsx` (deprecated, replaced by Gatekeeper) |
| **REWRITE** | `components/invite/HeroSection.tsx`                                    |
| **REWRITE** | `components/invite/CountdownTimer.tsx`                                 |
| **REWRITE** | `components/invite/MediaGallery.tsx`                                   |
| **REWRITE** | `components/invite/EventTimeline.tsx`                                  |
| **REWRITE** | `components/invite/VoiceMessage.tsx`                                   |
| **MODIFY**  | `components/invite/RSVPForm.tsx` (add label props, no logic change)    |
| **MODIFY**  | `components/invite/GlobalMusicPlayer.tsx` (defer to Gatekeeper)        |
| **MODIFY**  | `components/invite/EventCard.tsx` (iOS button styling)                 |
| **MODIFY**  | `app/invite/[id]/InvitePageContent.client.tsx` (orchestration updates) |
| **UPDATE**  | `app/test-preloader/page.tsx` (now tests Gatekeeper instead)           |

---

## Dependencies & Performance

- GSAP ScrollTrigger registered in `useGSAPTimeline` hook
- `canvas-confetti` already in deps
- `react-masonry-css` already in deps
- `framer-motion` already in deps
- All animated elements get `will-change: transform` via Tailwind or inline style
- All GSAP instances cleaned up in `useEffect` return / `gsap.context().revert()`
- No hardcoded Tailwind colors — all theme colors use `var(--template-*)` CSS variables
- Gatekeeper uses Web Audio API context resume to unlock browser audio restrictions
- Build compiles clean: `✓ Compiled in 98ms` (confirmed)
