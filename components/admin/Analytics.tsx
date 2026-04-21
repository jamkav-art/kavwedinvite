import { createAdminClient } from '@/lib/supabase/admin'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { OrderStatus } from '@/types/database.types'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  expired: 'bg-slate-100 text-slate-500',
}

async function fetchStats() {
  const db = createAdminClient()

  const [{ data: orders }, { data: recentOrders }] = await Promise.all([
    db.from('orders').select('status, template_slug, amount_paid, created_at'),
    db
      .from('orders')
      .select('id, invite_id, couple_name_1, couple_name_2, status, template_slug, created_at, amount_paid')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const allOrders = orders ?? []
  const revenue = allOrders.reduce((sum, o) => sum + (o.amount_paid ?? 0), 0)

  const byStatus = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  const byTemplate = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.template_slug] = (acc[o.template_slug] ?? 0) + 1
    return acc
  }, {})

  const topTemplates = Object.entries(byTemplate)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return {
    total: allOrders.length,
    revenue,
    byStatus,
    topTemplates,
    recentOrders: recentOrders ?? [],
  }
}

export default async function Analytics() {
  const stats = await fetchStats()

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.total,
      sub: 'all time',
    },
    {
      label: 'Revenue',
      value: `₹${(stats.revenue).toLocaleString('en-IN')}`,
      sub: 'total collected',
    },
    {
      label: 'Active Invites',
      value: stats.byStatus['active'] ?? 0,
      sub: 'live right now',
    },
    {
      label: 'Pending Build',
      value: stats.byStatus['paid'] ?? 0,
      sub: 'awaiting delivery',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-black/4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              {card.label}
            </p>
            <p className="text-3xl font-semibold text-[--color-charcoal] leading-none mb-1">
              {card.value}
            </p>
            <p className="text-xs text-slate-400">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/4">
          <h3 className="font-semibold text-[--color-charcoal] mb-5 text-sm">Orders by Status</h3>
          <div className="space-y-3">
            {(['paid', 'active', 'pending', 'expired'] as OrderStatus[]).map((status) => {
              const count = stats.byStatus[status] ?? 0
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[status]}`}>
                      {status}
                    </span>
                    <span className="text-sm font-semibold text-[--color-charcoal]">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[--color-gold] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top templates */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/4">
          <h3 className="font-semibold text-[--color-charcoal] mb-5 text-sm">Popular Templates</h3>
          <div className="space-y-3">
            {stats.topTemplates.length === 0 ? (
              <p className="text-sm text-slate-400">No orders yet.</p>
            ) : (
              stats.topTemplates.map(([slug, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                return (
                  <div key={slug}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600 capitalize">
                        {slug.replace(/-/g, ' ')}
                      </span>
                      <span className="text-sm font-semibold text-[--color-charcoal]">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[--color-sage] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/4 overflow-hidden">
        <div className="px-6 py-4 border-b border-black/4 flex items-center justify-between">
          <h3 className="font-semibold text-[--color-charcoal] text-sm">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-xs text-[--color-gold] hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-black/4">
          {stats.recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">No orders yet.</p>
          ) : (
            stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[--color-charcoal] truncate">
                    {order.couple_name_1} &amp; {order.couple_name_2}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(order.created_at)} · {order.template_slug.replace(/-/g, ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status as OrderStatus]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-[--color-charcoal]">
                    ₹{order.amount_paid ?? 0}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
