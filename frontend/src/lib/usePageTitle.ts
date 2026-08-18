'use client'

import { useEffect } from 'react'

/**
 * Client pages can't export Next.js `metadata` (server-only), so the whole app
 * falls back to the root layout's generic "Ceibbo" tab title otherwise —
 * indistinguishable pages for anyone switching tabs with a screen reader.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} | Ceibbo`
    return () => { document.title = previous }
  }, [title])
}
