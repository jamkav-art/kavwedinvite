import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getTemplateBySlug, DEFAULT_TEMPLATE } from '@/lib/templates'
import { formatDate } from '@/lib/utils'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ name?: string; attending?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('couple_name_1, couple_name_2')
    .eq('invite_id', id)
    .maybeSingle()

  if (!order) return { title: 'RSVP Confirmed' }
  return {
    title: `RSVP — ${order.couple_name_1} & ${order.couple_name_2}`,
    robots: { index: false, follow: false },
  }
}

export default async function RSVPConfirmationPage({ params, searchParams }: Props) {
  const { id } = await params
  const { name, attending } = await searchParams

  const supabase = await createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('couple_name_1, couple_name_2, wedding_date, template_slug, invite_id')
    .eq('invite_id', id)
    .maybeSingle()

  if (!order) notFound()

  const template = getTemplateBySlug(order.template_slug) ?? DEFAULT_TEMPLATE
  const isAttending = attending === 'yes'
  const hasName = !!name

  const primary = template.colors.primary
  const bg = template.colors.background
  const text = template.colors.text
  const secondary = template.colors.secondary
  const border = template.colors.border

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5 py-16"
      style={{ background: bg }}
    >
      <div className="w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: `${primary}12` }}
          >
            {isAttending ? '🎊' : '🙏'}
          </div>
        </div>

        {/* Status label */}
        <p
          className="text-center text-[10px] tracking-[0.22em] uppercase font-medium mb-2"
          style={{ color: secondary }}
        >
          {attending ? (isAttending ? 'See you there' : 'We understand') : 'RSVP received'}
        </p>

        {/* Heading */}
        <h1
          className="text-center font-[var(--font-cormorant)] text-4xl font-semibold leading-tight"
          style={{ color: text }}
        >
          {hasName ? `Thank you, ${name}` : 'RSVP Received'}
        </h1>

        {/* Message */}
        <p
          className="text-center text-sm leading-relaxed mt-4 mb-8"
          style={{ color: `${text}80` }}
        >
          {isAttending
            ? `Your RSVP for the wedding of ${order.couple_name_1} & ${order.couple_name_2} has been received. We look forward to celebrating with you.`
            : `We appreciate you letting ${order.couple_name_1} & ${order.couple_name_2} know. Your warmth means a great deal.`}
        </p>

        {/* Wedding details card */}
        <div
          className="rounded-2xl border px-5 py-5 mb-8"
          style={{
            borderColor: `${border}44`,
            background: `${primary}08`,
          }}
        >
          <p
            className="text-[10px] tracking-[0.18em] uppercase mb-3"
            style={{ color: `${text}50` }}
          >
            Wedding details
          </p>
          <p
            className="font-[var(--font-cormorant)] text-2xl font-semibold leading-tight"
            style={{ color: primary }}
          >
            {order.couple_name_1} & {order.couple_name_2}
          </p>
          {order.wedding_date && (
            <p className="text-sm mt-1.5" style={{ color: `${text}70` }}>
              {formatDate(order.wedding_date)}
            </p>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/invite/${order.invite_id}`}
          className="flex items-center justify-center gap-2 w-full rounded-full py-3.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-85"
          style={{ background: primary, color: '#fff' }}
        >
          View full invitation
        </Link>
      </div>
    </main>
  )
}
