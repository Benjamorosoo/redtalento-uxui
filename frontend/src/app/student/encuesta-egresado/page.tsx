'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { api } from '@/lib/api-client'

interface GraduateSurveyResponse {
  isWorking: boolean
  worksInSpecialty?: boolean
  timeToFindJob?: string
}

export default function EncuestaEgresadoPage() {
  const [isWorking, setIsWorking] = useState<boolean | null>(null)
  const [worksInSpecialty, setWorksInSpecialty] = useState<boolean | null>(null)
  const [timeToFindJob, setTimeToFindJob] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    api.get<GraduateSurveyResponse | null>('/students/me/graduate-survey')
      .then(res => {
        if (res) {
          setIsWorking(res.isWorking)
          setWorksInSpecialty(res.worksInSpecialty ?? null)
          setTimeToFindJob(res.timeToFindJob ?? '')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const canSubmit = isWorking !== null

  const submit = async () => {
    if (!canSubmit || saving) return
    setSaving(true)
    try {
      await api.post('/students/me/graduate-survey', {
        isWorking,
        worksInSpecialty: isWorking ? (worksInSpecialty ?? undefined) : undefined,
        timeToFindJob: timeToFindJob || undefined,
      })
      setToast({ message: '¡Gracias! Tu respuesta fue enviada.', type: 'success' })
    } catch {
      setToast({ message: 'No se pudo enviar la encuesta. Intenta de nuevo.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="card h-80 animate-pulse" />
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface mb-1">Encuesta de seguimiento</h1>
        <p className="text-sm text-on-surface-variant">
          Tu colegio quiere saber cómo te está yendo tras egresar. Toma menos de un minuto.
        </p>
      </div>

      <div className="card p-6 space-y-6">
        <div>
          <p className="text-sm font-bold text-on-surface mb-3">¿Estás trabajando?</p>
          <div className="flex gap-2">
            {[{ v: true, label: 'Sí' }, { v: false, label: 'No' }].map(opt => (
              <button
                key={String(opt.v)}
                onClick={() => setIsWorking(opt.v)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isWorking === opt.v
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isWorking && (
          <>
            <div>
              <p className="text-sm font-bold text-on-surface mb-3">¿Trabajas en tu especialidad?</p>
              <div className="flex gap-2">
                {[{ v: true, label: 'Sí' }, { v: false, label: 'No' }].map(opt => (
                  <button
                    key={String(opt.v)}
                    onClick={() => setWorksInSpecialty(opt.v)}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      worksInSpecialty === opt.v
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-on-surface mb-3">¿Cuánto tardaste en encontrar trabajo?</p>
              <input
                value={timeToFindJob}
                onChange={e => setTimeToFindJob(e.target.value)}
                placeholder="Ej: 2 meses"
                className="w-full bg-surface-container-low rounded-lg px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary transition-colors placeholder:text-outline"
              />
            </div>
          </>
        )}

        <Button fullWidth disabled={!canSubmit || saving} onClick={submit}>
          {saving ? 'Enviando...' : 'Enviar respuesta'}
        </Button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </main>
  )
}
