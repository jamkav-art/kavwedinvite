// ============================================================================
// WEDINVITER pSEO — Queue Status API Endpoint
// ============================================================================
// Read-only endpoint to monitor queue health, generation stats, and
// remaining capacity. Used for dashboards and manual checks.
// ============================================================================

import { NextResponse } from "next/server";
import { getQueueStats } from "@/lib/pseo/queue";

/**
 * GET /api/pseo/status
 *
 * Returns queue statistics including:
 * - total_items: Total queue items
 * - pending: Items waiting to be generated
 * - completed: Successfully generated pages
 * - failed: Failed generation attempts
 * - generating: Currently in progress
 * - avg_priority: Average priority score of remaining items
 * - estimated_days: Estimated days until queue exhaustion
 * - pages_today: Pages generated today
 */
export async function GET() {
  try {
    const stats = await getQueueStats();

    if (!stats) {
      return NextResponse.json(
        { error: "Failed to fetch queue statistics" },
        { status: 500 },
      );
    }

    // Calculate estimated days until queue exhaustion (at 20 pages/day)
    const pagesPerDay = 20;
    const estimatedDays = stats.pending
      ? Math.round((stats.pending / pagesPerDay) * 10) / 10
      : 0;

    return NextResponse.json(
      {
        ...stats,
        estimated_days: estimatedDays,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("❌ Status API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
