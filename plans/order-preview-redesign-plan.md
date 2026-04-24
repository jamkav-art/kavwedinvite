# Order Preview Redesign Plan

## Objective

Replace the current modal-based preview in Step 4 with a separate full-page route (`/order/preview`) that renders a live-like wedding invite preview using the user's actual input data, with a payment button at the bottom.

## Current Behavior

1. Step 4 shows a small [`TemplatePreview`](components/order/TemplatePreview.tsx) card (thumbnail-sized) within the form
2. Clicking "Preview Invite" on that card opens a **modal** with basic text details (names, date, events list, template name) — NOT a faithful invite visual
3. Payment button is at the bottom of the Step 4 form

## Desired Behavior

1. The small thumbnail card in Step 4 **remains as-is** for form review context
2. Clicking "Preview Invite" on the thumbnail navigates to `/order/preview` (separate route)
3. The preview page renders a **full, live-like invitation** using:
   - Template colors, fonts, borders, particles
   - Couple names and wedding date (Hero section)
   - Events (timeline cards)
   - Media (photos grid, videos, voice note)
   - Custom message
   - Countdown timer
4. At the bottom of the preview: **same payment button** as Step 4 (`PaymentButtonEnhanced`)
5. A "Back to Review" button returns to Step 4
6. No changes to any existing Step 4 form logic, store, user flow, or structure

## Files to Create

### 1. [`app/order/preview/page.tsx`](app/order/preview/page.tsx) — Preview Route Page

A "use client" page that:

- Reads the store with `useOrderStore()`
- Checks if essential data exists (couple names, template). If not, redirects to `/order`
- Renders the [`OrderPreview`](components/order/OrderPreview.tsx) component
- Uses **fixed positioning** (`position: fixed; inset: 0; z-index: 50`) to break out of the order layout's `max-w-3xl` container, giving full-width preview

**Key Structure:**

```tsx
// app/order/preview/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/hooks/useOrderStore";
import OrderPreview from "@/components/order/OrderPreview";

export default function OrderPreviewPage() {
  const store = useOrderStore();
  const router = useRouter();

  useEffect(() => {
    useOrderStore.persist.rehydrate();
  }, []);

  // Guard: redirect if no essential data
  if (!store.couple_name_1 || !store.template_slug) {
    return null; // or loading skeleton
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[--color-cream]">
      <OrderPreview />
    </div>
  );
}
```

### 2. [`components/order/OrderPreview.tsx`](components/order/OrderPreview.tsx) — Full Preview Component

This is the core of the redesign. It renders a complete invite page experience using the user's data from the Zustand store.

**Architecture:**

The component will:

1. Read all data from `useOrderStore()`
2. Look up the template config from `TEMPLATES` array using `store.template_slug`
3. Map store data to formats compatible with existing invite components
4. Render sections mimicking the live invite layout at `app/invite/[id]/InvitePageContent.client.tsx`

**Data Mapping:**

- `heroPhoto` → first photo from `store.media.photos[0]?.url` (or null)
- `timelineEvents` → map `store.events` to `{ id, name, date, time, venueName, venueAddress, mapLink }` (generate id from index or name)
- `galleryPhotos` → map `store.media.photos` to `{ id, file_url, file_name }` objects
- `galleryVideos` → map `store.media.videos` to `{ id, file_url }` objects
- `voiceUrl` → `store.media.voice?.url`
- `customMessage` → `store.custom_message`

**Sections to Render (top to bottom):**

| Section         | Component/Content                                                                                                                                                 | Source                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Back button bar | Sticky top bar with "← Back to Review" button                                                                                                                     | -                                                |
| Hero            | [`HeroSection`](components/invite/HeroSection.tsx) with couple, weddingDate, template, heroPhoto                                                                  | Store + template                                 |
| Countdown       | [`CountdownTimer`](components/invite/CountdownTimer.tsx) (already inside HeroSection)                                                                             | Store wedding_date                               |
| Voice Message   | [`VoiceMessage`](components/invite/VoiceMessage.tsx) if voice or customMessage exists                                                                             | `store.media.voice.url` + `store.custom_message` |
| Media Gallery   | [`MediaGallery`](components/invite/MediaGallery.tsx) if photos/videos exist                                                                                       | `store.media.photos` / `store.media.videos`      |
| Events Timeline | [`EventTimeline`](components/invite/EventTimeline.tsx) if events exist                                                                                            | `store.events`                                   |
| Payment Section | Custom section with [`AnimatedPrice`](components/order/AnimatedPrice.tsx) + [`PaymentButtonEnhanced`](components/order/PaymentButtonEnhanced.tsx) + `useRazorpay` | Store + payment hook                             |

**Payment Section Design:**

- Same `useRazorpay()` hook and `initializePayment()` call as Step 4
- Same `PaymentButtonEnhanced` component with loading state and disabled reason
- Same `AnimatedPrice` component
- Floral border wrapper card (same visual style as Step 4)
- Validation logic derived from `step4Schema`

**Template CSS Variables applied to wrapper:**

