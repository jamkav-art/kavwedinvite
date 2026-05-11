// ============================================================================
// WEDINVITER pSEO — Vendor Recommendations Section
// ============================================================================

interface Vendor {
  category: string;
  tips: string;
  price_range: string;
}

interface PageVendorRecsProps {
  vendors: Vendor[];
}

export function PageVendorRecs({ vendors }: PageVendorRecsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{vendor.category}</h3>
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600">
              {vendor.price_range}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {vendor.tips}
          </p>
        </div>
      ))}
    </div>
  );
}
