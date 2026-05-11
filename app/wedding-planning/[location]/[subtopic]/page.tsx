// ============================================================================
// WEDINVITER pSEO — Wedding Planning Pillar Route
// ============================================================================

import PseoPage, {
  generatePseoMetadata,
  PSEO_REVALIDATE,
} from "@/lib/pseo/page-component";

export const revalidate = PSEO_REVALIDATE;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; subtopic: string }>;
}) {
  return generatePseoMetadata("wedding-planning", params);
}

export default async function Page({
  params,
}: {
  params: Promise<{ location: string; subtopic: string }>;
}) {
  return <PseoPage pillarSlug="wedding-planning" params={params} />;
}
