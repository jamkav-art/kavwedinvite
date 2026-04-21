import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type React from 'react'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_TEMPLATE, getTemplateBySlug } from '@/lib/templates'
import type { Event, Media, Order } from '@/types/database.types'
import CountdownTimer from '@/components/invite/CountdownTimer'
import EventCard from '@/components/invite/EventCard'
import MediaGallery from '@/components/invite/MediaGallery'
import RSVPForm from '@/components/invite/RSVPForm'
import ShareButtons from '@/components/invite/ShareButtons'
import GlobalMusicPlayer from '@/components/invite/GlobalMusicPlayer'
import { APP_URL } from '@/lib/constants'
import { InviteScrollAnimations } from '@/components/invite/_InviteScrollAnimations'

type InvitePageProps = {
  params: { id: string }
}

async function fetchInvite(inviteId: string): Promise<{
  order: Order
  events: Event[]
  media: Media[]
}> {
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('invite_id', inviteId)
    .maybeSingle()

  if (orderError) {
    throw new Error(orderError.message)
  }

  if (!order) {
    notFound()
  }

  const expiresAt = order.expires_at ? new Date(order.expires_at) : null
  if (expiresAt && Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
    notFound()
  }

  const [{ data: events, error: eventsError }, { data: media, error: mediaError }] =
    await Promise.all([
      supabase
        .from('events')
        .select('*')
        .eq('order_id', order.id)
        .order('event_date', { ascending: true }),
      supabase.from('media').select('*').eq('order_id', order.id),
    ])

  if (eventsError) throw new Error(eventsError.message)
  if (mediaError) throw new Error(mediaError.message)

  return { order, events: events ?? [], media: media ?? [] }
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { id } = params

  try {
    const { order } = await fetchInvite(id)
    const title = `${order.couple_name_1} & ${order.couple_name_2} — Wedding Invitation`
    const description = `You're invited to the wedding of ${order.couple_name_1} & ${order.couple_name_2} on ${order.wedding_date}. View events, gallery, and RSVP.`
    const canonical = new URL(`/invite/${order.invite_id}`, APP_URL).toString()

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonical,
        siteName: 'WedInviter',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: false,
      },
    }
  } catch {
    const canonical = new URL(`/invite/${id}`, APP_URL).toString()
    return {
      title: 'Wedding Invitation',
      alternates: { canonical },
      robots: { index: false },
    }
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { id } = params
  const { order, events, media } = await fetchInvite(id)
  const template = getTemplateBySlug(order.template_slug) ?? DEFAULT_TEMPLATE

  const heroPhoto = media.find((m) => m.media_type === 'photo')?.file_url ?? null

  const photos = media.filter((m) => m.media_type === 'photo')
  const videos = media.filter((m) => m.media_type === 'video')
  const voice = media.find((m) => m.media_type === 'voice') ?? null
  const song = media.find((m) => m.media_type === 'song') ?? null

  return (
    <main
      style={
        {
          '--invite-bg': template.colors.background,
          '--invite-text': template.colors.text,
          '--invite-primary': template.colors.primary,
          '--invite-secondary': template.colors.secondary,
          '--invite-accent': template.colors.accent,
          '--invite-border': template.colors.border,
          '--pattern-opacity': template.decorations.patternOpacity,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--invite-bg)] text-[var(--invite-text)]"
    >
      <GlobalMusicPlayer song={song} accentColor={template.colors.primary} />
      <InviteScrollAnimations />

      <div className="relative mx-auto w-full max-w-[980px] px-4 sm:px-6 py-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-[var(--pattern-opacity,0.06)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--invite-border) 1px, transparent 0)`,
              backgroundSize: '22px 22px',
            }}
          />
        </div>

        <div
          data-gsap="reveal"
          className="relative overflow-hidden rounded-[28px] border border-[color:rgba(0,0,0,0.06)] bg-white/55 backdrop-blur-md"
          style={{
            borderColor: `${template.colors.border}55`,
            boxShadow: '0 24px 80px rgba(0,0,0,0.12)',
          }}
        >
          <div className="relative">
            {heroPhoto ? (
              <div className="relative h-[340px] sm:h-[420px] w-full">
                <Image
                  src={heroPhoto}
                  alt={`${order.couple_name_1} and ${order.couple_name_2}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 980px"
                  className="object-cover"
                  unoptimized
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))',
                  }}
                />
              </div>
            ) : (
              <div
                className="h-[260px] sm:h-[320px] w-full"
                style={{
                  background: `radial-gradient(1200px 420px at 30% 20%, ${template.colors.accent}55, transparent 60%), radial-gradient(900px 380px at 80% 70%, ${template.colors.secondary}33, transparent 55%), linear-gradient(180deg, #ffffff, ${template.colors.background})`,
                }}
              />
            )}

            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-6 sm:p-10">
                <div className="max-w-[640px]">
                  <p
                    className="text-[11px] sm:text-xs tracking-[0.18em] uppercase"
                    style={{ color: heroPhoto ? 'rgba(255,255,255,0.85)' : template.colors.secondary }}
                  >
                    You are invited
                  </p>
                  <h1 className="mt-2 font-[var(--font-cormorant)] text-4xl sm:text-6xl leading-[1.03] font-semibold">
                    <span style={{ color: heroPhoto ? '#fff' : template.colors.text }}>
                      {order.couple_name_1}
                    </span>{' '}
                    <span className="opacity-80" style={{ color: heroPhoto ? '#fff' : template.colors.text }}>
                      &
                    </span>{' '}
                    <span style={{ color: heroPhoto ? '#fff' : template.colors.text }}>
                      {order.couple_name_2}
                    </span>
                  </h1>
                  <p
                    className="mt-3 text-sm sm:text-base"
                    style={{ color: heroPhoto ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.62)' }}
                  >
                    {order.wedding_date}
                  </p>
                  <div className="mt-6">
                    <ShareButtons
                      inviteId={order.invite_id}
                      coupleNames={`${order.couple_name_1} & ${order.couple_name_2}`}
                      weddingDate={order.wedding_date}
                      customMessage={order.custom_message ?? ''}
                      variant={heroPhoto ? 'dark' : 'light'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-12 sm:space-y-16">
            <section data-gsap="reveal" className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-semibold">
                    Countdown
                  </h2>
                  <p className="mt-1 text-sm text-black/60">We can&apos;t wait to celebrate with you.</p>
                </div>
              </div>
              <CountdownTimer weddingDate={order.wedding_date} accentColor={template.colors.primary} />
            </section>

            <section data-gsap="reveal" className="space-y-4">
              <div>
                <h2 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-semibold">
                  Events
                </h2>
                <p className="mt-1 text-sm text-black/60">
                  All the moments we&apos;d love for you to be part of.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} accentColor={template.colors.secondary} />
                ))}
              </div>
            </section>

            <section data-gsap="reveal" className="space-y-4">
              <div>
                <h2 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-semibold">
                  Gallery
                </h2>
                <p className="mt-1 text-sm text-black/60">A few glimpses before the big day.</p>
              </div>
              <MediaGallery
                photos={photos}
                videos={videos}
                voice={voice}
                accentColor={template.colors.primary}
              />
            </section>

            <section data-gsap="reveal" className="space-y-4">
              <div>
                <h2 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl font-semibold">RSVP</h2>
                <p className="mt-1 text-sm text-black/60">
                  Let us know if you can make it — it helps us plan.
                </p>
              </div>
              <RSVPForm inviteId={order.invite_id} accentColor={template.colors.secondary} />
            </section>

            <footer className="pt-6 border-t border-black/10">
              <p className="text-xs text-black/50">
                Crafted with WedInviter • Share this invite with your loved ones.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}
