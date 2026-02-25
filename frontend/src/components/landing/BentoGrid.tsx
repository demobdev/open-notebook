"use client";

import { Upload, Mic, FileText, Search, AudioLines, FileAudio, FileType, Sparkles, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'

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
    {
      title: 'Custom Transformations',
      description: 'Create templates with specific prompts to extract exactly what you need.',
      icon: <Wand2 className="h-6 w-6 text-[#bd34fe]" />,
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
            className="group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 bg-white p-8 sm:p-10 transition-all hover:shadow-2xl hover:shadow-purple-500/10 shadow-xl border border-gray-200/60"
          >
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 opacity-100 transition-colors" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(65,209,255,0.06)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(189,52,254,0.08)_0%,transparent_50%)]" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <motion.div 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white ring-1 ring-gray-200/60 shadow-lg shadow-blue-500/5 backdrop-blur-md"
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
              
              {/* Animation Container */}
              <div className="mt-8 relative w-full h-48 bg-gray-50/50 rounded-2xl border border-gray-200/60 overflow-hidden flex items-center justify-center shadow-inner group-hover:bg-gray-100/50 transition-colors">
                 {/* Better Orbit Animation */}
                 <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-32 h-32 border border-gray-200 rounded-full animate-[spin_12s_linear_infinite]" />
                    <div className="absolute w-48 h-48 border border-gray-200 rounded-full animate-[spin_18s_linear_infinite_reverse]" />
                    <div className="absolute w-64 h-64 border border-[#bd34fe]/10 rounded-full animate-[spin_24s_linear_infinite]" />
                    
                    {/* Center node: Main AI Core */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#41d1ff] to-[#bd34fe] flex items-center justify-center shadow-[0_0_20px_rgba(189,52,254,0.3)] z-10 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    
                    {/* Orbiting nodes with context */}
                    <div className="absolute w-32 h-32 animate-[spin_12s_linear_infinite]">
                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md">
                         <AudioLines className="w-4 h-4 text-[#41d1ff] -rotate-90" />
                       </div>
                    </div>
                    
                    <div className="absolute w-48 h-48 animate-[spin_18s_linear_infinite_reverse]">
                       <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md">
                         <FileText className="w-4 h-4 text-[#bd34fe]" />
                       </div>
                       <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md">
                         <FileType className="w-4 h-4 text-pink-500" /> {/* TTS context */}
                       </div>
                    </div>
                    
                    <div className="absolute w-64 h-64 animate-[spin_24s_linear_infinite]">
                       <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md">
                         <FileAudio className="w-4 h-4 text-emerald-500" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Other conforming cards */}
          {[cards[0], cards[2], cards[3], cards[4]].map((card, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
              whileHover={{ y: -5, scale: 1.03 }}
              key={idx}
              className="group relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white p-6 sm:p-8 transition-all hover:bg-white hover:border-[#bd34fe]/40 hover:shadow-xl hover:shadow-purple-900/5 md:col-span-1"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100 shadow-sm text-gray-400 group-hover:bg-purple-50 group-hover:ring-purple-100 transition-colors duration-300">
                  {card.icon}
                </div>
                <div>
                  <h3 className="mb-3 text-[16px] font-bold text-gray-900 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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
