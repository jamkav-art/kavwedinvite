---
name: pseo-content-generator
description: Generates SEO-optimized, location-specific Indian wedding content pages using DeepSeek AI for WedInviter.wasleen.com pSEO strategy
---

# 🎯 pSEO Content Generator for WedInviter.wasleen.com

## Objective

Generate a complete, production-ready wedding content page targeting the Indian market. Each page is:

- **Location-specific** (city/state/neighborhood-level)
- **Culturally aware** (Hindu, Muslim, Christian, Sikh, or regional traditions)
- **SEO-optimized** (JSON-LD schema, keyword placement, internal linking)
- **Quality-scored** (must pass 75/100 threshold before publishing)
- **Storage-ready** (designed for Supabase `published_pages` table insertion)

The system generates **10 pages per day** via GitHub Actions at 2:00 AM UTC, with a 3-year target of 10,800+ pages driving ₹10+ Crore ARR.

---

## Input Parameters

When invoking this skill, you MUST provide all of the following:

| Parameter          | Required | Description                           | Example                                                     |
| ------------------ | -------- | ------------------------------------- | ----------------------------------------------------------- |
| `location_name`    | ✅       | City or state name                    | `Mumbai`, `Bengaluru`, `Kerala`                             |
| `location_slug`    | ✅       | URL-safe location slug                | `mumbai`, `bengaluru`, `kerala`                             |
| `location_type`    | ✅       | `city`, `state`, or `union-territory` | `city`                                                      |
| `state`            | ✅       | Parent state name                     | `Maharashtra`, `Karnataka`                                  |
| `topic_name`       | ✅       | Wedding topic/pillar name             | `Wedding Invitations`                                       |
| `topic_slug`       | ✅       | URL-safe topic slug                   | `wedding-invitations`                                       |
| `subtopic_name`    | ✅       | Specific subtopic                     | `Digital wedding invitations`                               |
| `subtopic_slug`    | ✅       | URL-safe subtopic slug                | `digital-invitations`                                       |
| `target_keyword`   | ✅       | Primary keyword to rank for           | `digital wedding invitations in Mumbai`                     |
| `cultural_context` | optional | Religion/region focus                 | `hindu`, `muslim`, `christian`, `sikh`, or `multi-cultural` |
| `url_slug`         | ✅       | Full URL path                         | `wedding-invitations/mumbai/digital-invitations`            |
| `priority_score`   | ✅       | Auto-calculated priority              | `48`                                                        |

---

## Output Structure

The skill produces a complete JSON object matching this schema (identical to the `published_pages` table structure):

### 1. SEO Metadata

```json
{
  "title": "Digital Wedding Invitations in Mumbai | Free E-Cards - WedInviter",
  "meta_description": "Create stunning digital wedding invitations in Mumbai with WedInviter. Premium designs, WhatsApp delivery, RSVP tracking. Start free today!",
  "h1": "Digital Wedding Invitations in Mumbai: Complete Guide for Couples",
  "canonical_url": "https://wedinviter.wasleen.com/wedding-invitations/mumbai/digital-invitations"
}
```

**Rules**:

- Title: max 60 characters, include target keyword + location + brand
- Meta description: max 155 characters, include benefit + social proof + CTA
- H1: include target keyword + location + unique value proposition
- Canonical URL: full absolute URL without trailing slash

### 2. Introduction Section

```json
{
  "intro": {
    "hook": "Planning a wedding in Mumbai and looking for the perfect invitation? Go digital with WedInviter's stunning e-invitations designed for Mumbai couples.",
    "context": "Mumbai's fast-paced wedding scene demands modern solutions. With 85% of Mumbai couples using smartphones, digital invitations are the new norm.",
    "preview": "In this guide, you'll discover the best digital invitation designs for Mumbai weddings, pricing, and how to create yours in minutes."
  }
}
```

**Rules**:

