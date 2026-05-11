// ============================================================================
// WEDINVITER pSEO — Queue Management Utilities
// ============================================================================
// Handles queue item lifecycle: fetch, mark status, update on completion/fail.
// Used by the hourly generation script and any admin tools.
// ============================================================================

import type { GenerationStatus, PseoQueueItem } from "@/lib/pseo/types";
import { createPseoClient } from "@/lib/pseo/client";

// ---------------------------------------------------------------------------
// Queue Fetch
// ---------------------------------------------------------------------------

/**
 * Fetches the next pending queue item using the `get_next_single_queue_item()`
 * database function, which uses FOR UPDATE SKIP LOCKED to prevent concurrent
 * workflow collisions.
 *
 * @returns The next queue item to process, or null if queue is empty
 */
export async function fetchNextQueueItem(): Promise<PseoQueueItem | null> {
  const supabase = createPseoClient();

  const { data, error } = await supabase.rpc("get_next_single_queue_item");

  if (error) {
    console.error(`❌ Error fetching next queue item: ${error.message}`);
    return null;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  // The RPC returns a single row (LIMIT 1), but Supabase returns it as array
  const item = Array.isArray(data) ? data[0] : data;

  return item as PseoQueueItem;
}

// ---------------------------------------------------------------------------
// Queue Status Management
// ---------------------------------------------------------------------------

/**
 * Marks a queue item as "generating" (in progress).
 * Used at the start of a generation attempt.
 */
export async function markAsGenerating(queueId: number): Promise<void> {
  const supabase = createPseoClient();

  const { error } = await supabase
    .from("content_queue")
    .update({
      status: "generating",
      updated_at: new Date().toISOString(),
    })
    .eq("id", queueId);

  if (error) {
    console.error(
      `❌ Error marking queue item ${queueId} as generating: ${error.message}`,
    );
  }
}

/**
 * Marks a queue item as "completed" after successful generation and publish.
 */
export async function markAsCompleted(queueId: number): Promise<void> {
  const supabase = createPseoClient();

  const { error } = await supabase
    .from("content_queue")
    .update({
      status: "completed",
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", queueId);

  if (error) {
    console.error(
      `❌ Error marking queue item ${queueId} as completed: ${error.message}`,
    );
  }
}

/**
 * Marks a queue item as "failed" with an error message.
 */
export async function markAsFailed(
  queueId: number,
  errorMessage: string,
): Promise<void> {
  const supabase = createPseoClient();

  const { error } = await supabase
    .from("content_queue")
    .update({
      status: "failed",
      last_error: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", queueId);

  if (error) {
    console.error(
      `❌ Error marking queue item ${queueId} as failed: ${error.message}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Generation Logging
// ---------------------------------------------------------------------------

/**
 * Logs a generation attempt to the `generation_logs` table for monitoring.
 */
export async function logGeneration(params: {
  queueId: number;
  status: GenerationStatus;
  qualityScore?: number;
  errorMessage?: string;
  tokensUsed?: number;
  generationTime?: number;
}): Promise<void> {
  const supabase = createPseoClient();

  const { error } = await supabase.from("generation_logs").insert({
    queue_id: params.queueId,
    status: params.status,
    quality_score: params.qualityScore,
    error_message: params.errorMessage,
    api_tokens_used: params.tokensUsed,
    generation_time_seconds: params.generationTime,
    api_cost: params.tokensUsed ? (params.tokensUsed / 1_000_000) * 0.14 : 0, // DeepSeek pricing: $0.14/M tokens
  });

  if (error) {
    console.error(`❌ Error logging generation: ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Vercel Cache Revalidation
// ---------------------------------------------------------------------------

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wedinviter.wasleen.com";

/**
 * Pings the Vercel revalidation endpoint to bust ISR cache for a page.
 * This ensures the newly published page is immediately available.
 *
 * @param item - The queue item that was just published
 * @returns true if revalidation succeeded
 */
export async function revalidateVercelCache(
  item: PseoQueueItem,
): Promise<boolean> {
  const secret = process.env.VERCEL_REVALIDATE_SECRET;
  if (!secret) {
    console.error("❌ Missing VERCEL_REVALIDATE_SECRET env var");
    return false;
  }

  const pillar = item.topic_slug;
  const slug = item.subtopic_slug
    ? `${item.location_slug}/${item.subtopic_slug}`
    : item.location_slug;

  const revalidateUrl = `${SITE_URL}/api/revalidate?secret=${secret}`;

  try {
    const response = await fetch(revalidateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pillar, slug }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Vercel revalidation failed: ${text}`);
      return false;
    }

    console.log(`⚡ Vercel cache revalidated: /${pillar}/${slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Error revalidating cache: ${error}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Queue Statistics
// ---------------------------------------------------------------------------

/**
 * Fetches queue statistics from the `get_queue_statistics()` function.
 */
export async function getQueueStats(): Promise<{
  total_items: number;
  pending: number;
  completed: number;
  failed: number;
  generating: number;
  avg_priority: number;
} | null> {
  const supabase = createPseoClient();

  const { data, error } = await supabase.rpc("get_queue_statistics");

  if (error) {
    console.error(`❌ Error fetching queue stats: ${error.message}`);
    return null;
  }

  return data as {
    total_items: number;
    pending: number;
    completed: number;
    failed: number;
    generating: number;
    avg_priority: number;
  };
}

/**
 * Checks if there are pending items in the queue.
 * Used by the GitHub Actions workflow to decide whether to run.
 */
export async function hasPendingItems(): Promise<boolean> {
  const stats = await getQueueStats();
  return stats !== null && stats.pending > 0;
}
