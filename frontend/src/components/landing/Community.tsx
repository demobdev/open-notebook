import { MessageSquare, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Community() {
  return (
    <section id="community" className="py-24 border-y border-white/5 bg-white/[0.02] text-center">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
          Join the community
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Feature drops, bug fixes, and the roadmap — without the corporate theatre.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           {/* Note: In a real app we would use actual links to Discord/GitHub. 
               We'll just use href="#" as placeholders per the prompt */}
           <Button variant="outline" size="lg" className="h-12 rounded-full border-white/20 bg-background hover:bg-white/10 text-white font-medium" asChild>
             <a href="#">
               <MessageSquare className="mr-2 h-5 w-5" /> Join Discord
             </a>
           </Button>
           <Button variant="outline" size="lg" className="h-12 rounded-full border-white/20 bg-background hover:bg-white/10 text-white font-medium" asChild>
             <a href="#">
               <Github className="mr-2 h-5 w-5" /> Star on GitHub
             </a>
           </Button>
        </div>
      </div>
    </section>
  )
}
