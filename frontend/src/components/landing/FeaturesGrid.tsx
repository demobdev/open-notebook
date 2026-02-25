import { Layers, Headphones, Sparkles, Shuffle, BookOpen, Lock } from 'lucide-react'

export function FeaturesGrid() {
  const features = [
    {
      title: 'Multi-Modal Ingestion',
      description: 'Upload PDFs, audio, video, and web pages. Everything gets parsed and indexed.',
      icon: <Layers className="h-5 w-5 text-white" />,
    },
    {
      title: 'AI Podcast Generation',
      description: 'Create multi-voice episodes with clean structure, pacing, and polish.',
      icon: <Headphones className="h-5 w-5 text-white" />,
    },
    {
      title: 'Semantic Search',
      description: 'Ask questions across all your sources and get grounded answers fast.',
      icon: <Sparkles className="h-5 w-5 text-white" />,
    },
    {
      title: 'Provider Flexibility',
      description: 'Swap models when you want — or use your own keys anytime.',
      icon: <Shuffle className="h-5 w-5 text-white" />,
    },
    {
      title: 'Notebooks & Notes',
      description: 'Organize sources into notebooks with summaries, insights, and transformations.',
      icon: <BookOpen className="h-5 w-5 text-white" />,
    },
    {
      title: 'Secure by Design',
      description: 'Modern auth, encrypted credentials, and usage limits that prevent surprises.',
      icon: <Lock className="h-5 w-5 text-white" />,
    },
  ]

  return (
    <section className="py-24 bg-background transition-colors">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
         {/* Subtle top separator */}
         <div className="flex justify-center mb-16">
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#bd34fe]/50 to-transparent" />
         </div>

         <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div key={idx} className="group relative flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.02]">
              {/* Neon Glow Effect on Hover */}
              <div className="absolute inset-0 bg-[#bd34fe]/0 blur-2xl transition-all duration-500 group-hover:bg-[#bd34fe]/10 rounded-full" />
              
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border shadow-sm transition-all duration-500 group-hover:ring-[#bd34fe]/50 group-hover:shadow-[0_0_20px_rgba(189,52,254,0.4)] group-hover:bg-[#bd34fe]/10 group-hover:scale-110 z-10">
                <div className="text-foreground transition-colors duration-300 group-hover:text-[#bd34fe]">
                  {feature.icon}
                </div>
              </div>
              <h3 className="relative text-[16px] font-semibold text-foreground mb-2 tracking-tight z-10">
                {feature.title}
              </h3>
              <p className="relative text-[14px] text-muted-foreground leading-relaxed max-w-[250px] z-10">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
