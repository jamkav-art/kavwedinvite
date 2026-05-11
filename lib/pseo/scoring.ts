// ============================================================================
// WEDINVITER pSEO — Quality Scoring Engine
// ============================================================================
// Evaluates generated content across 6 weighted dimensions.
// Threshold: >= 75/100 to publish. Max 2 retries with enhanced prompts.
// ============================================================================

import type {
  GeneratedContent,
  PseoQueueItem,
  QualityScores,
} from "@/lib/pseo/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DIMENSION_WEIGHTS = {
  location_specificity: 0.2, // 20%
  cultural_relevance: 0.15, // 15%
  actionability: 0.15, // 15%
  readability: 0.15, // 15%
  keyword_optimization: 0.15, // 15%
  uniqueness: 0.2, // 20%
} as const;

export const QUALITY_THRESHOLD = 75;

// Keywords used in scoring heuristics
const CULTURAL_KEYWORDS = [
  "tradition",
  "custom",
  "ritual",
  "culture",
  "hindu",
  "muslim",
  "christian",
  "sikh",
  "ceremony",
  "blessing",
];

const ACTIONABLE_KEYWORDS = [
  "how to",
  "steps",
  "tips",
  "guide",
  "choose",
  "find",
  "book",
  "plan",
  "budget",
  "compare",
];

const STUFFING_THRESHOLD = 0.03; // 3% keyword density max

// ---------------------------------------------------------------------------
// Keyword Stuffing Detection
// ---------------------------------------------------------------------------

/**
 * Checks if a keyword is overused beyond the safe density threshold.
 * Returns true if keyword stuffing is detected (density > 3%).
 */
export function detectKeywordStuffing(
  content: GeneratedContent,
  targetKeyword: string,
): boolean {
  const fullText = [
    content.title,
    content.meta_description,
    content.h1,
    content.intro?.hook || "",
    content.intro?.context || "",
    content.intro?.preview || "",
    ...(content.benefits || []).map((b) => `${b.title} ${b.description}`),
    ...(content.main_content || []).map(
      (s) =>
        `${s.heading} ${s.content} ${(s.subsections || []).map((ss) => `${ss.subheading} ${ss.content}`).join(" ")}`,
    ),
    ...(content.faqs || []).map((f) => `${f.question} ${f.answer}`),
  ].join(" ");

  const wordCount = fullText.split(/\s+/).length;
  const keywordRegex = new RegExp(
    targetKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi",
  );
  const keywordOccurrences = (fullText.match(keywordRegex) || []).length;
  const density = keywordOccurrences / wordCount;

  return density > STUFFING_THRESHOLD;
}

// ---------------------------------------------------------------------------
// 6-Dimension Quality Scoring
// ---------------------------------------------------------------------------

/**
 * Evaluates generated content quality across 6 weighted dimensions.
 *
 * BUG FIX (vs original plan): Operator precedence in uniqueness calculation.
 *   Old: `content.vendor_recommendations?.length || 0 * 10`
 *   New: `(content.vendor_recommendations?.length || 0) * 10`
 *
 * @returns QualityScores with dimension breakdown and overall (0-100)
 */
