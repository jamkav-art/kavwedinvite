# CLAUDE.md — WedInviter

## Project
Digital wedding invitation SaaS. Customers order → we build → deliver via WhatsApp link.
Domain: wedinviter.wasleen.com | Stack: Next.js 15, Tailwind, Supabase, Razorpay, GSAP, Framer Motion

## Architecture rules
- App Router ONLY. No pages/ directory. No getServerSideProps.
- Server components by default. Add "use client" only when needed (hooks, browser APIs, Razorpay).
- All Supabase reads in server components use lib/supabase/server.ts
- All client-side Supabase uses lib/supabase/client.ts
- Admin routes use lib/supabase/admin.ts (service role key — NEVER exposed to browser)
- middleware.ts guards ALL /admin/* routes via httpOnly cookie check

## Naming conventions
- Components: PascalCase (HeroSection.tsx)
- Hooks: camelCase with use prefix (useCountdown.ts)
- API routes: always route.ts inside a folder
- Template slugs: kebab-case (royal-maroon, garden-floral)

## Animation rules
- GSAP: text reveals, ScrollTrigger, countdown digit flip, timeline sequences
- Framer Motion: mount/unmount (AnimatePresence), hover/tap, page transitions, stagger
- Never mix GSAP and Framer on the same element

## Templates
- ONE invite page: app/invite/[id]/page.tsx
- Template config lives in lib/templates.ts — array of TemplateConfig objects
- All 8 templates are CSS/font/layout config — NOT separate pages

## Database
- 4 tables: orders, events, media, rsvps
- order_status enum: pending_payment | paid | building | live | expired | refunded
- Unique invite served at /invite/[invite_id] (nanoid slug, not UUID)
- expires_at = delivered_at + 60 days

## Payment flow
1. Browser → POST /api/razorpay/create-order → get rzp_order_id
2. Razorpay modal opens → user pays
3. onSuccess → POST /api/razorpay/verify (HMAC check) → save to Supabase
4. Redirect to /order/success

## Key env vars
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (browser-safe)
SUPABASE_SERVICE_ROLE_KEY (server only — never NEXT_PUBLIC_)
NEXT_PUBLIC_RAZORPAY_KEY_ID (browser-safe)
RAZORPAY_KEY_SECRET (server only)
ADMIN_SECRET (cookie value for admin auth)
NEXT_PUBLIC_WHATSAPP_NUMBER=919846224086
## Invite ID & WhatsApp logic

### Invite URL format
invite_id = slugify(bride_name) + "-" + slugify(groom_name) + "-" + nanoid(16)
Example: priya-rahul-k8x9m2p4n1q7r3t5
Saved to orders.invite_id. Route: /invite/[invite_id]

### WhatsApp message 1 — to owner (fires on /order/success)
wa.me/919846224086 with order summary (names, date, template, order ID)

### WhatsApp message 2 — to client's guests (button on /order/success)  
wa.me/?text=[custom_invite_message from Step 4 form] + invite URL
User taps this button to share their invite link with guests

### WhatsApp message 3 — from admin (fires after marking invite live)
wa.me/91[client_phone] with "Your invite is ready" + invite URL
Generated dynamically in /admin/orders/[id] page
## Invite ID generation (api/razorpay/verify/route.ts)

import { nanoid } from 'nanoid'

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // strip non-ASCII (handles Hindi/Malayalam)
    .replace(/\s+/g, '-')            // spaces to hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .slice(0, 20)                    // max 20 chars per name
}

const invite_id = `${slugifyName(couple_name_1)}-${slugifyName(couple_name_2)}-${nanoid(16)}`
// Example: priya-rahul-k8x9m2p4n1q7r3t5
// Saved to orders.invite_id column (UNIQUE constraint)
// Live at: /invite/[invite_id]

## WhatsApp flow (fires on /order/success — immediately after payment)

### Message A — to owner 919846224086 (auto-opens on page load)
Fires via window.open() with 500ms delay on /order/success mount.
Content: couple names, wedding date, template, order ID, client phone.
Purpose: you get instant notification of new paid order.

### Message B — client's share button (big CTA on /order/success page)  
Pre-filled with: custom_invite_message (from Step 4 form) + invite URL + "going live in 24h"
wa.me/?text=... (no phone number — opens WA contact picker so client can share to anyone)
Client taps this to send to their guests AFTER you deliver.

### Message C — admin delivery button (in /admin/orders/[id])
After you mark invite as live → one-click wa.me/91[client_phone] 
Content: "Your WedInvite is ready! Share this link: [invite_url]"
This is your manual delivery confirmation to the client.

## /order/success page receives via URL params:
?orderId=xxx&inviteId=priya-rahul-k8x9m2p4n1q7r3t5&coupleNames=Priya+%26+Rahul
&weddingDate=2025-02-15&template=royal-maroon&phone=9876543210&message=[encoded]
All passed from /api/razorpay/verify response → client redirects with these params.
## How I work
- I am not a developer. I describe tasks in plain English.
- Before touching any code, always tell me which files are involved and why.
- Always work on the minimum number of files needed.
- Never rewrite full files. Only change what is necessary.
- If a task touches more than 5 files, stop and ask me to confirm before proceeding.
- Prefer small focused changes over large refactors.
- After finishing, tell me what you changed and what you didn't touch.