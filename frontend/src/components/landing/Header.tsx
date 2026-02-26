import Image from 'next/image'
import Link from 'next/link'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border transition-colors">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Audioprism Logo" width={24} height={24} className="h-6 w-auto" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Audioprism</span>
        </div>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-foreground/60 md:flex">
          <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="#use-cases" className="transition-colors hover:text-foreground">Use Cases</Link>
          <Link href="#pricing" className="transition-colors hover:text-foreground">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <span className="cursor-pointer flex items-center h-full text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground">
                Sign In
              </span>
            </SignInButton>
            <SignUpButton mode="modal">
              <span className="inline-flex h-[28px] items-center justify-center whitespace-nowrap rounded-full bg-[#3b82f6]/10 px-4 text-[13px] font-medium text-[#3b82f6] transition-colors hover:bg-[#3b82f6]/20 border border-[#3b82f6]/20 cursor-pointer">
                Get Started
              </span>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="cursor-pointer text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground bg-transparent border-none mr-2">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
