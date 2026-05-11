# 🚀 WEDINVITER pSEO — PHASED IMPLEMENTATION PLAN

## 20 Pages/Day · 1 Per Hour · 12 Pillars · 50,000+ Queue

---

**Domain**: [`wedinviter.wasleen.com`](https://wedinviter.wasleen.com)
**Engine**: Next.js 16 App Router + Supabase + DeepSeek AI + GitHub Actions
**Target**: 20 pages/day, 1 page generated + published every hour (4h maintenance window)
**Queue Capacity**: 50,000+ keyword-location combinations
**DeepSeek API Key**: `sk-c3b70b23a599435982baa4907a1d31a0`

---

## SYSTEM ARCHITECTURE OVERVIEW

```mermaid
flowchart TD
    subgraph "Hourly Cron (GitHub Actions)"
        A[Trigger: GitHub Actions Schedule\n0 * * * *] --> B[Fetch 1 Queue Item\npriority_score DESC]
        B --> C[Build Context Prompt\nLocation + Topic + Subtopic]
        C --> D[Call DeepSeek API\nmodel: deepseek-chat]
        D --> E[Parse JSON Response]
        E --> F[evaluateContentQuality\n6-dimension scoring]
        F --> G{Quality Score >= 75?}
        G -->|YES| H[Insert into published_pages]
        H --> I[Update queue status -> completed]
        I --> J[Ping Vercel Revalidate\n/api/revalidate?secret=...]
        J --> K[Log Success]
        G -->|NO| L{Attempts < 2?}
        L -->|YES| M[Enhance Prompt\nwith failure feedback]
        M --> D
        L -->|NO| N[Mark queue -> failed]
        N --> O[Log Failure]
    end

    subgraph "Vercel (Next.js ISR)"
        P[12 Pillar Dynamic Routes\n/wedding-invitations/[loc]/[sub]\n/wedding-venues/[loc]/[sub]\n...] --> Q[Fetch from published_pages]
        Q --> R[Render Page + JSON-LD Schema]
        R --> S[ISR Cache: revalidate 86400s]
        J --> T[Cache-Bust Specific URL]
    end

    subgraph "Supabase (PostgreSQL)"
        U[(wedding_locations\n136 rows)] --> V[(content_queue\n50,000+ rows)]
        W[(wedding_topics\n12 rows)] --> V
        X[(wedding_subtopics\n240 rows)] --> V
        V --> Y[(published_pages)]
        Y --> Z[(generation_logs)]
    end
```

---

## KEY DIFFERENCES FROM EXISTING 10/DAY PLAN

| Aspect                 | Old Plan (10/day)                          | New Plan (20/day, hourly)           |
| ---------------------- | ------------------------------------------ | ----------------------------------- |
| Generation cadence     | Single batch at 2:00 AM UTC                | 1 page every hour, 20 hours/day     |
| Script mode            | Batch fetch 10 items, process sequentially | Single-item fetch + process per run |
| GitHub Actions trigger | `0 2 * * *` (once daily)                   | `0 * * * *` (every hour, 4h break)  |
| Queue function         | `get_next_wedding_queue_items(p_limit 10)` | `get_next_single_queue_item()`      |
| API cost/month         | ~₹50-100 (10 pages × 8K tokens)            | ~₹100-200 (20 pages × 8K tokens)    |
| Generation time budget | Single 5-8 min window                      | 1 hour per page = ample time        |
| Retry logic            | Inline within batch                        | Same, but non-blocking across hours |
| Sitemap updates        | Daily                                      | Real-time after each publish        |

---

## PHASE 0: FOUNDATION & ENVIRONMENT AUDIT

### 0.1 — Verify Supabase Access

- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` has full access to create tables, functions, and triggers
- [ ] Test connection using existing [`lib/supabase/admin.ts`](lib/supabase/admin.ts:5) pattern
- [ ] Verify no table name conflicts with existing schema (`orders`, `events`, `media`, `rsvps`, `question_bank`, `quiz_sessions`, `quiz_taker_sessions`)

### 0.2 — Environment Variables Audit

Current `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=https://lmfpgmnsrhjrpzzedsjk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

New vars needed for `.env.local`:

```bash
# pSEO System
DEEPSEEK_API_KEY=sk-c3b70b23a599435982baa4907a1d31a0
VERCEL_REVALIDATE_SECRET=<generate_random_32char_base64>
NEXT_PUBLIC_SITE_URL=https://wedinviter.wasleen.com
DAILY_GENERATION_LIMIT=20
```

### 0.3 — Install Additional Dependencies

- `@supabase/supabase-js` — already installed (`^2.103.3`)
- `tsx` — needed for running generation script locally

```bash
npm install -D tsx
```

### 0.4 — Directory Structure for pSEO

Create these directories:

```
scripts/
  pseo/
    generate-wedding-content.ts   # Main generation script (modified for single-item)
    seed-database.ts              # Seed locations, topics, subtopics, queue
    quality-control.ts            # Quality evaluation utilities
    types.ts                      # Shared pSEO TypeScript types
    utils.ts                      # Prompt builder, schema generator, etc.

app/
  api/
    revalidate/route.ts           # Vercel cache revalidation webhook
    pseo/status/route.ts          # API endpoint for queue status

components/
  pseo/
    PageRenderer.tsx              # Universal page renderer for pSEO content
    PageIntro.tsx                 # Intro section component
    PageFAQs.tsx                  # FAQ accordion component
    PageCTA.tsx                   # CTA section component
    PageBenefits.tsx              # Benefits grid component
    PageLocalInsights.tsx         # Local insights component
    PagePricing.tsx               # Pricing table component
    PageRelated.tsx               # Related pages component
    PageSchema.tsx                # JSON-LD schema injection component

lib/
  pseo/
    client.ts                     # Supabase admin client for pSEO
    scoring.ts                    # Quality scoring logic
    prompts.ts                    # Prompt builder functions
    schema.ts                     # Schema markup generators
    queue.ts                      # Queue management utilities
    types.ts                      # All pSEO TypeScript types
```

---

## PHASE 1: DATABASE SCHEMA & SEED DATA

### 1.1 — Create pSEO Tables in Supabase

Execute the following SQL in Supabase SQL Editor. These 7 tables coexist with your existing tables.

**Table: `wedding_locations`** (136 rows)

```sql
CREATE TABLE wedding_locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('city', 'state', 'union-territory')),
  parent_state TEXT,
  region TEXT,                           -- 'north', 'south', 'east', 'west', 'northeast', 'central'
  population INTEGER,
  search_volume INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 50,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  tier INTEGER DEFAULT 3,               -- 1=Tier1, 2=Tier2, 3=Tier3
  cultural_tags TEXT[],                  -- ARRAY['hindu','muslim','christian','sikh',...]
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_wl_priority ON wedding_locations(priority DESC, search_volume DESC);
CREATE INDEX idx_wl_tier ON wedding_locations(tier);
```

Seed data: 28 states + 8 UTs + 100 cities = **136 locations**. Tier 1 (priority=100): Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Kerala(kochi,ernamkulam,Thrissur,Trivandrum,kasargod,kannur,kozhikode,calicut,malappuram,palakad,alappuzha,kollam,pathanamthitta,idukki). Tier 2 (priority=75): Jaipur, Lucknow, Surat, Indore, Nagpur, Visakhapatnam, etc.

**Table: `wedding_topics`** (12 rows)

```sql
CREATE TABLE wedding_topics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  pillar_type TEXT NOT NULL CHECK (pillar_type IN ('primary', 'supporting')),
  description TEXT,
  icon TEXT,                              -- Emoji or icon identifier
  search_volume INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW()
);
```

12 topics: `wedding-invitations` (primary), `wedding-venues`, `wedding-planning`, `bridal-fashion`, `wedding-makeup`, `wedding-photography`, `wedding-catering`, `wedding-decorations`, `wedding-entertainment`, `wedding-rituals`, `wedding-gifts`, `honeymoon-planning`.

**Table: `wedding_subtopics`** (240 rows)

```sql
CREATE TABLE wedding_subtopics (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER REFERENCES wedding_topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  search_modifier TEXT,                    -- 'best', 'top', 'affordable', 'luxury', NULL
  cultural_context TEXT,                   -- 'hindu', 'muslim', 'christian', 'sikh', NULL
  search_volume INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(topic_id, slug)
);
```

Each topic has 20 subtopics → 12 × 20 = 240 subtopics.

**Table: `content_queue`** (50,000+ rows)

```sql
CREATE TABLE content_queue (
  id SERIAL PRIMARY KEY,
  location_id INTEGER REFERENCES wedding_locations(id),
  topic_id INTEGER REFERENCES wedding_topics(id),
  subtopic_id INTEGER REFERENCES wedding_subtopics(id),
  url_slug TEXT NOT NULL UNIQUE,           -- "wedding-invitations/mumbai/digital-invitations"
  target_keyword TEXT NOT NULL,
  search_volume INTEGER,
  keyword_difficulty INTEGER,
  priority_score INTEGER,                  -- Auto-calculated
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','generating','completed','failed')),
  last_error TEXT,
  scheduled_date DATE,
  generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cq_status_priority ON content_queue(status, priority_score DESC);
CREATE INDEX idx_cq_scheduled ON content_queue(scheduled_date);
```

**Table: `published_pages`**

```sql
CREATE TABLE published_pages (
  id SERIAL PRIMARY KEY,
  queue_id INTEGER REFERENCES content_queue(id) UNIQUE,
  url_path TEXT NOT NULL UNIQUE,
  topic_slug TEXT NOT NULL,                -- For sitemap grouping
  location_slug TEXT NOT NULL,
  subtopic_slug TEXT,

  -- SEO fields
  title TEXT NOT NULL,
  meta_description TEXT,
  h1_heading TEXT,
  canonical_url TEXT,

  -- Content (JSONB)
  intro_section JSONB,
  benefits JSONB,
  main_content JSONB,
  local_insights JSONB,
  vendor_recommendations JSONB,
  faqs JSONB,
  testimonials JSONB,
  pricing_table JSONB,
  cta_section JSONB,
  related_pages JSONB,

  -- Structured Data
  schema_json JSONB,

  -- Metrics
  quality_score INTEGER,
  location_specificity_score INTEGER,
  cultural_relevance_score INTEGER,
  actionability_score INTEGER,
  word_count INTEGER,

  -- Tracking
  view_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  published_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pp_url ON published_pages(url_path);
CREATE INDEX idx_pp_quality ON published_pages(quality_score DESC);
CREATE INDEX idx_pp_topic_location ON published_pages(topic_slug, location_slug);
```

**Table: `wedding_vendors`** (optional, for future enrichment)

```sql
CREATE TABLE wedding_vendors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location_id INTEGER REFERENCES wedding_locations(id),
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  rating DECIMAL(3, 2),
  review_count INTEGER,
  price_range TEXT,
  services JSONB,
  portfolio_images JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_wv_cat_loc ON wedding_vendors(category, location_id, rating DESC);
```

**Table: `generation_logs`**

```sql
CREATE TABLE generation_logs (
  id SERIAL PRIMARY KEY,
  queue_id INTEGER REFERENCES content_queue(id),
  status TEXT NOT NULL CHECK (status IN ('success','failed','timeout','low_quality','keyword_stuffing')),
  error_message TEXT,
  quality_score INTEGER,
  api_tokens_used INTEGER,
  generation_time_seconds INTEGER,
  api_cost DECIMAL(10, 6),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gl_status ON generation_logs(status);
CREATE INDEX idx_gl_date ON generation_logs(created_at);
```

### 1.2 — Create Database Functions

**Function: `get_next_single_queue_item()`**

```sql
CREATE OR REPLACE FUNCTION get_next_single_queue_item()
RETURNS TABLE (
  queue_id INTEGER,
  location_name TEXT,
  location_slug TEXT,
  topic_name TEXT,
  topic_slug TEXT,
  subtopic_name TEXT,
  subtopic_slug TEXT,
  target_keyword TEXT,
  url_slug TEXT,
  priority_score INTEGER,
  cultural_context TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cq.id AS queue_id,
    wl.name AS location_name,
    wl.slug AS location_slug,
    wt.name AS topic_name,
    wt.slug AS topic_slug,
    ws.name AS subtopic_name,
    ws.slug AS subtopic_slug,
    cq.target_keyword,
    cq.url_slug,
    cq.priority_score,
    ws.cultural_context AS cultural_context
  FROM content_queue cq
  JOIN wedding_locations wl ON cq.location_id = wl.id
  JOIN wedding_topics wt ON cq.topic_id = wt.id
  LEFT JOIN wedding_subtopics ws ON cq.subtopic_id = ws.id
  WHERE cq.status = 'pending'
    AND (cq.scheduled_date IS NULL OR cq.scheduled_date <= CURRENT_DATE)
  ORDER BY cq.priority_score DESC, cq.created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;               -- Prevents concurrent workers picking same item
END;
$$ LANGUAGE plpgsql;
```

**Function: `get_queue_statistics()`**

```sql
CREATE OR REPLACE FUNCTION get_queue_statistics()
RETURNS TABLE (
  total_items BIGINT,
  pending BIGINT,
  completed BIGINT,
  failed BIGINT,
  generating BIGINT,
  avg_priority NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_items,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT AS pending,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT AS completed,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT AS failed,
    COUNT(*) FILTER (WHERE status = 'generating')::BIGINT AS generating,
    ROUND(AVG(priority_score), 1) AS avg_priority
  FROM content_queue;
END;
$$ LANGUAGE plpgsql;
```

**Function: `generate_initial_content_queue()`**

```sql
CREATE OR REPLACE FUNCTION generate_initial_content_queue()
RETURNS INTEGER AS $$
DECLARE
  inserted_count INTEGER;
BEGIN
  INSERT INTO content_queue (location_id, topic_id, subtopic_id, url_slug, target_keyword, search_volume, priority_score)
  SELECT
    wl.id,
    wt.id,
    ws.id,
    wt.slug || '/' || wl.slug || '/' || ws.slug,
    ws.name || ' in ' || wl.name,
    COALESCE(ws.search_volume, 0) * COALESCE(wl.search_volume, 0) / 100,
    ROUND(
      (COALESCE(wl.search_volume, 100) / GREATEST(COALESCE(wl.priority, 1), 1)) *
      (wl.priority::DECIMAL / 100) *
      (wt.priority::DECIMAL / 100)
    )::INTEGER
  FROM wedding_locations wl
  CROSS JOIN wedding_topics wt
  JOIN wedding_subtopics ws ON ws.topic_id = wt.id;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;
```

### 1.3 — Seed Data

**Locations CSV** (in [`scripts/pseo/seed-database.ts`]):

- 8 Tier 1 cities (priority=100): Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad + Kerala cities(kochi,ernamkulam,Thrissur,Trivandrum,kasargod,kannur,kozhikode,calicut,malappuram,palakad,alappuzha,kollam,pathanamthitta,idukki)
- 15 Tier 2 cities (priority=75): Jaipur, Lucknow, Surat, Indore, Nagpur, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Coimbatore, Agra, Madurai, Nashik, Faridabad
- ~80 Tier 3 cities (priority=50): All remaining cities from the 100+ list
- 28 States (priority=40)
- 8 UTs (priority=30)

**Topics seed data** in SQL: 12 rows with priority and search volume.

**Subtopics seed data**: 20 per topic × 12 topics = 240 rows.

**Queue generation**: Run `SELECT generate_initial_content_queue();` → 136 × 12 × 20 = ~32,640 combinations minimum. Additional modifier combinations push queue to 50,000+.

---

## PHASE 2: GENERATION SCRIPT (MODIFIED FOR 1-PER-HOUR)

### 2.1 — Core Architecture Change

The existing script at [`plans/pSEO for Wedinviter.wasleen.com/generate-wedding-content.ts`](plans/pSEO%20for%20Wedinviter.wasleen.com/generate-wedding-content.ts:1) was built for batch processing (fetch 10, process all). We need to modify it for **single-item execution**:

**Old flow** (10/day batch):

```
main() → fetch 10 items → for each: gen → eval → publish → log → next
```

**New flow** (1-per-hour):

```
main() → fetch 1 item → gen → eval → publish → log → revalidate → done
```

### 2.2 — New File: [`scripts/pseo/generate-wedding-content.ts`]

Key modifications from the existing script:

| Aspect           | Old Code                                                        | New Code                                        |
| ---------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| Queue fetch      | `supabase.rpc('get_next_wedding_queue_items', { p_limit: 10 })` | `supabase.rpc('get_next_single_queue_item')`    |
| Daily limit      | `DAILY_LIMIT` constant controls fetch count                     | No limit needed — cron controls frequency       |
| Loop logic       | `for (const item of items)`                                     | Single item processing, exit                    |
| Hourly tracking  | Not needed                                                      | Log `generated_at` timestamp for queue analysis |
| Failure handling | Retry immediately within batch                                  | Retry immediately (same run, 1 hour budget)     |
| Success handling | Continue to next item                                           | Exit cleanly                                    |

```typescript
// scripts/pseo/generate-wedding-content.ts
// CRITICAL CHANGES from existing plan version:

// 1. Import from new lib/pseo/ modules instead of inline code
import { evaluateContentQuality } from "@/lib/pseo/scoring";
import { buildWeddingPrompt } from "@/lib/pseo/prompts";
import { generateSchemaMarkup } from "@/lib/pseo/schema";
import { createPseoClient } from "@/lib/pseo/client";

// 2. CONFIG
const CONFIG = {
  // ... same as before but DAILY_LIMIT removed (cron controls it)
  MIN_QUALITY_SCORE: 75,
  MAX_RETRIES: 2,
};

// 3. main() - Single item processing
async function main() {
  console.log(`🚀 WedInviter pSEO Generation — ${new Date().toISOString()}`);

  // Fetch ONE item from queue
  const { data: item, error } = await supabase.rpc(
    "get_next_single_queue_item",
  );

  if (error || !item) {
    console.log("✅ No items in queue. All done!");
    return;
  }

  const success = await processQueueItem(item);
  process.exit(success ? 0 : 1);
}
```

### 2.3 — Shared Library: [`lib/pseo/scoring.ts`]

Extract the `evaluateContentQuality()` function from the existing script into a reusable module, with the **keyword stuffing detection bug fixed**:

```typescript
// Fix operator precedence bug from original:
// Old: content.vendor_recommendations?.length || 0 * 10
// New: (content.vendor_recommendations?.length || 0) * 10
// Same fix for testimonials
```

### 2.4 — Shared Library: [`lib/pseo/prompts.ts`]

Extract `buildWeddingPrompt()` from existing script. Add:

- Tier-based prompt enhancements (Tier 1 cities get more detail)
- Cultural context auto-injection based on `location.region`
- Dynamic pricing ranges based on city tier

### 2.5 — Shared Library: [`lib/pseo/client.ts`]

Create a dedicated Supabase admin client for pSEO operations:

```typescript
import { createClient } from "@supabase/supabase-js";

export function createPseoClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
```

### 2.6 — Quality Control Integration

The existing `.roo/skills/pseo-quality-control/SKILL.md` defines the quality scoring system. The code must respect:

- **Pre-publication gate**: Score ≥ 75 to publish
- **Max 2 retries** with enhanced prompts
- **Keyword stuffing detection**: Density > 3% triggers regeneration
- **6-dimension scoring**: Location specificity (20%), Cultural relevance (15%), Actionability (15%), Readability (15%), Keyword optimization (15%), Uniqueness (20%)

---

## PHASE 3: DYNAMIC ROUTES & UI COMPONENTS

### 3.1 — Create 12 Pillar Route Directories

```
app/
  wedding-invitations/
    [location]/
      [subtopic]/
        page.tsx          ← Dynamic SSR page with ISR
  wedding-venues/
    [location]/
      [subtopic]/
        page.tsx
  wedding-planning/
    [location]/
      [subtopic]/
        page.tsx
  bridal-fashion/
    [location]/
      [subtopic]/
        page.tsx
  wedding-makeup/
    [location]/
      [subtopic]/
        page.tsx
  wedding-photography/
    [location]/
      [subtopic]/
        page.tsx
  wedding-catering/
    [location]/
      [subtopic]/
        page.tsx
  wedding-decorations/
    [location]/
      [subtopic]/
        page.tsx
  wedding-entertainment/
    [location]/
      [subtopic]/
        page.tsx
  wedding-rituals/
    [location]/
      [subtopic]/
        page.tsx
  wedding-gifts/
    [location]/
      [subtopic]/
        page.tsx
  honeymoon-planning/
    [location]/
      [subtopic]/
        page.tsx
```

### 3.2 — Page Template ([`app/wedding-invitations/[location]/[subtopic]/page.tsx`])

```typescript
import { createPseoClient } from '@/lib/pseo/client';
import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/pseo/PageRenderer';

interface Props {
  params: Promise<{ location: string; subtopic: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { location, subtopic } = await params;
  const supabase = createPseoClient();

  const { data: page } = await supabase
    .from('published_pages')
    .select('title, meta_description')
    .eq('url_path', `/wedding-invitations/${location}/${subtopic}`)
    .single();

  if (!page) return {};

  return {
    title: page.title,
    description: page.meta_description,
    alternates: {
      canonical: `https://wedinviter.wasleen.com/wedding-invitations/${location}/${subtopic}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { location, subtopic } = await params;
  const supabase = createPseoClient();

  const { data: page } = await supabase
    .from('published_pages')
    .select('*')
    .eq('url_path', `/wedding-invitations/${location}/${subtopic}`)
    .single();

  if (!page) notFound();

  return <PageRenderer page={page} />;
}

