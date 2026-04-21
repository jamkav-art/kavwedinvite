'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types/database.types'

interface OrderTableProps {
  orders: Order[]
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  paid: 'bg-blue-100 text-blue-700 border-blue-200',
  active: 'bg-green-100 text-green-700 border-green-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',
}

const STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' },
]

const PAGE_SIZE = 20

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  })
}

export default function OrderTable({ orders }: OrderTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'all' || o.status === statusFilter
      const matchSearch =
        !q ||
        o.couple_name_1.toLowerCase().includes(q) ||
        o.couple_name_2.toLowerCase().includes(q) ||
        o.invite_id.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        (o.phone_number ?? '').includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleFilterChange(val: OrderStatus | 'all') {
    setStatusFilter(val)
    setPage(1)
  }

  function handleSearch(val: string) {
    setSearch(val)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or invite ID…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-black/10 bg-white text-sm text-[--color-charcoal] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[--color-gold]/30 focus:border-[--color-gold]/40"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value as OrderStatus | 'all')}
          className="h-9 px-3 rounded-lg border border-black/10 bg-white text-sm text-[--color-charcoal] focus:outline-none focus:ring-2 focus:ring-[--color-gold]/30"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="flex items-center text-xs text-slate-400 sm:ml-auto">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-slate-50/70">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Couple
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                  Wedding
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  Template
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden xl:table-cell">
                  Created
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/4">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    {search || statusFilter !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <p className="font-medium text-[--color-charcoal]">
                          {order.couple_name_1} &amp; {order.couple_name_2}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-[160px]">
                          {order.invite_id}
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 hidden sm:table-cell">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        {formatShortDate(order.wedding_date)}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <span className="text-slate-500 capitalize">
                          {order.template_slug.replace(/-/g, ' ')}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        <span
                          className={cn(
                            'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border capitalize',
                            STATUS_STYLES[order.status as OrderStatus]
                          )}
                        >
                          {order.status}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[--color-charcoal] hidden lg:table-cell">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        ₹{order.amount_paid ?? '–'}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs hidden xl:table-cell">
                      <Link href={`/admin/orders/${order.id}`} className="block">
                        {formatShortDate(order.created_at)}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-[--color-gold] hover:underline font-medium whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-black/5 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Page {safePage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="h-7 px-3 text-xs rounded-lg border border-black/10 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="h-7 px-3 text-xs rounded-lg border border-black/10 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
