import { Video, BookOpen, GraduationCap } from "lucide-react"

const useCases = [
  {
    icon: Video,
    title: "Content Creators",
    description: "Repurpose articles, interviews, and research into polished podcast episodes.",
    iconBg: "bg-[#bd34fe]/10 text-[#bd34fe]",
  },
  {
    icon: BookOpen,
    title: "Research Teams",
    description: "Index hundreds of documents and surface answers with semantic search.",
    iconBg: "bg-[#41d1ff]/10 text-[#41d1ff]",
  },
  {
    icon: GraduationCap,
    title: "Students & Lifelong Learners",
    description: "Turn messy reading lists into study notes, summaries, and audio you'll finish.",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for people who create, research, and learn
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl border border-border/40 bg-card p-6 text-center transition-colors hover:border-border/80"
            >
              <div className={`mx-auto mb-4 inline-flex rounded-lg p-3 ${uc.iconBg}`}>
                <uc.icon className="size-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {uc.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
