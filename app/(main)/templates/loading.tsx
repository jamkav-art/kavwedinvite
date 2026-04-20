export default function TemplatesLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg shadow-sm"></div>
        ))}
      </div>
    </div>
  );
}
