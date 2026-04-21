import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import OrderTable from '@/components/admin/OrderTable'

export const metadata: Metadata = { title: 'Orders' }
export const revalidate = 30

async function getOrders() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw new Error(error.message)
  return data ?? []
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[--color-charcoal]">Orders</h1>
        <p className="text-sm text-slate-400 mt-1">
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>
      <OrderTable orders={orders} />
    </div>
  )
}
