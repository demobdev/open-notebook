import Link from "next/link"
import { ArrowRight } from "lucide-react"

const posts = [
  {
    slug: "getting-started-with-audioprism",
    title: "Getting Started with Audioprism Studio",
    excerpt:
      "Learn how to upload your first sources, generate notes, and create an AI podcast in under five minutes.",
    date: "Feb 10, 2026",
    tag: "Tutorial",
  },
  {
    slug: "why-ai-podcasts",
    title: "Why AI Podcasts Are the Future of Content",
    excerpt:
      "Exploring how AI-generated audio is changing the way we consume research, news, and long-form content.",
    date: "Feb 3, 2026",
    tag: "Insights",
  },
  {
    slug: "semantic-search-deep-dive",
    title: "Semantic Search: Ask Your Documents Anything",
    excerpt:
      "A deep dive into how Audioprism indexes and retrieves information across all your uploaded sources.",
    date: "Jan 28, 2026",
    tag: "Guide",
  },
]

export function BlogPreview() {
  return (
    <section className="border-t border-border/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
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
              className="group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-colors hover:border-border/80"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#bd34fe]/5 to-[#41d1ff]/5">
                <div className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  Audioprism Studio
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
