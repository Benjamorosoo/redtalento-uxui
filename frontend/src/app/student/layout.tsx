'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  // Never touch useAuthStore.persist during render — it must only run in the
  // browser after mount, otherwise Next's build-time static prerendering
  // (which also executes this component in Node) crashes.
  useEffect(() => {
    setHydrated(useAuthStore.persist?.hasHydrated?.() ?? true)
    return useAuthStore.persist?.onFinishHydration?.(() => setHydrated(true))
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/auth/login')
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !isAuthenticated) return null

  return (
    <div className="pt-20 min-h-screen bg-surface">
      {children}
    </div>
  )
}
