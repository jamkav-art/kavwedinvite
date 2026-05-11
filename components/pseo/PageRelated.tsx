// ============================================================================
// WEDINVITER pSEO — Related Pages (Internal Linking)
// ============================================================================

import Link from "next/link";

interface RelatedPage {
  title: string;
  url: string;
}

interface PageRelatedProps {
  related: RelatedPage[];
}

export function PageRelated({ related }: PageRelatedProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((page, index) => (
        <Link
          key={index}
          href={page.url}
          className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-rose-200 hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-sm text-rose-600">
              {index + 1}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 transition-colors group-hover:text-rose-600">
                {page.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {page.url.replace(/^\//, "").replace(/\//g, " › ")}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