export const revalidate = 86400; // 24-hour ISR
```

### 3.3 — Route Optimization

Since all 12 pillar routes have identical logic (only the URL pattern changes), create a **shared page component** that all routes import:

```typescript
// lib/pseo/page-component.tsx
export async function generatePseoMetadata(
  supabase: any,
  urlPath: string
): Promise<Metadata> { ... }

export default async function PseoPage({
  params,
  pillarSlug,
}: {
  params: { location: string; subtopic: string };
  pillarSlug: string;
}) { ... }
```

This avoids duplicating code across 12 route files. Each route file becomes a 5-line wrapper.

### 3.4 — UI Components

Build these components in [`components/pseo/`]:

| Component           | File                      | Purpose                                                       |
| ------------------- | ------------------------- | ------------------------------------------------------------- |
| `PageRenderer`      | [`PageRenderer.tsx`]      | Top-level orchestrator, renders all sections + JSON-LD script |
| `PageIntro`         | [`PageIntro.tsx`          | Hero/intro section with hook, context, preview                |
| `PageBenefits`      | [`PageBenefits.tsx`]      | Benefits grid with icons                                      |
| `PageMainContent`   | [`PageMainContent.tsx`]   | Main content sections with H2/H3 hierarchy                    |
| `PageLocalInsights` | [`PageLocalInsights.tsx`] | Venues, seasons, costs, customs cards                         |
| `PageVendorRecs`    | [`PageVendorRecs.tsx`]    | Vendor recommendation cards                                   |
| `PageFAQs`          | [`PageFAQs.tsx`]          | Accordion FAQ section with JSON-LD                            |
| `PageTestimonials`  | [`PageTestimonials.tsx`]  | Testimonial carousel                                          |
| `PagePricing`       | [`PagePricing.tsx`]       | Pricing table comparison                                      |
| `PageCTA`           | [`PageCTA.tsx`]           | Call-to-action section                                        |
| `PageRelated`       | [`PageRelated.tsx`]       | Related pages internal linking grid                           |
| `PageSchema`        | [`PageSchema.tsx`]        | Injects all JSON-LD schema types                              |

### 3.5 — Design System

All pSEO pages should match the existing WedInviter brand:

- Fonts: Cormorant Garamond (headings) + Inter (body) — already in [`public/fonts/`]
- Colors: Use the existing Tailwind theme from [`tailwind.config.ts`]
- Responsive: Mobile-first, same as existing invite pages
- Performance: Target <2s LCP, all Core Web Vitals green

---

## PHASE 4: API LAYER

### 4.1 — Revalidation Webhook ([`app/api/revalidate/route.ts`])

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.VERCEL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const { pillar, slug } = await request.json();
  // slug = "mumbai/digital-invitations"

  revalidatePath(`/${pillar}/${slug}`);

  return NextResponse.json({ revalidated: true });
}
```

