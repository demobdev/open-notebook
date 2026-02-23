import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  return (
    <section className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Quote card */}
        <div className="rounded-xl border border-border/40 bg-gradient-to-br from-card via-card to-secondary/30 p-10 text-center">
          <blockquote className="text-pretty text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            &ldquo;Audioprism exists because great ideas shouldn&rsquo;t die in unread PDFs.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">
            — Founder, Audioprism
          </p>
        </div>

        {/* Beta CTA */}
        <div className="mt-14 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Join the beta
          </h3>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            Get early access and help shape the fastest way to turn content into audio.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
