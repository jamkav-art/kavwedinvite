// ============================================================================
// WEDINVITER pSEO — Vercel Cache Revalidation Webhook
// ============================================================================
// Called by the hourly generation script after publishing a new page.
// Busts the ISR cache for the specific pillar/location/subtopic URL.
// ============================================================================

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate?secret=xxx
 * Body: { pillar: string, slug: string }
 *
 * Secrets:
 * - `secret` (query param): Must match VERCEL_REVALIDATE_SECRET env var
 * - `pillar` (body): Topic slug (e.g., "wedding-invitations")
 * - `slug` (body): Location/subtopic path (e.g., "mumbai/digital-invitations")
 */
export async function POST(request: NextRequest) {
  // Validate secret
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.VERCEL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const { pillar, slug } = await request.json();

    if (!pillar || !slug) {
      return NextResponse.json(
        { message: "Missing 'pillar' or 'slug' in request body" },
        { status: 400 },
      );
    }

    const path = `/${pillar}/${slug}`;

    // Revalidate the specific path
    revalidatePath(path);

    // Also revalidate sitemap since new pages affect it
    revalidatePath("/sitemap.xml");

    console.log(`⚡ Revalidated: ${path}`);

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Revalidation error:", error);
    return NextResponse.json(
      {
        message: "Revalidation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/revalidate?secret=xxx&pillar=wedding-invitations&slug=mumbai/digital-invitations
 * Convenience GET endpoint for quick testing in browser.
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.VERCEL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const pillar = request.nextUrl.searchParams.get("pillar");
  const slug = request.nextUrl.searchParams.get("slug");

  if (!pillar || !slug) {
    return NextResponse.json(
      { message: "Missing 'pillar' or 'slug' query parameters" },
      { status: 400 },
    );
  }

  const path = `/${pillar}/${slug}`;
  revalidatePath(path);
  revalidatePath("/sitemap.xml");

  console.log(`⚡ Revalidated (GET): ${path}`);

  return NextResponse.json({
    revalidated: true,
    path,
    timestamp: new Date().toISOString(),
  });
}
