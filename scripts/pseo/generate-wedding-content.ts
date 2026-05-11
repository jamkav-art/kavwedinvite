// ============================================================================
// WEDINVITER pSEO — HOURLY WEDDING CONTENT GENERATION SCRIPT
// File: scripts/pseo/generate-wedding-content.ts
// Runs via GitHub Actions every hour (0 0-19 * * *)
// Generates 1 page per run, evaluates quality, publishes, and revalidates.
//
// CRITICAL DIFFERENCES from old batch script:
//   1. Fetches 1 item via get_next_single_queue_item() instead of 10
//   2. Uses shared lib/pseo/ modules instead of inline code
//   3. Includes keyword stuffing detection
//   4. Exits with proper code for GitHub Actions success/failure tracking
//   5. No loop — single item processing per run
// ============================================================================

import { createPseoClient } from "@/lib/pseo/client";
import {
  evaluateContentQuality,
  detectKeywordStuffing,
  getWeakDimensions,
  QUALITY_THRESHOLD,
} from "@/lib/pseo/scoring";
import { buildWeddingPrompt, buildRetryPrompt } from "@/lib/pseo/prompts";
import { generateSchemaMarkup } from "@/lib/pseo/schema";
import {
  fetchNextQueueItem,
  markAsGenerating,
  markAsCompleted,
  markAsFailed,
  logGeneration,
  revalidateVercelCache,
} from "@/lib/pseo/queue";
import type {
  GeneratedContent,
  PseoQueueItem,
  QualityScores,
} from "@/lib/pseo/types";

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY!,
  SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL || "https://wedinviter.wasleen.com",
  MIN_QUALITY_SCORE: QUALITY_THRESHOLD, // 75
  MAX_RETRIES: 2,
  DEEPSEEK_MODEL: "deepseek-chat",
  MAX_TOKENS: 8000,
  TEMPERATURE: 0.7,
  GENERATION_TIMEOUT_MS: 120_000, // 2 minutes
};

// Validate environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DEEPSEEK_API_KEY",
  "VERCEL_REVALIDATE_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// ============================================================================
// DEEPSEEK AI GENERATION
// ============================================================================

/**
 * Calls the DeepSeek API to generate wedding content based on a prompt.
 * Uses JSON response format for reliable parsing.
 */
