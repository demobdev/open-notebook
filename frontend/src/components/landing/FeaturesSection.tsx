import {
  Layers,
  Headphones,
  Sparkles,
  Shuffle,
  BookOpen,
  Lock,
} from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Multi-Modal Ingestion",
    description: "Upload PDFs, audio, video, and web pages. Everything gets parsed and indexed.",
  },
  {
    icon: Headphones,
    title: "AI Podcast Generation",
    description: "Create multi-voice episodes with clean structure, pacing, and polish.",
  },
  {
    icon: Sparkles,
    title: "Semantic Search",
    description: "Ask questions across all your sources and get grounded answers fast.",
  },
  {
    icon: Shuffle,
    title: "Provider Flexibility",
    description: "Swap models when you want — or use your own keys anytime.",
  },
  {
    icon: BookOpen,
    title: "Notebooks & Notes",
    description: "Organize sources into notebooks with summaries, insights, and transformations.",
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description: "Modern auth, encrypted credentials, and usage limits that prevent surprises.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for speed, built for privacy
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/40 bg-card p-6 transition-colors hover:border-border/80"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
