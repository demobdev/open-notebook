'use client'

import { SignIn } from '@clerk/nextjs'

const clerkAppearance = {
  variables: {
    colorBackground: '#0a0a0a',
    colorText: 'white',
    colorPrimary: 'white',
    colorTextOnPrimaryBackground: 'black',
    colorTextSecondary: '#a1a1aa',
    colorInputBackground: 'transparent',
    colorInputText: 'white',
    colorDanger: '#ff3b3b',
  },
  elements: {
    rootBox: 'w-full max-w-[420px] mx-auto',
    card: 'shadow-2xl border border-white/10 bg-[#0a0a0a] backdrop-blur-3xl rounded-2xl overflow-hidden',
    cardBox: 'shadow-none border-0 bg-transparent',
    headerTitle: 'text-2xl font-bold text-white',
    headerSubtitle: 'text-sm text-white/60',
    socialButtonsBlockButton: 'rounded-lg border border-white/20 bg-transparent hover:bg-white/10 transition-colors',
    socialButtonsBlockButtonText: '!text-white font-semibold',
    dividerLine: 'bg-white/10',
    dividerRow: 'text-white/40',
    formButtonPrimary: 'rounded-lg bg-white !text-black hover:bg-neutral-200 border-0 font-bold transition-colors shadow-none text-[15px]',
    formFieldInput: 'rounded-lg border border-white/20 bg-white/5 text-white focus:border-white/40 transition-colors placeholder:text-white/30',
    formFieldLabel: 'text-white/80 font-medium',
    footerActionLink: 'text-white font-semibold hover:text-white/80 transition-colors',
    footerActionText: 'text-white/60',
    identityPreviewText: 'text-white',
    identityPreviewEditButton: 'text-white/70 hover:text-white',
    footer: 'bg-[#0a0a0a] border-t border-white/10',
  },
  layout: {
    socialButtonsPlacement: 'bottom' as const,
    showOptionalFields: true,
  },
}

export function SignInWithPrism() {
  return (
    <div className="w-full max-w-[420px] p-4">
      <SignIn
        fallbackRedirectUrl="/notebooks"
        forceRedirectUrl="/notebooks"
        appearance={clerkAppearance}
      />
    </div>
  )
}