### 4.2 — Enhanced Sitemap ([`app/sitemap.ts`])

Modify the existing sitemap to include pSEO pages:

```typescript
// Add pSEO pages from published_pages table
const { data: pseoPages } = await adminClient
  .from("published_pages")
  .select("url_path, published_at");

const pseoUrls = (pseoPages || []).map((page) => ({
  url: `${APP_URL}${page.url_path}`,
  lastModified: new Date(page.published_at),
  changeFrequency: "weekly" as const,
  priority: 0.8,
}));
```

Consider implementing **sitemap index** splitting if URLs exceed 50,000:

```
/sitemap.xml → index of:
  /sitemap-invitations.xml
  /sitemap-venues.xml
  /sitemap-planning.xml
  ...
  /sitemap-dynamic-invites.xml  (existing invite pages)
```

### 4.3 — Queue Status API ([`app/api/pseo/status/route.ts`])

Read-only endpoint to check queue health:

```typescript
// Returns: { total, pending, completed, failed, generating, avg_priority }
GET / api / pseo / status;
```

### 4.4 — Robots.txt

No changes needed — existing [`app/robots.ts`](app/robots.ts:1) already allows all paths except `/admin`, `/order`, `/api`. pSEO content paths are all under `/wedding-invitations/*`, `/wedding-venues/*`, etc. — all allowed.

