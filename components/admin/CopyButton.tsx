'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full h-8 text-xs rounded-lg border border-black/10 text-slate-500 hover:bg-slate-50 transition-colors"
    >
      {copied ? '✓ Copied!' : 'Copy link'}
    </button>
  )
}
