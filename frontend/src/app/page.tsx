import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/notebooks')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Audioprism" width={32} height={32} />
            <span className="text-xl font-semibold text-foreground">Audioprism</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              AI-powered podcasts
              <br />
              <span className="bg-gradient-to-r from-[#bd34fe] to-[#41d1ff] bg-clip-text text-transparent">
                made simple
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your research, generate intelligent notes, and produce professional
              podcasts with custom AI voices — all in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              Start for free
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-base font-medium text-foreground hover:bg-accent transition-colors w-full sm:w-auto"
            >
              Sign in
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-left">
            <div className="rounded-lg border border-border p-6 space-y-2">
              <div className="text-2xl">📄</div>
              <h3 className="font-semibold text-foreground">Multi-modal sources</h3>
              <p className="text-sm text-muted-foreground">
                PDFs, audio, video, web pages — upload anything and let AI extract the insights.
              </p>
            </div>
            <div className="rounded-lg border border-border p-6 space-y-2">
              <div className="text-2xl">🎙️</div>
              <h3 className="font-semibold text-foreground">Custom AI podcasts</h3>
              <p className="text-sm text-muted-foreground">
                Generate professional episodes with cloned voices from ElevenLabs and OpenAI.
              </p>
            </div>
            <div className="rounded-lg border border-border p-6 space-y-2">
              <div className="text-2xl">🔒</div>
              <h3 className="font-semibold text-foreground">Privacy first</h3>
              <p className="text-sm text-muted-foreground">
                Your data stays yours. Bring your own API keys or use ours — your choice.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Audioprism. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
