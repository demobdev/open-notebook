'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { AppSidebar } from './AppSidebar'
import { SetupBanner } from './SetupBanner'
import { useTranslation } from '@/lib/hooks/use-translation'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:flex">
        <AppSidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile header - visible only on mobile */}
        <header className="flex md:hidden items-center h-14 px-4 border-b border-sidebar-border bg-sidebar shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="mr-3 -ml-1"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Image src="/logo.svg" alt={t.common.appName} width={24} height={24} />
          <span className="ml-2 text-sm font-medium text-sidebar-foreground">
            {t.common.appName}
          </span>
        </header>

        {/* Mobile sidebar drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <AppSidebar
              onNavigate={() => setMobileMenuOpen(false)}
              forceMobileView
            />
          </SheetContent>
        </Sheet>

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <SetupBanner />
          {children}
        </main>
      </div>
    </div>
  )
}
