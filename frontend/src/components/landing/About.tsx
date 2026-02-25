export function About() {
  return (
    <section id="about" className="py-24 bg-background border-t border-border relative overflow-hidden transition-colors">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-l from-[#bd34fe]/5 to-transparent blur-[120px] rounded-full" />
      
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[13px] font-bold tracking-widest text-[#41d1ff] uppercase mb-4 block">
            About Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
            Built for a world where attention is the scarcest resource.
          </h2>
        </div>

        <div className="prose prose-invert prose-white w-full text-foreground/70 text-[17px] leading-relaxed max-w-2xl mx-auto text-center">
          <p className="mb-6">
            We started Audioprism because we realized that the best ideas were locked away in formats no one had the time to consume. PDFs, long-form research, endless documentations—they contain incredible value, but they demand too much unbroken attention.
          </p>
          <p className="mb-6">
            Our mission is to reduce the friction of knowledge transfer. By turning static text into dynamic, engaging, and high-quality audio, we give creators, researchers, and professionals their time back. 
          </p>
          <p>
            Whether you're studying for an exam, catching up on industry reports during your commute, or scaling your content strategy—Audioprism transforms your text into an immersive audio experience.
          </p>
        </div>
      </div>
    </section>
  )
}
