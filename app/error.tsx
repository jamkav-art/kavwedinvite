'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
          <h2 className="text-xl font-medium">Something went wrong</h2>
          <button
            onClick={reset}
            className="px-6 py-2 rounded-full bg-[--color-charcoal] text-[--color-cream] text-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
