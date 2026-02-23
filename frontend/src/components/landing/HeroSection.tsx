import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#bd34fe]/8 blur-[140px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[#41d1ff]/6 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        {/* Announcement pill */}
        <div className="mb-8 flex justify-center lg:justify-start">
          <Link href="/sign-up">
            <Badge
              variant="outline"
              className="gap-2 rounded-full border-border/60 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <span className="font-semibold text-primary">New</span>
              Introducing Audioprism Studio
              <ArrowRight className="size-3.5" />
            </Badge>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:justify-between">
          {/* Left column */}
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-[#bd34fe] to-[#41d1ff] bg-clip-text text-transparent">
                Audioprism
              </span>{" "}
              Studio
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0 lg:text-xl">
              Turn any content into AI-powered podcasts, smart notes, and semantic
              search — no setup. Upload and go.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="gap-2 rounded-full bg-gradient-to-r from-[#bd34fe] to-[#41d1ff] px-8 text-foreground hover:opacity-90"
                >
                  Get Started
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full border-border/60 text-foreground"
              >
                <Play className="size-4" />
                Watch Demo
              </Button>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Free to try &middot; No credit card required
            </p>
          </div>

          {/* Right column - decorative visual placeholder */}
          <div className="hidden lg:block">
            <div className="relative h-[420px] w-[520px] overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#bd34fe]/10 via-secondary/50 to-[#41d1ff]/10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(189,52,254,0.15)_0%,_transparent_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(65,209,255,0.12)_0%,_transparent_60%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 size-20 rounded-2xl bg-gradient-to-br from-[#bd34fe]/30 to-[#41d1ff]/30 backdrop-blur-sm" />
                  <p className="text-sm text-muted-foreground/60">Prism Visual Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