async function generateWeddingContent(
  item: PseoQueueItem,
  retryFeedback?: string,
): Promise<GeneratedContent | null> {
  const prompt = retryFeedback
    ? buildRetryPrompt(item, getWeakDimensions({} as QualityScores), 0) // We'll build full retry prompt differently
    : buildWeddingPrompt(item);

  // If retry feedback provided, build enhanced prompt
  const finalPrompt = retryFeedback
    ? buildWeddingPrompt(item, retryFeedback)
    : prompt;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CONFIG.GENERATION_TIMEOUT_MS,
    );

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CONFIG.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: CONFIG.DEEPSEEK_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert Indian wedding content writer with deep knowledge of local wedding cultures, traditions, and market trends. You write SEO-optimized, culturally sensitive, and highly actionable content. Always respond with valid JSON only, no markdown formatting.",
            },
            {
              role: "user",
              content: finalPrompt,
            },
          ],
          max_tokens: CONFIG.MAX_TOKENS,
          temperature: CONFIG.TEMPERATURE,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ DeepSeek API error (${response.status}): ${error}`);
      return null;
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;

    // Parse JSON response
    const content = JSON.parse(rawContent) as GeneratedContent;

    // Validate basic structure
    if (!content.title || !content.h1 || !content.meta_description) {
      console.error("❌ Generated content missing required SEO fields");
      return null;
    }

    return content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("❌ DeepSeek API request timed out");
    } else {
      console.error(`❌ Error generating content: ${error}`);
    }
    return null;
  }
}

// ============================================================================
// PUBLISH TO DATABASE
// ============================================================================

/**
 * Inserts the generated content into published_pages and updates queue status.
 */
async function publishContent(
  item: PseoQueueItem,
  content: GeneratedContent,
  qualityScores: QualityScores,
): Promise<boolean> {
  const supabase = createPseoClient();
  const schema = generateSchemaMarkup(content, item);
  const wordCount = JSON.stringify(content).split(/\s+/).length;

  try {
    // Insert into published_pages
    const { error: publishError } = await supabase
      .from("published_pages")
      .insert({
        queue_id: item.queue_id,
        url_path: `/${item.url_slug}`,
        topic_slug: item.topic_slug,
        location_slug: item.location_slug,
        subtopic_slug: item.subtopic_slug,
        title: content.title,
        meta_description: content.meta_description,
        h1_heading: content.h1,
        canonical_url: `${CONFIG.SITE_URL}/${item.url_slug}`,

        // Content (JSONB)
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

        // Structured Data
        schema_json: schema,

        // Metrics
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

    console.log(`   📝 Published page: /${item.url_slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Error in publishContent: ${error}`);
    return false;
  }
}

// ============================================================================
// MAIN GENERATION FLOW (Single Item)
// ============================================================================

/**
 * Processes a single queue item: generate → evaluate → publish → revalidate.
 * Supports up to MAX_RETRIES attempts with enhanced prompts on failure.
 */
async function processQueueItem(
  item: PseoQueueItem,
  attempt: number = 1,
): Promise<boolean> {
  console.log(
    `\n🤖 [Attempt ${attempt}/${CONFIG.MAX_RETRIES}] Generating ${item.topic_name} for ${item.location_name}...`,
  );
  console.log(`   Target keyword: "${item.target_keyword}"`);
  console.log(`   URL: /${item.url_slug}`);
  console.log(`   Priority: ${item.priority_score}`);
  console.log(`   Cultural context: ${item.cultural_context || "General"}`);

  const startTime = Date.now();

  // Mark as generating in queue
  await markAsGenerating(item.queue_id);

  // --- Step 1: Generate Content via DeepSeek ---
  const content = await generateWeddingContent(item);

  if (!content) {
    await logGeneration({
      queueId: item.queue_id,
      status: "failed",
      errorMessage: "DeepSeek API returned null or failed",
      generationTime: Math.round((Date.now() - startTime) / 1000),
    });

    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(
        `   ⚠️  Retrying (attempt ${attempt + 1}/${CONFIG.MAX_RETRIES})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Brief delay
      return processQueueItem(item, attempt + 1);
    }

    await markAsFailed(item.queue_id, "DeepSeek API failed after retries");
    return false;
  }

  // --- Step 2: Keyword Stuffing Detection ---
  const stuffingDetected = detectKeywordStuffing(content, item.target_keyword);
  if (stuffingDetected) {
    console.warn(
      `   ⚠️  Keyword stuffing detected for "${item.target_keyword}"`,
    );

    await logGeneration({
      queueId: item.queue_id,
      status: "keyword_stuffing",
      qualityScore: 0,
      errorMessage: `Keyword stuffing detected for "${item.target_keyword}"`,
      generationTime: Math.round((Date.now() - startTime) / 1000),
    });

    // Treat as low quality — retry with enhanced prompt
    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(
        `   ⚠️  Regenerating with anti-stuffing prompt (attempt ${attempt + 1}/${CONFIG.MAX_RETRIES})...`,
      );
      const antiStuffingFeedback = `KEYWORD STUFFING DETECTED: The target keyword "${item.target_keyword}" appeared too frequently (>3% density). Use natural keyword placement with synonyms and variations. The keyword should appear in title, H1, and intro only — then use natural variations in the body.`;
      return processQueueItemWithFeedback(
        item,
        attempt + 1,
        antiStuffingFeedback,
      );
    }

    await markAsFailed(
      item.queue_id,
      `Keyword stuffing: ${item.target_keyword}`,
    );
    return false;
  }

  // --- Step 3: Quality Evaluation ---
  const qualityScores = evaluateContentQuality(content, item);

  console.log(`   📊 Quality Score: ${qualityScores.overall}/100`);
  console.log(
    `      - Location Specificity: ${qualityScores.location_specificity}/100`,
  );
  console.log(
    `      - Cultural Relevance: ${qualityScores.cultural_relevance}/100`,
  );
  console.log(`      - Actionability: ${qualityScores.actionability}/100`);
  console.log(`      - Readability: ${qualityScores.readability}/100`);
  console.log(
    `      - Keyword Optimization: ${qualityScores.keyword_optimization}/100`,
  );
  console.log(`      - Uniqueness: ${qualityScores.uniqueness}/100`);

  // --- Step 4: Quality Gate ---
  if (qualityScores.overall < CONFIG.MIN_QUALITY_SCORE) {
    console.log(
      `   ⚠️  Below quality threshold (${qualityScores.overall}/${CONFIG.MIN_QUALITY_SCORE})`,
    );

    const weakDims = getWeakDimensions(qualityScores);
    console.log(
      `   ⚠️  Weak dimensions: ${weakDims.join(", ") || "None specific"}`,
    );

    await logGeneration({
      queueId: item.queue_id,
      status: "low_quality",
      qualityScore: qualityScores.overall,
      errorMessage: `Low quality: ${qualityScores.overall}/100. Weak: ${weakDims.join(", ")}`,
      generationTime: Math.round((Date.now() - startTime) / 1000),
    });

    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(
        `   ⚠️  Regenerating with enhanced prompt (attempt ${attempt + 1}/${CONFIG.MAX_RETRIES})...`,
      );

      // Build feedback string from weak dimensions for the retry prompt
      const feedbackMap: Record<string, string> = {
        location_specificity:
          "LOCATION SPECIFICITY: Content was too generic about the location. Must include more real neighborhood names, venue names, and location-specific details.",
        cultural_relevance:
          "CULTURAL RELEVANCE: Need stronger cultural context. Include specific traditions, rituals, and customs practiced in this region.",
        actionability:
          "ACTIONABILITY: Content needs more actionable advice. Add step-by-step guidance, budgeting tips, and practical checklists.",
        readability:
          "READABILITY: Structure is incomplete. Ensure intro has hook+context+preview, benefits has 5-7 items, main content has 6-8 sections, and FAQs has 10-15 questions.",
        keyword_optimization:
          "KEYWORD OPTIMIZATION: Target keyword must appear in the title, H1, and intro hook.",
        uniqueness:
          "UNIQUENESS: Content lacks unique elements. Add more local insights, vendor recommendations, and realistic testimonials.",
      };

      const feedback = weakDims
        .map((dim) => feedbackMap[dim] || `Improve ${dim}`)
        .join("\n");
      return processQueueItemWithFeedback(item, attempt + 1, feedback);
    }

    await markAsFailed(
      item.queue_id,
      `Low quality: ${qualityScores.overall}/100`,
    );
    return false;
  }

  // --- Step 5: Publish to Database ---
  const published = await publishContent(item, content, qualityScores);

  if (!published) {
    await logGeneration({
      queueId: item.queue_id,
      status: "failed",
      qualityScore: qualityScores.overall,
      errorMessage: "Database publish failed",
      generationTime: Math.round((Date.now() - startTime) / 1000),
    });
    return false;
  }

  // Mark queue as completed
  await markAsCompleted(item.queue_id);

  const generationTime = Math.round((Date.now() - startTime) / 1000);

  // Log successful generation
  await logGeneration({
    queueId: item.queue_id,
    status: "success",
    qualityScore: qualityScores.overall,
    tokensUsed: 8000, // Estimated; real usage tracking would need response parsing
    generationTime,
  });

  // --- Step 6: Revalidate Vercel Cache ---
  await revalidateVercelCache(item);

  console.log(`\n   ✅ SUCCESS: /${item.url_slug}`);
  console.log(`   ⏱️  Generation time: ${generationTime}s`);
  console.log(`   📊 Final quality: ${qualityScores.overall}/100`);
  console.log(`   🔗 View: ${CONFIG.SITE_URL}/${item.url_slug}`);

  return true;
}

