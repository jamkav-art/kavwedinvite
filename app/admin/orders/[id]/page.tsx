import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDate, formatDateTime } from '@/lib/utils'
import { APP_URL, WHATSAPP_OWNER } from '@/lib/constants'
import OrderStatusActions from '@/components/admin/OrderStatusActions'
import CopyButton from '@/components/admin/CopyButton'
import type { OrderStatus } from '@/types/database.types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Order ${id.slice(0, 8)}…` }
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  paid: 'bg-blue-100 text-blue-700 border-blue-200',
  active: 'bg-green-100 text-green-700 border-green-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',
}

async function fetchOrderDetail(id: string) {
  const db = createAdminClient()
  const [{ data: order }, { data: events }, { data: media }, ] = await Promise.all([
    db.from('orders').select('*').eq('id', id).single(),
    db.from('events').select('*').eq('order_id', id).order('event_date'),
    db.from('media').select('*').eq('order_id', id),
  ])
  return { order, events: events ?? [], media: media ?? [] }
}

async function fetchRsvps(inviteId: string) {
  const db = createAdminClient()
  const { data } = await db
    .from('rsvps')
    .select('*')
    .eq('invite_id', inviteId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const { order, events, media } = await fetchOrderDetail(id)
  if (!order) notFound()

  const rsvps = await fetchRsvps(order.invite_id)
  const inviteUrl = `${APP_URL}/invite/${order.invite_id}`

  const waDeliveryMsg = encodeURIComponent(
    `Hi! Your WedInvite is ready 🎉\n\nCouple: ${order.couple_name_1} & ${order.couple_name_2}\nWedding: ${formatDate(order.wedding_date)}\n\nShare this link with your guests:\n${inviteUrl}\n\nWishing you a beautiful wedding! 💐\n— WedInviter`
  )

  const rsvpAttending = rsvps.filter((r) => r.attending)
  const rsvpDeclined = rsvps.filter((r) => !r.attending)

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors mb-2 flex items-center gap-1"
          >
            ← Orders
          </Link>
          <h1 className="text-2xl font-semibold text-[--color-charcoal]">
            {order.couple_name_1} &amp; {order.couple_name_2}
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-mono">{order.invite_id}</p>
        </div>
        <span
          className={`flex-shrink-0 text-sm font-medium px-3 py-1 rounded-full border capitalize ${STATUS_STYLES[order.status as OrderStatus]}`}
        >
          {order.status}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href={inviteUrl}
          target="_blank"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[--color-charcoal] text-[--color-cream] text-sm font-medium hover:bg-black transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View Live Invite
        </Link>

        {order.phone_number && (
          <a
            href={`https://wa.me/91${order.phone_number}?text=${waDeliveryMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#1eb85a] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.427A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            Send to Client
          </a>
        )}

        <a
          href={`https://wa.me/${WHATSAPP_OWNER}?text=${encodeURIComponent(`New order review: ${order.couple_name_1} & ${order.couple_name_2} — ${inviteUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-black/10 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
        >
          Notify Owner
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order info */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <h2 className="font-semibold text-[--color-charcoal] text-sm">Order Details</h2>
            </div>
            <div className="divide-y divide-black/4">
              {[
                { label: 'Order ID', value: order.id, mono: true },
                { label: 'Invite ID', value: order.invite_id, mono: true },
                { label: 'Template', value: order.template_slug.replace(/-/g, ' ') },
                { label: 'Wedding Date', value: formatDate(order.wedding_date) },
                { label: 'Amount Paid', value: order.amount_paid ? `₹${order.amount_paid}` : '—' },
                { label: 'Phone', value: order.phone_number ?? '—' },
                { label: 'Email', value: order.email ?? '—' },
                { label: 'Razorpay Order', value: order.razorpay_order_id ?? '—', mono: true },
                { label: 'Razorpay Payment', value: order.razorpay_payment_id ?? '—', mono: true },
                { label: 'Created', value: formatDateTime(order.created_at) },
                { label: 'Updated', value: formatDateTime(order.updated_at) },
                { label: 'Expires', value: order.expires_at ? formatDate(order.expires_at) : '—' },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3 px-5 py-2.5">
                  <span className="text-xs text-slate-400 w-36 flex-shrink-0 pt-0.5">{row.label}</span>
                  <span className={`text-sm text-[--color-charcoal] break-all ${row.mono ? 'font-mono text-xs' : ''}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom message */}
          {order.custom_message && (
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
              <h2 className="font-semibold text-[--color-charcoal] text-sm mb-3">Custom Invite Message</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {order.custom_message}
              </p>
            </div>
          )}

          {/* Events */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <h2 className="font-semibold text-[--color-charcoal] text-sm">
                Events ({events.length})
              </h2>
            </div>
            {events.length === 0 ? (
              <p className="px-5 py-6 text-sm text-slate-400">No events recorded.</p>
            ) : (
              <div className="divide-y divide-black/4">
                {events.map((event) => (
                  <div key={event.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm text-[--color-charcoal]">{event.event_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(event.event_date)}
                          {event.event_time && ` at ${event.event_time}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {event.venue_name}
                      {event.venue_city && `, ${event.venue_city}`}
                    </p>
                    {event.venue_address && (
                      <p className="text-xs text-slate-400 mt-0.5">{event.venue_address}</p>
                    )}
                    {event.venue_map_link && (
                      <a
                        href={event.venue_map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[--color-gold] hover:underline mt-1 inline-block"
                      >
                        View on map →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <h2 className="font-semibold text-[--color-charcoal] text-sm">
                Media ({media.length})
              </h2>
            </div>
            {media.length === 0 ? (
              <p className="px-5 py-6 text-sm text-slate-400">No media uploaded.</p>
            ) : (
              <div className="divide-y divide-black/4">
                {media.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize w-14 text-center flex-shrink-0">
                      {item.media_type}
                    </span>
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[--color-gold] hover:underline truncate flex-1"
                    >
                      {item.file_name ?? 'View file'}
                    </a>
                    {item.file_size && (
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {(item.file_size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status actions */}
          <OrderStatusActions orderId={order.id} currentStatus={order.status as OrderStatus} />

          {/* RSVP summary */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
              <h2 className="font-semibold text-[--color-charcoal] text-sm">
                RSVPs ({rsvps.length})
              </h2>
              <div className="flex gap-3 text-xs">
                <span className="text-green-600">✓ {rsvpAttending.length}</span>
                <span className="text-red-400">✗ {rsvpDeclined.length}</span>
              </div>
            </div>
            {rsvps.length === 0 ? (
              <p className="px-5 py-6 text-sm text-slate-400">No RSVPs yet.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-black/4">
                {rsvps.map((rsvp) => (
                  <div key={rsvp.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[--color-charcoal] truncate">
                        {rsvp.guest_name}
                      </p>
                      <span
                        className={`flex-shrink-0 text-xs font-medium ${rsvp.attending ? 'text-green-600' : 'text-red-400'}`}
                      >
                        {rsvp.attending ? `✓ ${rsvp.guest_count}` : '✗'}
                      </span>
                    </div>
                    {rsvp.message && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{rsvp.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invite URL */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
            <h2 className="font-semibold text-[--color-charcoal] text-sm mb-3">Invite Link</h2>
            <p className="text-xs font-mono text-slate-500 break-all mb-3 bg-slate-50 rounded-lg p-2.5">
              {inviteUrl}
            </p>
            <CopyButton text={inviteUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}
