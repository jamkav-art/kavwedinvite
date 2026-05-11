// ============================================================================
// WEDINVITER pSEO — Prompt Builder
// ============================================================================
// Builds context-aware DeepSeek prompts with location-specific, cultural,
// and tier-based enhancements for Indian wedding content generation.
// ============================================================================

import type { PseoQueueItem } from "@/lib/pseo/types";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wedinviter.wasleen.com";

/**
 * Pricing ranges by city tier. DeepSeek uses these to generate accurate costs.
 */
const PRICING_BY_TIER: Record<
  number,
  { budget: string; mid: string; luxury: string }
> = {
  1: {
    budget: "₹5-8 lakhs",
    mid: "₹15-25 lakhs",
    luxury: "₹50 lakhs-2 crores",
  },
  2: { budget: "₹3-5 lakhs", mid: "₹10-18 lakhs", luxury: "₹30 lakhs-1 crore" },
  3: { budget: "₹2-4 lakhs", mid: "₹8-12 lakhs", luxury: "₹20-50 lakhs" },
};

/**
 * Region-specific cultural context for auto-injection.
 */
const REGION_CULTURAL_CONTEXT: Record<string, string> = {
  north:
    "North Indian weddings feature elaborate Sangeet ceremonies, Mehendi nights, and multi-day celebrations. Punjabi weddings are known for Bhangra, vibrant colors, and grand Anand Karaj ceremonies.",
  south:
    "South Indian weddings are known for their traditional rituals like Kashi Yatra, Saptapadi, and distinctive Tamil Telugu or Malayalam customs. Temple weddings are especially popular.",
  east: "East Indian weddings, especially Bengali weddings, feature unique rituals like Saat Paak, Shubho Drishti, and the iconic Bengali saree (Taant or Paar). Durga Puja season is prime wedding time.",
  west: "Gujarati and Marathi weddings dominate West India. Gujarati weddings feature Garba nights and traditional Ponk. Marathi weddings include Kanyadan and Saptapadi around the Tulsi.",
  northeast:
    "Northeastern weddings showcase diverse tribal cultures from Assamese to Naga traditions. Simple, community-centric ceremonies with unique costumes and cuisine.",
  central:
    "Central Indian weddings blend North and South traditions, with unique Bundeli customs and Maratha influences prominent in cities like Indore and Bhopal.",
};

/**
 * Seasonality guidance by region (for prompting).
 */
const SEASONALITY_BY_REGION: Record<string, string> = {
  north:
    "Peak wedding season October-February (pleasant weather). Monsoon weddings June-September (indoor venues recommended). Summer weddings March-May (AC venues essential).",
  south:
    "Weddings year-round. June-September popular due to Tamil/Malayalam calendar auspicious dates. December-February peak for outdoor weddings.",
  east: "October-March peak season (Durga Puja to Basanta). Monsoon weddings April-September common for Bengali weddings.",
  west: "November-February peak (post-monsoon). Gujarat: November-March. Maharashtra: December-May.",
  northeast:
    "October-April peak. Avoid May-August (heavy monsoon). Community weddings common in winter months.",
  central:
    "October-March peak. Summer weddings April-June (evening ceremonies preferred to avoid heat).",
};

// ---------------------------------------------------------------------------
// Prompt Builder
// ---------------------------------------------------------------------------

/**
 * Builds a comprehensive DeepSeek prompt for generating a wedding content page.
 * Tier-based pricing, regional cultural context, and failure feedback are
 * injected dynamically based on the queue item.
 *
 * @param item - Queue item containing location, topic, and subtopic data
 * @param retryFeedback - Optional feedback from a failed quality evaluation
 * @returns Complete prompt string for DeepSeek API
 */
