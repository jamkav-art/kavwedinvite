// ============================================================================
// WEDINVITER pSEO — Testimonials Section
// ============================================================================

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
}

interface PageTestimonialsProps {
  testimonials: Testimonial[];
}

export function PageTestimonials({ testimonials }: PageTestimonialsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          {/* Quote */}
          <p className="text-sm leading-relaxed text-gray-600 italic">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          {/* Stars */}
          <div className="mt-4 flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`size-4 ${
                  i < testimonial.rating ? "text-amber-400" : "text-gray-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Author */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-900">
              {testimonial.name}
            </p>
            <p className="text-xs text-gray-500">{testimonial.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
