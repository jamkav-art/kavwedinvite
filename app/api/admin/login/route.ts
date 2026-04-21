import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE, computeAdminToken } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = (await request.json()) as { password: string }

    if (!password || password !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = await computeAdminToken(password)
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
