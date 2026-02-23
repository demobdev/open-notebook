import { KeyRound, Shield } from "lucide-react"

export function ValuePropsSection() {
  return (
    <section className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border/40 bg-card p-8">
            <div className="mb-5 inline-flex rounded-lg bg-[#bd34fe]/10 p-3 text-[#bd34fe]">
              <KeyRound className="size-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Your keys or ours — you choose
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Start instantly with Audioprism-managed AI, or bring your own OpenAI / ElevenLabs keys for maximum control and lower cost.
            </p>
          </div>
          <div className="rounded-xl border border-border/40 bg-card p-8">
            <div className="mb-5 inline-flex rounded-lg bg-[#41d1ff]/10 p-3 text-[#41d1ff]">
              <Shield className="size-5" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Private by default
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keep notebooks scoped to your account. Your content stays yours — and your keys are encrypted at rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
