import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { BentoGrid } from '@/components/landing/BentoGrid'
import { ActivityLog } from '@/components/landing/ActivityLog'
import { ValueProps } from '@/components/landing/ValueProps'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { StatsStrip } from '@/components/landing/StatsStrip'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'
import { Blog } from '@/components/landing/Blog'
import { About } from '@/components/landing/About'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let userId: string | null = null
  try {
    const authResult = await auth()
    userId = authResult.userId
  } catch {
    // Clerk not configured or middleware detection failed; show landing so we don't 404
  }

  if (userId) {
    redirect('/notebooks')
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#bd34fe]/30">
      <Header />
      <main className="flex flex-col">
        <Hero />
        <BentoGrid />
        <ValueProps />
        <FeaturesGrid />
        <StatsStrip />
        <Pricing />
        <ActivityLog />
        <Blog />
        <About />
      </main>
      <Footer />
    </div>
  )
}
