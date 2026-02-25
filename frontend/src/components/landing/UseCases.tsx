import { Video, BookOpen, GraduationCap } from 'lucide-react'

export function UseCases() {
  const cases = [
    {
      title: 'Content Creators',
      description: 'Repurpose articles, interviews, and research into polished podcast episodes.',
      icon: <Video className="h-5 w-5 text-white" />,
    },
    {
      title: 'Research Teams',
      description: 'Index hundreds of documents and surface answers with semantic search.',
      icon: <BookOpen className="h-5 w-5 text-white" />,
    },
    {
      title: 'Students & Lifelong Learners',
      description: 'Turn messy reading lists into study notes, summaries, and audio you\'ll finish.',
      icon: <GraduationCap className="h-5 w-5 text-white" />,
    },
  ]

  return (
    <section id="use-cases" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Subtle top separator */}
        <div className="flex justify-center mb-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cases.map((useCase, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center text-center p-6 border border-white/5 rounded-2xl bg-black/40 hover:bg-black/60 transition-colors shadow-sm"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 shadow-sm">
                {useCase.icon}
              </div>
              <h3 className="mb-3 text-[15px] font-semibold text-white tracking-tight">
                {useCase.title}
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed max-w-[250px]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
