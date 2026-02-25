import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-foreground selection:bg-[#bd34fe]/30">
      <Header />
      <main className="flex flex-col items-center justify-center p-8 sm:p-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 w-full">Terms of Service</h1>
        <div className="prose prose-invert prose-white w-full text-white/70">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This is a placeholder for the Audioprism Studio Terms of Service.</p>
          <h2>Acceptance of Terms</h2>
          <p>By accessing or using our services, you agree to be bound by these Terms.</p>
          <h2>Use of Services</h2>
          <p>You agree to use the services only for lawful purposes.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
