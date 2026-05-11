---
name: pseo-internal-linking
description: Creates SEO-optimized internal link networks across WedInviter.wasleen.com's 50,000+ page pSEO content universe
---

# 🔗 pSEO Internal Linking for WedInviter.wasleen.com

## Objective

Build a **topic cluster architecture** across 12 wedding content pillars × 136 locations that distributes link equity, establishes content hierarchy, and boosts keyword rankings via contextual internal linking. Every page must link to **8-12 related pages** using varied, natural anchor text.

The internal linking system serves 3 purposes:

1. **SEO equity distribution** — Pass PageRank from high-authority pages to new pages
2. **User navigation** — Help readers discover related wedding content naturally
3. **Crawl optimization** — Ensure Googlebot can reach all 50,000+ pages within 3-5 clicks from the homepage

---

## Input Parameters

| Parameter               | Required | Description                             | Example                                           |
| ----------------------- | -------- | --------------------------------------- | ------------------------------------------------- |
| `current_url_path`      | ✅       | URL of the page being built             | `/wedding-invitations/mumbai/digital-invitations` |
| `current_location`      | ✅       | Location slug                           | `mumbai`                                          |
| `current_topic_slug`    | ✅       | Pillar slug                             | `wedding-invitations`                             |
| `current_subtopic_slug` | ✅       | Subtopic slug                           | `digital-invitations`                             |
| `current_keyword`       | ✅       | Target keyword                          | `digital wedding invitations in Mumbai`           |
| `all_published_pages`   | ✅       | Array of published page records from DB | See DB query section                              |

---

## Topic Cluster Architecture

### The 3-Level Hierarchy

```
Level 1: Pillar Hub Pages (12 total)
  └── /wedding-invitations/
  └── /wedding-venues/
  └── /wedding-planning/
  └── ... (12 pillars)

Level 2: Location Pillar Pages (136 × 12 = 1,632 total)
  └── /wedding-invitations/mumbai/
  └── /wedding-invitations/delhi/
  └── /wedding-venues/mumbai/
  └── ... (every location × every pillar)

Level 3: Subtopic Pages (50,000+ total)
  └── /wedding-invitations/mumbai/digital-invitations
  └── /wedding-invitations/mumbai/video-invitations
  └── /wedding-venues/mumbai/banquet-halls
  └── ... (every location × every pillar × every subtopic)
```

### Link Direction Rules

| From                 | To                                             | Purpose                      | Links Per Page |
| -------------------- | ---------------------------------------------- | ---------------------------- | -------------- |
| Subtopic page        | Its parent location pillar page                | Establishes hierarchy        | 1-2            |
| Subtopic page        | Other subtopics in same location + same pillar | Cross-sells related services | 3-4            |
| Subtopic page        | Same subtopic in nearby/peer locations         | Location comparison          | 2-3            |
| Subtopic page        | Related pillars in same location               | Cross-pillar exploration     | 2-3            |
| Location pillar page | All its child subtopic pages                   | Distributes equity downward  | 5-10           |
| Pillar hub page      | All its child location pages                   | Distributes equity downward  | 10-136         |

---

## The 4 Link Types

### Type 1: Same-Location Same-Pillar (Strongest Signal)

Link to other subtopics within the same location and pillar.

**Example**: On `/wedding-invitations/mumbai/digital-invitations`, link to:

- `/wedding-invitations/mumbai/video-invitations`
- `/wedding-invitations/mumbai/luxury-wedding-cards`
- `/wedding-invitations/mumbai/budget-invitations`

**Anchor text pattern**: `[Subtopic] in [Location]` or `[Location] [subtopic]`

- `"Video wedding invitations in Mumbai"`
- `"Mumbai luxury wedding cards"`
- `"Compare budget wedding invitations in Mumbai"`

**Quantity**: 3-4 links per page

---

### Type 2: Same-Pillar Cross-Location (Medium Signal)

Link to the same subtopic in nearby, peer, or higher-priority locations.

**Example**: On `/wedding-invitations/mumbai/digital-invitations`, link to:

- `/wedding-invitations/pune/digital-invitations` (nearby city)
- `/wedding-invitations/delhi/digital-invitations` (Tier 1 peer)
- `/wedding-invitations/bengaluru/digital-invitations` (Tier 1 peer)
- `/wedding-invitations/maharashtra/digital-invitations` (state-level)

**Anchor text pattern**: `[Subtopic] in [nearby/peer Location]` or location name + subtopic

- `"Digital invitations in Pune"`
- `"Delhi digital wedding cards"`
- `"Maharashtra wedding invitations guide"`

**Quantity**: 2-3 links per page

**Location proximity priority** (same pillar):

