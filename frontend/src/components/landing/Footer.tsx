import Link from "next/link"
import Image from "next/image"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Audioprism" width={24} height={24} />
            <span className="text-sm font-semibold text-foreground">
              {">"}_  Audioprism SDK
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="X / Twitter"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            All rights reserved.
          </p>
        </div>
      </div>

      {/* Large background text */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden pb-4">
        <span className="select-none text-[8rem] font-bold leading-none tracking-tighter text-foreground/[0.03] sm:text-[12rem]">
          AUDIOPRISM
        </span>
      </div>
    </footer>
  )
}
