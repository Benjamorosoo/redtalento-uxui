'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

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
    </main>
  )
}
