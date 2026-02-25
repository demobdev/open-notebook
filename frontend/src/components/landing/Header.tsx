import Image from 'next/image'
import Link from 'next/link'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border transition-colors">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Audioprism Logo" width={24} height={24} className="h-6 w-auto" />
          <span className="text-[15px] font-semibold tracking-tight text-white">Audioprism</span>
        </div>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-foreground/60 md:flex">
          <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="#use-cases" className="transition-colors hover:text-foreground">Use Cases</Link>
          <Link href="#pricing" className="transition-colors hover:text-foreground">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignInButton mode="modal">
            <button className="hidden text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground sm:block">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="h-[28px] rounded-full bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20 px-4 text-[13px] font-medium border border-[#3b82f6]/20">
              Get Started
            </Button>
          </SignUpButton>
        </div>
      </div>
    </header>
  )
}
