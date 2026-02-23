'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { setAuthTokenProvider } from '@/lib/api/client'

export function ClerkTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()

  useEffect(() => {
    setAuthTokenProvider(getToken)
  }, [getToken])

  return <>{children}</>
}
