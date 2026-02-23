export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  authorRole: string
  tag: string
  content: string
}

const posts: BlogPost[] = [
  {
    slug: "getting-started-with-audioprism",
    title: "Getting Started with the SDK",
    excerpt:
      "Introducing Audioprism SDK, a cutting-edge AI solution for building modern agent workflows.",
    date: "2026-01-15",
    author: "Alice Johnson",
    authorRole: "Developer Relations",
    tag: "Tutorial",
    content: `
## Getting Started with Audioprism SDK

Welcome to Audioprism SDK! This guide will walk you through setting up your first AI agent in just a few minutes.

### Installation

First, install the SDK using your preferred package manager:

\`\`\`bash
npm install audioprism-sdk
\`\`\`

### Your First Agent

Create a simple agent that can answer questions:

\`\`\`typescript
import { Agent } from "audioprism-sdk"

const agent = new Agent({
  name: "MyFirstAgent",
  role: "Assistant",
  instructions: "You are a helpful assistant.",
})

const result = await agent.run({
  description: "What is the capital of France?",
})

console.log(result.output)
// => "The capital of France is Paris."
\`\`\`

### Configuration

The SDK supports multiple AI providers out of the box. Configure your preferred provider in your project's environment:

\`\`\`bash
AUDIOPRISM_API_KEY=your_api_key_here
AUDIOPRISM_MODEL=gpt-4
\`\`\`

### What's Next?

- Explore [Multi-Agent Systems](/blog/building-multi-agent-systems) for complex workflows
- Learn about [Tool Integration](#) to extend agent capabilities
- Join our [Discord community](#) for support and discussions

Happy building!
    `,
  },
  {
    slug: "why-ai-agents-matter",
    title: "Why AI Agents Matter",
    excerpt:
      "Explore why autonomous AI agents represent the next paradigm shift in software development.",
    date: "2026-01-22",
    author: "Diana Evans",
    authorRole: "CTO",
    tag: "Insights",
    content: `
## Why AI Agents Matter

The software industry is on the cusp of another major transformation. After cloud computing, mobile-first, and microservices, **autonomous AI agents** are emerging as the next paradigm.

### Beyond Simple Prompts

Traditional LLM usage involves sending a prompt and receiving a response. AI agents go further — they can:

- **Plan** multi-step tasks autonomously
- **Use tools** like web search, code execution, and API calls
- **Collaborate** with other agents on complex problems
- **Learn** from feedback and improve over time

### Real-World Impact

Companies using agent-based architectures report:

- **60% reduction** in repetitive task completion time
- **3x increase** in developer productivity for automation workflows
- **40% fewer errors** in data processing pipelines

### The Agent Architecture

\`\`\`
User Request
    │
    ▼
┌─────────────┐
│  Orchestrator │
│    Agent      │
└──────┬───────┘
       │
  ┌────┼────┐
  ▼    ▼    ▼
┌───┐┌───┐┌───┐
│ R ││ W ││ V │
│ e ││ r ││ a │
│ s ││ i ││ l │
│ e ││ t ││ i │
│ a ││ e ││ d │
│ r ││ r ││ a │
│ c ││   ││ t │
│ h ││   ││ o │
│ e ││   ││ r │
│ r ││   ││   │
└───┘└───┘└───┘
\`\`\`

### Getting Started

With Audioprism SDK, building your first agent takes minutes, not weeks. Check out our [getting started guide](/blog/getting-started-with-audioprism) to begin your journey.

The future of software is autonomous. Are you ready?
    `,
  },
  {
    slug: "building-multi-agent-systems",
    title: "Building Multi-Agent Systems",
    excerpt:
      "A deep dive into orchestrating multiple AI agents for complex task automation workflows.",
    date: "2026-02-01",
    author: "George Harris",
    authorRole: "Senior Engineer",
    tag: "Guide",
    content: `
## Building Multi-Agent Systems

When a single agent isn't enough, you need a **crew**. This guide covers how to orchestrate multiple specialized agents to tackle complex workflows.

### Why Multi-Agent?

Some tasks are too complex for a single agent. By breaking work into specialized roles, you get:

- **Better quality** — each agent focuses on what it does best
- **Parallelism** — agents can work simultaneously on different subtasks
- **Modularity** — swap out or upgrade individual agents without affecting the system

### Creating a Crew

\`\`\`typescript
import { Crew, Agent } from "audioprism-sdk"

const researcher = new Agent({
  name: "Researcher",
  role: "Data Analyst",
  goal: "Find and analyze relevant data",
  tools: [webSearchTool, databaseTool],
})

const writer = new Agent({
  name: "Writer",
  role: "Content Creator",
  goal: "Produce clear, well-structured reports",
})

const reviewer = new Agent({
  name: "Reviewer",
  role: "Quality Assurance",
  goal: "Ensure accuracy and clarity",
})

const crew = new Crew({
  agents: [researcher, writer, reviewer],
  strategy: "sequential",
  verbose: true,
})

const result = await crew.execute({
  task: "Create a market analysis report for Q4 2025",
})
\`\`\`

### Execution Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| \`sequential\` | Agents run one after another | Dependent tasks |
| \`parallel\` | Agents run simultaneously | Independent subtasks |
| \`hierarchical\` | Manager agent delegates to workers | Complex orchestration |

### Communication Patterns

Agents can share context through the built-in **memory** system:

\`\`\`typescript
const crew = new Crew({
  agents: [researcher, writer],
  memory: {
    type: "shared",
    persist: true,
  },
})
\`\`\`

This allows the writer agent to access all findings from the researcher without explicit data passing.

### Best Practices

1. **Keep agents focused** — one role per agent
2. **Define clear goals** — ambiguity leads to poor results
3. **Use appropriate strategies** — not everything needs to be parallel
4. **Monitor and log** — use verbose mode during development
5. **Test incrementally** — verify each agent before combining

### Next Steps

- Explore [Tool Integration](#) for extending agent capabilities
- Check out [Agent Templates](#) for common patterns
- Read about [Production Deployment](#) for scaling your system
    `,
  },
]

export function getAllPosts(): BlogPost[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
