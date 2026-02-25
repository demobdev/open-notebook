import { SignIn } from '@clerk/nextjs'
import Prism from '@/components/Prism'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { SignInWithPrism } from './SignInWithPrism'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
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
      <div className="z-10 relative pointer-events-auto flex flex-col items-center">
        <SignInWithPrism />
        
        {/* Legal Links */}
        <div className="mt-8 flex items-center gap-6 text-xs text-white/40">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}