- Hook: 2-3 engaging sentences specific to the location
- Context: 3-4 sentences on why this topic matters locally
- Preview: 2-3 sentences on what the reader will learn

### 3. Benefits Array

```json
{
  "benefits": [
    {
      "title": "Instant WhatsApp Delivery",
      "description": "Reach all your Mumbai guests instantly via WhatsApp. No printing delays, no delivery hassles. Perfect for Mumbai's fast-paced lifestyle.",
      "icon": "💬"
    }
  ]
}
```

**Rules**:

- Include 5-7 benefits minimum
- Each benefit must tie to a location-specific need
- Use relevant emoji icons
- Benefits should address pain points unique to the location

### 4. Main Content Sections

```json
{
  "main_content": [
    {
      "heading": "Why Choose Digital Wedding Invitations in Mumbai?",
      "content": "Mumbai couples are increasingly choosing digital invitations over traditional printed cards. With average wedding guest lists of 300-500 people in Mumbai, the cost savings are significant...",
      "subsections": [
        {
          "subheading": "Cost Comparison: Digital vs. Printed in Mumbai",
          "content": "A typical printed wedding card in Mumbai costs ₹75-150 per card for 300 guests, totaling ₹22,500-45,000. Digital invitations from WedInviter start at ₹0..."
        }
      ]
    }
  ]
}
```

**Rules**:

- Include 6-8 main sections minimum
- Each section must reference specific location details (neighborhoods, landmarks, venues)
- Each section should have 2-4 subsections
- Minimum 2,000-2,500 words total
- Include real price ranges accurate for the location market
- Reference seasonal patterns (monsoon/peak season)
- Mention 2-3 times WedInviter.wasleen.com as the solution

### 5. Local Insights

```json
{
  "local_insights": {
    "popular_venues": [
      "Taj Mahal Palace",
      "ITC Grand Central",
      "JW Marriott Juhu",
      "Sahara Star",
      "St. Regis Mumbai"
    ],
    "best_seasons": "October to February is peak wedding season in Mumbai, with pleasant weather. Monsoon weddings June-September require indoor venues.",
    "average_costs": "Budget weddings in Mumbai: ₹5-8 lakhs. Mid-range: ₹15-25 lakhs. Luxury: ₹50 lakhs-2 crores.",
    "cultural_customs": "Mumbai is a melting pot. Marathi weddings include the 'Halad Chadane' ritual. Gujarati weddings feature 'Garba' nights. North Indian weddings have 'Sangeet' ceremonies."
  }
}
```

**Rules**:

- Popular venues: list 5+ real venues/landmarks
- Best seasons: specific months with reasoning
- Average costs: budget, mid-range, and luxury tiers with ₹ amounts
- Cultural customs: location-specific traditions across at least 2 communities

### 6. Vendor Recommendations

```json
{
  "vendor_recommendations": [
    {
      "category": "Wedding Photographer",
      "tips": "In Mumbai, look for photographers experienced with monsoon lighting conditions. Ask to see full wedding albums, not just highlight reels.",
      "price_range": "₹50,000 - ₹2,00,000"
    }
  ]
}
```

**Rules**:

- Include 3-5 vendor categories
- Tips must be location-specific (e.g., monsoon considerations for Mumbai)
- Price ranges must reflect the local market

### 7. FAQs

```json
{
  "faqs": [
    {
      "question": "How early should I send wedding invitations in Mumbai?",
      "answer": "For Mumbai weddings, send invitations 4-6 weeks in advance. For destination weddings involving travel from Mumbai, send 8-12 weeks ahead."
    }
  ]
}
```

**Rules**:

- Include 10-15 FAQs minimum
- Mix of informational, commercial, and local intent questions
- Each answer must include location-specific context
- Cover cultural/religious specifics if applicable

### 8. Testimonials

