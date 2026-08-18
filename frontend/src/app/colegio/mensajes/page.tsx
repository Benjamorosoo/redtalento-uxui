import { Suspense } from 'react'
import type { Metadata } from 'next'
import MessagesLayout from '@/components/shared/MessagesLayout'

export const metadata: Metadata = { title: 'Mensajes' }

export default function ColegioMensajesPage() {
  return (
    <Suspense fallback={<div>Cargando mensajes...</div>}>
      <MessagesLayout />
    </Suspense>
  )
}
