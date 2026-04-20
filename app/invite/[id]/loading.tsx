export default function InviteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Preparing invitation...</p>
      </div>
    </div>
  );
}
