import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SocialProof() {
  return (
    <section className="py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#bd34fe]/10 to-[#41d1ff]/10 blur-[100px] rounded-full" />
      
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Quote Card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 mb-16 backdrop-blur-sm">
          <blockquote className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-8 leading-snug">
            "Audioprism exists because great ideas shouldn't die in unread PDFs."
          </blockquote>
          <cite className="text-muted-foreground not-italic flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-white/20" />
             <span>Founder, Audioprism</span>
             <div className="h-px w-8 bg-white/20" />
          </cite>
        </div>

        {/* Beta CTA */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Join the beta
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get early access and help shape the fastest way to turn content into audio.
          </p>
          <Button asChild size="lg" className="h-12 rounded-full bg-white text-black hover:bg-neutral-200 px-8 font-semibold">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
