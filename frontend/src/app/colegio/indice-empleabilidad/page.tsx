'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import apiClient, { api } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'
import { getApiErrorMessage } from '@/lib/utils'

interface IndiceStats {
  totalStudents: number
  avgScore: number
  studentsWithValidations: number
  studentsWithApplications: number
}

export default function IndiceEmpleabilidadPage() {
  const { isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState<IndiceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return }
    api.get<IndiceStats>('/schools/me/stats')
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleExport = async () => {
    setExporting(true); setExportError(null)
    try {
      const response = await apiClient.get('/schools/me/students/export', { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte-empleabilidad-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link); link.click()
      document.body.removeChild(link); URL.revokeObjectURL(url)
    } catch (err) {
      setExportError(await getApiErrorMessage(err, {
        500: 'Ocurrió un error en el servidor al generar el reporte. Intenta nuevamente.',
      }))
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="h-9 w-64 bg-surface-container rounded-lg animate-pulse mb-8" />
        <div className="card h-56 animate-pulse" />
      </main>
    )
  }

  const totalStudents = stats?.totalStudents ?? 0
  const avgScore = stats?.avgScore ?? 0
  const studentsWithValidations = stats?.studentsWithValidations ?? 0
  const studentsWithApplications = stats?.studentsWithApplications ?? 0

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-1">Índice de empleabilidad</h1>
        <p className="text-on-surface-variant">Un indicador concreto para reportar resultados y justificar decisiones.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <div className="rounded-2xl editorial-gradient p-6 sm:p-8 shadow-editorial text-on-primary">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-on-primary mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
            Score promedio
          </p>
          <div className="flex items-end gap-2">
            <span className="font-headline text-6xl font-black leading-none">{avgScore}</span>
            <span className="pb-2 text-2xl font-black">%</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-on-primary" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
            Preparación promedio de tus estudiantes en la plataforma — perfil, habilidades, portafolio y evidencias.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-on-primary/15">
            {[
              { value: totalStudents,           label: 'Estudiantes' },
              { value: studentsWithValidations, label: 'Con validaciones' },
              { value: studentsWithApplications, label: 'Con postulaciones' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-headline text-2xl font-black leading-none">{value}</p>
                <p className="mt-1 text-[11px] font-semibold text-on-primary" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="card p-6">
            <h3 className="font-headline text-base font-bold text-on-surface">Usos del indicador</h3>
            <div className="mt-4 space-y-3">
              {[
                'Evidencia para sostenedor y Mineduc',
                'Dato publicable para admisión',
                'Argumento para presupuesto interno',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 rounded-lg bg-surface-container-low p-3">
                  <span className="material-symbols-outlined icon-filled text-[18px] text-green-600">check_circle</span>
                  <span className="text-sm font-semibold text-on-surface">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <Button variant="secondary" icon="ios_share" fullWidth loading={exporting} onClick={handleExport}>
            {exporting ? 'Generando…' : 'Exportar evidencia'}
          </Button>
          {exportError && (
            <div role="alert" className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5" aria-hidden="true">error</span>
              <p className="text-sm text-error font-semibold">{exportError}</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
