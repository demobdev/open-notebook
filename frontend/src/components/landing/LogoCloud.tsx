"use client"

const logos = ["OpenAI", "ElevenLabs", "Anthropic", "Google", "Mistral", "Groq"]

export function LogoCloud() {
  return (
    <section className="border-y border-border/40 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Powered by leading AI providers
        </p>

        {/* Desktop: static row */}
        <div className="hidden flex-wrap items-center justify-center gap-x-12 gap-y-4 sm:flex">
          {logos.map((name) => (
            <span
              key={name}
              className="text-base font-semibold text-muted-foreground/40 transition-colors hover:text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Mobile: marquee animation */}
        <div className="relative overflow-hidden sm:hidden">
          <div className="animate-marquee flex w-max gap-12">
            {[...logos, ...logos].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 text-base font-semibold text-muted-foreground/40"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
