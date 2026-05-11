// ============================================================================
// WEDINVITER pSEO — Universal Page Renderer
// ============================================================================
// Top-level orchestrator that renders all content sections plus JSON-LD schema.
// ============================================================================

import type { PublishedPage } from "@/lib/pseo/types";
import { PageIntro } from "@/components/pseo/PageIntro";
import { PageBenefits } from "@/components/pseo/PageBenefits";
import { PageMainContent } from "@/components/pseo/PageMainContent";
import { PageLocalInsights } from "@/components/pseo/PageLocalInsights";
import { PageVendorRecs } from "@/components/pseo/PageVendorRecs";
import { PageFAQs } from "@/components/pseo/PageFAQs";
import { PageTestimonials } from "@/components/pseo/PageTestimonials";
import { PagePricing } from "@/components/pseo/PagePricing";
import { PageCTA } from "@/components/pseo/PageCTA";
import { PageRelated } from "@/components/pseo/PageRelated";
import { PageSchema } from "@/components/pseo/PageSchema";

interface PageRendererProps {
  page: PublishedPage;
}

export function PageRenderer({ page }: PageRendererProps) {
  return (
    <article className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      {/* JSON-LD Schema Injection */}
      <PageSchema schema={page.schema_json as Record<string, unknown> | null} />

      {/* Main Content Container */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* H1 Heading */}
        <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          {page.h1_heading || page.title}
        </h1>

        {/* Intro Section */}
        {page.intro_section && (
          <section className="mt-8">
            <PageIntro intro={page.intro_section} />
          </section>
        )}

        {/* Benefits Grid */}
        {page.benefits && page.benefits.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-gray-900">
              Why Choose WedInviter?
            </h2>
            <div className="mt-6">
              <PageBenefits
                benefits={
                  page.benefits as Array<{
                    title: string;
                    description: string;
                    icon: string;
                  }>
                }
              />
            </div>
          </section>
        )}

        {/* Main Content (H2/H3 sections) */}
        {page.main_content && page.main_content.length > 0 && (
          <section className="mt-12">
            <PageMainContent
              sections={
                page.main_content as Array<{
                  heading: string;
                  content: string;
                  subsections?: Array<{ subheading: string; content: string }>;
                }>
              }
            />
          </section>
        )}

        {/* Local Insights */}
        {page.local_insights && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-gray-900">
              Local Insights
            </h2>
            <div className="mt-6">
              <PageLocalInsights
                insights={
                  page.local_insights as {
                    popular_venues?: string[];
                    best_seasons?: string;
                    average_costs?: string;
                    cultural_customs?: string;
                  }
                }
              />
            </div>
          </section>
        )}

        {/* Vendor Recommendations */}
        {page.vendor_recommendations &&
          page.vendor_recommendations.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-semibold text-gray-900">
                Vendor Recommendations
              </h2>
              <div className="mt-6">
                <PageVendorRecs
                  vendors={
                    page.vendor_recommendations as Array<{
                      category: string;
                      tips: string;
                      price_range: string;
                    }>
                  }
                />
              </div>
            </section>
          )}

        {/* Pricing Table */}
        {page.pricing_table && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-gray-900">
              Pricing Plans
            </h2>
            <div className="mt-6">
              <PagePricing
                pricing={
                  page.pricing_table as {
                    packages: Array<{
                      name: string;
                      price: string;
                      features: string[];
                    }>;
                  }
                }
              />
            </div>
          </section>
        )}

        {/* Testimonials */}
        {page.testimonials && page.testimonials.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-gray-900">
              What Couples Say
            </h2>
            <div className="mt-6">
              <PageTestimonials
                testimonials={
                  page.testimonials as Array<{
                    name: string;
                    location: string;
                    quote: string;
                    rating: number;
                  }>
                }
              />
            </div>
          </section>
        )}

        {/* FAQs (with JSON-LD already injected by PageSchema) */}
        {page.faqs && page.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="mt-6">
              <PageFAQs
                faqs={page.faqs as Array<{ question: string; answer: string }>}
              />
            </div>
          </section>
        )}

        {/* CTA Section */}
        {page.cta_section && (
          <section className="mt-16">
            <PageCTA
              cta={
                page.cta_section as {
                  heading: string;
                  description: string;
                  button_text: string;
                  features: string[];
                }
              }
            />
          </section>
        )}

        {/* Related Topics / Internal Links */}
        {page.related_pages && page.related_pages.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-12">
            <h2 className="font-serif text-2xl font-semibold text-gray-900">
              Explore More
            </h2>
            <div className="mt-6">
              <PageRelated
                related={
                  page.related_pages as Array<{ title: string; url: string }>
                }
              />
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
