import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME, computeAdminToken } from '@/lib/admin-auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin/login')) return NextResponse.next()

  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (!cookieToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const expected = await computeAdminToken(process.env.ADMIN_SECRET ?? '')
  if (cookieToken !== expected) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