1. Same state, nearby cities (Mumbai ↔ Pune, Thane, Nashik)
2. Same tier, different state (Mumbai ↔ Delhi, Bengaluru)
3. State-level parent page (`/wedding-invitations/maharashtra/`)
4. Major destination wedding cities (Goa, Udaipur, Jaipur)

---

### Type 3: Cross-Pillar Same-Location (Medium Signal)

Link to different pillars in the same location to create a comprehensive wedding resource.

**Example**: On `/wedding-invitations/mumbai/digital-invitations`, link to:

- `/wedding-venues/mumbai/banquet-halls` (venue planning)
- `/wedding-photography/mumbai/candid-photography` (photography)
- `/wedding-planning/mumbai/budget-wedding` (planning)
- `/bridal-fashion/mumbai/wedding-lehengas` (fashion)

**Anchor text pattern**: Service name in location context

- `"Find banquet halls in Mumbai"`
- `"Book Mumbai wedding photographers"`
- `"Plan your Mumbai wedding budget"`
- `"Shop for bridal lehengas in Mumbai"`

**Natural section placement**: These links fit best in the "vendor_recommendations" or "local_insights" sections of the generated content.

**Quantity**: 2-3 links per page

---

### Type 4: Contextual In-Body Links (Strongest Signal)

Embed links naturally within the flowing content paragraphs. These carry the most SEO weight because they are surrounded by relevant content.

**Example in paragraph**:

```
Mumbai couples planning their wedding should start with a beautiful
<a href="/wedding-invitations/mumbai/digital-invitations">digital wedding invitation</a>,
then explore our guide to
<a href="/wedding-venues/mumbai/banquet-halls">best banquet halls in Mumbai</a>
to secure the perfect venue.
```

**Rules**:

- Maximum 1 contextual link per 200 words of content
- Anchor text must be natural — NEVER exact-match keyword stuffing
- Surrounding sentences must be semantically related to the linked page
- Link to pages that genuinely add value at that point in the reader's journey
- Prefer linking to pages that exist (are in `published_pages` or `content_queue` with status `completed`)

**Quantity**: 3-5 links per page

---

## The `related_topics` JSON Array

Every generated content page stores its internal links in the `related_pages` JSONB column. This is output from the AI generation script as the `related_topics` field:

```json
{
  "related_topics": [
    {
      "title": "Video Wedding Invitations in Mumbai",
      "url": "/wedding-invitations/mumbai/video-invitations"
    },
    {
      "title": "Mumbai Wedding Planning: Complete Guide",
      "url": "/wedding-planning/mumbai/complete-guide"
    },
    {
      "title": "Best Banquet Halls in Mumbai for Weddings",
      "url": "/wedding-venues/mumbai/banquet-halls"
    },
    {
      "title": "Digital Wedding Invitations in Pune",
      "url": "/wedding-invitations/pune/digital-invitations"
    },
    {
      "title": "Bridal Makeup Artists in Mumbai",
      "url": "/wedding-makeup/mumbai/bridal-makeup-artists"
    },
    {
      "title": "Mumbai Wedding Photography Guide",
      "url": "/wedding-photography/mumbai/wedding-photographers"
    },
    {
      "title": "Budget Wedding Planning in Mumbai",
      "url": "/wedding-planning/mumbai/budget-wedding"
    }
  ]
}
```

**Rules for `related_topics`**:

- Include 6-8 items minimum (8-12 preferred)
- At least 3 must be Type 1 (same-location same-pillar)
- At least 2 must be Type 3 (cross-pillar same-location)
- At least 1 must be Type 2 (cross-location same-pillar)
- All URLs must be within `wedinviter.wasleen.com` domain
- Titles must be unique, descriptive, and include the target location
- URLs must match the pattern `^/[a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+$`

---

## Anchor Text Rules

### Allowed Anchor Text Types

| Type                     | Example                                        | When to Use                            |
| ------------------------ | ---------------------------------------------- | -------------------------------------- |
| **Exact match**          | `digital wedding invitations in Mumbai`        | Only for Type 1 links, max 1 per page  |
| **Partial match**        | `digital invitations in Mumbai`                | Preferred for most links               |
| **Branded**              | `WedInviter Mumbai invitations`                | In introductory paragraphs             |
| **Generic with context** | `click here for Mumbai wedding invites`        | Only as fallback, rarely               |
| **Related phrase**       | `e-invite options for Mumbai couples`          | For cross-pillar links                 |
| **Location-prefixed**    | `Mumbai digital wedding cards`                 | Type 1 subtopic links                  |
| **Question-form**        | `How to choose digital invitations in Mumbai?` | FAQ sections linking to related guides |

### Banned Anchor Text Patterns

