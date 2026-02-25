import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background overflow-hidden relative transition-colors">
      {/* Footer CTA Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 text-center border-b border-border">
        
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
          Ready to get started?
        </h2>
        <p className="text-[17px] text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of developers building the next generation of AI applications.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Button asChild size="lg" className="h-[44px] rounded-lg bg-foreground text-background hover:bg-foreground/90 px-8 text-[15px] font-medium w-full sm:w-auto">
             <Link href="/sign-up">Get Started for free</Link>
           </Button>
           <Button asChild variant="outline" size="lg" className="h-[44px] rounded-lg border-border bg-transparent text-foreground hover:bg-accent hover:text-foreground px-8 text-[15px] font-medium w-full sm:w-auto">
             <Link href="#demo">Book a demo</Link>
           </Button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16">
          <div className="col-span-2 md:col-span-2 border-b border-border md:border-b-0 pb-8 md:pb-0">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.svg" alt="Audioprism" width={24} height={24} className="h-6 w-auto" />
              <span className="text-[17px] font-semibold tracking-tight text-foreground">Audioprism</span>
            </div>
            <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
              Beautifully designed components that you can copy and paste into your apps.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-[14px]">Product</h4>
            <ul className="space-y-3 text-[13px] text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-[14px]">Company</h4>
            <ul className="space-y-3 text-[13px] text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-[14px]">Legal</h4>
            <ul className="space-y-3 text-[13px] text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-[13px] text-muted-foreground">
          <p>© 2026 Audioprism Studio. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Facebook</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