/**
 * Same as processQueueItem but with pre-built feedback for retry.
 * Used when keyword stuffing or low quality triggers regeneration.
 */
async function processQueueItemWithFeedback(
  item: PseoQueueItem,
  attempt: number,
  feedback: string,
): Promise<boolean> {
  console.log(
    `\n🤖 [Attempt ${attempt}/${CONFIG.MAX_RETRIES}] Regenerating ${item.topic_name} for ${item.location_name}...`,
  );
  console.log(`   Target keyword: "${item.target_keyword}"`);
  console.log(`   Feedback: ${feedback.slice(0, 100)}...`);

  const startTime = Date.now();

  // Mark as generating
  await markAsGenerating(item.queue_id);

  // Generate with enhanced prompt
  const content = await generateWeddingContent(item, feedback);

  if (!content) {
    await logGeneration({
      queueId: item.queue_id,
      status: "failed",
      errorMessage: "DeepSeek API failed on retry",
      generationTime: Math.round((Date.now() - startTime) / 1000),
    });

    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(
        `   ⚠️  Retrying again (attempt ${attempt + 1}/${CONFIG.MAX_RETRIES})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return processQueueItemWithFeedback(item, attempt + 1, feedback);
    }

    await markAsFailed(item.queue_id, "DeepSeek API failed after retries");
    return false;
  }

  // Quality evaluation
  const qualityScores = evaluateContentQuality(content, item);

  console.log(`   📊 Quality Score: ${qualityScores.overall}/100`);

  // Quality gate
  if (qualityScores.overall < CONFIG.MIN_QUALITY_SCORE) {
    console.log(
      `   ⚠️  Still below threshold after retry (${qualityScores.overall}/${CONFIG.MIN_QUALITY_SCORE})`,
    );

    await logGeneration({
      queueId: item.queue_id,
      status: "low_quality",
      qualityScore: qualityScores.overall,
      errorMessage: `Low quality after retry: ${qualityScores.overall}/100`,
      generationTime: Math.round((Date.now() - startTime) / 1000),
    });

    if (attempt < CONFIG.MAX_RETRIES) {
      console.log(
        `   ⚠️  Final retry attempt (${attempt + 1}/${CONFIG.MAX_RETRIES})...`,
      );
      return processQueueItemWithFeedback(item, attempt + 1, feedback);
    }

    await markAsFailed(
      item.queue_id,
      `Low quality after retries: ${qualityScores.overall}/100`,
    );
    return false;
  }

  // Publish
  const published = await publishContent(item, content, qualityScores);

  if (!published) {
    await logGeneration({
      queueId: item.queue_id,
      status: "failed",
      qualityScore: qualityScores.overall,
      errorMessage: "Database publish failed on retry",
      generationTime: Math.round((Date.now() - startTime) / 1000),
    });
    return false;
  }

  await markAsCompleted(item.queue_id);

  const generationTime = Math.round((Date.now() - startTime) / 1000);

  await logGeneration({
    queueId: item.queue_id,
    status: "success",
    qualityScore: qualityScores.overall,
    tokensUsed: 8000,
    generationTime,
  });

  await revalidateVercelCache(item);

  console.log(`\n   ✅ SUCCESS (retry): /${item.url_slug}`);
  console.log(`   ⏱️  Generation time: ${generationTime}s`);
  console.log(`   📊 Final quality: ${qualityScores.overall}/100`);

  return true;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main entry point for the hourly generation job.
 * Fetches exactly 1 item from the queue, processes it, and exits.
 *
 * Exit codes:
 *   0 — Success (page generated and published, or queue empty)
 *   1 — Failure (generation failed after retries)
 */
async function main() {
  console.log("=".repeat(60));
  console.log("🚀 WEDINVITER pSEO — Hourly Content Generation");
  console.log(`📅 ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  // --- Step 1: Fetch ONE item from queue ---
  console.log("\n🔍 Fetching next queue item...");
  const item = await fetchNextQueueItem();

  if (!item) {
    console.log("\n✅ Queue is empty. All items completed!");
    console.log("=".repeat(60));
    process.exit(0);
  }

  console.log(`   📋 Queue item #${item.queue_id}:`);
  console.log(`      Topic: ${item.topic_name}`);
  console.log(`      Location: ${item.location_name}`);
  console.log(`      Subtopic: ${item.subtopic_name || "General"}`);
  console.log(`      Keyword: ${item.target_keyword}`);
  console.log(`      URL: /${item.url_slug}`);

  // --- Step 2: Process the item (generate → evaluate → publish → revalidate) ---
  const success = await processQueueItem(item);

  // --- Step 3: Summary ---
  console.log("\n" + "=".repeat(60));
  console.log("📊 GENERATION SUMMARY");
  console.log("=".repeat(60));

  if (success) {
    console.log(`✅ Page published successfully`);
    console.log(`🔗 ${CONFIG.SITE_URL}/${item.url_slug}`);
    process.exit(0);
  } else {
    console.log(`❌ Generation failed for queue item #${item.queue_id}`);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