export function buildWeddingPrompt(
  item: PseoQueueItem,
  retryFeedback?: string,
): string {
  const culturalNote = item.cultural_context
    ? `\nCULTURAL CONTEXT: This content should focus on ${item.cultural_context} wedding traditions and customs. Be specific to this tradition's rituals, attire, and ceremonies.`
    : "\nCULTURAL CONTEXT: Cover all major Indian wedding traditions (Hindu, Muslim, Christian, Sikh) with sensitivity and respect. Prioritize the dominant traditions of this region.";

  // Determine region-based enhancements
  const regionHint = getRegionHint(item.location_slug);

  // Pricing based on location tier (default Tier 3)
  const tier = inferTier(item.priority_score);
  const pricing = PRICING_BY_TIER[tier] || PRICING_BY_TIER[3];

  // Retry enhancement
  const retrySection = retryFeedback
    ? `
\n🔄 ENHANCEMENT FEEDBACK (RETRY ATTEMPT):
The previous generation was rejected because: ${retryFeedback}
Please specifically address the following:
${retryFeedback}
Make sure to improve in these areas. Be MORE specific about ${item.location_name}. Include MORE local data.`
    : "";

  return `
You are writing a comprehensive, SEO-optimized article about "${item.topic_name}" specifically for couples in ${item.location_name}.

TARGET KEYWORD: "${item.target_keyword}"
LOCATION: ${item.location_name}
TOPIC: ${item.topic_name}
SUBTOPIC: ${item.subtopic_name || "General overview"}
URL: ${SITE_URL}/${item.url_slug}
${culturalNote}

${regionHint}

WORD COUNT: 2,000-2,500 words
TONE: Helpful, authoritative, culturally sensitive, locally relevant, conversational

CRITICAL REQUIREMENTS:
1. Include 10-15 ${item.location_name}-SPECIFIC details:
   - Actual neighborhood names, localities, and suburbs
   - Real venue names (banquet halls, hotels, farmhouses, temples/churches)
   - Local vendors and markets
   - Famous wedding spots
2. Mention REAL price ranges accurate for ${item.location_name} market:
   - Budget weddings: ${pricing.budget}
   - Mid-range weddings: ${pricing.mid}
   - Luxury weddings: ${pricing.luxury}
3. Reference seasonal patterns specific to ${item.location_name}'s region
4. Include cultural traditions specific to ${item.location_name}'s dominant communities
5. Use natural keyword placement (target keyword in title, H1, first paragraph, 2-3x in body)
6. Add 2-3 mentions of WedInviter as the solution for digital wedding invitations
7. 100% original content — NO generic templates or plagiarism
8. Conversational, engaging tone (write like helping a friend plan their wedding)
${retrySection}

OUTPUT FORMAT: Respond ONLY with valid JSON, no markdown formatting, no code blocks.

{
  "title": "[60-char max SEO title with target keyword — e.g., '${item.target_keyword} | Free Digital Cards - WedInviter']",
  "meta_description": "[155-char max compelling meta description with CTA — include location + topic + WedInviter]",
  "h1": "[Clear H1 with location + topic — e.g., '${item.target_keyword}: Complete Guide for ${item.location_name} Couples']",

  "intro": {
    "hook": "[Engaging 2-3 sentence opening about weddings in ${item.location_name}]",
    "context": "[Why this topic matters for ${item.location_name} couples — 3-4 sentences with local context]",
    "preview": "[What readers will learn — 2-3 sentences bulleted overview]"
  },

  "benefits": [
    {
      "title": "[Benefit 1 — specific to ${item.location_name}]",
      "description": "[2-3 sentences explaining this benefit with local context]",
      "icon": "💍"
    }
  ],

  "main_content": [
    {
      "heading": "[H2: Main section about ${item.topic_name} in ${item.location_name}]",
      "content": "[3-5 paragraphs with SPECIFIC ${item.location_name} details — mention actual neighborhoods, venues, price ranges, local customs]",
      "subsections": [
        {
          "subheading": "[H3: Specific aspect]",
          "content": "[2-3 paragraphs with actionable advice]"
        }
      ]
    }
  ],

  "local_insights": {
    "popular_venues": ["[${item.location_name} Venue 1]", "[Venue 2]", "[Venue 3]", "[Venue 4]", "[Venue 5]"],
    "best_seasons": "[Specific months for ${item.location_name} weddings]",
    "average_costs": "[Price ranges specific to ${item.location_name}]",
    "cultural_customs": "[${item.location_name}-specific traditions and customs]"
  },

  "vendor_recommendations": [
    {
      "category": "[Photographer/Caterer/Decorator/etc.]",
      "tips": "[How to choose in ${item.location_name} — 3-4 sentences]",
      "price_range": "[₹X - ₹Y for ${item.location_name} market]"
    }
  ],

  "faqs": [
    {
      "question": "[Question about ${item.topic_name} in ${item.location_name}]",
      "answer": "[Detailed answer with local context — 3-4 sentences]"
    }
  ],

  "testimonials": [
    {
      "name": "[Indian first name]",
      "location": "[Neighborhood in ${item.location_name}]",
      "quote": "[2-3 sentence testimonial about using WedInviter]",
      "rating": 5
    }
  ],

  "pricing_table": {
    "packages": [
      { "name": "Free", "price": "₹0", "features": ["1 basic design", "50 guests", "Email delivery", "WedInviter watermark"] },
      { "name": "Starter", "price": "₹999", "features": ["10 premium designs", "200 guests", "Email + WhatsApp delivery", "RSVP tracking", "No watermark"] },
      { "name": "Premium", "price": "₹2,499", "features": ["Unlimited designs", "Unlimited guests", "Video invitations", "Advanced RSVP", "Custom domain", "Analytics"] }
    ]
  },

  "cta": {
    "heading": "Create Your Perfect ${item.location_name} Wedding Invitation Today",
    "description": "[2-3 sentences about WedInviter for ${item.location_name} couples]",
    "button_text": "Start Creating Free",
    "features": ["[Feature 1]", "[Feature 2]", "[Feature 3]"]
  },

  "related_topics": [
    {
      "title": "[Related page title]",
      "url": "/[pillar]/[location]/[subtopic]"
    }
  ]
}

LOCATION-SPECIFIC RESEARCH CHECKLIST (must include ALL):
- [ ] Mentioned 3+ actual neighborhoods, localities, or suburbs in ${item.location_name}
- [ ] Referenced 5+ real venues, landmarks, or wedding halls by name
- [ ] Included accurate price ranges for ${item.location_name}
- [ ] Discussed seasonal patterns (monsoon, peak season, off-season)
- [ ] Covered cultural traditions specific to ${item.location_name}'s region
- [ ] Used ${item.location_name} colloquial terms naturally
- [ ] Mentioned unique local wedding customs or cuisine
- [ ] Referenced nearby cities for destination wedding patterns

AVOID:
- Generic content that could apply to any city
- Vague statements without specific data
- Over-optimized keyword stuffing (keep under 3% density)
- Excessive promotional language
- Cultural insensitivity or stereotypes
- Outdated information
- Fake testimonials or made-up data

Now generate the complete JSON content following this structure exactly.
  `.trim();
}

