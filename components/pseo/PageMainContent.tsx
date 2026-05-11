// ============================================================================
// WEDINVITER pSEO — Main Content Sections (H2/H3)
// ============================================================================

interface Section {
  heading: string;
  content: string;
  subsections?: Array<{
    subheading: string;
    content: string;
  }>;
}

interface PageMainContentProps {
  sections: Section[];
}

export function PageMainContent({ sections }: PageMainContentProps) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <div key={index}>
          {/* H2 Heading */}
          <h2 className="font-serif text-xl font-semibold text-gray-900 sm:text-2xl">
            {section.heading}
          </h2>

          {/* Main content paragraphs */}
          <div className="mt-4 space-y-4">
            {section.content.split("\n\n").map((paragraph, pIdx) => (
              <p key={pIdx} className="text-base leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Subsections (H3) */}
          {section.subsections && section.subsections.length > 0 && (
            <div className="ml-4 mt-6 space-y-6 border-l-2 border-rose-100 pl-6">
              {section.subsections.map((sub, sIdx) => (
                <div key={sIdx}>
                  <h3 className="font-semibold text-gray-800">
                    {sub.subheading}
                  </h3>
                  <div className="mt-2 space-y-3">
                    {sub.content.split("\n\n").map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm leading-relaxed text-gray-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