export function evaluateContentQuality(
  content: GeneratedContent,
  item: PseoQueueItem,
): QualityScores {
  const contentText = JSON.stringify(content).toLowerCase();
  const locationName = item.location_name.toLowerCase();

  // -----------------------------------------------------------------------
  // Dimension 1: Location Specificity (Weight: 20%)
  // Measures how many times the target location is mentioned naturally.
  // -----------------------------------------------------------------------
  const locationMentions = (
    contentText.match(new RegExp(locationName, "g")) || []
  ).length;
  // Expected: ~15 mentions for a good location-specific article
  const locationSpecificity = Math.min(100, (locationMentions / 15) * 100);

  // -----------------------------------------------------------------------
  // Dimension 2: Cultural Relevance (Weight: 15%)
  // Measures coverage of cultural/traditional keywords.
  // -----------------------------------------------------------------------
  const culturalMentions = CULTURAL_KEYWORDS.reduce(
    (count, keyword) =>
      count + (contentText.match(new RegExp(keyword, "g")) || []).length,
    0,
  );
  const culturalRelevance = Math.min(100, (culturalMentions / 8) * 100);

  // -----------------------------------------------------------------------
  // Dimension 3: Actionability (Weight: 15%)
  // Measures how actionable/helpful the content is.
  // -----------------------------------------------------------------------
  const actionableMentions = ACTIONABLE_KEYWORDS.reduce(
    (count, keyword) =>
      count + (contentText.match(new RegExp(keyword, "g")) || []).length,
    0,
  );
  const actionability = Math.min(100, (actionableMentions / 10) * 100);

  // -----------------------------------------------------------------------
  // Dimension 4: Readability (Weight: 15%)
  // Based on structure completeness (intro, benefits, main content, FAQs, CTA).
  // -----------------------------------------------------------------------
  const hasIntro = Boolean(
    content.intro && content.intro.hook && content.intro.context,
  );
  const hasBenefits = Boolean(content.benefits && content.benefits.length >= 5);
  const hasMainContent = Boolean(
    content.main_content && content.main_content.length >= 6,
  );
  const hasFAQs = Boolean(content.faqs && content.faqs.length >= 10);
  const hasCTA = Boolean(content.cta && content.cta.heading);

  const readability =
    (hasIntro ? 25 : 0) +
    (hasBenefits ? 20 : 0) +
    (hasMainContent ? 30 : 0) +
    (hasFAQs ? 15 : 0) +
    (hasCTA ? 10 : 0);

  // -----------------------------------------------------------------------
  // Dimension 5: Keyword Optimization (Weight: 15%)
  // Checks if target keyword appears in key SEO positions.
  // -----------------------------------------------------------------------
  const targetKeyword = item.target_keyword.toLowerCase();
  const titleHasKeyword = content.title.toLowerCase().includes(targetKeyword)
    ? 30
    : 0;
  const h1HasKeyword = content.h1.toLowerCase().includes(targetKeyword)
    ? 30
    : 0;
  const introHasKeyword = content.intro?.hook
    ?.toLowerCase()
    .includes(targetKeyword)
    ? 20
    : 0;

  // Check body mentions (loose match to account for keyword variations)
  const bodyMentions = (
    contentText.match(new RegExp(targetKeyword.replace(/ /g, ".*"), "g")) || []
  ).length;
  const bodyScore = Math.min(20, bodyMentions * 5);

  const keywordOptimization =
    titleHasKeyword + h1HasKeyword + introHasKeyword + bodyScore;

  // -----------------------------------------------------------------------
  // Dimension 6: Uniqueness (Weight: 20%)
  // Measures variety of content elements — local data, vendor recs, testimonials.
  //
  // ⚠️ BUG FIX: Operator precedence
  //   Old: `content.vendor_recommendations?.length || 0 * 10`
  //   This evaluated as: `content.vendor_recommendations?.length || (0 * 10)`
  //   So when array was undefined, result was 0 (correct by accident)
  //   But when array had length 2, result was 2 (wrong! should be 20)
  //
  //   New: `(content.vendor_recommendations?.length || 0) * 10`
  //   Now correctly: 0 -> 0, 2 -> 20, 5 -> 50
  // -----------------------------------------------------------------------
  const uniquenessFactors = [
    content.local_insights?.popular_venues?.length || 0,
    content.local_insights?.best_seasons ? 20 : 0,
    content.local_insights?.average_costs ? 20 : 0,
    content.local_insights?.cultural_customs ? 20 : 0,
    (content.vendor_recommendations?.length || 0) * 10,
    (content.testimonials?.length || 0) * 10,
  ];
  const uniqueness = Math.min(
    100,
    uniquenessFactors.reduce((a, b) => a + b, 0),
  );

  // -----------------------------------------------------------------------
  // Overall Score (Weighted Average)
  // -----------------------------------------------------------------------
  const overall = Math.round(
    locationSpecificity * DIMENSION_WEIGHTS.location_specificity +
      culturalRelevance * DIMENSION_WEIGHTS.cultural_relevance +
      actionability * DIMENSION_WEIGHTS.actionability +
      readability * DIMENSION_WEIGHTS.readability +
      keywordOptimization * DIMENSION_WEIGHTS.keyword_optimization +
      uniqueness * DIMENSION_WEIGHTS.uniqueness,
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

// ---------------------------------------------------------------------------
// Quality Score Helpers
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable label for a quality score.
 */
export function getQualityLabel(score: number): string {
  if (score >= 90) return "🌟 Excellent";
  if (score >= 80) return "✅ Good";
  if (score >= QUALITY_THRESHOLD) return "👍 Passable";
  if (score >= 60) return "⚠️ Needs Work";
  return "❌ Poor";
}

/**
 * Returns an array of dimension names that scored below the threshold.
 */
export function getWeakDimensions(scores: QualityScores): string[] {
  const dimThreshold = 70;
  const weak: string[] = [];

  if (scores.location_specificity < dimThreshold)
    weak.push("location_specificity");
  if (scores.cultural_relevance < dimThreshold) weak.push("cultural_relevance");
  if (scores.actionability < dimThreshold) weak.push("actionability");
  if (scores.readability < dimThreshold) weak.push("readability");
  if (scores.keyword_optimization < dimThreshold)
    weak.push("keyword_optimization");
  if (scores.uniqueness < dimThreshold) weak.push("uniqueness");

  return weak;
}
