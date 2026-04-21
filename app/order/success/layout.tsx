import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your wedding invitation order has been received.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