---

## PHASE 5: GITHUB ACTIONS HOURLY CRON

### 5.1 — Workflow File (`.github/workflows/pseo-hourly-generation.yml`)

```yaml
name: pSEO Hourly Generation

on:
  schedule:
    # Run every hour from 00:00 to 19:00 UTC (20 runs)
    # 4-hour maintenance window 20:00-23:59 UTC
    - cron: "0 0-19 * * *"
  workflow_dispatch: # Manual trigger for testing
    inputs:
      force_page_count:
        description: "Number of pages to generate (default: 1)"
        required: false
        default: "1"

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 45 # Max 45 min per page (DeepSeek can be slow)

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Generate 1 Wedding Content Page
        run: npx tsx scripts/pseo/generate-wedding-content.ts
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
          VERCEL_REVALIDATE_SECRET: ${{ secrets.VERCEL_REVALIDATE_SECRET }}
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

      - name: Notify on Failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '⚠️ pSEO Generation Failed — ' + new Date().toISOString(),
              body: 'Hourly pSEO generation failed. Check workflow logs: ' +
                    context.serverUrl + '/' + context.repo.owner + '/' + context.repo.repo +
                    '/actions/runs/' + context.runId
            })
```

### 5.2 — GitHub Secrets Required

| Secret                      | Value                                      |
| --------------------------- | ------------------------------------------ |
| `SUPABASE_URL`              | `https://lmfpgmnsrhjrpzzedsjk.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | (from `.env.local`)                        |
| `DEEPSEEK_API_KEY`          | `sk-c3b70b23a599435982baa4907a1d31a0`      |
| `VERCEL_REVALIDATE_SECRET`  | (generate random 32-char base64)           |
| `NEXT_PUBLIC_SITE_URL`      | `https://wedinviter.wasleen.com`           |

