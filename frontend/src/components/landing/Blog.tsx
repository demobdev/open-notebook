import Link from 'next/link'

export function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Turning 10 Hours of Lectures into a 45-Minute Audio Guide',
      category: 'Education',
      date: 'March 14, 2026',
      description: 'See how university students use Audioprism to summarize entire course modules into highly focused, digestible audio episodes for exam prep.',
      imageGradient: 'from-blue-500/20 via-cyan-400/20 to-emerald-400/20',
      iconUrl: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'How Content Teams Repurpose Blogs into Daily Micro-Podcasts',
      category: 'Creators',
      date: 'February 28, 2026',
      description: 'Learn the workflow marketing teams are using to automatically convert new blog posts into engaging, multi-speaker audio segments with zero manual editing.',
      imageGradient: 'from-fuchsia-500/20 via-pink-400/20 to-orange-400/20',
      iconUrl: 'bg-fuchsia-500',
    },
    {
      id: 3,
      title: 'Auditing Enterprise Meeting Transcripts with AI Audio',
      category: 'Enterprise',
      date: 'February 12, 2026',
      description: 'Executives don\'t have time to read 50-page transcripts. Discover how C-suites use Audioprism to get 5-minute intelligent audio briefings of weekly strategy meetings.',
      imageGradient: 'from-violet-500/20 via-purple-400/20 to-indigo-400/20',
      iconUrl: 'bg-violet-500',
    }
  ]

  return (
    <section id="blog" className="py-24 bg-background transition-colors">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#bd34fe]/50 to-transparent" />
        </div>

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[13px] font-bold tracking-widest text-[#bd34fe] uppercase mb-4 block">
            Blog
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
             Explore the possibilities.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link 
              href={`#blog-${post.id}`} 
              key={post.id}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:bg-accent transition-colors shadow-sm"
            >
              <div className={`h-48 relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${post.imageGradient}`}>
                 {/* Visual imagery for blog image */}
                 <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] group-hover:scale-110 transition-transform duration-700 ease-out" />
                 
                 {/* Abstract 'Audio Wave' Graphic */}
                 <div className="flex items-center gap-1 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`w-1.5 h-6 rounded-full ${post.iconUrl} mix-blend-screen animate-pulse`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-1.5 h-12 rounded-full ${post.iconUrl} mix-blend-screen animate-pulse`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-1.5 h-8 rounded-full ${post.iconUrl} mix-blend-screen animate-pulse`} style={{ animationDelay: '300ms' }} />
                    <div className={`w-1.5 h-14 rounded-full ${post.iconUrl} mix-blend-screen animate-pulse`} style={{ animationDelay: '450ms' }} />
                    <div className={`w-1.5 h-5 rounded-full ${post.iconUrl} mix-blend-screen animate-pulse`} style={{ animationDelay: '600ms' }} />
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-3">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{post.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-[#41d1ff] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[250px]">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
