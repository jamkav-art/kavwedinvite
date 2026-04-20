export default function InvitePage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-center mb-8">Wedding Invitation</h1>
        <p className="text-center text-slate-600 mb-12">Invitation ID: {params.id}</p>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <p className="text-center italic">Loading your personalized experience...</p>
        </div>
      </div>
    </main>
  );
}
