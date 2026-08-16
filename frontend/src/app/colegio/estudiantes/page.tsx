'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'
import { cn, scoreBgColor } from '@/lib/utils'
import type { StudentProfile } from '@/types'

const QUICK_FILTERS = [
  { label: 'Todos',                    value: 'all' },
  { label: 'Validaciones pendientes',  value: 'pending' },
  { label: 'Sin evidencias',           value: 'noEvidence' },
  { label: 'Con evidencias',           value: 'withEvidence' },
  { label: 'Alto score',               value: 'highScore' },
  { label: 'Score bajo',               value: 'lowScore' },
]

type PageTab = 'estudiantes' | 'egresados'

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

function EgresadosView() {
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 mb-6 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
        <span className="material-symbols-outlined text-[14px]">science</span>
        Vista previa — contenido de ejemplo, aún no conectado a información real
      </span>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="card overflow-x-auto p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">Seguimiento de egresados</h3>
              <p className="text-sm text-on-surface-variant">Estado laboral reportado por encuesta corta.</p>
            </div>
            <Button variant="secondary" icon="send">Enviar encuesta</Button>
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
    </div>
  )
}

function EstudiantesContent() {
  const { isAuthenticated } = useAuthStore()
  const searchParams = useSearchParams()
  const [students, setStudents]   = useState<StudentProfile[]>([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [query, setQuery]         = useState(searchParams.get('q') ?? '')
  const [quickFilter, setQuickFilter] = useState('all')

  const requestedTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<PageTab>(requestedTab === 'egresados' ? 'egresados' : 'estudiantes')

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      if (isAuthenticated) {
        const res = await api.get<StudentProfile[]>('/schools/me/students')
        setStudents(res)
        setTotal(res.length)
      } else {
        setStudents([])
        setTotal(0)
      }
    } catch {
      setStudents([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  // Client-side filtering
  const filtered = students.filter(s => {
    if (query) {
      const q = query.toLowerCase()
      const match = `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.specialty?.toLowerCase().includes(q)
      if (!match) return false
    }
    if (quickFilter === 'pending') {
      return s.skills.some(sk => sk.validationStatus === 'PENDIENTE')
    }
    if (quickFilter === 'noEvidence') {
      return (s.evidences?.length ?? 0) === 0
    }
    if (quickFilter === 'withEvidence') {
      return (s.evidences?.length ?? 0) > 0
    }
    if (quickFilter === 'highScore') {
      return (s.readinessScore ?? 0) >= 70
    }
    if (quickFilter === 'lowScore') {
      return (s.readinessScore ?? 0) < 40
    }
    return true
  })

  const avgScore = filtered.length
    ? Math.round(filtered.reduce((a, s) => a + (s.readinessScore ?? 0), 0) / filtered.length)
    : 0

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Gestión de Estudiantes</h1>
          <p className="text-on-surface-variant mt-1">
            {loading ? 'Cargando...' : `${total} estudiantes activos`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/colegio/carga-masiva"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-sm font-bold hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Carga masiva
          </Link>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-8 bg-surface-container-low p-1.5 rounded-xl w-fit border border-outline-variant/20">
        {([
          { key: 'estudiantes', label: 'Estudiantes', icon: 'group' },
          { key: 'egresados',   label: 'Egresados',   icon: 'school' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2',
              activeTab === tab.key
                ? 'bg-surface shadow-sm text-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50',
            )}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'egresados' ? (
        <EgresadosView />
      ) : (
      <>
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: 'group',               label: 'Total estudiantes',    value: total,                                                                         color: 'text-primary' },
          { icon: 'trending_up',         label: 'Score promedio',       value: `${avgScore}%`,                                                                color: 'text-amber-600' },
          { icon: 'verified',            label: 'Con validaciones',     value: students.filter(s => s.skills.some(sk => sk.isValidated)).length,              color: 'text-green-600' },
          { icon: 'pending_actions',     label: 'Pendientes de validar', value: students.flatMap(s => s.skills.filter(sk => sk.validationStatus === 'PENDIENTE')).length, color: 'text-amber-600' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="card p-5">
            <span className={`material-symbols-outlined text-[28px] icon-filled ${color} mb-2`}>{icon}</span>
            <div className="text-2xl font-extrabold font-headline text-on-surface">{value}</div>
            <div className="text-xs text-outline mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-2 gap-2 flex-1 max-w-sm">
          <span className="material-symbols-outlined text-outline text-[18px]">search</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar estudiante..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-outline"
          />
        </div>
        {QUICK_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setQuickFilter(f.value)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              quickFilter === f.value
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-surface-container-low" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-surface-container rounded" />
                  <div className="h-2.5 w-24 bg-surface-container-low rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline">school</span>
            <p className="mt-3 text-sm font-semibold text-outline">
              {isAuthenticated ? 'No hay estudiantes con esos criterios.' : 'Inicia sesión para ver los estudiantes.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  {['Estudiante', 'Especialidad', 'Año', 'Score', 'Habilidades', 'Validadas', 'Acciones'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-widest text-outline">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((student) => {
                  const fullName = `${student.firstName} ${student.lastName}`
                  const validatedCount = student.skills.filter(s => s.isValidated).length
                  return (
                    <tr key={student.id} className="group hover:bg-surface-container-low transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={student.avatar} name={fullName} size="sm" />
                          <div>
                            <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                              {fullName}
                            </p>
                            <p className="text-xs text-outline">{student.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{student.specialty}</td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{student.year}°</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div className="h-full editorial-gradient rounded-full"
                              style={{ width: `${student.readinessScore ?? 0}%` }} />
                          </div>
                          <span className={`text-xs font-bold ${scoreBgColor(student.readinessScore ?? 0)} px-2 py-0.5 rounded-full`}>
                            {student.readinessScore ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant text-center">{student.skills.length}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          validatedCount > 0 ? 'bg-green-50 text-green-700' : 'bg-surface-container text-outline'
                        }`}>
                          {validatedCount} / {student.skills.length}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/colegio/validaciones?student=${student.id}`}
                            className="px-3 py-1 rounded-md bg-primary-fixed text-primary text-xs font-bold hover:bg-primary-container hover:text-on-primary transition-all">
                            Validar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </>
      )}
    </main>
  )
}

export default function EstudiantesPage() {
  return (
    <Suspense fallback={
      <main className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="card h-96 animate-pulse" />
      </main>
    }>
      <EstudiantesContent />
    </Suspense>
  )
}
