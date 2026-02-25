import { Upload, Mic, FileText, Search, AudioLines, FileAudio, FileType, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function BentoGrid() {
  const cards = [
    {
      title: 'Upload Anything',
      description: 'PDFs, audio, video, web pages — drop it in and AI handles the rest.',
      icon: <Upload className="h-6 w-6 text-[#bd34fe]" />,
    },
    {
      title: 'AI Podcast Studio',
      description: 'Generate multi-voice episodes in minutes — intros, segments, and polish.',
      icon: <Mic className="h-6 w-6 text-[#41d1ff]" />,
    },
    {
      title: 'Smart Research Notes',
      description: 'Auto-summaries, key takeaways, and structured notes across notebooks.',
      icon: <FileText className="h-6 w-6 text-[#bd34fe]" />,
    },
    {
      title: 'Semantic Search',
      description: 'Ask questions in plain English and jump to the exact source.',
      icon: <Search className="h-6 w-6 text-[#41d1ff]" />,
    },
  ]

  return (
    <section id="features" className="py-24 bg-background transition-colors">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Subtle top separator */}
        <div className="flex justify-center mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2">
          {/* Main Colorful Card (Spans 2 columns, 2 rows if on grid) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 bg-card p-8 transition-all hover:shadow-2xl shadow-xl border border-border"
          >
            {/* Dynamic Background that works in both Light and Dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-[#09090b] dark:via-[#09090b] dark:to-[#121215] opacity-100 transition-colors" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(65,209,255,0.08)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(189,52,254,0.08)_0%,transparent_50%)]" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/50 ring-1 ring-border shadow-sm backdrop-blur-md"
                >
                  {cards[1].icon}
                </motion.div>
                <h3 className="mb-3 text-2xl font-bold text-foreground tracking-tight">
                  {cards[1].title}
                </h3>
                <p className="text-[15px] text-foreground/70 leading-relaxed max-w-sm">
                  {cards[1].description}
                </p>
              </div>
              
              {/* Animation Container - Responds to Light/Dark Mode */}
              <div className="mt-8 relative w-full h-40 bg-muted/30 dark:bg-zinc-950/50 rounded-lg border border-border/50 overflow-hidden flex items-center justify-center shadow-inner group-hover:bg-muted/50 dark:group-hover:bg-zinc-900/50 transition-colors">
                 {/* Better Orbit Animation */}
                 <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-32 h-32 border border-border/60 rounded-full animate-[spin_12s_linear_infinite]" />
                    <div className="absolute w-48 h-48 border border-border/60 rounded-full animate-[spin_18s_linear_infinite_reverse]" />
                    <div className="absolute w-64 h-64 border border-[#bd34fe]/10 rounded-full animate-[spin_24s_linear_infinite]" />
                    
                    {/* Center node: Main AI Core */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#41d1ff] to-[#bd34fe] flex items-center justify-center shadow-[0_0_20px_rgba(189,52,254,0.3)] dark:shadow-[0_0_20px_rgba(189,52,254,0.5)] z-10 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    
                    {/* Orbiting nodes with context */}
                    <div className="absolute w-32 h-32 animate-[spin_12s_linear_infinite]">
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                         <AudioLines className="w-3.5 h-3.5 text-[#41d1ff] -rotate-90" />
                       </div>
                    </div>
                    
                    <div className="absolute w-48 h-48 animate-[spin_18s_linear_infinite_reverse]">
                       <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                         <FileText className="w-4 h-4 text-[#bd34fe]" />
                       </div>
                       <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                         <FileType className="w-3.5 h-3.5 text-pink-500" /> {/* TTS context */}
                       </div>
                    </div>
                    
                    <div className="absolute w-64 h-64 animate-[spin_24s_linear_infinite]">
                       <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                         <FileAudio className="w-3.5 h-3.5 text-emerald-500" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Other conforming cards */}
          {[cards[0], cards[2], cards[3]].map((card, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
              whileHover={{ y: -5, scale: 1.02 }}
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:bg-muted/50 hover:border-[#bd34fe]/40 dark:hover:border-[#bd34fe]/50 hover:shadow-lg hover:shadow-purple-500/5 md:col-span-1"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10 shadow-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {card.icon}
                </div>
                <div>
                  <h3 className="mb-2 text-[15px] font-semibold text-foreground tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