- ❌ `wedding invitations` (too generic, no location signal)
- ❌ `read more` / `click here` / `this page` (no semantic value)
- ❌ Exact repetition of the page's H1 as anchor text
- ❌ Exact repetition of another page's target keyword
- ❌ Keyword-stuffed: `best affordable cheap digital wedding invitations in Mumbai 2024`
- ❌ Same anchor text used more than once on the same page

### Anchor Text Diversity

On any single page, anchor text distribution should be:

- Exact match: max 1 (10-15% of links)
- Partial match / location-prefixed: 4-6 (40-50%)
- Related phrase / question-form: 3-4 (30-40%)
- Branded: 1-2 (10-15%)

---

## Link Placement Context

Links must be placed in contextually relevant sections of the generated content. Use this mapping:

| Content Section         | Link Types to Place                             | Anchor Text Style                                        | Max Links |
| ----------------------- | ----------------------------------------------- | -------------------------------------------------------- | --------- |
| Introduction            | Type 4 (contextual)                             | Branded or partial match                                 | 1-2       |
| Benefits section        | Type 1 (same-pillar)                            | Benefit-oriented: `Save with Mumbai digital invitations` | 1-2       |
| Main content body       | Type 4 (contextual)                             | Natural, varied                                          | 3-5       |
| Local insights          | Type 3 (cross-pillar) + Type 2 (cross-location) | Location-prefixed                                        | 2-3       |
| Vendor recommendations  | Type 3 (cross-pillar)                           | Service-oriented                                         | 1-2       |
| FAQs                    | Type 1 + Type 4                                 | Question-form or partial match                           | 2-3       |
| CTA section             | Branded link to homepage or pricing             | Branded: `WedInviter pricing`                            | 1         |
| Related topics (footer) | All types — stored in `related_pages` JSONB     | Title case, descriptive                                  | 6-8       |

---

## Bidirectional Linking Requirements

For every link FROM page A TO page B, ensure there is a reciprocal link FROM page B TO page A.

### Automatic Bidirectional Enforcement

When generating the `related_topics` for a new page:

1. Query the `published_pages` table for pages where `related_pages @> '[{"url": "/current/page/path"}]'`
2. If page A already links to the current page, ensure the current page links back to page A
3. If no reciprocal exists yet, the current page's `related_topics` becomes the first direction — confirm the other direction will be added when page B is regenerated or updated

### Bidirectional Priority Matrix

| Page A has link to Page B? | Page B has link to Page A? | Action                                                                                    |
| -------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| Yes                        | Yes                        | ✅ Good — maintain both                                                                   |
| Yes                        | No                         | ⚠️ Add link to Page B's `related_topics` on next regeneration                             |
| No                         | Yes                        | ⚠️ Add link to Page A's `related_topics`                                                  |
| No                         | No                         | ❌ Choose which direction makes more sense, add one, then ensure reciprocal on next batch |

---

## Hub Page Linking Strategy

### Pillar Hub Pages (`/wedding-invitations/`)

These are auto-generated index pages for each of the 12 pillars. They must link to:

1. **All location pages** within that pillar that have published content:
   - `/wedding-invitations/mumbai/`
   - `/wedding-invitations/delhi/`
   - `/wedding-invitations/bengaluru/`
   - ... etc. for all locations with published pages

2. **Top 10 highest-priority subtopic pages** across all locations:
   - `/wedding-invitations/mumbai/digital-invitations`
   - `/wedding-invitations/delhi/video-invitations`
   - ... (by priority_score DESC, limit 10)

3. **All 11 other pillar hub pages** in the footer:
   - `/wedding-venues/`, `/wedding-planning/`, etc.

### Location Pillar Pages (`/wedding-invitations/mumbai/`)

These are auto-generated index pages for a specific location × pillar. They must link to:

1. **All published subtopic pages** within this location + pillar:
   - `/wedding-invitations/mumbai/digital-invitations`
   - `/wedding-invitations/mumbai/video-invitations`
   - `/wedding-invitations/mumbai/luxury-wedding-cards`
   - ... (all published)

2. **The parent pillar hub page**: `/wedding-invitations/`

3. **Sibling location pillar pages** (same pillar, peer locations):
   - `/wedding-invitations/pune/`
   - `/wedding-invitations/thane/`

4. **Related pillars in same location**:
   - `/wedding-venues/mumbai/`
   - `/wedding-planning/mumbai/`

---

## Database Query for Linkable Pages

Use this query to find eligible pages to link to:

