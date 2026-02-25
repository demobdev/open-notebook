"use client";

import { Key, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export function ValueProps() {
  const props = [
    {
      title: 'Your keys or ours — you choose',
      description: 'Start instantly with Audioprism-managed AI, or bring your own OpenAI / ElevenLabs keys for maximum control and lower cost.',
      icon: <Key className="h-6 w-6 text-[#bd34fe]" />,
    },
    {
      title: 'Private by default',
      description: 'Keep notebooks scoped to your account. Your content stays yours — and your keys are encrypted at rest.',
      icon: <Shield className="h-6 w-6 text-[#41d1ff]" />,
    },
  ]

  return (
    <section className="py-24 bg-background transition-colors">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Subtle top separator */}
        <div className="flex justify-center mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#41d1ff]/40 to-transparent" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {props.map((prop, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              key={idx}
              className="group relative flex flex-col items-center text-center p-8 transition-all"
            >
              {/* Profile/Icon Container instead of typical card */}
              <div className="mb-6 relative">
                 {/* Soft backdrop glow */}
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-full" />
                 
                 <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-white border border-gray-200 ring-8 ring-gray-50 shadow-xl shadow-purple-900/5 z-10 group-hover:scale-105 transition-transform duration-500">
                   {/* Wrapping icon with slightly smaller size internally */}
                   <div className="scale-125">
                      {prop.icon}
                   </div>
                 </div>
              </div>

              <div>
                <h3 className="mb-3 text-[17px] font-semibold text-foreground tracking-tight">
                  {prop.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm mx-auto">
                  {prop.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
