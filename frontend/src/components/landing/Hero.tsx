"use client"

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { WarpBackground } from '@/components/ui/warp-background'

export function Hero() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WarpBackground className="relative overflow-hidden pt-20 pb-16 lg:pt-24 bg-background transition-colors min-h-[90vh] flex flex-col justify-center">
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center">
          {/* Announcement Pill */}
          <div className="flex justify-center mb-6">
            <Link 
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#3b82f6]/10 px-3 py-1 text-[13px] text-[#3b82f6] transition-colors hover:bg-[#3b82f6]/20 font-medium"
            >
              <span className="flex items-center text-[#3b82f6]">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#3b82f6] mr-2"></span>
                New — Introducing Audioprism Studio
              </span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <h1 className="text-[52px] font-bold tracking-tight text-foreground leading-tight sm:text-6xl md:text-[80px] md:leading-[1.1]">
            Build Powerful Audio Workflows
          </h1>
          
          <p className="mt-6 max-w-[600px] text-[17px] leading-relaxed text-foreground/50">
            Create powerful audio processing workflows that can seamlessly integrate into your applications. Fast, reliable, and entirely yours.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Button 
              asChild 
              size="lg" 
              className="h-11 rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 text-[15px] font-medium"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
          <p className="mt-4 text-[13px] text-foreground/40">
             Free to try • No credit card required.
          </p>
        </div>

        {/* Spacer before Trust Bar */}
        <div className="mt-16 sm:mt-24"></div>

        {/* Trust Bar */}
        <div className="mt-20 pt-10 border-t border-border/50 relative w-full overflow-hidden">
             {/* Fade Edges */}
             <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
             <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
             
             {/* Logos */}
             <div className="flex animate-marquee whitespace-nowrap items-center gap-16 px-4">
               {/* Grayscale text logos */}
               <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-bold tracking-tight text-[15px]">OpenAI</span>
               </div>
               
               <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-semibold text-[15px]">Anthropic</span>
               </div>

               <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-bold text-[15px]">Meta Llama</span>
               </div>

                <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-semibold text-[15px]">xAI Grok</span>
               </div>

               {/* Repeat for seamless marquee */}
               <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-bold tracking-tight text-[15px]">OpenAI</span>
               </div>
               
               <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-semibold text-[15px]">Anthropic</span>
               </div>

               <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-bold text-[15px]">Meta Llama</span>
               </div>

                <div className="flex items-center gap-2 text-foreground/40 grayscale opacity-70">
                 <span className="font-semibold text-[15px]">xAI Grok</span>
               </div>
             </div>
        </div>
      </div>
    </WarpBackground>
  )
}
