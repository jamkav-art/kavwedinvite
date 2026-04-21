import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, computeAdminToken } from '@/lib/admin-auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const expected = await computeAdminToken(process.env.ADMIN_SECRET ?? '')
  const isAuthenticated = !!token && token === expected

  if (!isAuthenticated) {
    // Unauthenticated — render bare (login page)
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#F0EDE8]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
