// ============================================================================
// WEDINVITER pSEO — Local Insights Section
// ============================================================================

interface LocalInsights {
  popular_venues?: string[];
  best_seasons?: string;
  average_costs?: string;
  cultural_customs?: string;
}

interface PageLocalInsightsProps {
  insights: LocalInsights;
}

export function PageLocalInsights({ insights }: PageLocalInsightsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Popular Venues */}
      {insights.popular_venues && insights.popular_venues.length > 0 && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-emerald-800">
            <span className="text-xl">📍</span> Popular Venues
          </h3>
          <ul className="mt-3 space-y-2">
            {insights.popular_venues.map((venue, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-emerald-700"
              >
                <span className="mt-0.5 text-emerald-400">•</span>
                <span>{venue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Best Seasons */}
      {insights.best_seasons && (
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-amber-800">
            <span className="text-xl">📅</span> Best Seasons
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-amber-700">
            {insights.best_seasons}
          </p>
        </div>
      )}

      {/* Average Costs */}
      {insights.average_costs && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-blue-800">
            <span className="text-xl">💰</span> Average Costs
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-blue-700">
            {insights.average_costs}
          </p>
        </div>
      )}

      {/* Cultural Customs */}
      {insights.cultural_customs && (
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-purple-800">
            <span className="text-xl">🎎</span> Cultural Customs
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-purple-700">
            {insights.cultural_customs}
          </p>
        </div>
      )}
    </div>
  );
}
