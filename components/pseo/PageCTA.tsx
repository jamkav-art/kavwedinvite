// ============================================================================
// WEDINVITER pSEO — Call-to-Action Section
// ============================================================================

interface CTA {
  heading: string;
  description: string;
  button_text: string;
  features: string[];
}

interface PageCTAProps {
  cta: CTA;
}

export function PageCTA({ cta }: PageCTAProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 px-6 py-12 text-center text-white sm:px-12">
      {/* Heading */}
      <h2 className="font-serif text-2xl font-bold sm:text-3xl">
        {cta.heading}
      </h2>

      {/* Description */}
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-rose-100">
        {cta.description}
      </p>

      {/* Features */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {cta.features.map((feature, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-rose-100 backdrop-blur-sm"
          >
            <svg
              className="size-3.5 text-rose-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </span>
        ))}
      </div>

      {/* Button */}
      <div className="mt-8">
        <a
          href="/order"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-rose-700 shadow-lg transition-all hover:bg-rose-50 hover:shadow-xl"
        >
          {cta.button_text}
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