```sql
SELECT
  pp.url_path,
  pp.title,
  pp.quality_score,
  pp.view_count,
  cq.target_keyword,
  wl.name AS location_name,
  wl.slug AS location_slug,
  wt.slug AS topic_slug,
  ws.slug AS subtopic_slug
FROM published_pages pp
JOIN content_queue cq ON pp.queue_id = cq.id
JOIN wedding_locations wl ON cq.location_id = wl.id
JOIN wedding_topics wt ON cq.topic_id = wt.id
LEFT JOIN wedding_subtopics ws ON cq.subtopic_id = ws.id
WHERE pp.quality_score >= 75
ORDER BY pp.view_count DESC, pp.quality_score DESC;
```

For targeted queries when building a specific page:

### Same-Location Same-Pillar (Type 1)

```sql
SELECT url_path, title
FROM published_pages pp
JOIN content_queue cq ON pp.queue_id = cq.id
JOIN wedding_locations wl ON cq.location_id = wl.id
JOIN wedding_topics wt ON cq.topic_id = wt.id
WHERE wl.slug = 'mumbai'
  AND wt.slug = 'wedding-invitations'
  AND pp.url_path != '/wedding-invitations/mumbai/digital-invitations'
ORDER BY pp.quality_score DESC
LIMIT 5;
```

### Cross-Location Same-Pillar (Type 2)

```sql
SELECT url_path, title
FROM published_pages pp
JOIN content_queue cq ON pp.queue_id = cq.id
JOIN wedding_locations wl ON cq.location_id = wl.id
JOIN wedding_topics wt ON cq.topic_id = wt.id
JOIN wedding_subtopics ws ON cq.subtopic_id = ws.id
WHERE ws.slug = 'digital-invitations'
  AND wl.slug != 'mumbai'
  AND cq.status = 'completed'
ORDER BY wl.priority DESC
LIMIT 4;
```

### Cross-Pillar Same-Location (Type 3)

```sql
SELECT url_path, title
FROM published_pages pp
JOIN content_queue cq ON pp.queue_id = cq.id
JOIN wedding_locations wl ON cq.location_id = wl.id
JOIN wedding_topics wt ON cq.topic_id = wt.id
WHERE wl.slug = 'mumbai'
  AND wt.slug != 'wedding-invitations'
  AND cq.status = 'completed'
ORDER BY wt.priority DESC, pp.quality_score DESC
LIMIT 4;
```

---

## Sitemap Integration

The internal linking topology must be reflected in the XML sitemap:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Pillar hub pages (highest priority) -->
  <url>
    <loc>https://wedinviter.wasleen.com/wedding-invitations/</loc>
    <priority>0.9</priority>
  </url>

  <!-- Location pillar pages (high priority) -->
  <url>
    <loc>https://wedinviter.wasleen.com/wedding-invitations/mumbai/</loc>
    <priority>0.8</priority>
  </url>

  <!-- Subtopic pages (standard priority) -->
  <url>
    <loc>https://wedinviter.wasleen.com/wedding-invitations/mumbai/digital-invitations</loc>
    <priority>0.6</priority>
  </url>
</urlset>
```

**Priority hierarchy**: Pillar hubs (0.9) > Location pages (0.8) > Subtopic pages (0.6)

**Sitemap split**: When exceeding 50,000 URLs, split into multiple sitemaps:

- `sitemap-pillar-1.xml` through `sitemap-pillar-12.xml`

---

## Quality Checks

After generating the `related_topics` array, verify:

- [ ] Total links: 8-12 (min 6 for very new sites with few published pages)
- [ ] Type 1 (same-location same-pillar): at least 3
- [ ] Type 2 (cross-location same-pillar): at least 1
- [ ] Type 3 (cross-pillar same-location): at least 2
- [ ] Contextual in-body links (Type 4): at least 3
- [ ] No duplicate URLs in the list
- [ ] No duplicate anchor text across the list
- [ ] All URLs use the correct `/[pillar]/[location]/[subtopic]` pattern
- [ ] No external links in the `related_topics` array (all must be internal)
- [ ] Anchor text includes location name for all Type 1 and Type 2 links
- [ ] No exact-match keyword anchor text duplicated more than once
- [ ] Bidirectional check: if page A is linking here, ensure reciprocal link exists

---

## Error Handling

| Issue                                                    | Resolution                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| Fewer than 6 related pages exist in DB for this location | Use broader scope: drop to state-level, then national-level topics    |
| No pages exist for the pillar at all                     | Link to other pillar hubs instead; skip Type 1 links                  |
| Duplicate URLs in related_topics                         | Deduplicate by `url_path`, keep highest-scoring title                 |
| AI generated invalid URL pattern                         | Strip to `/[pillar-slug]/[location-slug]/[subtopic-slug]` format      |
| Target page has quality_score < 75                       | Do NOT link to low-quality pages. Pick next-best alternative.         |
| Bidirectional link missing                               | Flag for next batch generation; add to the other page's pending queue |
