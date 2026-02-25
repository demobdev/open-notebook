'use client'

import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'

const clerkAppearance = {
  elements: {
    rootBox: 'w-full',
    card: 'shadow-none border-0 bg-transparent',
    cardBox: 'shadow-none border-0 bg-transparent',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    socialButtonsBlockButton: 'rounded-md',
    formButtonPrimary: 'rounded-md',
    formFieldInput: 'rounded-md',
    footerActionLink: 'text-primary',
  },
  layout: {
    socialButtonsPlacement: 'bottom' as const,
    showOptionalFields: true,
  },
}

export function SignInCard() {
  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
        Welcome to Audioprism
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Continue with your work email for the best experience.
      </p>
      <div className="mt-8">
        <SignIn
          afterSignInUrl="/notebooks"
          appearance={clerkAppearance}
        />
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
      </p>
    </div>
  )
}
