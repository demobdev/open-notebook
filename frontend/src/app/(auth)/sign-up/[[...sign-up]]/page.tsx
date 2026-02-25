import { SignUp } from '@clerk/nextjs'
import Prism from '@/components/Prism'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

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

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] p-4 overflow-hidden">
      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Audioprism
      </Link>

      {/* Prism Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
        <div style={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0 }}>
          <Prism
            height={3.5}
            baseWidth={4.5}
            animationType="hover"
            glow={1}
            noise={0.5}
            transparent
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            hoverStrength={2}
            inertia={0.05}
            bloom={1}
            timeScale={0.5}
          />
        </div>
      </div>

      {/* Auth Modal */}
      <div className="z-10 relative w-full max-w-[420px] pointer-events-auto flex flex-col items-center">
        <SignUp afterSignUpUrl="/notebooks" appearance={clerkAppearance} />
        
        {/* Legal Links */}
        <div className="mt-8 flex items-center gap-6 text-xs text-white/40">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}
