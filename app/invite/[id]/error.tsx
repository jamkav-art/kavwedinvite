'use client'

import { useEffect } from 'react'

export default function InviteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FBF7F0]">
      <div className="max-w-md w-full rounded-3xl border border-black/5 bg-white/60 p-10 text-center shadow-xl backdrop-blur-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
          🥀
        </div>
        
        <h2 className="font-[var(--font-cormorant)] text-3xl font-semibold text-black/80 mb-3">
          We lost our way
        </h2>
        
        <p className="text-sm text-black/50 mb-8 leading-relaxed">
          We&apos;re having trouble loading this beautiful invitation. Please try refreshing or checking your connection.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full rounded-full bg-black/90 px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-transform active:scale-[0.98] hover:bg-black uppercase"
          >
            Refresh page
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full rounded-full border border-black/10 bg-transparent px-6 py-3.5 text-sm font-medium tracking-wide text-black/60 transition-colors hover:bg-black/5 uppercase"
          >
            Go back
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-black/30 tracking-widest uppercase">
        WedInviter Support
      </p>
    </div>
  )
}