### 5.3 — Hourly Schedule Logic

The cron `0 0-19 * * *` means:

- Runs at minute 0 of every hour from 00:00 UTC to 19:00 UTC
- **20 runs per day** (hours 0, 1, 2, ..., 18, 19)
- **4-hour maintenance window** 20:00-23:59 UTC
- Each run: fetch 1 item, generate, evaluate, publish, revalidate

**Timezone mapping** (Dubai = UTC+4):

- 00:00 UTC → 04:00 Dubai (first generation)
- 19:00 UTC → 23:00 Dubai (last generation)
- Pages spread evenly across the Dubai waking day

---

## PHASE 6: DEPLOYMENT & INITIAL LAUNCH

### 6.1 — Local Testing Sequence

```bash
# Step 1: Install dependencies
npm install -D tsx
npm install @supabase/supabase-js    # Already installed

# Step 2: Add env vars to .env.local
echo "DEEPSEEK_API_KEY=sk-c3b70b23a599435982baa4907a1d31a0" >> .env.local
echo "VERCEL_REVALIDATE_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")" >> .env.local
echo "DAILY_GENERATION_LIMIT=20" >> .env.local

# Step 3: Run database migration SQL in Supabase
# (All 7 CREATE TABLE statements + functions)

# Step 4: Seed database
npx tsx scripts/pseo/seed-database.ts

# Step 5: Test single generation
npx tsx scripts/pseo/generate-wedding-content.ts

# Step 6: Verify page renders locally
npm run dev
# Visit: http://localhost:3000/wedding-invitations/mumbai/digital-invitations
```

