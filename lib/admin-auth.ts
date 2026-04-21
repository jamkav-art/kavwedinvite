export const ADMIN_COOKIE_NAME = 'admin_token'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

export async function computeAdminToken(secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(`wedinviter-admin:${secret}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
