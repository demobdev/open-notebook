import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { ArrowLeft } from "lucide-react"
import { BlogContent } from "./blog-content"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Audioprism SDK Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>
        </div>

        <article>
          <header className="mb-10">
            <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                {post.tag}
              </span>
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {post.author}
                </p>
                <p className="text-xs text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>
          </header>

          <BlogContent content={post.content} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
