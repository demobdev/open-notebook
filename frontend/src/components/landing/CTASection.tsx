import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Ready to build your next AI agent?
          </h2>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