```json
{
  "testimonials": [
    {
      "name": "Priya & Rahul",
      "location": "Bandra, Mumbai",
      "quote": "WedInviter made our Mumbai wedding invitations so easy! Our guests loved the digital cards and RSVP was seamless.",
      "rating": 5
    }
  ]
}
```

**Rules**:

- Include 2-3 testimonials
- Names must be culturally appropriate Indian names
- Locations must be real neighborhoods in the target city
- Quotes should mention specific benefits relevant to the location

### 9. Pricing Table

```json
{
  "pricing_table": {
    "packages": [
      {
        "name": "Free",
        "price": "₹0",
        "features": [
          "1 basic design",
          "50 guests",
          "Email delivery",
          "WedInviter watermark"
        ]
      },
      {
        "name": "Starter",
        "price": "₹999",
        "features": [
          "10 premium designs",
          "200 guests",
          "Email + WhatsApp delivery",
          "RSVP tracking",
          "No watermark"
        ]
      },
      {
        "name": "Premium",
        "price": "₹2,499",
        "features": [
          "Unlimited designs",
          "Unlimited guests",
          "Video invitations",
          "Advanced RSVP",
          "Custom domain",
          "Analytics"
        ]
      }
    ]
  }
}
```

**Rules**:

- Always include 3 tiers: Free, Starter ₹999, Premium ₹2,499
- Features must be consistent across all generated pages
- Prices are fixed (do not vary by location)

### 10. Call-to-Action

```json
{
  "cta": {
    "heading": "Create Your Perfect Mumbai Wedding Invitation Today",
    "description": "Join 10,000+ Mumbai couples who chose WedInviter for beautiful, affordable digital wedding invitations. Create yours in 5 minutes!",
    "button_text": "Start Creating Free",
    "features": [
      "Free starter design",
      "Mumbai-local design templates",
      "Instant WhatsApp sharing",
      "RSVP tracking"
    ]
  }
}
```

**Rules**:

- Heading must include location name
- Description must mention social proof (number of users/couples)
- Features must include 3-4 location-relevant items
- Button text: always "Start Creating Free"

### 11. Related Topics (Internal Links)

```json
{
  "related_topics": [
    {
      "title": "Video Wedding Invitations in Mumbai",
      "url": "/wedding-invitations/mumbai/video-invitations"
    }
  ]
}
```

**Rules**:

- Include 6-8 related pages
- Links must be to real pages in the pSEO system
- Use contextual anchor text (not just keywords)
- Cover related subtopics, same location

---

## JSON-LD Schema Markup

