import { ImageResponse } from 'next/og'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: { id: string } }

export default async function Image({ params }: Props) {
  const adminClient = createAdminClient()
  const { data: order } = await adminClient
    .from('orders')
    .select('couple_name_1, couple_name_2, wedding_date')
    .eq('invite_id', params.id)
    .maybeSingle()

  const name1 = order?.couple_name_1 ?? 'Wedding'
  const name2 = order?.couple_name_2 ?? 'Invitation'
  const date = order?.wedding_date ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FBF7F0 0%, #F5E6C8 60%, #EDD9A3 100%)',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '2px solid #C9A962',
            borderRadius: 12,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 32,
            border: '1px solid #C9A962',
            borderRadius: 8,
            opacity: 0.3,
          }}
        />

        {/* Content */}
        <p
          style={{
            fontSize: 18,
            color: '#C9A962',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            margin: '0 0 20px',
          }}
        >
          You are invited
        </p>

        <h1
          style={{
            fontSize: name1.length + name2.length > 24 ? 60 : 76,
            color: '#1A0A00',
            fontWeight: 600,
            margin: '0 0 20px',
            textAlign: 'center',
            lineHeight: 1.1,
            padding: '0 60px',
          }}
        >
          {name1} & {name2}
        </h1>

        {date && (
          <p
            style={{
              fontSize: 26,
              color: '#8B4513',
              margin: '0 0 40px',
              letterSpacing: '0.05em',
            }}
          >
            {date}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
          }}
        >
          <div style={{ width: 40, height: 1, background: '#C9A962' }} />
          <p style={{ fontSize: 16, color: '#C9A962', margin: 0, letterSpacing: '0.1em' }}>
            wedinviter.wasleen.com
          </p>
          <div style={{ width: 40, height: 1, background: '#C9A962' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
