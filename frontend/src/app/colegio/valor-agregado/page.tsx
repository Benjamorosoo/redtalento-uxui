'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type View = 'alertas' | 'indice' | 'egresados'
type AlertTone = 'urgent' | 'warn' | 'info'

const tabs: Array<{ key: View; label: string; icon: string }> = [
  { key: 'alertas', label: 'Alertas', icon: 'notifications_active' },
  { key: 'indice', label: 'Indice de empleabilidad', icon: 'monitoring' },
  { key: 'egresados', label: 'Seguimiento egresados', icon: 'school' },
]

const alerts: Array<{
  tone: AlertTone
  icon: string
  tag: string
  title: string
  detail: string
  action: string
}> = [
  {
    tone: 'urgent',
    icon: 'event_busy',
    tag: 'Urgente',
    title: 'La practica de Juan Perez vence en 7 dias y no tiene evaluacion registrada',
    detail: '4 medio C Electricidad - Empresa: InnoSoft Desarrollo Digital',
    action: 'Revisar',
  },
  {
    tone: 'warn',
    icon: 'work_alert',
    tag: 'Sin postulantes',
    title: 'Hay un cupo publicado hace 10 dias sin postulantes',
    detail: 'Pasantia Desarrollo Aplicaciones - InnoSoft Desarrollo Digital',
    action: 'Ver oferta',
  },
  {
    tone: 'warn',
    icon: 'person_off',
    tag: 'Perfil inactivo',
    title: '3 alumnos llevan mas de 2 semanas sin actividad en su perfil',
    detail: 'Matias Arancibia, Fernanda Soto, Ignacio Reyes',
    action: 'Ver lista',
  },
  {
    tone: 'urgent',
    icon: 'verified_off',
    tag: 'Sin validacion',
    title: '5 alumnos completaron su perfil hace mas de 1 mes y siguen sin competencias validadas',
    detail: 'Modulo Programacion',
    action: 'Validar ahora',
  },
  {
    tone: 'info',
    icon: 'trending_up',
    tag: 'Oportunidad',
    title: 'La especialidad de Telecomunicaciones tiene alta demanda esta semana',
    detail: '7 ofertas nuevas coinciden con alumnos de cuarto medio',
    action: 'Promover',
  },
]

const dimensions = [
  { label: 'Trabajo en especialidad', value: 82 },
  { label: 'Insercion menor a 3 meses', value: 74 },
  { label: 'Perfiles con portafolio', value: 68 },
  { label: 'Competencias validadas', value: 79 },
]

const graduates = [
  { name: 'Camila Torres', specialty: 'Programacion', status: 'working', label: 'Trabaja en su area', delay: '1 mes', company: 'InnoSoft' },
  { name: 'Diego Morales', specialty: 'Electricidad', status: 'working', label: 'Trabaja en su area', delay: '2 meses', company: 'Energia Sur' },
  { name: 'Fernanda Soto', specialty: 'Administracion', status: 'other', label: 'Trabaja fuera del area', delay: '3 meses', company: 'Retail Pro' },
  { name: 'Ignacio Reyes', specialty: 'Telecomunicaciones', status: 'looking', label: 'Buscando empleo', delay: 'Pendiente', company: '-' },
  { name: 'Valentina Rojas', specialty: 'Contabilidad', status: 'working', label: 'Trabaja en su area', delay: '2 semanas', company: 'Consultora Norte' },
]

const surveyQuestions = [
  'Estas trabajando?',
  'Trabajas en tu especialidad?',
  'Cuanto tardaste en encontrar trabajo?',
]

const toneStyles: Record<AlertTone, { icon: string; tag: string; dot: string }> = {
  urgent: {
    icon: 'bg-red-50 text-red-600',
    tag: 'bg-red-50 text-red-700 border-red-100',
    dot: 'bg-red-500',
  },
  warn: {
    icon: 'bg-amber-50 text-amber-600',
    tag: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-500',
  },
  info: {
    icon: 'bg-primary-fixed text-primary',
    tag: 'bg-primary-fixed/60 text-primary border-primary/10',
    dot: 'bg-primary',
  },
}

const statusStyles: Record<string, string> = {
  working: 'bg-green-50 text-green-700 border-green-100',
  other: 'bg-amber-50 text-amber-700 border-amber-100',
  looking: 'bg-red-50 text-red-700 border-red-100',
}

