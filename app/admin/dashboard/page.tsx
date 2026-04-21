import type { Metadata } from 'next'
import { Suspense } from 'react'
import Analytics from '@/components/admin/Analytics'

export const metadata: Metadata = { title: 'Dashboard' }
export const revalidate = 60

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 h-24 border border-black/4" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 h-56 border border-black/4" />
        <div className="bg-white rounded-2xl p-6 h-56 border border-black/4" />
      </div>
      <div className="bg-white rounded-2xl h-72 border border-black/4" />
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[--color-charcoal]">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Overview of all orders and revenue.</p>
      </div>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics />
      </Suspense>
    </div>
  )
}
