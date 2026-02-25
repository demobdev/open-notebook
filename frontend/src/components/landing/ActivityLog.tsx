"use client"

import { Play, Pause, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const LOG_LINES = [
  { id: 1, time: '[10:23:45]', status: 'UPLOAD', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: '3 sources added to "Q1 Research"', active: false },
  { id: 2, time: '[10:23:47]', status: 'PROCESS', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', text: 'Extracting content from earnings-report.pdf...', active: false },
  { id: 3, time: '[10:23:50]', status: 'NOTES', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', text: '12 key insights generated across 3 sources', active: false },
  { id: 4, time: '[10:23:52]', status: 'PODCAST', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', text: 'Generating 8-minute episode with 2 AI voices...', active: false },
  { id: 5, time: '[10:23:55]', status: 'COMPLETE', color: 'bg-green-500/20 text-green-400 border-green-500/30', text: '"Q1 Deep Dive" episode ready to play', active: false },
]

export function ActivityLog() {
  const [mounted, setMounted] = useState(false)
  const [logs, setLogs] = useState(LOG_LINES)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)

    let currentLogIndex = 0
    const interval = setInterval(() => {
      if (currentLogIndex < LOG_LINES.length) {
        setLogs(prevLogs => 
          prevLogs.map((log, idx) => 
            idx === currentLogIndex ? { ...log, active: true } : log
          )
        )
        currentLogIndex++
      } else {
        clearInterval(interval)
        setShowPlayer(true)
      }
    }, 700)

    return () => {
      clearInterval(interval)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const handleTogglePlay = () => {
    if (!audioRef.current) {
      setIsLoading(true)
      const newAudio = new Audio('/the-energy-code-photobiomodulation.mp3')
      audioRef.current = newAudio
      
      // Safari requires synchronous play() relative to user interaction
      const playPromise = newAudio.play()
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsLoading(false)
          setIsPlaying(true)
        }).catch(error => {
          console.error("Audio playback failed:", error)
          setIsLoading(false)
        })
      }

      newAudio.onended = () => {
        setIsPlaying(false)
      }

    } else {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch(console.error)
        setIsPlaying(true)
      }
    }
  }

  if (!mounted) return null

  return (
    <section id="activity-log" className="py-24 bg-background border-y border-border overflow-hidden transition-colors">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-center mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
            Watch audio processing stream in real time.
          </h2>
          <p className="mt-4 text-[17px] text-muted-foreground max-w-2xl text-center mx-auto">
            Get full semantic visibility into every step of your transcription and rendering.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0f0f11] shadow-2xl overflow-hidden font-mono text-[13px] sm:text-[14px] relative">
          <div className="flex items-center border-b border-white/5 bg-white/[0.02] px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-white/20" />
              <div className="h-3 w-3 rounded-full bg-white/20" />
              <div className="h-3 w-3 rounded-full bg-white/20" />
            </div>
            <div className="mx-auto text-xs text-foreground/40 font-sans tracking-wide">audioprism-rendering.log</div>
            <div className="w-11" />
          </div>
          
          <div className="p-6 overflow-x-auto min-h-[300px]">
            <div className="min-w-max space-y-4">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`flex gap-4 p-4 rounded-xl transition-all duration-500 ease-out border ${
                    log.active 
                      ? 'bg-muted/50 border-border shadow-[0_0_15px_rgba(255,255,255,0.05)] translate-y-0 opacity-100' 
                      : 'bg-transparent border-transparent opacity-40 hover:opacity-100 translate-y-0'
                  }`}
                >
                  <span className="text-white/30 w-24 shrink-0">{log.time}</span>
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold tracking-wider uppercase w-24 text-center shrink-0 ${log.color}`}>
                    {log.status}
                  </span>
                  <span className="text-white/80">{log.text}</span>
                </div>
              ))}
              
              {/* Blinking cursor */}
              {!showPlayer && (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ repeat: Infinity, duration: 1 }}
                   className="flex items-center gap-4 mt-4"
                >
                   <span className="text-white/30 w-24 shrink-0">[10:23:56]</span>
                   <div className="w-2 h-4 bg-white/50" />
                </motion.div>
              )}

              {/* Inline Audio Player */}
              {showPlayer && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-4 mt-6 p-4 rounded-xl bg-card border border-border shadow-sm max-w-sm"
                >
                  <button 
                    className="h-10 w-10 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                    aria-label={isPlaying ? "Pause sample audio" : "Play sample audio"}
                    disabled={isLoading}
                    onClick={handleTogglePlay}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 fill-current ml-1" />
                    )}
                  </button>
                  <div className="flex flex-col flex-1 truncate">
                    <span className="text-[14px] font-medium text-foreground truncate">Play Generated Episode</span>
                    <span className="text-[12px] text-muted-foreground">"Q1 Deep Dive" (02:14)</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