export default function ValorAgregadoPage() {
  const [activeView, setActiveView] = useState<View>('alertas')
  const activeTab = useMemo(() => tabs.find(tab => tab.key === activeView), [activeView])

  return (
    <main className="max-w-[1440px] mx-auto px-5 sm:px-8 py-8 sm:py-10">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary mb-2">Panel colegio</p>
          <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Elementos de valor agregado</h1>
          <p className="text-on-surface-variant max-w-2xl">
            Alertas operativas, evidencia de empleabilidad y seguimiento posterior al egreso para coordinar sin revisar todo manualmente.
          </p>
        </div>
        <Link href="/colegio/dashboard">
          <Button variant="secondary" icon="dashboard">Volver al dashboard</Button>
        </Link>
      </div>

      <div className="mb-7 flex w-full gap-2 overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-low p-1.5 no-scrollbar lg:w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors',
              activeView === tab.key
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface/70 hover:text-on-surface',
            )}
          >
            <span className={cn('material-symbols-outlined text-[19px]', activeView === tab.key && 'icon-filled')}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      <section className="mb-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4 shadow-editorial">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <span className="material-symbols-outlined icon-filled text-[22px]">{activeTab?.icon}</span>
          </div>
          <div>
            <h2 className="font-headline text-lg font-bold text-on-surface">{activeTab?.label}</h2>
            <p className="text-sm text-on-surface-variant">
              {activeView === 'alertas' && 'La plataforma prioriza donde conviene mirar primero.'}
              {activeView === 'indice' && 'Un indicador concreto para reportar resultados y justificar decisiones.'}
              {activeView === 'egresados' && 'El alumno no desaparece al egresar: se mantiene el pulso del resultado real.'}
            </p>
          </div>
        </div>
      </section>

      {activeView === 'alertas' && <AlertsView />}
      {activeView === 'indice' && <EmployabilityView />}
      {activeView === 'egresados' && <GraduatesView />}
    </main>
  )
}

function AlertsView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard value="3" label="Urgentes" icon="priority_high" className="text-red-600" />
        <MetricCard value="7" label="Requieren atencion" icon="notification_important" className="text-amber-600" />
        <MetricCard value="42" label="Alumnos al dia" icon="task_alt" className="text-green-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-headline text-lg font-bold text-on-surface">Alertas activas</h3>
            <Button variant="ghost" size="sm" icon="done_all">Marcar vistas</Button>
          </div>

          <div className="divide-y divide-outline-variant/15">
            {alerts.map(alert => (
              <article key={alert.title} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', toneStyles[alert.tone].icon)}>
                  <span className="material-symbols-outlined text-[22px]">{alert.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide', toneStyles[alert.tone].tag)}>
                    {alert.tag}
                  </span>
                  <h4 className="mt-2 text-sm font-bold leading-snug text-on-surface">{alert.title}</h4>
                  <p className="mt-1 text-xs text-on-surface-variant">{alert.detail}</p>
                </div>
                <Button variant="outline" size="sm">{alert.action}</Button>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card p-6">
            <h3 className="font-headline text-base font-bold text-on-surface">Prioridad sugerida</h3>
            <div className="mt-5 space-y-4">
              {[
                ['Practicas por vencer', 92, 'bg-red-500'],
                ['Ofertas sin postulantes', 76, 'bg-amber-500'],
                ['Perfiles inactivos', 61, 'bg-primary'],
              ].map(([label, value, color]) => (
                <div key={label as string}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-on-surface">{label}</span>
                    <span className="font-bold text-on-surface-variant">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container">
                    <div className={cn('h-2 rounded-full', color as string)} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-primary/15 bg-primary-fixed/40 p-6">
            <span className="material-symbols-outlined icon-filled text-primary">lightbulb</span>
            <h3 className="mt-3 font-headline text-base font-bold text-on-surface">Proxima accion</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              Contactar a los estudiantes inactivos antes de revisar nuevos cupos: es el grupo con mayor riesgo de quedarse fuera del proceso.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

function EmployabilityView() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <section className="space-y-6">
        <div className="rounded-xl editorial-gradient p-6 text-white shadow-editorial sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Indice 2024</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-headline text-6xl font-black leading-none">82</span>
                <span className="pb-2 text-2xl font-black">%</span>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                Egresados 2024 encontraron trabajo en su area en menos de 3 meses.
              </p>
            </div>
            <Button variant="secondary" icon="ios_share">Exportar evidencia</Button>
          </div>
        </div>

        <section className="card p-6">
          <h3 className="font-headline text-lg font-bold text-on-surface">Componentes del indice</h3>
          <div className="mt-5 space-y-5">
            {dimensions.map(item => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-on-surface">{item.label}</span>
                  <span className="text-sm font-black text-primary">{item.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-container">
                  <div className="h-2.5 rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard value="126" label="Egresados medidos" icon="groups" />
          <MetricCard value="3m" label="Tiempo promedio" icon="schedule" />
          <MetricCard value="18" label="Empresas empleadoras" icon="business_center" />
        </div>

        <section className="card p-6">
          <h3 className="font-headline text-base font-bold text-on-surface">Usos del indicador</h3>
          <div className="mt-4 space-y-3">
            {[
              'Evidencia para sostenedor y Mineduc',
              'Dato publicable para admision',
              'Argumento para presupuesto interno',
            ].map(item => (
              <div key={item} className="flex items-start gap-3 rounded-lg bg-surface-container-low p-3">
                <span className="material-symbols-outlined icon-filled text-[18px] text-green-600">check_circle</span>
                <span className="text-sm font-semibold text-on-surface">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}

function GraduatesView() {
  return (
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
          <h3 className="font-headline text-base font-bold text-on-surface">Encuesta automatica</h3>
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
          <MetricCard value="64%" label="Trabaja en su area" icon="engineering" />
        </section>
      </aside>
    </div>
  )
}

function MetricCard({
  value,
  label,
  icon,
  className,
}: {
  value: string
  label: string
  icon: string
  className?: string
}) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </span>
      </div>
      <p className={cn('font-headline text-3xl font-black text-on-surface', className)}>{value}</p>
      <p className="mt-1 text-xs font-bold text-on-surface-variant">{label}</p>
    </div>
  )
}