Every generated page MUST include this structured data:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "[title]",
      "description": "[meta_description]",
      "author": { "@type": "Organization", "name": "WedInviter", "url": "https://wedinviter.wasleen.com" },
      "publisher": { "@type": "Organization", "name": "WedInviter" },
      "datePublished": "[ISO date]",
      "dateModified": "[ISO date]",
      "mainEntityOfPage": "[canonical_url]"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [each FAQ mapped to Question/Answer schema]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wedinviter.wasleen.com" },
        { "@type": "ListItem", "position": 2, "name": "[topic]", "item": "https://wedinviter.wasleen.com/[topic-slug]" },
        { "@type": "ListItem", "position": 3, "name": "[location]", "item": "https://wedinviter.wasleen.com/[topic-slug]/[location-slug]" }
      ]
    },
    {
      "@type": "LocalBusiness",
      "name": "WedInviter",
      "description": "Create beautiful digital wedding invitations online",
      "url": "https://wedinviter.wasleen.com",
      "areaServed": { "@type": "City", "name": "[location_name]" },
      "priceRange": "₹999-₹2499"
    }
  ]
}
```

---

## Quality Evaluation Criteria

Before accepting content for publication, score it across these 6 dimensions. Minimum overall threshold: **75/100**.

| Dimension            | Weight | How to Calculate                                                                                                                | Target                |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Location Specificity | 20%    | Count location name mentions. Score = min(100, mentions/15 × 100)                                                               | 10-15+ mentions       |
| Cultural Relevance   | 15%    | Count cultural keywords: tradition, custom, ritual, culture, hindu, muslim, christian, sikh. Score = min(100, mentions/8 × 100) | 8+ keywords           |
| Actionability        | 15%    | Count actionable keywords: how to, steps, tips, guide, choose, find, book. Score = min(100, mentions/10 × 100)                  | 10+ keywords          |
| Readability          | 15%    | Check structure completeness: intro + benefits(5+) + main_content(6+) + faqs(10+) + cta. Each section adds points.              | All sections present  |
| Keyword Optimization | 15%    | Check keyword in title(30pts) + H1(30pts) + intro(20pts) + body(20pts)                                                          | Keyword in title + H1 |
| Uniqueness           | 20%    | Variety of elements: local_insights, vendor_recommendations, testimonials, pricing_table all present                            | All elements present  |

**Overall Score Formula**:

```
overall = (location_specificity × 0.2) + (cultural_relevance × 0.15) + (actionability × 0.15) + (readability × 0.15) + (keyword_optimization × 0.15) + (uniqueness × 0.2)
```

**Actions based on score**:

- **90-100**: Excellent. Publish immediately.
- **80-89**: Good. Publish.
- **75-79**: Passes threshold. Publish but flag for review.
- **Below 75**: FAIL. Regenerate with enhanced prompts. Max 2 retries.

---

## Content Generation Workflow

### Step 1: Fetch Queue Item

Query the `content_queue` table via `get_next_wedding_queue_items(10)` RPC function to get the highest-priority pending items. Each item carries all required Input Parameters.

### Step 2: Build AI Prompt

Construct the DeepSeek prompt using the **Master Prompt Template** (see below). Inject all location, topic, and cultural context. The prompt must demand JSON output format.

### Step 3: Call DeepSeek API

- Endpoint: `POST https://api.deepseek.com/v1/chat/completions`
- Model: `deepseek-chat`
- Max tokens: 8000
- Temperature: 0.7
- Response format: `json_object`
- System message: "You are an expert Indian wedding content writer..."

### Step 4: Validate & Parse Response

- Parse JSON response
- Validate all required fields exist
- Check content meets word count (2000-2500 words)
- If parsing fails or fields missing → retry (max 2 attempts)

### Step 5: Calculate Quality Scores

Run the Quality Evaluation matrix above on the generated content.

### Step 6: Conditional Publishing

- If score >= 75 → insert into `published_pages` table
- If score < 75 → retry with enhanced prompt (up to 2 retries), then mark queue item as `failed`

### Step 7: Generate Schema Markup

Build the JSON-LD structured data and include it in the `schema_json` column.

### Step 8: Update Queue Status

- Success → set `status = 'completed'` in `content_queue`
- Failure → set `status = 'failed'`, populate `last_error`

### Step 9: Log Generation

Insert a record into `generation_logs` with status, quality score, tokens used, and generation time.

### Step 10: Revalidate Vercel Cache

POST to `/api/revalidate?secret=[REVALIDATE_SECRET]&pillar=[topic_slug]&slug=[location_slug/subtopic_slug]` to trigger ISR cache invalidation.

---

## Master Prompt Template

Use this exact prompt structure when calling DeepSeek AI:

