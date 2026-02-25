"use client"

// Removed duplicate imports
'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const spring = useSpring(0, { bounce: 0, duration: 2000 })
  const display = useTransform(spring, (current) => Math.round(current))

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  return <motion.span ref={ref}>{display}</motion.span>
}

export function StatsStrip() {
  const stats = [
    { value: '50+', label: 'File types supported' },
    { value: '8+', label: 'AI providers integrated' },
    { value: '< 5 min', label: 'From upload to podcast' },
  ]

  return (
    <section className="py-12 bg-background border-y border-border transition-colors">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        
         {/* Subtle top separator */}
         <div className="flex justify-center mb-16">
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#bd34fe]/40 to-transparent" />
         </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center">
              <AnimatedNumber value={50} />+
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">File types supported</div>
          </motion.div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-12 bg-border" />

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center">
              <AnimatedNumber value={8} />+
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">AI providers integrated</div>
          </motion.div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-12 bg-border" />

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
             <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center">
              &lt; <AnimatedNumber value={5} /> min
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">From upload to podcast</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
