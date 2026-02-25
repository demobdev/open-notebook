"use client"

import { Play, Pause, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const LOG_LINES = [
  { id: 1, time: '[10:23:45]', status: 'UPLOAD', color: 'bg-blue-50 text-blue-700 border-blue-200', text: '3 sources added to "Q1 Research"' },
  { id: 2, time: '[10:23:47]', status: 'PROCESS', color: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Extracting content from earnings-report.pdf...' },
  { id: 3, time: '[10:23:50]', status: 'NOTES', color: 'bg-purple-50 text-purple-700 border-purple-200', text: '12 key insights generated across 3 sources' },
  { id: 4, time: '[10:23:52]', status: 'PODCAST', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', text: 'Generating 8-minute episode with 2 AI voices...' },
  { id: 5, time: '[10:23:55]', status: 'COMPLETE', color: 'bg-green-50 text-green-700 border-green-200', text: '"Q1 Deep Dive" episode ready to play' },
]

export function ActivityLog() {
  const [mounted, setMounted] = useState(false)
  const [activeLogIndex, setActiveLogIndex] = useState(-1)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)

    // Preload audio instantly to bypass iOS restrictions later
    audioRef.current = new Audio('/the-energy-code-photobiomodulation.mp3')
    audioRef.current.load()

    audioRef.current.onended = () => {
      setIsPlaying(false)
    }

    let currentLogIndex = 0
    const interval = setInterval(() => {
      if (currentLogIndex < LOG_LINES.length) {
        setActiveLogIndex(currentLogIndex)
        currentLogIndex++
      } else {
        clearInterval(interval)
        setShowPlayer(true)
      }
    }, 900) // Slightly slower animation for better readability

    return () => {
      clearInterval(interval)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const handleTogglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsLoading(false)
          setIsPlaying(true)
        }).catch(error => {
          console.error("Audio playback failed:", error)
          setIsLoading(false)
          // Attempt to reload if Safari blocked it
          if (audioRef.current) {
            audioRef.current.load()
          }
        })
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

        <div className="rounded-[24px] border border-gray-200 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden font-mono text-[13px] sm:text-[14px] relative">
          <div className="flex items-center border-b border-gray-100 bg-gray-50/50 px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-300" />
              <div className="h-3 w-3 rounded-full bg-gray-300" />
              <div className="h-3 w-3 rounded-full bg-gray-300" />
            </div>
            <div className="mx-auto text-xs text-gray-400 font-sans tracking-wide">audioprism-rendering.log</div>
            <div className="w-11" />
          </div>
          
          <div className="p-6 sm:p-8 overflow-x-auto min-h-[400px]">
            <div className="min-w-max space-y-3">
              {LOG_LINES.map((log, index) => {
                const isActive = index <= activeLogIndex;
                return (
                  <div 
                    key={log.id} 
                    className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-700 ease-out border ${
                      isActive 
                        ? 'bg-gray-50 border-gray-100 shadow-sm translate-y-0 opacity-100' 
                        : 'bg-transparent border-transparent opacity-0 translate-y-4'
                    }`}
                  >
                    <span className="text-gray-400 w-24 shrink-0 tabular-nums">{log.time}</span>
                    <span className={`px-2.5 py-1 rounded-md border text-[11px] font-bold tracking-wider uppercase w-[90px] text-center shrink-0 ${log.color} ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      {log.status}
                    </span>
                    <span className="text-gray-700 font-medium">{log.text}</span>
                  </div>
                );
              })}
              
              {/* Blinking cursor */}
              {!showPlayer && activeLogIndex < LOG_LINES.length - 1 && (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ repeat: Infinity, duration: 1 }}
                   className="flex items-center gap-4 mt-4 px-4"
                >
                   <span className="text-gray-300 w-24 shrink-0">[10:23:56]</span>
                   <div className="w-2.5 h-5 bg-gray-300 rounded-[1px]" />
                </motion.div>
              )}

              {/* Inline Audio Player */}
              {showPlayer && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-5 mt-8 p-4 rounded-2xl bg-white border border-gray-200 shadow-lg shadow-gray-200/50 max-w-md ml-4"
                >
                  <button 
                    className="h-12 w-12 shrink-0 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
                    aria-label={isPlaying ? "Pause sample audio" : "Play sample audio"}
                    disabled={isLoading}
                    onClick={handleTogglePlay}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current ml-1" />
                    )}
                  </button>
                  <div className="flex flex-col flex-1 truncate">
                    <span className="text-[15px] font-bold text-gray-900 truncate">Play Generated Episode</span>
                    <span className="text-[13px] text-gray-500 font-sans flex items-center gap-2">
                       "Q1 Deep Dive"
                       <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400 text-[10px] font-bold tracking-wider">02:14</span>
                    </span>
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
