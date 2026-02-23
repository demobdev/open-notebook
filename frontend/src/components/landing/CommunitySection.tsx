import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CommunitySection() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Community
        </p>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative flex flex-col items-center px-6 py-12 text-center">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[80px]" />
            </div>

            <div className="relative">
              <p className="mb-2 text-lg font-semibold text-foreground">
                {"We're"} grateful for the amazing open-source community
              </p>
              <p className="mb-8 text-sm text-muted-foreground">
                that helps make our project better every day.
              </p>

              <div className="mb-8 flex justify-center">
                {/* Stacked avatar placeholders */}
                <div className="flex -space-x-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary/20 text-xs font-medium text-primary"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="gap-2">
                <Github className="size-4" />
                Become a contributor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
