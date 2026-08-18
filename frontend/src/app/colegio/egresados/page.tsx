'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { api } from '@/lib/api-client'
import { useModalA11y } from '@/lib/useModalA11y'

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
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{icon}</span>
      </span>
      <p className="font-headline text-3xl font-black text-on-surface">{value}</p>
      <p className="mt-1 text-xs font-bold text-on-surface-variant">{label}</p>
    </div>
  )
}

function SendSurveyModal({
  questions,
  onQuestionChange,
  sending,
  onCancel,
  onConfirm,
}: {
  questions: string[]
  onQuestionChange: (index: number, value: string) => void
  sending: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const modalRef = useModalA11y<HTMLDivElement>(() => { if (!sending) onCancel() })

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !sending && onCancel()} />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-survey-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl bg-surface shadow-2xl animate-slide-up overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
          <h2 id="send-survey-title" className="font-headline font-bold text-on-surface text-lg">Enviar encuesta</h2>
          <button
            type="button"
            onClick={() => !sending && onCancel()}
            aria-label="Cerrar"
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-on-surface-variant mb-4">
            Editá las preguntas si querés — se enviarán como notificación a todos los estudiantes marcados como egresados:
          </p>
          <ol className="space-y-2.5">
            {questions.map((question, index) => (
              <li key={index} className="flex items-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-low p-3 focus-within:border-primary/60 transition-colors">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-black text-on-primary" aria-hidden="true">
                  {index + 1}
                </span>
                <label htmlFor={`survey-question-${index}`} className="sr-only">Pregunta {index + 1}</label>
                <input
                  id={`survey-question-${index}`}
                  value={question}
                  onChange={e => onQuestionChange(index, e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low">
          <button
            type="button"
            onClick={onCancel}
            disabled={sending}
            className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <Button onClick={onConfirm} disabled={sending} icon="send">
            {sending ? 'Enviando...' : 'Confirmar y enviar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function EgresadosPage() {
  const [sending, setSending] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [editedQuestions, setEditedQuestions] = useState<string[]>(surveyQuestions)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const openConfirm = () => {
    setEditedQuestions(surveyQuestions)
    setConfirming(true)
  }

  const setQuestion = (index: number, value: string) => {
    setEditedQuestions(prev => prev.map((q, i) => i === index ? value : q))
  }

  const sendSurvey = async () => {
    if (sending) return
    setSending(true)
    try {
      const res = await api.post<{ sent: number }>('/schools/me/graduates/survey', { questions: editedQuestions })
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
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">science</span>
          Vista previa — contenido de ejemplo, aún no conectado a información real
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="card overflow-x-auto p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Seguimiento de egresados</h2>
              <p className="text-sm text-on-surface-variant">Estado laboral reportado por encuesta corta.</p>
            </div>
            <Button variant="secondary" icon="send" onClick={openConfirm}>
              Enviar encuesta
            </Button>
          </div>

          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 text-left text-[11px] font-black uppercase tracking-wide text-outline">
                <th scope="col" className="pb-3 pr-4">Egresado</th>
                <th scope="col" className="pb-3 pr-4">Especialidad</th>
                <th scope="col" className="pb-3 pr-4">Estado</th>
                <th scope="col" className="pb-3 pr-4">Tiempo</th>
                <th scope="col" className="pb-3">Empresa</th>
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
            <h2 className="font-headline text-base font-bold text-on-surface">Encuesta automática</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Cada egresado recibe una encuesta breve para mantener respuestas comparables y accionables.
            </p>
            <ol className="mt-5 space-y-3">
              {surveyQuestions.map((question, index) => (
                <li key={question} className="flex items-center gap-3 rounded-lg border border-outline-variant/15 bg-surface-container-low p-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-black text-on-primary" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">{question}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard value="78%" label="Respondieron" icon="fact_check" />
            <MetricCard value="64%" label="Trabaja en su área" icon="engineering" />
          </div>
        </aside>
      </div>

      {confirming && (
        <SendSurveyModal
          questions={editedQuestions}
          onQuestionChange={setQuestion}
          sending={sending}
          onCancel={() => setConfirming(false)}
          onConfirm={sendSurvey}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </main>
  )
}
