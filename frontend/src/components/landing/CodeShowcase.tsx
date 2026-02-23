"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const codeExamples = [
  {
    title: "Simple Agent Workflow",
    description: "Create AI agent workflows with multiple agents.",
    code: `import { Agent, Task } from "audioprism-sdk"

const agent = new Agent({
  name: "ResearchAgent",
  role: "AI Researcher",
  instructions: "Only speak in haiku.",
})

const task = new Task({
  description: "Analyze market trends",
  agent: agent,
})

const result = await agent.run(task)
console.log(result.output)`,
  },
  {
    title: "Multi-Agent Collaboration",
    description: "Set up multiple agents to work together on a complex task.",
    code: `import { Crew, Agent } from "audioprism-sdk"

const researcher = new Agent({
  name: "Researcher",
  goal: "Find relevant data",
})

const writer = new Agent({
  name: "Writer",
  goal: "Produce clear reports",
})

const crew = new Crew({
  agents: [researcher, writer],
  strategy: "sequential",
})

const output = await crew.execute()`,
  },
  {
    title: "Tool Integration",
    description: "Integrate external APIs and tools into an AI agent.",
    code: `import { Agent, Tool } from "audioprism-sdk"

const searchTool = new Tool({
  name: "web_search",
  fn: async (query) => {
    const res = await fetch(
      \`/api/search?q=\${query}\`
    )
    return res.json()
  },
})

const agent = new Agent({
  name: "SearchAgent",
  tools: [searchTool],
})

await agent.run("Find latest AI news")`,
  },
  {
    title: "Customizable Agent Behavior",
    description: "Design a specialized agent with custom decision-making logic.",
    code: `import { Agent, Pipeline } from "audioprism-sdk"

const pipeline = new Pipeline({
  steps: [
    { action: "classify", model: "gpt-4" },
    { action: "route", rules: customRules },
    { action: "respond", tone: "formal" },
  ],
})

const agent = new Agent({
  name: "SupportAgent",
  pipeline: pipeline,
  memory: true,
})

await agent.listen({ channel: "tickets" })`,
  },
]

export function CodeShowcase() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-0 overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-[320px_1fr]">
          {/* Left panel - tabs */}
          <div className="flex flex-col border-b border-border bg-secondary/50 lg:border-b-0 lg:border-r">
            {codeExamples.map((example, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex flex-col gap-1 border-b border-border px-5 py-4 text-left transition-colors last:border-b-0",
                  activeTab === i
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                )}
              >
                <span className="text-sm font-semibold">{example.title}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {example.description}
                </span>
              </button>
            ))}
          </div>

          {/* Right panel - code */}
          <div className="relative overflow-auto bg-background p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="size-3 rounded-full bg-destructive/60" />
              <div className="size-3 rounded-full bg-chart-3/60" />
              <div className="size-3 rounded-full bg-chart-4/60" />
            </div>
            <pre className="overflow-x-auto text-sm leading-relaxed">
              <code>
                {codeExamples[activeTab].code.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="mr-4 inline-block w-6 select-none text-right text-muted-foreground/40">
                      {i + 1}
                    </span>
                    <span className="text-foreground">
                      <CodeLine line={line} />
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

function CodeLine({ line }: { line: string }) {
  // Simple syntax highlighting
  const highlighted = line
    .replace(
      /\b(import|from|const|new|await|async|return)\b/g,
      '<span class="text-primary">$1</span>'
    )
    .replace(
      /("[^"]*"|'[^']*'|`[^`]*`)/g,
      '<span class="text-chart-4">$1</span>'
    )
    .replace(
      /\b(Agent|Task|Crew|Tool|Pipeline)\b/g,
      '<span class="text-chart-2">$1</span>'
    )
    .replace(
      /(\/\/.*$)/gm,
      '<span class="text-muted-foreground">$1</span>'
    )

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
}
