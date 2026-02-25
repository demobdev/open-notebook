import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-foreground selection:bg-[#bd34fe]/30">
      <Header />
      <main className="flex flex-col items-center justify-center p-8 sm:p-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 w-full">Privacy Policy</h1>
        <div className="prose prose-invert prose-white w-full text-white/70">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This is a placeholder for the Audioprism Studio Privacy Policy.</p>
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us.</p>
          <h2>How We Use Information</h2>
          <p>We use the information we collect to operate and improve our services.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
