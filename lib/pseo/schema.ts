// ============================================================================
// WEDINVITER pSEO — JSON-LD Schema Markup Generators
// ============================================================================
// Generates structured data for SEO: Article, FAQPage, BreadcrumbList,
// LocalBusiness. Injected into page via <script type="application/ld+json">.
// ============================================================================

import type { GeneratedContent, PseoQueueItem } from "@/lib/pseo/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wedinviter.wasleen.com";

// ---------------------------------------------------------------------------
// Schema Generator
// ---------------------------------------------------------------------------

/**
 * Generates the complete schema.org JSON-LD @graph for a pSEO page.
 * Includes Article, FAQPage, BreadcrumbList, and LocalBusiness schemas.
 *
 * @param content - The generated content with all sections
 * @param item - The queue item with location/topic metadata
 * @returns A schema.org @graph object suitable for <script> injection
 */
export function generateSchemaMarkup(
  content: GeneratedContent,
  item: PseoQueueItem,
): Record<string, unknown> {
  const pageUrl = `${SITE_URL}/${item.url_slug}`;
  const now = new Date().toISOString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Article Schema
      generateArticleSchema(content, item, pageUrl, now),

      // 2. FAQ Schema
      generateFAQSchema(content),

      // 3. BreadcrumbList Schema
      generateBreadcrumbSchema(item, pageUrl),

      // 4. LocalBusiness Schema (invitation service)
      generateLocalBusinessSchema(item),
    ],
  };
}

// ---------------------------------------------------------------------------
// Individual Schema Builders
// ---------------------------------------------------------------------------

/**
 * Article schema for rich search results.
 */
function generateArticleSchema(
  content: GeneratedContent,
  item: PseoQueueItem,
  pageUrl: string,
  datePublished: string,
): Record<string, unknown> {
  return {
    "@type": "Article",
    headline: content.title,
    description: content.meta_description,
    author: {
      "@type": "Organization",
      name: "WedInviter",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "WedInviter",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    image: `${SITE_URL}/og-image.png`,
    about: {
      "@type": "Thing",
      name: item.target_keyword,
      description: `${item.topic_name} in ${item.location_name}`,
    },
    keywords: [
      item.target_keyword,
      item.topic_name,
      `${item.topic_name} in ${item.location_name}`,
      "wedding invitations",
      "digital wedding cards",
      "WedInviter",
    ].join(", "),
  };
}

/**
 * FAQ schema for rich search results (question/answer accordion).
 */
function generateFAQSchema(content: GeneratedContent): Record<string, unknown> {
  if (!content.faqs || content.faqs.length === 0) {
    return {
      "@type": "FAQPage",
      mainEntity: [],
    };
  }

  return {
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList schema for navigation context in SERPs.
 */
function generateBreadcrumbSchema(
  item: PseoQueueItem,
  pageUrl: string,
): Record<string, unknown> {
  const breadcrumbItems: Array<Record<string, unknown>> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ];

  if (item.topic_slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: item.topic_name,
      item: `${SITE_URL}/${item.topic_slug}`,
    });
  }

  if (item.location_slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: `${item.topic_name} in ${item.location_name}`,
      item: `${SITE_URL}/${item.topic_slug}/${item.location_slug}`,
    });
  }

  if (item.subtopic_slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: `${item.subtopic_name} in ${item.location_name}`,
      item: pageUrl,
    });
  }

  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };
}

/**
 * LocalBusiness schema for local SEO relevance.
 */
function generateLocalBusinessSchema(
  item: PseoQueueItem,
): Record<string, unknown> {
  return {
    "@type": "LocalBusiness",
    name: "WedInviter",
    description: `Create beautiful digital wedding invitations online — serving couples in ${item.location_name}`,
    url: SITE_URL,
    telephone: "+91-XXXXXXXXXX",
    areaServed: {
      "@type": "City",
      name: item.location_name,
    },
    priceRange: "₹999-₹2499",
    sameAs: [
      "https://www.instagram.com/wedinviter",
      "https://www.facebook.com/wedinviter",
    ],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Digital Wedding Invitations",
        description:
          "Customizable digital wedding invitation cards with RSVP tracking, WhatsApp delivery, and premium designs",
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/**
 * Converts a schema object to a JSON string for <script> tag injection.
 */
export function schemaToString(schema: Record<string, unknown>): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Generates an Open Graph image URL for sharing.
 */
export function generateOGImageUrl(item: PseoQueueItem): string {
  return `${SITE_URL}/api/og?topic=${item.topic_slug}&location=${item.location_slug}&subtopic=${item.subtopic_slug || ""}`;
}
