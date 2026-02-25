'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/stores/theme-store'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Force light mode permanently
    const root = window.document.documentElement
    root.classList.remove('dark')
    root.classList.add('light')
    root.setAttribute('data-theme', 'light')
  }, [])

  return <>{children}</>
}
