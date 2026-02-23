export function LogoCloud() {
  const logos = [
    "Vercel",
    "Stripe",
    "Linear",
    "Supabase",
    "Resend",
    "Clerk",
  ]

  return (
    <section className="border-b border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
