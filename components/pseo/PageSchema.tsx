// ============================================================================
// WEDINVITER pSEO — JSON-LD Schema Injection Component
// ============================================================================
// Injects structured data (Article, FAQPage, BreadcrumbList, LocalBusiness)
// into the page for rich search results.
// ============================================================================

interface PageSchemaProps {
  schema: Record<string, unknown> | null;
}

export function PageSchema({ schema }: PageSchemaProps) {
  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
