// ============================================================================
// WEDINVITER pSEO — Pricing Table Section
// ============================================================================

interface PricingPackage {
  name: string;
  price: string;
  features: string[];
}

interface PagePricingProps {
  pricing: {
    packages: PricingPackage[];
  };
}

export function PagePricing({ pricing }: PagePricingProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pricing.packages.map((pkg, index) => (
        <div
          key={index}
          className={`rounded-xl border p-6 shadow-sm ${
            index === 1
              ? "border-rose-200 bg-rose-50 shadow-md ring-1 ring-rose-200"
              : "border-gray-100 bg-white"
          }`}
        >
          {/* Package Name */}
          <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>

          {/* Price */}
          <p className="mt-3">
            <span className="text-3xl font-bold text-gray-900">
              {pkg.price}
            </span>
          </p>

          {/* Features */}
          <ul className="mt-6 space-y-3">
            {pkg.features.map((feature, fIdx) => (
              <li
                key={fIdx}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <svg
                  className="mt-0.5 size-4 shrink-0 text-emerald-500"
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
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              index === 1
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {index === 0 ? "Get Started Free" : "Choose Plan"}
          </button>
        </div>
      ))}
    </div>
  );
}
