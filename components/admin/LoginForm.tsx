'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? 'Login failed')
        return
      }
      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-[--font-cormorant] text-3xl font-semibold text-[--color-charcoal] mb-1">
            Wed<span className="text-[--color-gold]">✦</span>Inviter
          </div>
          <p className="text-sm text-[--color-charcoal]/50">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-black/8 p-8">
          <h1 className="text-xl font-semibold text-[--color-charcoal] mb-6">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[--color-charcoal]/70 mb-1.5"
              >
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                autoComplete="current-password"
                className="w-full h-11 px-4 rounded-xl border border-black/10 bg-[--color-cream]/50 text-[--color-charcoal] placeholder:text-[--color-charcoal]/30 focus:outline-none focus:ring-2 focus:ring-[--color-gold]/40 focus:border-[--color-gold]/50 transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full h-11 rounded-xl bg-[--color-charcoal] text-[--color-cream] font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
