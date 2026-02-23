import { Upload, Mic, FileText, Search } from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Upload Anything",
    description: "PDFs, audio, video, web pages — drop it in and AI handles the rest.",
    color: "from-[#bd34fe]/20 to-[#bd34fe]/5",
    iconBg: "bg-[#bd34fe]/10 text-[#bd34fe]",
  },
  {
    icon: Mic,
    title: "AI Podcast Studio",
    description: "Generate multi-voice episodes in minutes — intros, segments, and polish.",
    color: "from-[#41d1ff]/20 to-[#41d1ff]/5",
    iconBg: "bg-[#41d1ff]/10 text-[#41d1ff]",
  },
  {
    icon: FileText,
    title: "Smart Research Notes",
    description: "Auto-summaries, key takeaways, and structured notes across notebooks.",
    color: "from-[#bd34fe]/20 to-[#41d1ff]/10",
    iconBg: "bg-[#bd34fe]/10 text-[#bd34fe]",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Ask questions in plain English and jump to the exact source.",
    color: "from-[#41d1ff]/20 to-[#bd34fe]/10",
    iconBg: "bg-[#41d1ff]/10 text-[#41d1ff]",
  },
]

export function CodeShowcase() {
  return (
    <section id="bento" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to go from raw content to finished podcast
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-8 transition-all hover:border-border/80"
            >
              {/* Subtle gradient overlay on hover */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 transition-opacity group-hover:opacity-100`} />

              <div className="relative">
                <div className={`mb-5 inline-flex rounded-lg p-3 ${f.iconBg}`}>
                  <f.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
