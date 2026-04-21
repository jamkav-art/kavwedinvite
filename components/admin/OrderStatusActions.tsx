'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/database.types'

interface Props {
  orderId: string
  currentStatus: OrderStatus
}

const TRANSITIONS: Record<OrderStatus, { label: string; next: OrderStatus; style: string }[]> = {
  pending: [
    { label: 'Mark as Paid', next: 'paid', style: 'bg-blue-600 hover:bg-blue-700 text-white' },
  ],
  paid: [
    { label: 'Mark as Active (Live)', next: 'active', style: 'bg-green-600 hover:bg-green-700 text-white' },
    { label: 'Mark as Expired', next: 'expired', style: 'bg-slate-500 hover:bg-slate-600 text-white' },
  ],
  active: [
    { label: 'Mark as Expired', next: 'expired', style: 'bg-slate-500 hover:bg-slate-600 text-white' },
  ],
  expired: [
    { label: 'Reactivate', next: 'active', style: 'bg-green-600 hover:bg-green-700 text-white' },
  ],
}

export default function OrderStatusActions({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const transitions = TRANSITIONS[currentStatus] ?? []

  async function updateStatus(next: OrderStatus) {
    setError('')
    setLoading(next)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      router.refresh()
    } catch {
      setError('Could not update status. Try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
      <h2 className="font-semibold text-[--color-charcoal] text-sm mb-4">Update Status</h2>
      {transitions.length === 0 ? (
        <p className="text-xs text-slate-400">No transitions available.</p>
      ) : (
        <div className="space-y-2">
          {transitions.map((t) => (
            <button
              key={t.next}
              onClick={() => updateStatus(t.next)}
              disabled={loading !== null}
              className={cn(
                'w-full h-9 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed',
                t.style
              )}
            >
              {loading === t.next && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {t.label}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
