// ============================================================================
// WEDINVITER pSEO — Content Freshness Check Script
// ============================================================================
// Identifies stale published pages and re-queues them for regeneration.
// Runs weekly via GitHub Actions (Sunday 06:00 UTC).
//
// Staleness rules:
//   - quality_score >= 80 → re-queue after 180 days
//   - quality_score < 80  → re-queue after 90 days
//   - Always include pages missing quality_score for >60 days
// ============================================================================

import { createPseoClient } from "@/lib/pseo/client";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const STALENESS_DAYS_HIGH_QUALITY = 180; // Pages with score >= 80
const STALENESS_DAYS_LOW_QUALITY = 90; // Pages with score < 80
const STALENESS_DAYS_NO_SCORE = 60; // Pages with no quality score

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(60));
  console.log("📋 WEDINVITER pSEO — Content Freshness Check");
  console.log(`📅 ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  const supabase = createPseoClient();

  // -----------------------------------------------------------------------
  // Step 1: Find stale pages
  // -----------------------------------------------------------------------
  console.log("\n🔍 Identifying stale pages...");

  const now = new Date();
  const highQualityThreshold = new Date(
    now.getTime() - STALENESS_DAYS_HIGH_QUALITY * 24 * 60 * 60 * 1000,
  ).toISOString();
  const lowQualityThreshold = new Date(
    now.getTime() - STALENESS_DAYS_LOW_QUALITY * 24 * 60 * 60 * 1000,
  ).toISOString();
  const noScoreThreshold = new Date(
    now.getTime() - STALENESS_DAYS_NO_SCORE * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Query stale pages
  const { data: stalePages, error } = await supabase
    .from("published_pages")
    .select(
      "id, queue_id, url_path, title, quality_score, published_at, last_updated",
    )
    .or(
      `and(quality_score.gte.80,published_at.lte.${highQualityThreshold}),` +
        `and(quality_score.lt.80,published_at.lte.${lowQualityThreshold}),` +
        `and(quality_score.is.null,published_at.lte.${noScoreThreshold})`,
    )
    .order("published_at", { ascending: true });

  if (error) {
    console.error(`❌ Error querying stale pages: ${error.message}`);
    process.exit(1);
  }

  if (!stalePages || stalePages.length === 0) {
    console.log("\n✅ No stale pages found. All content is fresh!");
    process.exit(0);
  }

  console.log(`\n📋 Found ${stalePages.length} stale page(s):`);
  stalePages.forEach((page) => {
    const daysOld = Math.round(
      (now.getTime() - new Date(page.published_at).getTime()) /
        (24 * 60 * 60 * 1000),
    );
    console.log(
      `   - [${page.quality_score ?? "N/A"}/100] ${page.url_path} (${daysOld} days old)`,
    );
  });

  // -----------------------------------------------------------------------
  // Step 2: Re-queue stale pages
  // -----------------------------------------------------------------------
  console.log("\n🔄 Re-queuing stale pages for regeneration...");

  let requeued = 0;
  let failed = 0;

  for (const page of stalePages) {
    // Only re-queue if we have a valid queue_id
    if (!page.queue_id) {
      console.log(`   ⏭️  Skipping ${page.url_path} — no queue_id`);
      continue;
    }

    // Reset the queue item to 'pending' for regeneration
    const { error: updateError } = await supabase
      .from("content_queue")
      .update({
        status: "pending",
        last_error: null,
        updated_at: now.toISOString(),
      })
      .eq("id", page.queue_id);

    if (updateError) {
      console.error(
        `   ❌ Failed to re-queue ${page.url_path}: ${updateError.message}`,
      );
      failed++;
    } else {
      console.log(`   ✅ Re-queued ${page.url_path}`);
      requeued++;
    }
  }

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------
  console.log("\n" + "=".repeat(60));
  console.log("📊 FRESHNESS CHECK SUMMARY");
  console.log("=".repeat(60));
  console.log(`📋 Total stale pages found: ${stalePages.length}`);
  console.log(`🔄 Successfully re-queued: ${requeued}`);
  console.log(`❌ Failed to re-queue: ${failed}`);
  console.log("=".repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
