'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { setAuthTokenProvider, apiClient } from '@/lib/api/client'
import { useAdminStore } from '@/lib/stores/admin-store'

export function ClerkTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth()
  const { setAdmin, reset } = useAdminStore()

  useEffect(() => {
    setAuthTokenProvider(getToken)
  }, [getToken])

  useEffect(() => {
    if (!isSignedIn) {
      reset()
      return
    }

    let cancelled = false
    async function fetchAdminStatus() {
      try {
        const res = await apiClient.get('/auth/me')
        if (!cancelled) {
          setAdmin(res.data.is_admin === true)
        }
      } catch {
        if (!cancelled) setAdmin(false)
      }
    }
    fetchAdminStatus()
    return () => { cancelled = true }
  }, [isSignedIn, setAdmin, reset])

  return <>{children}</>
}
