export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-slate-800">Dashboard</a>
          <a href="/admin/orders" className="block px-4 py-2 rounded hover:bg-slate-800">Orders</a>
          <a href="/admin/templates" className="block px-4 py-2 rounded hover:bg-slate-800">Templates</a>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
