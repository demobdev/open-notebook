'use client'

import { useVersionCheck } from '@/lib/hooks/use-version-check'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ModalProvider } from '@/components/providers/ModalProvider'
import { ClerkTokenProvider } from '@/components/providers/ClerkTokenProvider'
import { CreateDialogsProvider } from '@/lib/hooks/use-create-dialogs'
import { CommandPalette } from '@/components/common/CommandPalette'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useVersionCheck()

  return (
    <ErrorBoundary>
      <ClerkTokenProvider>
        <CreateDialogsProvider>
          {children}
          <ModalProvider />
          <CommandPalette />
        </CreateDialogsProvider>
      </ClerkTokenProvider>
    </ErrorBoundary>
  )
}
