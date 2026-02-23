import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bd34fe]/6 blur-[120px]" />
        <div className="absolute left-1/3 top-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#41d1ff]/4 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Ready to turn your research into audio?
        </h2>
        <div className="mt-10">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-[#bd34fe] to-[#41d1ff] px-10 text-lg text-foreground hover:opacity-90"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          No setup required. Bring your own keys anytime.
        </p>
      </div>
    </section>
  )
}