### 6.2 — Vercel Deployment

```bash
# Deploy to Vercel
npx vercel --prod

# Add environment variables in Vercel Dashboard:
# SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEEPSEEK_API_KEY,
# VERCEL_REVALIDATE_SECRET, NEXT_PUBLIC_SITE_URL
```

### 6.3 — Initial Queue Prioritization

First 30 days of generation (20/day = 600 pages) should target:

| Days  | Focus                                                         | Pages |
| ----- | ------------------------------------------------------------- | ----- |
| 1-7   | Tier 1 cities × Wedding Invitations (8 cities × 10 subtopics) | 140   |
| 8-14  | Tier 1 cities × Wedding Venues (8 cities × 10 subtopics)      | 140   |
| 15-21 | Tier 1 cities × Wedding Planning (8 cities × 10 subtopics)    | 140   |
| 22-25 | Tier 1 cities × Bridal Fashion (8 cities × 10 subtopics)      | 80    |
| 26-30 | Tier 1 cities × Wedding Makeup (8 cities × 10 subtopics)      | 100   |

The priority scoring formula automatically handles this ordering. Queue function returns highest-priority items first.

### 6.4 — Launch Day Checklist

- [ ] All 7 Supabase tables verified (run `SELECT * FROM information_schema.tables WHERE table_schema = 'public'`)
- [ ] Seed data inserted (136 locations, 12 topics, 240 subtopics)
- [ ] Queue generated (32,000+ items minimum)
- [ ] Local generation test successful (1 page published to `published_pages`)
- [ ] Local page rendering verified
- [ ] Build succeeds (`npm run build`)
- [ ] Vercel deployment successful
- [ ] Environment variables set in Vercel
- [ ] Custom domain verified (`wedinviter.wasleen.com`)
- [ ] Revalidation webhook tested
- [ ] GitHub secrets configured (5 secrets)
- [ ] Manual workflow trigger → 1 page generated successfully
- [ ] Sitemap updated with pSEO pages
- [ ] Google Search Console: sitemap submitted

