import Link from "next/link"
import { ArrowRight, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <span className="font-semibold text-foreground">New</span>
            Introducing Audioprism SDK v2.0
          </Badge>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Audioprism SDK
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Create powerful AI agent workflows with just a few lines of code,
            enabling complex task automation and decision-making processes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                <Terminal className="size-4" />
                Get Started
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Available for all major programming languages
          </p>
        </div>
      </div>
    </section>
  )
}
