import Link from "next/link"
import { ArrowRight } from "lucide-react"

const posts = [
  {
    slug: "getting-started-with-audioprism",
    title: "Getting Started with the SDK",
    excerpt:
      "Introducing Audioprism SDK, a cutting-edge AI solution for building modern agent workflows.",
    date: "Jan 15, 2026",
    tag: "Tutorial",
  },
  {
    slug: "why-ai-agents-matter",
    title: "Why AI Agents Matter",
    excerpt:
      "Explore why autonomous AI agents represent the next paradigm shift in software development.",
    date: "Jan 22, 2026",
    tag: "Insights",
  },
  {
    slug: "building-multi-agent-systems",
    title: "Building Multi-Agent Systems",
    excerpt:
      "A deep dive into orchestrating multiple AI agents for complex task automation workflows.",
    date: "Feb 1, 2026",
    tag: "Guide",
  },
]

export function BlogPreview() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Blog
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Latest from the blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:inline-flex"
          >
            View all posts
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/30"
            >
              <div className="flex h-40 items-center justify-center bg-secondary/50">
                <div className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  Audioprism SDK
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                    {post.tag}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            View all posts
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
