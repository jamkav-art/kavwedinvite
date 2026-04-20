export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-xl">WedInvite</span>
          <button className="text-sm font-medium text-gray-500">Save Progress</button>
        </div>
      </header>
      <main className="px-4 pb-20">
        {children}
      </main>
    </div>
  );
}
