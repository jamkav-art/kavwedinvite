import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { APP_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adminClient = createAdminClient()

  const { data: orders } = await adminClient
    .from('orders')
    .select('invite_id, updated_at, expires_at')
    .not('invite_id', 'is', null)

  const now = Date.now()
  const inviteUrls: MetadataRoute.Sitemap = (orders ?? [])
    .filter(
      (order) =>
        order.invite_id &&
        (!order.expires_at || new Date(order.expires_at).getTime() > now)
    )
    .map((order) => ({
      url: `${APP_URL}/invite/${order.invite_id}`,
      lastModified: order.updated_at ? new Date(order.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${APP_URL}/templates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...inviteUrls,
  ]
}
