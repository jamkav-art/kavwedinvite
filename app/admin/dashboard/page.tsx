export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold">128</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Revenue (INR)</h3>
          <p className="text-2xl font-bold">₹2,45,000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Pending Approvals</h3>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>
    </div>
  );
}
