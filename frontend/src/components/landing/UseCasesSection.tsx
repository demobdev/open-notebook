import { Wrench, Activity, Server } from "lucide-react"

const useCases = [
  {
    icon: Wrench,
    title: "Tool Integration",
    description:
      "Seamlessly integrate external APIs and tools into agent workflows.",
  },
  {
    icon: Activity,
    title: "Monitor agent activity",
    description:
      "Track and analyze your AI agent performance with detailed activity logs.",
  },
  {
    icon: Server,
    title: "Build once, run anywhere",
    description:
      "Create AI agents that work seamlessly across different platforms.",
  },
]

export function UseCasesSection() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Use Cases
        </p>

        {/* Activity log mockup */}
        <div className="mx-auto mb-16 max-w-2xl overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-secondary/30 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-destructive/60" />
              <div className="size-3 rounded-full bg-chart-3/60" />
              <div className="size-3 rounded-full bg-chart-4/60" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">agent-monitor.log</span>
            </div>
          </div>
          <div className="space-y-0 p-4 font-mono text-xs">
            <LogEntry
              time="2026-02-15 14:23:01"
              level="INFO"
              message="Agent 'ResearchBot' initialized successfully"
            />
            <LogEntry
              time="2026-02-15 14:23:03"
              level="INFO"
              message="Task assigned: Analyze Q4 market data"
            />
            <LogEntry
              time="2026-02-15 14:23:45"
              level="SUCCESS"
              message="Web search tool executed - 12 results found"
            />
            <LogEntry
              time="2026-02-15 14:24:12"
              level="INFO"
              message="Agent processing data with GPT-4 model"
            />
            <LogEntry
              time="2026-02-15 14:25:30"
              level="SUCCESS"
              message="Task completed - Report generated (2.3KB)"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {useCases.map((uc) => (
            <div key={uc.title} className="text-center">
              <div className="mx-auto mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <uc.icon className="size-5" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
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

function LogEntry({
  time,
  level,
  message,
}: {
  time: string
  level: string
  message: string
}) {
  const levelColors: Record<string, string> = {
    INFO: "text-chart-2",
    SUCCESS: "text-chart-4",
    WARN: "text-chart-3",
    ERROR: "text-destructive",
  }

  return (
    <div className="flex gap-3 py-1 text-muted-foreground">
      <span className="shrink-0 text-muted-foreground/60">{time}</span>
      <span className={`shrink-0 font-semibold ${levelColors[level] || "text-foreground"}`}>
        [{level}]
      </span>
      <span>{message}</span>
    </div>
  )
}
