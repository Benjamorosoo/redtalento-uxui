'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'

interface AlertsStats {
  totalStudents: number
  pendingValidations: number
  inactiveStudents: number
}

function MetricCard({ value, label, icon, className }: { value: string | number; label: string; icon: string; className?: string }) {
  return (
    <div className="card p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant mb-4">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </span>
      <p className={`font-headline text-3xl font-black text-on-surface ${className ?? ''}`}>{value}</p>
      <p className="mt-1 text-xs font-bold text-on-surface-variant">{label}</p>
    </div>
  )
}

export default function AlertasPage() {
  const { isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState<AlertsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return }
    api.get<AlertsStats>('/schools/me/stats')
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="h-9 w-64 bg-surface-container rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => <div key={i} className="card h-28 animate-pulse" />)}
        </div>
        <div className="card h-64 animate-pulse" />
      </main>
    )
  }

  const pendingValidations = stats?.pendingValidations ?? 0
  const inactiveStudents = stats?.inactiveStudents ?? 0
  const totalStudents = stats?.totalStudents ?? 0
  const alDia = Math.max(totalStudents - inactiveStudents, 0)
  const hasAlerts = pendingValidations > 0 || inactiveStudents > 0

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-1">Alertas</h1>
        <p className="text-on-surface-variant">Situaciones que conviene revisar primero.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard value={pendingValidations} label="Urgentes" icon="priority_high" className="text-red-600" />
        <MetricCard value={inactiveStudents} label="Requieren atención" icon="notification_important" className="text-amber-600" />
        <MetricCard value={alDia} label="Alumnos al día" icon="task_alt" className="text-green-600" />
      </div>

      {!hasAlerts ? (
        <div className="card p-10 flex flex-col items-center text-center">
          <span className="material-symbols-outlined icon-filled text-green-600 text-[48px]">task_alt</span>
          <p className="mt-4 font-headline font-bold text-lg text-on-surface">Todo al día</p>
          <p className="mt-1 text-sm text-on-surface-variant">No hay alertas pendientes por revisar.</p>
        </div>
      ) : (
        <section className="card p-5 sm:p-6">
          <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Alertas activas</h3>
          <div className="divide-y divide-outline-variant/15">
            {pendingValidations > 0 && (
              <div className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <span className="material-symbols-outlined text-[22px]">verified_off</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-700">
                    Urgente
                  </span>
                  <p className="mt-2 text-sm font-bold text-on-surface">
                    {pendingValidations} {pendingValidations === 1 ? 'habilidad requiere' : 'habilidades requieren'} validación
                  </p>
                </div>
                <Link href="/colegio/validaciones">
                  <Button variant="outline" size="sm">Validar</Button>
                </Link>
              </div>
            )}

            {inactiveStudents > 0 && (
              <div className="flex flex-col gap-4 py-4 last:pb-0 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#26C6DA1A', color: '#26C6DA' }}>
                  <span className="material-symbols-outlined text-[22px]">person_off</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide" style={{ backgroundColor: '#26C6DA1A', color: '#1B8A9C', border: '1px solid #26C6DA33' }}>
                    Perfil inactivo
                  </span>
                  <p className="mt-2 text-sm font-bold text-on-surface">
                    {inactiveStudents} {inactiveStudents === 1 ? 'estudiante lleva' : 'estudiantes llevan'} más de 14 días sin actividad
                  </p>
                </div>
                <Link href="/colegio/estudiantes">
                  <Button variant="outline" size="sm">Ver lista</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
