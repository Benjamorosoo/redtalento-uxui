'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'

interface InactiveStudentEntry {
  userId: string
  firstName: string
  lastName: string
  avatar?: string
  daysInactive: number
}

interface PendingValidationEntry {
  userId: string
  firstName: string
  lastName: string
  avatar?: string
  skillId: string
  skillName: string
}

interface AlertsStats {
  totalStudents: number
  pendingValidations: number
  inactiveStudents: number
  inactiveStudentsList: InactiveStudentEntry[]
  pendingValidationsList: PendingValidationEntry[]
}

interface AffectedStudent {
  userId: string
  name: string
  avatar?: string
  detail: string
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

/** Inline, expandable list of the specific students affected by an alert — each links straight to their profile. */
function AffectedStudentsList({ students }: { students: AffectedStudent[] }) {
  const [expanded, setExpanded] = useState(false)
  const COLLAPSE_AT = 3
  const visible = expanded ? students : students.slice(0, COLLAPSE_AT)
  const hiddenCount = students.length - visible.length

  return (
    <div className="mt-3 space-y-1 border-t border-outline-variant/10 pt-3">
      {visible.map((s, i) => (
        <Link
          key={`${s.userId}-${i}`}
          href={`/student/ver/${s.userId}`}
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors group"
        >
          <Avatar src={s.avatar} name={s.name} size="xs" />
          <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate shrink-0">
            {s.name}
          </span>
          <span className="text-[11px] text-on-surface-variant truncate">{s.detail}</span>
          <span className="material-symbols-outlined text-[14px] text-outline ml-auto shrink-0 group-hover:text-primary transition-colors">
            arrow_forward
          </span>
        </Link>
      ))}

      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs font-bold text-primary hover:underline px-2 py-1"
        >
          Ver {hiddenCount} más
        </button>
      )}
      {expanded && students.length > COLLAPSE_AT && (
        <button
          onClick={() => setExpanded(false)}
          className="text-xs font-bold text-on-surface-variant hover:underline px-2 py-1"
        >
          Ver menos
        </button>
      )}
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

  // Group pending validations by student — one row per skill, so a student with
  // several pending skills gets a single entry listing all of them.
  const pendingByStudent = new Map<string, { name: string; avatar?: string; skills: string[] }>()
  for (const entry of stats?.pendingValidationsList ?? []) {
    const key = entry.userId
    const name = `${entry.firstName} ${entry.lastName}`
    if (!pendingByStudent.has(key)) pendingByStudent.set(key, { name, avatar: entry.avatar, skills: [] })
    pendingByStudent.get(key)!.skills.push(entry.skillName)
  }
  const pendingAffected: AffectedStudent[] = Array.from(pendingByStudent.entries()).map(([userId, v]) => ({
    userId,
    name: v.name,
    avatar: v.avatar,
    detail: v.skills.join(', '),
  }))

  const inactiveAffected: AffectedStudent[] = (stats?.inactiveStudentsList ?? []).map(s => ({
    userId: s.userId,
    name: `${s.firstName} ${s.lastName}`,
    avatar: s.avatar,
    detail: `hace ${s.daysInactive} ${s.daysInactive === 1 ? 'día' : 'días'} sin actividad`,
  }))

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
              <div className="py-4 first:pt-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                    <Button variant="outline" size="sm">Validar todo</Button>
                  </Link>
                </div>
                <AffectedStudentsList students={pendingAffected} />
              </div>
            )}

            {inactiveStudents > 0 && (
              <div className="py-4 last:pb-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                </div>
                <AffectedStudentsList students={inactiveAffected} />
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