```
You are an expert Indian wedding content writer with deep knowledge of [LOCATION] wedding culture and traditions.

Write a comprehensive, SEO-optimized article for: "[TOPIC] in [LOCATION]"

TARGET KEYWORD: "[EXACT_KEYWORD]"
LOCATION CONTEXT: [LOCATION_NAME], [STATE]
CULTURAL CONTEXT: [RELIGION/REGION if applicable]
WORD COUNT: 2,000-2,500 words
TONE: Helpful, authoritative, culturally sensitive, locally relevant, conversational

CONTENT STRUCTURE (JSON FORMAT):
[Include the full Output Structure JSON template from sections 1-11 above]

CRITICAL REQUIREMENTS:
1. Include 10-15 [LOCATION]-SPECIFIC details (neighborhoods, landmarks, popular venues, local customs)
2. Mention REAL price ranges accurate for [LOCATION] market
3. Reference seasonal patterns (monsoon weddings, winter wedding season, etc.)
4. Include cultural traditions specific to [LOCATION] region
5. Use natural keyword placement (target keyword in title, H1, first paragraph, 2-3x in body)
6. Add 2-3 mentions of WedInviter.wasleen.com as the solution
7. 100% original content - NO generic templates or plagiarism
8. Conversational, engaging tone (write like helping a friend)
9. Output ONLY valid JSON - no markdown wrappers, no explanations

AVOID:
- Generic content that could apply to any city
- Vague statements without specific data
- Over-optimized keyword stuffing
- Excessive promotional language
- Cultural insensitivity or stereotypes
- Outdated information
- Fake testimonials or made-up data
```

---

## SEO Rules

### Title Tag Formula

```
[Primary Keyword] in [City], [State] | Free Digital Cards - WedInviter
```

- Max 60 characters
- Include primary keyword naturally
- End with brand "WedInviter"

### Meta Description Formula

```
[Benefit statement]. [Social proof]. [CTA]. Create beautiful [topic] for your [city] wedding on WedInviter. Start free today!
```

- Max 155 characters
- Start with benefit
- Include CTA
- End with brand mention

### URL Structure

```
https://wedinviter.wasleen.com/[pillar-slug]/[location-slug]/[subtopic-slug]
```

Example: `/wedding-invitations/mumbai/digital-invitations`

### Internal Linking

- Every page links to 8-12 related pages
- Hub pages link to all child pages
- Bidirectional linking
- Contextual anchor text (not exact-match keyword stuffing)
- Link to other subtopics in same location AND same topic in nearby locations

### Schema Markup

Always include 4 schema types per page:

1. `Article` - for the main content
2. `FAQPage` - for FAQs section
3. `BreadcrumbList` - for navigation path
4. `LocalBusiness` - for WedInviter with areaServed set to target location

---

## Content Pillars Reference

The 12 content pillars. Primary pillar gets priority scoring bonus.

| #   | Pillar Name                 | URL Slug                | Type       |
| --- | --------------------------- | ----------------------- | ---------- |
| 1   | Wedding Invitations         | `wedding-invitations`   | Primary    |
| 2   | Wedding Venues              | `wedding-venues`        | Supporting |
| 3   | Wedding Planning            | `wedding-planning`      | Supporting |
| 4   | Bridal Fashion              | `bridal-fashion`        | Supporting |
| 5   | Makeup and Beauty           | `wedding-makeup`        | Supporting |
| 6   | Photography and Videography | `wedding-photography`   | Supporting |
| 7   | Catering and Food           | `wedding-catering`      | Supporting |
| 8   | Decorations                 | `wedding-decorations`   | Supporting |
| 9   | Entertainment               | `wedding-entertainment` | Supporting |
| 10  | Wedding Rituals             | `wedding-rituals`       | Supporting |
| 11  | Gifts and Favors            | `wedding-gifts`         | Supporting |
| 12  | Honeymoon Planning          | `honeymoon-planning`    | Supporting |

---

## Location Tiers for Priority Scoring

| Tier        | Priority Score | Cities                                                                                                                                                                                         |
| ----------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tier 1      | 100            | Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad                                                                                                                     |
| Tier 2      | 75             | Jaipur, Lucknow, Surat, Indore, Nagpur, Visakhapatnam, Kochi, Chandigarh, Bhopal, Patna, Vadodara, Ghaziabad, Ludhiana, Coimbatore, Agra, Madurai, Nashik, Faridabad, Meerut, Rajkot, Varanasi |
| Tier 3      | 50             | All remaining 100+ cities                                                                                                                                                                      |
| State-level | 40             | 28 states + 8 Union Territories                                                                                                                                                                |

