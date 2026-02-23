import {
  Workflow,
  Network,
  Wrench,
  Globe,
  Settings,
  Zap,
} from "lucide-react"

const features = [
  {
    icon: Workflow,
    title: "Simple Agent Workflows",
    description:
      "Easily create and manage AI agent workflows with intuitive APIs.",
  },
  {
    icon: Network,
    title: "Multi-Agent Systems",
    description:
      "Build complex systems with multiple AI agents working together.",
  },
  {
    icon: Wrench,
    title: "Tool Integration",
    description:
      "Seamlessly integrate external tools and APIs into your agent workflows.",
  },
  {
    icon: Globe,
    title: "Cross-Language Support",
    description:
      "Available in all major programming languages for maximum flexibility.",
  },
  {
    icon: Settings,
    title: "Customizable Agents",
    description:
      "Design and customize agents to fit your specific use cases and requirements.",
  },
  {
    icon: Zap,
    title: "Efficient Execution",
    description:
      "Optimize agent performance with built-in efficiency and scalability features.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to build AI agents
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A complete toolkit for creating, managing, and deploying intelligent
            agent systems at any scale.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-card/80"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Learn more
                <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
