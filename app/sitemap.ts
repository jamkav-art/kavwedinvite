// ============================================================================
// WEDINVITER — Sitemap Generator
// ============================================================================
// Includes homepage, templates, dynamic invite pages, and pSEO content pages.
// pSEO pages are fetched from the published_pages table for real-time indexing.
// ============================================================================

import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adminClient = createAdminClient();

  // -----------------------------------------------------------------------
  // Existing dynamic invite pages (from orders table)
  // -----------------------------------------------------------------------
  const { data: orders } = await adminClient
    .from("orders")
    .select("invite_id, updated_at, expires_at")
    .not("invite_id", "is", null);

  const now = Date.now();
  const inviteUrls: MetadataRoute.Sitemap = (orders ?? [])
    .filter(
      (order) =>
        order.invite_id &&
        (!order.expires_at || new Date(order.expires_at).getTime() > now),
    )
    .map((order) => ({
      url: `${APP_URL}/invite/${order.invite_id}`,
      lastModified: order.updated_at ? new Date(order.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  // -----------------------------------------------------------------------
  // pSEO published pages (from published_pages table)
  // -----------------------------------------------------------------------
  const { data: pseoPages } = (await adminClient
    .from("published_pages")
    .select("url_path, published_at, quality_score")) as unknown as {
    data: Array<{
      url_path: string;
      published_at: string | null;
      quality_score: number | null;
    }> | null;
    error: unknown;
  };

  const pseoUrls: MetadataRoute.Sitemap = (pseoPages || []).map((page) => ({
    url: `${APP_URL}${page.url_path}`,
    lastModified: page.published_at ? new Date(page.published_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: page.quality_score && page.quality_score >= 80 ? 0.9 : 0.8,
  }));
  // -----------------------------------------------------------------------
  // Build complete sitemap
  // -----------------------------------------------------------------------
  return [
    // Homepage
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Templates page
    {
      url: `${APP_URL}/templates`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // pSEO pages (published content)
    ...pseoUrls,
    // Dynamic invite pages (user-created)
    ...inviteUrls,
  ];
}
