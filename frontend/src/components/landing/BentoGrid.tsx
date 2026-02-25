import { Upload, Mic, FileText, Search, AudioLines, FileAudio, FileType, Sparkles } from 'lucide-react'

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
          <div className="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 bg-card p-8 transition-all shadow-xl border border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#111] to-[#1a1a1a] dark:from-[#09090b] dark:to-[#121215] opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(65,209,255,0.08)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(189,52,254,0.08)_0%,transparent_50%)]" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 shadow-sm backdrop-blur-md">
                  {cards[1].icon}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-foreground tracking-tight">
                  {cards[1].title}
                </h3>
                <p className="text-[15px] text-foreground/70 leading-relaxed max-w-sm">
                  {cards[1].description}
                </p>
              </div>
              <div className="mt-8 relative w-full h-40 bg-zinc-950/50 rounded-lg border border-border/50 overflow-hidden flex items-center justify-center shadow-inner">
                 {/* Better Orbit Animation */}
                 <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-32 h-32 border border-border rounded-full animate-[spin_12s_linear_infinite]" />
                    <div className="absolute w-48 h-48 border border-border rounded-full animate-[spin_18s_linear_infinite_reverse]" />
                    <div className="absolute w-64 h-64 border border-[#bd34fe]/10 rounded-full animate-[spin_24s_linear_infinite]" />
                    
                    {/* Center node: Main AI Core */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#41d1ff] to-[#bd34fe] flex items-center justify-center shadow-[0_0_20px_rgba(189,52,254,0.5)] z-10">
                      <Sparkles className="w-5 h-5 text-white/90 animate-pulse" />
                    </div>
                    
                    {/* Orbiting nodes with context */}
                    <div className="absolute w-32 h-32 animate-[spin_12s_linear_infinite]">
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-zinc-900 border border-border flex items-center justify-center shadow-[0_0_15px_#41d1ff33]">
                         <AudioLines className="w-3.5 h-3.5 text-[#41d1ff] -rotate-90" />
                       </div>
                    </div>
                    
                    <div className="absolute w-48 h-48 animate-[spin_18s_linear_infinite_reverse]">
                       <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900 border border-border flex items-center justify-center shadow-[0_0_15px_#bd34fe33]">
                         <FileText className="w-4 h-4 text-[#bd34fe]" />
                       </div>
                       <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-7 h-7 rounded-full bg-zinc-900 border border-border flex items-center justify-center shadow-[0_0_15px_#bd34fe33]">
                         <FileType className="w-3.5 h-3.5 text-pink-400" /> {/* TTS context */}
                       </div>
                    </div>
                    
                    <div className="absolute w-64 h-64 animate-[spin_24s_linear_infinite]">
                       <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-zinc-900 border border-border flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                         <FileAudio className="w-3.5 h-3.5 text-emerald-400" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Other conforming cards */}
          {[cards[0], cards[2], cards[3]].map((card, idx) => (
            <div 
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:bg-accent hover:border-border/80 shadow-sm md:col-span-1"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10 shadow-sm text-foreground/70 group-hover:text-foreground transition-colors">
                  {card.icon}
                </div>
                <div>
                  <h3 className="mb-2 text-[15px] font-semibold text-foreground tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
