# WEDINVITER: AI SESSION CONTEXT
## Load this file at the start of every Claude Code session

### PROJECT OVERVIEW
- **Product:** Premium digital wedding invitation SaaS
- **Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase, Razorpay
- **Pricing:** Fixed ₹699 (no tiers, no add-ons)
- **Architecture:** Config-driven templates (1 component tree, 8 visual variations)
- **Flow:** Stateless order form → Razorpay payment → Database insertion → Live invite URL

### CORE PRINCIPLES
1. **Zero Error Policy:** No placeholders, no `// rest of code`, complete files only
2. **Mobile-First:** Every component must be perfect on mobile (380px+)
3. **Performance:** <2s LCP, zero CLS, optimized images, lazy loading
4. **Design:** "Fashion magazine" aesthetic - massive whitespace, fluid typography, striking contrast
5. **TypeScript Strict:** No `any` types, all interfaces in `types/` directory
6. **Config-Driven:** Templates share ONE component tree, variations via `lib/templates.ts`

### KEY TECHNICAL CONSTRAINTS
- **Database writes:** ONLY server-side after payment verification
- **Client state:** Zustand for order form, localStorage backup
- **Animations:** Framer Motion for micro-interactions, GSAP for heavy scroll choreography
- **Images:** Next.js `<Image />` with strict sizing, blur placeholders
- **SEO:** Dynamic OG tags via `generateMetadata()`, WhatsApp-optimized

### FILE STRUCTURE
app/
├── (main)/templates/          # Template gallery
├── invite/[id]/              # Dynamic invite display
├── order/                    # 4-step order form
│   └── steps/               # Step components
├── admin/                    # Admin dashboard
└── api/razorpay/            # Payment verification
components/
├── ui/                      # Base components
├── invite/                  # Invite-specific components
├── order/                   # Order form components
└── layout/                  # Header, Footer
lib/
├── supabase.ts             # Client-side Supabase
├── supabase-server.ts      # Server-side Supabase
├── templates.ts            # Template configuration (CRITICAL)
├── utils.ts                # Utility functions
└── razorpay.ts             # Razorpay utilities
types/
├── database.types.ts       # Supabase generated types
├── order.types.ts          # Order flow types
└── template.types.ts       # Template config types

### CURRENT PRICING MODEL
```typescript
const PRICING = {
  basePrice: 699,
  currency: 'INR',
  features: [
    'Choose from 8 premium templates',
    'Unlimited events & venues',
    'Photo & video gallery',
    'Voice message from couple',
    'Background music',
    'Live countdown timer',
    'Digital RSVP collection',
    'WhatsApp sharing',
    'Valid for 1 year'
  ]
};
```

### ENVIRONMENT VARIABLES (Reference)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=invite-media
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
ADMIN_SECRET=
```

### TEMPLATE SYSTEM ARCHITECTURE
**8 Templates, 1 Component Tree:**
- Template variations controlled by `lib/templates.ts`
- Each template has: colors, fonts, borders, layout flags
- Component (`app/invite/[id]/page.tsx`) reads template config and adapts
- Fix a bug once, it's fixed for all 8 templates

### ORDER FLOW (4 STEPS)
1. **Step 1:** Couple names, wedding date, template selection
2. **Step 2:** Events (Mehendi, Sangeet, Wedding, etc.)
3. **Step 3:** Media upload (photos, videos, voice, song)
4. **Step 4:** Review & payment (₹699 fixed price)

**Critical:** State persists in Zustand + localStorage until payment success.

### PAYMENT VERIFICATION FLOW
User clicks "Pay ₹699"
↓
Frontend creates Razorpay order (/api/razorpay/create)
↓
User completes payment
↓
Razorpay callback with payment_id, order_id, signature
↓
Frontend sends to /api/razorpay/verify
↓
Server verifies signature
↓
Server inserts to database (orders, events, media)
↓
Server generates unique invite_id
↓
Return: { success: true, inviteUrl: '/invite/[Bride Name+groom name+marriage date+16 uniq string]' }
↓
Redirect user to their live invite


### DESIGN SYSTEM TOKENS
```css
/* Core Colors (Tailwind extend) */
--cream: #FBF7F0
--sage: #9CA986
--terracotta: #D4756C
--charcoal: #2D2D2D
--gold: #C9A962

/* Typography Scale */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
--text-xl: clamp(1.5rem, 1.3rem + 1vw, 2rem)
--text-3xl: clamp(2rem, 1.5rem + 2.5vw, 3.5rem)

/* Spacing */
Mobile: 16px / 24px / 32px
Desktop: 24px / 48px / 96px

/* Animation Timing */
--duration-fast: 200ms
--duration-normal: 300ms
--duration-slow: 500ms
--easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### CRITICAL RULES FOR CLAUDE CODE
1. **Always read this file first** before starting any phase
2. **Never truncate code** - write complete files
3. **Test before commit** - verify functionality locally
4. **Mobile-first** - design for 380px, enhance for desktop
5. **Type safety** - strict TypeScript, no `any`
6. **Follow blueprint** - refer to the 3 HTML blueprint files when uncertain
7. **Ask before changing** - if architecture seems unclear, ask the user

### SUCCESS CRITERIA FOR EACH PHASE
- [ ] All TypeScript types defined
- [ ] Zero console errors
- [ ] Mobile responsive (tested at 380px, 768px, 1440px)
- [ ] Components wrapped in error boundaries
- [ ] Loading states implemented
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard navigation
- [ ] Performance: Lighthouse score >90 on mobile

