'use client'

import { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { SkillPill } from '@/components/ui/SkillPill'
import { api } from '@/lib/api-client'
import type { StudentProfile } from '@/types'

type ValidationAction = 'VALIDADA' | 'RECHAZADA' | null

interface ValidateSkillsModalProps {
  student: StudentProfile
  onClose: () => void
  onSaved: () => void
}

export function ValidateSkillsModal({ student, onClose, onSaved }: ValidateSkillsModalProps) {
  const fullName = `${student.firstName} ${student.lastName}`
  const [actions, setActions] = useState<Record<string, ValidationAction>>({})
  const [notes, setNotes]     = useState<Record<string, string>>({})
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const pendingSkills = student.skills.filter(s => s.validationStatus === 'PENDIENTE')
  const validatedSkills = student.skills.filter(s => s.validationStatus === 'VALIDADA')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const setAction = (skillId: string, action: ValidationAction) =>
    setActions(prev => ({ ...prev, [skillId]: action }))

  const approveAll = () => {
    const next: Record<string, ValidationAction> = {}
    for (const sk of pendingSkills) next[sk.id] = 'VALIDADA'
    setActions(next)
  }

  const hasChanges = Object.values(actions).some(v => v !== null)

  const save = async () => {
    const toProcess = Object.entries(actions).filter(([, v]) => v !== null)
    if (toProcess.length === 0) return

    setSaving(true)
    setError(null)

    try {
      for (const [skillId, status] of toProcess) {
        if (!status) continue
        await api.post('/skills/validate', {
          studentId: student.id,
          skillId,
          status,
          notes: notes[skillId] || undefined,
        })
      }
      onSaved()
      onClose()
    } catch (err: any) {
      const msg = err?.response?.data?.message
      setError(Array.isArray(msg) ? msg[0] : msg ?? 'Error al guardar las validaciones.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-surface shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-outline-variant/15">
          <Avatar src={student.avatar} name={fullName} size="md" shape="rounded" />
          <div className="flex-1 min-w-0">
            <h2 className="font-headline font-bold text-on-surface text-lg truncate">{fullName}</h2>
            <p className="text-xs text-on-surface-variant">{student.specialty} · {student.year}° año</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {student.skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline">psychology</span>
              <p className="mt-3 text-sm font-semibold text-outline">Este estudiante aún no declaró habilidades.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingSkills.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-outline">
                      Pendientes de validación ({pendingSkills.length})
                    </h3>
                    <button
                      onClick={approveAll}
                      className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Aprobar todo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {pendingSkills.map(skill => {
                      const action = actions[skill.id]
                      return (
                        <div
                          key={skill.id}
                          className={`p-4 rounded-xl border transition-all ${
                            action === 'VALIDADA'  ? 'bg-green-50 border-green-200' :
                            action === 'RECHAZADA' ? 'bg-error-container/30 border-error/20' :
                            'bg-surface-container-low border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-wrap">
                            <SkillPill
                              skill={{ ...skill, isValidated: action === 'VALIDADA', validationStatus: action ?? 'PENDIENTE' }}
                              showLevel
                            />

                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-on-surface-variant">
                                {skill.category === 'TECNICA' ? 'Técnica' : skill.category === 'BLANDA' ? 'Blanda' : 'Certificación'}
                                {' · '}Nivel declarado: <strong>{skill.level}/5</strong>
                              </p>
                              {action && (
                                <input
                                  value={notes[skill.id] ?? ''}
                                  onChange={e => setNotes(prev => ({ ...prev, [skill.id]: e.target.value }))}
                                  placeholder="Agrega una nota (opcional)..."
                                  className="mt-2 w-full bg-transparent text-xs outline-none border-b border-outline-variant pb-1 focus:border-primary transition-colors placeholder:text-outline"
                                />
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => setAction(skill.id, action === 'VALIDADA' ? null : 'VALIDADA')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  action === 'VALIDADA'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Validar
                              </button>
                              <button
                                onClick={() => setAction(skill.id, action === 'RECHAZADA' ? null : 'RECHAZADA')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  action === 'RECHAZADA'
                                    ? 'bg-error text-on-error'
                                    : 'bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                Rechazar
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {validatedSkills.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-outline mb-3">
                    Ya validadas ({validatedSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {validatedSkills.map(skill => (
                      <SkillPill key={skill.id} skill={skill} showLevel />
                    ))}
                  </div>
                </div>
              )}

              {pendingSkills.length === 0 && validatedSkills.length > 0 && (
                <p className="text-xs text-on-surface-variant">
                  No hay habilidades pendientes — todas las declaradas ya fueron validadas.
                </p>
              )}
            </div>
          )}

          {error && <p className="mt-4 text-xs text-error font-semibold">{error}</p>}
        </div>

        {/* Footer */}
        {hasChanges && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low">
            <span className="text-xs text-on-surface-variant">
              {Object.values(actions).filter(v => v === 'VALIDADA').length} para validar
              {' · '}
              {Object.values(actions).filter(v => v === 'RECHAZADA').length} para rechazar
            </span>
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg editorial-gradient text-on-primary text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar validaciones'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