---

## PHASE 7: MONITORING, QUALITY & MAINTENANCE

### 7.1 — Daily Monitoring Dashboard

Create a monitoring script or use Supabase queries daily:

```sql
-- Daily Quality Report
SELECT
  CURRENT_DATE AS report_date,
  COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) AS pages_today,
  ROUND(AVG(quality_score) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 1) AS avg_quality_today,
  COUNT(*) FILTER (WHERE status = 'failed' AND DATE(created_at) = CURRENT_DATE) AS failures_today
FROM generation_logs;
```

### 7.2 — Weekly Quality Checks

As defined in the `pseo-quality-control` skill:

1. Run random 10-page manual spot-check
2. Check bottom-20 quality scores
3. Review failed queue items
4. Check freshness (pages >90 days old)

### 7.3 — Alert Conditions

| Condition                           | Action                                         |
| ----------------------------------- | ---------------------------------------------- |
| 3+ consecutive failures             | Investigate DeepSeek API / Supabase connection |
| Average quality < 75 for a week     | Review/enhance prompts                         |
| Queue running low (< 1,000 pending) | Regenerate queue with new combinations         |
| Generation time > 30 min average    | Check DeepSeek API latency                     |

### 7.4 — Monthly Optimization

- Review top 20 performing pages (by view_count, conversion_count)
- A/B test prompt variations
- Add new subtopics based on search trends
- Refresh old content (regenerate pages >180 days old)
- Add real vendor data to existing pages

