'use client'

import { motion } from 'framer-motion'
import { cn, buildWhatsAppShareUrl } from '@/lib/utils'

type ShareButtonsProps = {
  inviteId: string
  coupleNames: string
  weddingDate: string
  customMessage?: string
  variant?: 'light' | 'dark'
  className?: string
}

function getInviteUrl(inviteId: string) {
  if (typeof window === 'undefined') return `/invite/${inviteId}`
  return `${window.location.origin}/invite/${inviteId}`
}

export default function ShareButtons({
  inviteId,
  coupleNames,
  weddingDate,
  customMessage,
  variant = 'light',
  className,
}: ShareButtonsProps) {
  const inviteUrl = getInviteUrl(inviteId)
  const message = `${customMessage ? `${customMessage}\n\n` : ''}${coupleNames}\n${weddingDate}\n\n${inviteUrl}`
  const whatsappUrl = buildWhatsAppShareUrl(message)

  const base =
    variant === 'dark'
      ? 'bg-white/10 text-white border-white/20 hover:bg-white/15'
      : 'bg-white text-black border-black/10 hover:bg-black/[0.03]'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      const el = document.createElement('textarea')
      el.value = inviteUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      el.remove()
    }
    window.alert('Link copied.')
  }

  const nativeShare = async () => {
    if (!navigator.share) return
    await navigator.share({ title: coupleNames, text: message, url: inviteUrl })
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {'share' in navigator ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => void nativeShare()}
          className={cn(
            'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border transition-colors',
            base
          )}
        >
          Share
        </motion.button>
      ) : null}

      <motion.a
        whileTap={{ scale: 0.98 }}
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border transition-colors',
          base
        )}
      >
        WhatsApp
      </motion.a>

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => void copyLink()}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold border transition-colors',
          base
        )}
      >
        Copy link
      </motion.button>
    </div>
  )
}