### Priority Scoring Formula

```
priority_score = search_volume / GREATEST(keyword_difficulty, 1) * (location_priority / 100) * (topic_priority / 100)
```

---

## Cultural Context Rules

When `cultural_context` is specified, tailor the content accordingly:

- **hindu**: Reference Vedic rituals, muhurat timings, regional variations (Marathi, Gujarati, Bengali, South Indian, etc.)
- **muslim**: Reference Nikah, Mehndi, Walima, Islamic traditions, halal catering considerations
- **christian**: Reference church ceremonies, western traditions, reception planning, bridal traditions
- **sikh**: Reference Anand Karaj, Gurdwara ceremonies, Punjabi traditions, Langar
- **multi-cultural** (default): Cover all major traditions with sensitivity, note the location's dominant culture
- **regional** (e.g., Bengali, Maharashtrian): Deep-dive into that specific regional wedding culture

When no cultural_context is provided, default to "multi-cultural" covering Hindu, Muslim, Christian, and Sikh traditions with equal respect.

---

## Database Schema Reference

### `published_pages` Insert Format

```sql
INSERT INTO published_pages (
  queue_id, url_path, title, meta_description, h1_heading,
  canonical_url, intro_text, benefits, main_content,
  faqs, testimonials, pricing_table,
  cta_section, related_pages, schema_json,
  word_count, quality_score,
  location_specificity_score, cultural_relevance_score,
  actionability_score
) VALUES (
  :queue_id, :url_path, :title, :meta_description, :h1_heading,
  :canonical_url, :intro, :benefits_jsonb, :main_content_jsonb,
  :faqs_jsonb, :testimonials_jsonb, :pricing_jsonb,
  :cta_jsonb, :related_jsonb, :schema_jsonb,
  :word_count, :quality_score,
  :location_specificity, :cultural_relevance,
  :actionability
);
```

### Queue Status Lifecycle

`pending` → `generating` → `completed` (success) or `failed` (after max retries)

---

## Error Handling & Retry Logic

| Scenario                                  | Action                                                                                                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DeepSeek API call fails (network/4xx/5xx) | Retry up to 2 times with 2-second delay between attempts                                                                                                              |
| JSON parse failure                        | Retry with prompt enhancement: "Ensure valid JSON output. No markdown. No trailing commas."                                                                           |
| Quality score below 75                    | Retry with enhanced prompt: "Add more [LOCATION]-specific details. Include real venue names, neighborhoods, and local pricing. Improve cultural context specificity." |
| Database insert fails                     | Log error with full payload for manual recovery. Do NOT retry automatically.                                                                                          |
| Vercel revalidation fails                 | Log warning but do NOT block publishing. Will revalidate on next visit.                                                                                               |

---

## Cost Tracking

Each generation invocation logs to `generation_logs`:

```sql
INSERT INTO generation_logs (
  queue_id, status, error_message,
  quality_score, api_tokens_used,
  generation_time_seconds, api_cost
) VALUES (
  :queue_id, :status, :error_message,
  :quality_score, :tokens_used,
  :time_seconds, :tokens_used / 1000000 * 0.14
);
```

- DeepSeek cost: ~$0.14 per 1M tokens
- Per page cost: ~₹1-2 ($0.015-0.025)
- Daily cost (10 pages): ~₹15-20
- Monthly cost: ~₹450-600 (~$5-7)

---

## Output File Structure

The generated content should be stored in the `published_pages` table and also made available as:

1. Supabase row in `published_pages` table
2. Rendered via Next.js dynamic route at `/[topic_slug]/[location_slug]/[subtopic_slug]`
3. Included in auto-generated sitemap.xml

**No static files are created** — everything is served via ISR (Incremental Static Regeneration) with `revalidate = 86400` (24 hours).