### 7.5 — Content Freshness Pipeline

Create a weekly GitHub Actions workflow to identify stale content:

```yaml
# .github/workflows/pseo-freshness-check.yml
on:
  schedule:
    - cron: "0 6 * * 0" # Every Sunday at 06:00 UTC

jobs:
  check-freshness:
    steps:
      - name: Query stale pages
        run: npx tsx scripts/pseo/check-freshness.ts
      - name: Re-queue stale pages
        run: npx tsx scripts/pseo/requeue-stale.ts
```

---

## COST PROJECTIONS

| Item                                                                         | Monthly Cost      |
| ---------------------------------------------------------------------------- | ----------------- |
| Supabase Pro                                                                 | ₹2,000/mo         |
| DeepSeek API (20 pages × 8K tokens × 30 days = 4.8M tokens @ $0.14/M tokens) | ~₹60/mo           |
| GitHub Actions (free tier: 2,000 min/mo, we use ~600)                        | $0                |
| Vercel Hobby (free tier)                                                     | $0                |
| Domain (already owned)                                                       | $0                |
| **Total Monthly**                                                            | **~₹2,060/mo**    |
| **Cost per page**                                                            | **~₹3.40/page**   |
| **Manual equivalent** (freelance @ ₹500/page × 600 pages/mo)                 | **₹3,00,000/mo**  |
| **Savings**                                                                  | **~₹2,98,000/mo** |

---

## TIMELINE SUMMARY

| Phase                  | Duration | Deliverables                                     |
| ---------------------- | -------- | ------------------------------------------------ |
| **Phase 1** Database   | 1-2 days | 7 tables, 3 functions, seed scripts              |
| **Phase 2** Scripts    | 2-3 days | Generation script, shared lib modules            |
| **Phase 3** Routes     | 2-3 days | 12 pillar routes, 12 UI components               |
| **Phase 4** API        | 1 day    | Revalidation webhook, status API, sitemap update |
| **Phase 5** CI/CD      | 1 day    | GitHub Actions workflow, secrets config          |
| **Phase 6** Launch     | 1 day    | Deploy, test, verify, submit sitemap             |
| **Phase 7** Monitoring | Ongoing  | Dashboards, alerts, freshness pipeline           |

**Total active build time**: ~8-11 days
**First page live**: Day 1 of Phase 6
**600 pages (1 month milestone)**: ~30 days from launch

---

## RISK MITIGATION

| Risk                                  | Impact | Mitigation                                               |
| ------------------------------------- | ------ | -------------------------------------------------------- |
| DeepSeek API rate limit (5,000 RPM)   | Low    | 1 request/hour is well within limits                     |
| DeepSeek outage                       | Medium | Script fails gracefully, retries on next hour            |
| Supabase connection issues            | Medium | Logged, alerts via GitHub issue                          |
| Content quality degradation           | High   | 6-dimension scoring gate prevents publishing low quality |
| Google algorithm penalizes AI content | Medium | Focus on unique local insights, cultural specificity     |
| Queue exhaustion (all 50K generated)  | Low    | 50K ÷ 20/day = 6.8 years to exhaust initial queue        |
| Concurrent workflow collisions        | Low    | `FOR UPDATE SKIP LOCKED` prevents double-processing      |

---

## NEXT STEPS

1. **Review and approve** this phased plan
2. **Switch to Code mode** to begin Phase 1 implementation
3. **Start with database migration** — execute SQL in Supabase
4. **Proceed phase-by-phase** with testing before moving to next phase

---

**This plan builds upon the existing [`WEDINVITER_PSEO_MEGA_PLAN.md`](plans/pSEO%20for%20Wedinviter.wasleen.com/WEDINVITER_PSEO_MEGA_PLAN.md) and the [`generate-wedding-content.ts`](plans/pSEO for Wedinviter.wasleen.com/generate-wedding-content.ts) script, adapting them for 20 pages/day with hourly generation cadence.**
