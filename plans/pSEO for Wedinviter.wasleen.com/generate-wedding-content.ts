// ============================================================================
// WEDINVITER DAILY WEDDING CONTENT GENERATION SCRIPT
// File: scripts/generate-wedding-content.ts
// Runs via GitHub Actions daily at 2:00 AM UTC
// Generates 10 high-quality wedding content pages using DeepSeek AI
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY!,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://wedinviter.wasleen.com',
  REVALIDATE_SECRET: process.env.VERCEL_REVALIDATE_SECRET!,
  DAILY_LIMIT: parseInt(process.env.DAILY_GENERATION_LIMIT || '10'),
  MIN_QUALITY_SCORE: 75,
  MAX_RETRIES: 2,
};

// Validate environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DEEPSEEK_API_KEY',
  'VERCEL_REVALIDATE_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Supabase client
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// ============================================================================
// TYPES
// ============================================================================

interface QueueItem {
  queue_id: number;
  location_name: string;
  location_slug: string;
  topic_name: string;
  topic_slug: string;
  subtopic_name: string | null;
  subtopic_slug: string | null;
  target_keyword: string;
  url_slug: string;
  priority_score: number;
  cultural_context: string | null;
}

interface GeneratedContent {
  title: string;
  meta_description: string;
  h1: string;
  intro: {
    hook: string;
    context: string;
    preview: string;
  };
  benefits: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  main_content: Array<{
    heading: string;
    content: string;
    subsections?: Array<{
      subheading: string;
      content: string;
    }>;
  }>;
  local_insights: {
    popular_venues?: string[];
    best_seasons?: string;
    average_costs?: string;
    cultural_customs?: string;
  };
  vendor_recommendations?: Array<{
    category: string;
    tips: string;
    price_range: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  testimonials?: Array<{
    name: string;
    location: string;
    quote: string;
    rating: number;
  }>;
  pricing_table?: {
    packages: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  cta: {
    heading: string;
    description: string;
    button_text: string;
    features: string[];
  };
  related_topics: Array<{
    title: string;
    url: string;
  }>;
}

interface QualityScores {
  overall: number;
  location_specificity: number;
  cultural_relevance: number;
  actionability: number;
  readability: number;
  keyword_optimization: number;
  uniqueness: number;
}

// ============================================================================
// DEEPSEEK AI GENERATION
// ============================================================================

async function generateWeddingContent(item: QueueItem): Promise<GeneratedContent | null> {
  const prompt = buildWeddingPrompt(item);
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Indian wedding content writer with deep knowledge of local wedding cultures, traditions, and market trends. You write SEO-optimized, culturally sensitive, and highly actionable content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 8000,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ DeepSeek API error: ${error}`);
      return null;
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    
    // Parse JSON response
    const content = JSON.parse(rawContent) as GeneratedContent;
    
    return content;
  } catch (error) {
    console.error(`❌ Error generating content: ${error}`);
    return null;
  }
}

// ============================================================================
// PROMPT BUILDER
// ============================================================================

function buildWeddingPrompt(item: QueueItem): string {
  const culturalNote = item.cultural_context 
    ? `\nCULTURAL CONTEXT: This content should focus on ${item.cultural_context} wedding traditions and customs.`
    : '\nCULTURAL CONTEXT: Cover all major Indian wedding traditions (Hindu, Muslim, Christian, Sikh) with sensitivity and respect.';

  return `
You are writing a comprehensive, SEO-optimized article about "${item.topic_name}" specifically for ${item.location_name}.

TARGET KEYWORD: "${item.target_keyword}"
LOCATION: ${item.location_name}
TOPIC: ${item.topic_name}
SUBTOPIC: ${item.subtopic_name || 'General overview'}
URL: ${CONFIG.SITE_URL}/${item.url_slug}
${culturalNote}

WORD COUNT: 2,000-2,500 words
TONE: Helpful, authoritative, culturally sensitive, locally relevant, conversational

CRITICAL REQUIREMENTS:
1. Include 10-15 ${item.location_name}-SPECIFIC details (neighborhoods, landmarks, popular venues, local customs)
2. Mention REAL price ranges accurate for ${item.location_name} market
3. Reference seasonal patterns (monsoon weddings, winter wedding season, etc.)
4. Include cultural traditions specific to ${item.location_name} region
5. Use natural keyword placement (target keyword in title, H1, first paragraph, 2-3x in body)
6. Add 2-3 mentions of WedInviter.wasleen.com as the solution
7. 100% original content - NO generic templates or plagiarism
8. Conversational, engaging tone (write like helping a friend)

OUTPUT FORMAT (JSON):
{
  "title": "[60-char SEO title with target keyword - e.g., '${item.target_keyword} | Free Digital Cards - WedInviter']",
  "meta_description": "[155-char compelling meta with CTA - e.g., 'Discover the best ${item.subtopic_name || item.topic_name.toLowerCase()} in ${item.location_name}. Create stunning digital wedding invitations on WedInviter. Start free today!']",
  "h1": "[Clear H1 with location + topic - e.g., '${item.target_keyword}: Complete Guide for ${item.location_name} Couples']",
  
  "intro": {
    "hook": "[Engaging 2-3 sentence opening about weddings in ${item.location_name}]",
    "context": "[Why this topic matters for ${item.location_name} couples - 3-4 sentences]",
    "preview": "[What readers will learn - 2-3 sentences]"
  },
  
  "benefits": [
    {
      "title": "[Benefit 1 - specific to ${item.location_name}]",
      "description": "[2-3 sentences explaining this benefit in local context]",
      "icon": "💍"
    },
    // Include 5-7 benefits total, each with relevant emoji
  ],
  
  "main_content": [
    {
      "heading": "[H2: Main section about ${item.topic_name} in ${item.location_name}]",
      "content": "[3-5 paragraphs with SPECIFIC ${item.location_name} details - mention actual neighborhoods, venues, price ranges, local customs]",
      "subsections": [
        {
          "subheading": "[H3: Specific aspect]",
          "content": "[2-3 paragraphs with actionable advice]"
        },
        // 2-4 subsections per main section
      ]
    },
    // Include 6-8 main sections total
  ],
  
  "local_insights": {
    "popular_venues": ["[${item.location_name} Venue 1]", "[Venue 2]", "[Venue 3]", "[Venue 4]", "[Venue 5]"],
    "best_seasons": "[Specific months for ${item.location_name} weddings, e.g., 'October to February is peak wedding season in ${item.location_name}, with pleasant weather. Monsoon weddings (June-September) require indoor venues.']",
    "average_costs": "[Price ranges specific to ${item.location_name} - e.g., 'Budget weddings in ${item.location_name}: ₹5-8 lakhs, Mid-range: ₹15-25 lakhs, Luxury: ₹50 lakhs-2 crores']",
    "cultural_customs": "[${item.location_name}-specific traditions - e.g., 'In ${item.location_name}, Marathi weddings often include...' or 'Muslim weddings in ${item.location_name} typically...']"
  },
  
  "vendor_recommendations": [
    {
      "category": "[Photographer/Caterer/Decorator/etc.]",
      "tips": "[How to choose in ${item.location_name} - 3-4 sentences]",
      "price_range": "[₹X - ₹Y for ${item.location_name} market]"
    },
    // 3-5 vendor categories
  ],
  
  "faqs": [
    {
      "question": "[Specific question about ${item.topic_name} in ${item.location_name}]",
      "answer": "[Detailed answer with local context - 3-4 sentences]"
    },
    // Include 10-15 FAQs - mix of informational, commercial, and local questions
  ],
  
  "testimonials": [
    {
      "name": "[Indian first name]",
      "location": "[Neighborhood in ${item.location_name}]",
      "quote": "[2-3 sentence testimonial about using WedInviter for their ${item.location_name} wedding]",
      "rating": 5
    },
    // 2-3 testimonials
  ],
  
  "pricing_table": {
    "packages": [
      {
        "name": "Free",
        "price": "₹0",
        "features": ["1 basic design", "50 guests", "Email delivery", "WedInviter watermark"]
      },
      {
        "name": "Starter",
        "price": "₹999",
        "features": ["10 premium designs", "200 guests", "Email + WhatsApp delivery", "RSVP tracking", "No watermark"]
      },
      {
        "name": "Premium",
        "price": "₹2,499",
        "features": ["Unlimited designs", "Unlimited guests", "Video invitations", "Advanced RSVP", "Custom domain", "Analytics"]
      }
    ]
  },
  
  "cta": {
    "heading": "Create Your Perfect ${item.location_name} Wedding Invitation Today",
    "description": "[2-3 sentences about how WedInviter helps ${item.location_name} couples - mention convenience, cost savings, beautiful designs]",
    "button_text": "Start Creating Free",
    "features": ["[Feature 1 for ${item.location_name} couples]", "[Feature 2]", "[Feature 3]"]
  },
  
  "related_topics": [
    {
      "title": "[Related page title about ${item.location_name} or ${item.topic_name}]",
      "url": "/[pillar]/[location]/[subtopic]"
    },
    // 6-8 related pages for internal linking
  ]
}

LOCATION-SPECIFIC RESEARCH CHECKLIST:
- [ ] Mentioned 3+ actual neighborhoods in ${item.location_name}
- [ ] Referenced 5+ real venues or landmarks
- [ ] Included accurate price ranges for ${item.location_name}
- [ ] Discussed seasonal patterns (monsoon, peak season)
- [ ] Covered cultural traditions specific to ${item.location_name}
- [ ] Used ${item.location_name} colloquial terms naturally
- [ ] Mentioned traffic/logistics challenges (if applicable)
- [ ] Referenced destination wedding patterns from ${item.location_name}

AVOID:
- Generic content that could apply to any city
- Vague statements without specific data
- Over-optimized keyword stuffing
- Excessive promotional language
- Cultural insensitivity or stereotypes
- Outdated information
- Fake testimonials or made-up data

Now generate the complete JSON content following this structure.
  `.trim();
}

// ============================================================================
// QUALITY EVALUATION
// ============================================================================

function evaluateContentQuality(
  content: GeneratedContent,
  item: QueueItem
): QualityScores {
  const contentText = JSON.stringify(content).toLowerCase();
  const locationName = item.location_name.toLowerCase();
  
  // 1. Location Specificity (0-100)
  const locationMentions = (contentText.match(new RegExp(locationName, 'g')) || []).length;
  const locationSpecificity = Math.min(100, (locationMentions / 15) * 100);
  
  // 2. Cultural Relevance (0-100)
  const culturalKeywords = ['tradition', 'custom', 'ritual', 'culture', 'hindu', 'muslim', 'christian', 'sikh'];
  const culturalMentions = culturalKeywords.reduce(
    (count, keyword) => count + (contentText.match(new RegExp(keyword, 'g')) || []).length,
    0
  );
  const culturalRelevance = Math.min(100, (culturalMentions / 8) * 100);
  
  // 3. Actionability (0-100)
  const actionableKeywords = ['how to', 'steps', 'tips', 'guide', 'choose', 'find', 'book'];
  const actionableMentions = actionableKeywords.reduce(
    (count, keyword) => count + (contentText.match(new RegExp(keyword, 'g')) || []).length,
    0
  );
  const actionability = Math.min(100, (actionableMentions / 10) * 100);
  
  // 4. Readability (0-100) - based on structure completeness
  const hasIntro = content.intro && content.intro.hook && content.intro.context;
  const hasBenefits = content.benefits && content.benefits.length >= 5;
  const hasMainContent = content.main_content && content.main_content.length >= 6;
  const hasFAQs = content.faqs && content.faqs.length >= 10;
  const hasCTA = content.cta && content.cta.heading;
  
  const readability = (
    (hasIntro ? 25 : 0) +
    (hasBenefits ? 20 : 0) +
    (hasMainContent ? 30 : 0) +
    (hasFAQs ? 15 : 0) +
    (hasCTA ? 10 : 0)
  );
  
  // 5. Keyword Optimization (0-100)
  const targetKeyword = item.target_keyword.toLowerCase();
  const titleHasKeyword = content.title.toLowerCase().includes(targetKeyword) ? 30 : 0;
  const h1HasKeyword = content.h1.toLowerCase().includes(targetKeyword) ? 30 : 0;
  const introHasKeyword = content.intro?.hook?.toLowerCase().includes(targetKeyword) ? 20 : 0;
  const bodyMentions = (contentText.match(new RegExp(targetKeyword.replace(/ /g, '.*'), 'g')) || []).length;
  const bodyScore = Math.min(20, bodyMentions * 5);
  
  const keywordOptimization = titleHasKeyword + h1HasKeyword + introHasKeyword + bodyScore;
  
  // 6. Uniqueness (0-100) - based on variety of content elements
  const uniquenessFactors = [
    content.local_insights?.popular_venues?.length || 0,
    content.local_insights?.best_seasons ? 20 : 0,
    content.local_insights?.average_costs ? 20 : 0,
    content.local_insights?.cultural_customs ? 20 : 0,
    content.vendor_recommendations?.length || 0 * 10,
    content.testimonials?.length || 0 * 10,
  ];
  const uniqueness = Math.min(100, uniquenessFactors.reduce((a, b) => a + b, 0));
  
  // Overall Score (weighted average)
  const overall = Math.round(
    (locationSpecificity * 0.2) +
    (culturalRelevance * 0.15) +
    (actionability * 0.15) +
    (readability * 0.15) +
    (keywordOptimization * 0.15) +
    (uniqueness * 0.2)
  );
  
  return {
    overall,
    location_specificity: Math.round(locationSpecificity),
    cultural_relevance: Math.round(culturalRelevance),
    actionability: Math.round(actionability),
    readability: Math.round(readability),
    keyword_optimization: Math.round(keywordOptimization),
    uniqueness: Math.round(uniqueness),
  };
}

// ============================================================================
// SCHEMA GENERATION
// ============================================================================

function generateSchemaMarkup(content: GeneratedContent, item: QueueItem): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Article Schema
      {
        '@type': 'Article',
        'headline': content.title,
        'description': content.meta_description,
        'author': {
          '@type': 'Organization',
          'name': 'WedInviter',
          'url': CONFIG.SITE_URL,
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'WedInviter',
          'logo': {
            '@type': 'ImageObject',
            'url': `${CONFIG.SITE_URL}/logo.png`,
          },
        },
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString(),
        'mainEntityOfPage': `${CONFIG.SITE_URL}/${item.url_slug}`,
      },
      
      // FAQ Schema
      {
        '@type': 'FAQPage',
        'mainEntity': content.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      },
      
      // BreadcrumbList Schema
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': CONFIG.SITE_URL,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': item.topic_name,
            'item': `${CONFIG.SITE_URL}/${item.topic_slug}`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': item.location_name,
            'item': `${CONFIG.SITE_URL}/${item.topic_slug}/${item.location_slug}`,
          },
        ],
      },
      
      // LocalBusiness Schema (for invitation service)
      {
        '@type': 'LocalBusiness',
        'name': 'WedInviter',
        'description': 'Create beautiful digital wedding invitations online',
        'url': CONFIG.SITE_URL,
        'areaServed': {
          '@type': 'City',
          'name': item.location_name,
        },
        'priceRange': '₹999-₹2499',
      },
    ],
  };
}

// ============================================================================
// PUBLISH TO DATABASE
// ============================================================================

async function publishContent(
  item: QueueItem,
  content: GeneratedContent,
  qualityScores: QualityScores
): Promise<boolean> {
  const schema = generateSchemaMarkup(content, item);
  const wordCount = JSON.stringify(content).split(/\s+/).length;
  
  try {
    // Insert into published_pages
    const { error: publishError } = await supabase.from('published_pages').insert({
      queue_id: item.queue_id,
      url_path: `/${item.url_slug}`,
      title: content.title,
      meta_description: content.meta_description,
      h1_heading: content.h1,
      canonical_url: `${CONFIG.SITE_URL}/${item.url_slug}`,
      
      intro_section: content.intro,
      benefits: content.benefits,
      main_content: content.main_content,
      local_insights: content.local_insights,
      vendor_recommendations: content.vendor_recommendations,
      faqs: content.faqs,
      testimonials: content.testimonials,
      pricing_table: content.pricing_table,
      cta_section: content.cta,
      related_pages: content.related_topics,
      
      schema_json: schema,
      
      word_count: wordCount,
      quality_score: qualityScores.overall,
      location_specificity_score: qualityScores.location_specificity,
      cultural_relevance_score: qualityScores.cultural_relevance,
      actionability_score: qualityScores.actionability,
    });
    
    if (publishError) {
      console.error(`❌ Error publishing to database: ${publishError.message}`);
      return false;
    }
    
    // Update queue item status
    const { error: updateError } = await supabase
      .from('content_queue')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', item.queue_id);
    
    if (updateError) {
      console.error(`❌ Error updating queue: ${updateError.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error in publishContent: ${error}`);
    return false;
  }
}

// ============================================================================
// VERCEL CACHE REVALIDATION
// ============================================================================

async function revalidateVercelCache(item: QueueItem): Promise<boolean> {
  try {
    const pillar = item.topic_slug;
    const slug = item.subtopic_slug 
      ? `${item.location_slug}/${item.subtopic_slug}`
      : item.location_slug;
    
    const revalidateUrl = `${CONFIG.SITE_URL}/api/revalidate?secret=${CONFIG.REVALIDATE_SECRET}&pillar=${pillar}&slug=${slug}`;
    
    const response = await fetch(revalidateUrl, { method: 'POST' });
    
    if (!response.ok) {
      console.error(`❌ Vercel revalidation failed: ${response.statusText}`);
      return false;
    }
    
    console.log(`⚡ Vercel cache revalidated: /${pillar}/${slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Error revalidating cache: ${error}`);
    return false;
  }
}

// ============================================================================
// LOGGING
// ============================================================================

async function logGeneration(
  queueId: number,
  status: 'success' | 'failed' | 'timeout' | 'low_quality',
  qualityScore?: number,
  errorMessage?: string,
  tokensUsed?: number,
  generationTime?: number
): Promise<void> {
  try {
    await supabase.from('generation_logs').insert({
      queue_id: queueId,
      status,
      error_message: errorMessage,
      quality_score: qualityScore,
      api_tokens_used: tokensUsed,
      generation_time_seconds: generationTime,
      api_cost: tokensUsed ? (tokensUsed / 1000000) * 0.14 : 0, // DeepSeek pricing
    });
  } catch (error) {
    console.error(`❌ Error logging generation: ${error}`);
  }
}

// ============================================================================
// MAIN GENERATION FLOW
// ============================================================================

async function processQueueItem(item: QueueItem, attempt: number = 1): Promise<boolean> {
  console.log(`\n🤖 Generating ${item.topic_name} for ${item.location_name}...`);
  console.log(`   Target: ${item.target_keyword}`);
  console.log(`   Priority: ${item.priority_score}`);
  
  const startTime = Date.now();
  
  // Mark as generating
  await supabase
    .from('content_queue')
    .update({ status: 'generating' })
    .eq('id', item.queue_id);
  
  // Generate content
  const content = await generateWeddingContent(item);
  
  if (!content) {
    await logGeneration(item.queue_id, 'failed', undefined, 'DeepSeek API failed');
    
    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(`   ⚠️  Retrying (attempt ${attempt + 1}/${CONFIG.MAX_RETRIES})...`);
      return processQueueItem(item, attempt + 1);
    }
    
    await supabase
      .from('content_queue')
      .update({ status: 'failed', last_error: 'DeepSeek API failed after retries' })
      .eq('id', item.queue_id);
    
    return false;
  }
  
  // Evaluate quality
  const qualityScores = evaluateContentQuality(content, item);
  
  console.log(`   Quality Score: ${qualityScores.overall}/100`);
  console.log(`   - Location Specificity: ${qualityScores.location_specificity}/100`);
  console.log(`   - Cultural Relevance: ${qualityScores.cultural_relevance}/100`);
  console.log(`   - Actionability: ${qualityScores.actionability}/100`);
  
  // Check if quality meets threshold
  if (qualityScores.overall < CONFIG.MIN_QUALITY_SCORE) {
    console.log(`   ⚠️  Low quality (${qualityScores.overall}/100), threshold is ${CONFIG.MIN_QUALITY_SCORE}`);
    
    await logGeneration(item.queue_id, 'low_quality', qualityScores.overall);
    
    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(`   ⚠️  Regenerating with enhanced prompt (attempt ${attempt + 1}/${CONFIG.MAX_RETRIES})...`);
      return processQueueItem(item, attempt + 1);
    }
    
    await supabase
      .from('content_queue')
      .update({ status: 'failed', last_error: `Low quality: ${qualityScores.overall}/100` })
      .eq('id', item.queue_id);
    
    return false;
  }
  
  // Publish to database
  const published = await publishContent(item, content, qualityScores);
  
  if (!published) {
    await logGeneration(item.queue_id, 'failed', qualityScores.overall, 'Database insert failed');
    return false;
  }
  
  const generationTime = Math.round((Date.now() - startTime) / 1000);
  
  // Log successful generation
  await logGeneration(
    item.queue_id,
    'success',
    qualityScores.overall,
    undefined,
    8000, // Estimated tokens
    generationTime
  );
  
  // Revalidate Vercel cache
  await revalidateVercelCache(item);
  
  console.log(`   ✅ Published: ${CONFIG.SITE_URL}/${item.url_slug}`);
  console.log(`   ⏱️  Time: ${generationTime}s`);
  
  return true;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 WedInviter Daily Wedding Content Generation Started');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🎯 Target: ${CONFIG.DAILY_LIMIT} pages\n`);
  
  // Fetch next items from queue
  const { data: items, error } = await supabase.rpc('get_next_wedding_queue_items', {
    p_limit: CONFIG.DAILY_LIMIT,
  });
  
  if (error) {
    console.error(`❌ Error fetching queue: ${error.message}`);
    process.exit(1);
  }
  
  if (!items || items.length === 0) {
    console.log('✅ No items in queue. All done!');
    return;
  }
  
  console.log(`📋 Found ${items.length} items in queue\n`);
  
  // Process each item
  let successful = 0;
  let failed = 0;
  
  for (const item of items) {
    const success = await processQueueItem(item);
    
    if (success) {
      successful++;
    } else {
      failed++;
    }
    
    // Small delay between generations to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((successful / items.length) * 100)}%`);
  console.log('='.repeat(60));
  
  console.log('\n🎉 Daily generation completed!');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
