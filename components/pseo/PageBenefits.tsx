// ============================================================================
// WEDINVITER pSEO — Benefits Grid Section
// ============================================================================

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface PageBenefitsProps {
  benefits: Benefit[];
}

export function PageBenefits({ benefits }: PageBenefitsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex size-12 items-center justify-center rounded-lg bg-rose-50 text-2xl">
            {benefit.icon}
          </div>
          <h3 className="mt-4 font-semibold text-gray-900">{benefit.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {benefit.description}
          </p>
        </div>
      ))}
    </div>
  );
}
