'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { api } from '@/lib/api-client'

const graduates = [
  { name: 'Camila Torres', specialty: 'Programación', status: 'working', label: 'Trabaja en su área', delay: '1 mes', company: 'InnoSoft' },
  { name: 'Diego Morales', specialty: 'Electricidad', status: 'working', label: 'Trabaja en su área', delay: '2 meses', company: 'Energía Sur' },
  { name: 'Fernanda Soto', specialty: 'Administración', status: 'other', label: 'Trabaja fuera del área', delay: '3 meses', company: 'Retail Pro' },
  { name: 'Ignacio Reyes', specialty: 'Telecomunicaciones', status: 'looking', label: 'Buscando empleo', delay: 'Pendiente', company: '-' },
  { name: 'Valentina Rojas', specialty: 'Contabilidad', status: 'working', label: 'Trabaja en su área', delay: '2 semanas', company: 'Consultora Norte' },
]

const surveyQuestions = [
  '¿Estás trabajando?',
  '¿Trabajas en tu especialidad?',
  '¿Cuánto tardaste en encontrar trabajo?',
]

const statusStyles: Record<string, string> = {
  working: 'bg-green-50 text-green-700 border-green-100',
  other: 'bg-amber-50 text-amber-700 border-amber-100',
  looking: 'bg-red-50 text-red-700 border-red-100',
}

function MetricCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="card p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant mb-4">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </span>
      <p className="font-headline text-3xl font-black text-on-surface">{value}</p>
      <p className="mt-1 text-xs font-bold text-on-surface-variant">{label}</p>
    </div>
  )
}

export default function EgresadosPage() {
  const [sending, setSending] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const sendSurvey = async () => {
    if (sending) return
    setSending(true)
    try {
      const res = await api.post<{ sent: number }>('/schools/me/graduates/survey', {})
      if (res.sent === 0) {
        setToast({ message: 'No hay egresados marcados todavía. Márcalos desde Estudiantes.', type: 'info' })
      } else {
        setToast({ message: `Encuesta enviada a ${res.sent} ${res.sent === 1 ? 'egresado' : 'egresados'}.`, type: 'success' })
      }
    } catch {
      setToast({ message: 'No se pudo enviar la encuesta. Intenta de nuevo.', type: 'error' })
    } finally {
      setSending(false)
      setConfirming(false)
    }
  }

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-1">Seguimiento egresados</h1>
        <p className="text-on-surface-variant">El alumno no desaparece al egresar: se mantiene el pulso del resultado real.</p>
        <span className="inline-flex items-center gap-1.5 mt-4 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <span className="material-symbols-outlined text-[14px]">science</span>
          Vista previa — contenido de ejemplo, aún no conectado a información real
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="card overflow-x-auto p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Seguimiento de egresados</h3>
              <p className="text-sm text-on-surface-variant">Estado laboral reportado por encuesta corta.</p>
            </div>
            <Button variant="secondary" icon="send" onClick={() => setConfirming(true)}>
              Enviar encuesta
            </Button>
          </div>

          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 text-left text-[11px] font-black uppercase tracking-wide text-outline">
                <th className="pb-3 pr-4">Egresado</th>
                <th className="pb-3 pr-4">Especialidad</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3 pr-4">Tiempo</th>
                <th className="pb-3">Empresa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {graduates.map(graduate => (
                <tr key={graduate.name}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-fixed text-xs font-black text-primary">
                        {graduate.name.split(' ').map(part => part[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-on-surface">{graduate.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm text-on-surface-variant">{graduate.specialty}</td>
                  <td className="py-4 pr-4">
                    <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-black', statusStyles[graduate.status])}>
                      {graduate.label}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-sm font-semibold text-on-surface">{graduate.delay}</td>
                  <td className="py-4 text-sm text-on-surface-variant">{graduate.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-6">
          <section className="card p-6">
            <h3 className="font-headline text-base font-bold text-on-surface">Encuesta automática</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              Cada egresado recibe una encuesta breve para mantener respuestas comparables y accionables.
            </p>
            <div className="mt-5 space-y-3">
              {surveyQuestions.map((question, index) => (
                <div key={question} className="flex items-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-low p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-black text-on-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">{question}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <MetricCard value="78%" label="Respondieron" icon="fact_check" />
            <MetricCard value="64%" label="Trabaja en su área" icon="engineering" />
          </section>
        </aside>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !sending && setConfirming(false)} />

          <div className="relative w-full max-w-md rounded-2xl bg-surface shadow-2xl animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
              <h2 className="font-headline font-bold text-on-surface text-lg">Enviar encuesta</h2>
              <button
                onClick={() => !sending && setConfirming(false)}
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-on-surface-variant mb-4">
                Se enviará esta encuesta, como notificación, a todos los estudiantes marcados como egresados:
              </p>
              <div className="space-y-2.5">
                {surveyQuestions.map((question, index) => (
                  <div key={question} className="flex items-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-low p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-black text-on-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-on-surface">{question}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low">
              <button
                onClick={() => setConfirming(false)}
                disabled={sending}
                className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <Button onClick={sendSurvey} disabled={sending} icon="send">
                {sending ? 'Enviando...' : 'Confirmar y enviar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </main>
  )
}
