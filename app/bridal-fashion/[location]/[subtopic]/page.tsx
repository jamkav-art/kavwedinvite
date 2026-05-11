// ============================================================================
// WEDINVITER pSEO — Bridal Fashion Pillar Route
// ============================================================================

import PseoPage, { generatePseoMetadata } from "@/lib/pseo/page-component";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; subtopic: string }>;
}) {
  return generatePseoMetadata("bridal-fashion", params);
}

export default async function Page({
  params,
}: {
  params: Promise<{ location: string; subtopic: string }>;
}) {
  return <PseoPage pillarSlug="bridal-fashion" params={params} />;
}
