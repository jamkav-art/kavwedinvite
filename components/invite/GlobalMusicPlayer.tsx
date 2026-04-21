'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Media } from '@/types/database.types'

type GlobalMusicPlayerProps = {
  song: Media | null
  accentColor?: string
}

export default function GlobalMusicPlayer({ song, accentColor }: GlobalMusicPlayerProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!song) return
    setIsReady(true)
    const hasInteracted = sessionStorage.getItem('invite-interacted')
    if (!hasInteracted) {
      setShowOverlay(true)
    }
  }, [song])

  const handleInteract = () => {
    if (!song || !audioRef.current) return
    
    sessionStorage.setItem('invite-interacted', 'true')
    setShowOverlay(false)
    
    audioRef.current.volume = 0.5
    audioRef.current.play().then(() => {
      setIsPlaying(true)
    }).catch(e => {
      console.warn('Playback prevented:', e)
    })
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(e => console.warn(e))
    }
  }

  if (!isReady || !song) return null

  return (
    <>
      <audio
        ref={audioRef}
        src={song.file_url}
        loop
        preload="none"
      />

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={handleInteract}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-[6px] cursor-pointer"
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.4)] backdrop-blur-md"
                style={{
                  boxShadow: `0 0 40px ${accentColor ? accentColor + '44' : 'rgba(255,255,255,0.4)'}`
                }}
              >
                {/* Expanding rings */}
                <motion.div 
                  className="absolute inset-0 rounded-full border border-white/40"
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border border-white/20"
                  animate={{ scale: [1, 2], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.4 }}
                />
                
                {/* Center Icon */}
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>

              <motion.p 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-white text-sm font-medium tracking-[0.2em] uppercase"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                Tap anywhere to begin
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showOverlay && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm border border-black/5 hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-4">
                <motion.div animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-black/70 rounded-full" />
                <motion.div animate={{ height: ['80%', '40%', '100%', '60%', '80%'] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1 bg-black/70 rounded-full" />
                <motion.div animate={{ height: ['60%', '80%', '40%', '100%', '60%'] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-black/70 rounded-full" />
                <motion.div animate={{ height: ['100%', '60%', '80%', '40%', '100%'] }} transition={{ repeat: Infinity, duration: 1.0 }} className="w-1 bg-black/70 rounded-full" />
              </div>
            ) : (
              <svg className="w-5 h-5 text-black/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