```tsx
const cssVariables = {
  "--template-bg": template.colors.background,
  "--template-text": template.colors.text,
  "--template-primary": template.colors.primary,
  "--template-secondary": template.colors.secondary,
  "--template-accent": template.colors.accent,
  "--template-border": template.colors.border,
  "--pattern-opacity": template.decorations.patternOpacity,
} as React.CSSProperties;
```

**Optional pattern background:**

```tsx
<div className="pointer-events-none absolute inset-0 opacity-[var(--pattern-opacity,0.06)]">
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, var(--template-border) 1px, transparent 0)`,
      backgroundSize: "22px 22px",
    }}
  />
</div>
```

## Files to Modify

### 3. [`components/order/TemplatePreview.tsx`](components/order/TemplatePreview.tsx) — Modify Preview Button

**Changes:**

1. Import `useRouter` from `next/navigation`
2. Add `useRouter()` hook call
3. Change `openPreview()` function to call `router.push('/order/preview')` instead of `setShowPreviewModal(true)`
4. Remove the modal JSX (lines 296-413)
5. Remove `useState` for `showPreviewModal` (keep other imports)
6. Remove the `closePreview` function

**Note:** The small preview card (aspect ratio box with template colors, names, events) must remain unchanged — it serves as the form review visual.

## Component Details

### HeroSection Usage

The existing [`HeroSection`](components/invite/HeroSection.tsx) can be reused directly:

- `couple`: `{ name1: store.couple_name_1, name2: store.couple_name_2 }`
- `weddingDate`: `store.wedding_date`
- `template`: the matched `TemplateConfig`
- `heroPhoto`: `store.media.photos[0]?.url ?? null`

### EventTimeline Usage

The [`EventTimeline`](components/invite/EventTimeline.tsx) expects events with `id` field. Since store events (`EventFormData`) don't have IDs, generate a unique id per event using `event.event_name + '-' + index`:

```tsx
const timelineEvents = store.events.map((event, index) => ({
  id: `preview-${index}`,
  name: event.event_name,
  date: event.event_date,
  time: event.event_time,
  venueName: event.venue_name,
  venueAddress: event.venue_address,
  mapLink: event.venue_map_link || undefined,
}));
```

### MediaGallery Usage

The [`MediaGallery`](components/invite/MediaGallery.tsx) expects `Media[]` type (from `database.types` with `id`, `file_url`, `file_name`, `media_type`, `uploaded_at`). Map store media:

```tsx
const previewPhotos = store.media.photos.map((p, i) => ({
  id: `preview-photo-${i}`,
  file_url: p.url,
  file_name: p.name,
  media_type: "photo" as const,
  uploaded_at: new Date().toISOString(),
}));
```

### CountdownTimer Reuse

The [`CountdownTimer`](components/invite/CountdownTimer.tsx) is already embedded inside `HeroSection` — no extra work needed.

## Data Flow

```
User clicks "Preview Invite" in Step 4
  → router.push('/order/preview')
  → OrderPreviewPage renders
    → OrderPreview component reads useOrderStore (hydrated from localStorage)
    → Maps store data to component props
    → Renders full invite visual with template theming
    → User scrolls to bottom → Payment button
    → Click "Pay Securely" → same Razorpay flow as Step 4
    → Click "← Back to Review" → router.back() or router.push('/order')
```

## Edge Cases & Guards

1. **No data / fresh load**: If user navigates directly to `/order/preview` without filling the form, the page should redirect to `/order`
2. **No events**: Skip the EventTimeline section entirely
3. **No media**: Skip the MediaGallery section; use HeroSection without heroPhoto (gradient background)
4. **No voice/custom message**: Skip the VoiceMessage section
5. **Payment validation**: Same `step4Schema` validation as Step 4; require phone + email before payment
6. **Store hydration**: Call `useOrderStore.persist.rehydrate()` on mount to ensure data is loaded from localStorage

## What NOT to Change

- [`app/order/steps/step4.tsx`](app/order/steps/step4.tsx) — No modifications at all
- [`hooks/useOrderStore.ts`](hooks/useOrderStore.ts) — No modifications
- [`hooks/useRazorpay.ts`](hooks/useRazorpay.ts) — No modifications
- [`components/order/PaymentButtonEnhanced.tsx`](components/order/PaymentButtonEnhanced.tsx) — No modifications
- [`components/order/AnimatedPrice.tsx`](components/order/AnimatedPrice.tsx) — No modifications
- The small preview card in [`TemplatePreview.tsx`](components/order/TemplatePreview.tsx) (lines 46-293) — Leave unchanged

## Summary of Changes

| Action | File                                   | Description                                                                     |
| ------ | -------------------------------------- | ------------------------------------------------------------------------------- |
| CREATE | `app/order/preview/page.tsx`           | New route page, fixed overlay, renders OrderPreview                             |
| CREATE | `components/order/OrderPreview.tsx`    | Full invite preview with all sections + payment                                 |
| MODIFY | `components/order/TemplatePreview.tsx` | Replace modal navigation with `router.push('/order/preview')`, remove modal JSX |
