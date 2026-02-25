"use client";

import { Layers, Headphones, Sparkles, Shuffle, BookOpen, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export function FeaturesGrid() {
  const features = [
    {
      title: 'Multi-Modal Ingestion',
      description: 'Upload PDFs, audio, video, and web pages. Everything gets parsed and indexed.',
      icon: <Layers className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-colors" />,
    },
    {
      title: 'AI Podcast Generation',
      description: 'Create multi-voice episodes with clean structure, pacing, and polish.',
      icon: <Headphones className="h-5 w-5 text-purple-500 group-hover:text-purple-600 transition-colors" />,
    },
    {
      title: 'Semantic Search',
      description: 'Ask questions across all your sources and get grounded answers fast.',
      icon: <Sparkles className="h-5 w-5 text-amber-500 group-hover:text-amber-600 transition-colors" />,
    },
    {
      title: 'Provider Flexibility',
      description: 'Swap models when you want — or use your own keys anytime.',
      icon: <Shuffle className="h-5 w-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" />,
    },
    {
      title: 'Notebooks & Notes',
      description: 'Organize sources into notebooks with summaries, insights, and transformations.',
      icon: <BookOpen className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />,
    },
    {
      title: 'Secure by Design',
      description: 'Modern auth, encrypted credentials, and usage limits that prevent surprises.',
      icon: <Lock className="h-5 w-5 text-rose-500 group-hover:text-rose-600 transition-colors" />,
    },
  ]

  return (
    <section className="py-24 bg-background transition-colors">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
         {/* Subtle top separator */}
         <div className="flex justify-center mb-16">
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#bd34fe]/50 to-transparent" />
         </div>

         <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={idx} 
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-purple-900/5 border border-transparent hover:border-gray-200/60"
            >
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md z-10">
                <div className="text-foreground transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="relative text-[17px] font-bold text-gray-900 mb-3 tracking-tight z-10">
                {feature.title}
              </h3>
              <p className="relative text-[15px] text-gray-500 leading-relaxed max-w-[280px] z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