/**
 * Builds a concise prompt variation for content regeneration (faster, lighter).
 * Used for retry attempts when the first generation was too generic.
 */
export function buildRetryPrompt(
  item: PseoQueueItem,
  weakDimensions: string[],
  currentScore: number,
): string {
  const feedback = generateFailureFeedback(weakDimensions, currentScore);
  return buildWeddingPrompt(item, feedback);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generates human-readable failure feedback from weak dimension names.
 */
function generateFailureFeedback(
  weakDimensions: string[],
  currentScore: number,
): string {
  const feedbackMap: Record<string, string> = {
    location_specificity:
      "LOCATION SPECIFICITY: Content was too generic. Must include more real neighborhood names, venue names, and location-specific details. Research actual places in this city before writing.",
    cultural_relevance:
      "CULTURAL RELEVANCE: Need stronger cultural context. Include specific traditions, rituals, and customs practiced in this region. Mention community-specific wedding practices.",
    actionability:
      "ACTIONABILITY: Content needs more actionable advice. Add step-by-step guidance, how-to sections, budgeting tips, and practical checklists that couples can actually use.",
    readability:
      "READABILITY: Structure is incomplete. Ensure intro has hook+context+preview, benefits has 5-7 items, main content has 6-8 sections with subsections, and FAQs has 10-15 questions.",
    keyword_optimization:
      "KEYWORD OPTIMIZATION: Target keyword '${...}' must appear in the title, H1, and intro hook. Ensure it flows naturally, not forced.",
    uniqueness:
      "UNIQUENESS: Content lacks unique elements. Add more local_insights (venues, seasons, costs, customs), vendor recommendations, and realistic testimonials specific to this location.",
  };

  return weakDimensions
    .map((dim) => feedbackMap[dim] || `Improve ${dim} dimension.`)
    .join("\n");
}

/**
 * Returns region-specific cultural context based on location slug.
 */
function getRegionHint(locationSlug: string): string {
  // Map locations to regions (rough mapping)
  const regionMap: Record<string, string> = {
    // North
    delhi: "north",
    "delhi-ncr": "north",
    gurugram: "north",
    noida: "north",
    jaipur: "north",
    lucknow: "north",
    agra: "north",
    varanasi: "north",
    chandigarh: "north",
    amritsar: "north",
    ludhiana: "north",
    jodhpur: "north",
    udaipur: "north",
    kota: "north",
    meerut: "north",
    bareilly: "north",
    allahabad: "north",
    kanpur: "north",
    gwalior: "north",
    faridabad: "north",
    ghaziabad: "north",
    jammu: "north",
    srinagar: "north",
    shimla: "north",
    dehradun: "north",

    // South
    bangalore: "south",
    bengaluru: "south",
    hyderabad: "south",
    chennai: "south",
    coimbatore: "south",
    madurai: "south",
    mysuru: "south",
    tiruchirappalli: "south",
    visakhapatnam: "south",
    vijayawada: "south",
    mangalore: "south",
    kochi: "south",
    ernakulam: "south",
    thrissur: "south",
    trivandrum: "south",
    kozhikode: "south",
    calicut: "south",
    kannur: "south",
    kollam: "south",
    alappuzha: "south",
    palakkad: "south",
    malappuram: "south",
    kasargod: "south",
    pathanamthitta: "south",
    idukki: "south",
    pondicherry: "south",

    // East
    kolkata: "east",
    patna: "east",
    bhubaneswar: "east",
    ranchi: "east",
    siliguri: "east",

    // West
    mumbai: "west",
    pune: "west",
    ahmedabad: "west",
    surat: "west",
    vadodara: "west",
    nagpur: "west",
    nashik: "west",
    solapur: "west",
    rajkot: "west",
    jamnagar: "west",
    aurangabad: "west",
    goa: "west",
    panaji: "west",
    daman: "west",

    // Central
    indore: "central",
    bhopal: "central",
    jabalpur: "central",
    raipur: "central",

    // Northeast
    guwahati: "northeast",
    dimapur: "northeast",
    imphal: "northeast",
    shillong: "northeast",
    agartala: "northeast",
    aizawl: "northeast",
    kohima: "northeast",
    itanagar: "northeast",
    gangtok: "northeast",
  };

  const region = regionMap[locationSlug] || "general";

  if (region === "general") {
    return "REGIONAL CONTEXT: India has diverse wedding traditions. Adapt content to the local culture of this city.";
  }

  const seasonality =
    SEASONALITY_BY_REGION[region] || SEASONALITY_BY_REGION.north;
  const culture =
    REGION_CULTURAL_CONTEXT[region] || REGION_CULTURAL_CONTEXT.north;

  return `
REGIONAL CONTEXT (${region.toUpperCase()} India):
${culture}

SEASONALITY:
${seasonality}

Use these region-specific details to make the content authentic and locally relevant.
  `.trim();
}

/**
 * Infers city tier from priority score (rough mapping).
 */
function inferTier(priorityScore: number): number {
  if (priorityScore >= 80) return 1;
  if (priorityScore >= 60) return 2;
  return 3;
}
