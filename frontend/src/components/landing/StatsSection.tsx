import { Star, Users, Download } from "lucide-react"

const stats = [
  {
    value: "10K+",
    label: "Stars on GitHub",
    icon: Star,
  },
  {
    value: "50K+",
    label: "Discord Members",
    icon: Users,
  },
  {
    value: "1M+",
    label: "Downloads",
    icon: Download,
  },
]

export function StatsSection() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Statistics
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
                {stat.value}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
                <stat.icon className="size-4" />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
