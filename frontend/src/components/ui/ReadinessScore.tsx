'use client'

import { cn, scoreColor } from '@/lib/utils'
import type { ReadinessScoreBreakdown } from '@/types'

interface ReadinessScoreProps {
  score: number
  breakdown?: ReadinessScoreBreakdown
  size?: 'sm' | 'md' | 'lg'
  showBreakdown?: boolean
  showTips?: boolean
  className?: string
}

// Bloques con sus pesos máximos y colores
const segments = [
  { key: 'personalInfo'        as const, label: 'Información personal', icon: 'person',             max: 30, color: '#C0392B' },
  { key: 'visualPresentation'  as const, label: 'Presentación visual',  icon: 'add_a_photo',         max: 15, color: '#26C6DA' },
  { key: 'skills'              as const, label: 'Habilidades',          icon: 'psychology',          max: 20, color: '#81C784' },
  { key: 'validations'         as const, label: 'Validadas por colegio',icon: 'verified',            max: 20, color: '#2E7D32' },
  { key: 'evidences'           as const, label: 'Evidencias',           icon: 'folder_open',         max: 15, color: '#D68910' },
]

export function ReadinessScore({
  score,
  breakdown,
  size = 'md',
  showBreakdown = false,
  showTips = false,
  className,
}: ReadinessScoreProps) {
  const ringSize = size === 'lg' ? 96 : size === 'md' ? 72 : 52

  return (
    <div className={cn('flex flex-col gap-4', className)}>

      {/* ── Flor de ceibo creciendo ──────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
          <CeibboGrowthMark size={ringSize} score={score} />
          {size === 'sm' && (
            <span className={cn(
              'absolute -bottom-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-surface-container-lowest',
              'flex items-center justify-center text-[9px] font-black font-headline shadow-subtle border border-outline-variant/20',
              scoreColor(score),
            )}>
              {score}
            </span>
          )}
        </div>

        {size !== 'sm' && (
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className={cn('font-black font-headline leading-none', size === 'lg' ? 'text-2xl' : 'text-lg', scoreColor(score))}>
                {score}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-outline">pts</span>
            </div>
            <p className="font-semibold text-on-surface text-sm leading-tight mt-1">{scoreLabel(score)}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Índice de empleabilidad</p>
            {breakdown?.explanation && (
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed max-w-[180px]">
                {breakdown.explanation}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Breakdown bars ────────────────────────────────────────── */}
      {showBreakdown && breakdown && (
        <div className="space-y-2.5">
          {segments.map(({ key, label, icon, max }) => {
            const value = breakdown[key] as number
            const pct   = Math.round((value / max) * 100)

            return (
              <div key={key} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant w-5 shrink-0">
                  {icon}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] font-semibold text-on-surface-variant">{label}</span>
                    <span className="text-[11px] font-bold text-on-surface">{value}/{max}</span>
                  </div>
                  <div className="score-bar">
                    <div className="score-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Tips de mejora ───────────────────────────────────────── */}
      {showTips && breakdown?.tips && breakdown.tips.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
            Cómo mejorar
          </p>
          {breakdown.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[13px] text-amber-500 mt-0.5 shrink-0">lightbulb</span>
              {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Perfil Destacado'
  if (score >= 70) return 'Bien Preparado'
  if (score >= 55) return 'En Desarrollo'
  if (score >= 40) return 'Perfil Inicial'
  return 'Recién Iniciado'
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

// ── Flor de ceibo que crece con el score ───────────────────────────────────
// 0-45%: brota el tallo · 15-50%: aparecen las hojas
// 40-65%: se forma el capullo · 55-100%: los 5 pétalos se abren en orden
function CeibboGrowthMark({ size, score }: { size: number; score: number }) {
  const t     = clamp(score / 100)
  const stemT  = clamp(t / 0.45)
  const leafT  = clamp((t - 0.15) / 0.35)
  const budT   = clamp((t - 0.40) / 0.25)
  const bloomT = clamp((t - 0.55) / 0.45)
  const budOpacity  = budT * (1 - clamp(bloomT * 1.4))
  const strokeWidth = size >= 90 ? 3.4 : size >= 60 ? 2.8 : 2.2

  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <ellipse cx="32" cy="59" rx="10" ry="2.4" fill="#E8F5E9" />

      {/* Tallo */}
      <path
        d="M32 58 C 30 48, 34 40, 31 32 C 29 27, 31 23, 32 19"
        stroke="#4E9A52" strokeWidth={strokeWidth} strokeLinecap="round" fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - stemT}
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)' }}
      />

      {/* Hojas */}
      <g transform="rotate(-35 24 45)">
        <g style={{ opacity: leafT, transform: `scale(${0.5 + 0.5 * leafT})`, transformBox: 'fill-box', transformOrigin: 'center', transition: 'all 0.6s ease' }}>
          <ellipse cx="24" cy="45" rx="7" ry="3" fill="#6BAE6E" />
        </g>
      </g>
      <g transform="rotate(35 39 36)">
        <g style={{ opacity: leafT, transform: `scale(${0.5 + 0.5 * leafT})`, transformBox: 'fill-box', transformOrigin: 'center', transition: 'all 0.6s ease' }}>
          <ellipse cx="39" cy="36" rx="7" ry="3" fill="#6BAE6E" />
        </g>
      </g>

      {/* Capullo cerrado */}
      <circle
        cx="32" cy="18" r={2 + budT * 2} fill="#A93226"
        style={{ opacity: budOpacity, transition: 'all 0.6s ease' }}
      />

      {/* Pétalos abriéndose en orden */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const petalT = clamp((bloomT - i * 0.15) / 0.4)
        return (
          <g key={deg} transform={`rotate(${deg} 32 18)`}>
            <g style={{
              opacity: petalT,
              transform: `scale(${0.3 + 0.7 * petalT})`,
              transformBox: 'fill-box',
              transformOrigin: 'center',
              transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <ellipse cx="32" cy="9.5" rx="4.4" ry="8" fill={i % 2 === 0 ? '#C0392B' : '#E05B47'} />
            </g>
          </g>
        )
      })}
      <circle cx="32" cy="18" r="2.6" fill="#FADBD8" style={{ opacity: bloomT, transition: 'opacity 0.6s ease' }} />
    </svg>
  )
}
