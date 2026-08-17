import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

interface SkillPillProps {
  skill: Skill
  size?: 'sm' | 'md'
  showLevel?: boolean
  removable?: boolean
  onRemove?: () => void
  onClick?: () => void
}

export function SkillPill({
  skill,
  size = 'md',
  showLevel = false,
  removable = false,
  onRemove,
  onClick,
}: SkillPillProps) {
  const Tag = onClick ? 'button' : 'span'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold transition-all',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px] rounded-full' : 'px-3 py-1 text-xs rounded-full',
        skill.isValidated
          ? 'bg-primary-fixed/60 text-primary-container border border-primary/15'
          : 'bg-surface-container text-on-surface-variant border border-outline-variant/20',
        onClick && 'cursor-pointer hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
      )}
    >
      {skill.isValidated && (
        <span className="material-symbols-outlined text-[12px] icon-filled text-primary-container" aria-hidden="true">
          verified
        </span>
      )}
      {skill.name}
      {skill.isValidated && <span className="sr-only"> (validada)</span>}
      {(skill.endorsements ?? 0) > 0 && (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary-container bg-primary-fixed/60 border border-primary/20 px-1.5 rounded-full ml-0.5">
          <span aria-hidden="true">👍{skill.endorsements}</span>
          <span className="sr-only">{skill.endorsements} respaldos</span>
        </span>
      )}
      {showLevel && skill.level && (
        <span className={cn(
          'rounded-full px-1.5 py-0 text-[9px] font-bold',
          skill.isValidated ? 'bg-primary text-on-primary' : 'bg-outline-variant text-on-surface-variant',
        )}>
          <span aria-hidden="true">L{skill.level}</span>
          <span className="sr-only">Nivel {skill.level} de 5</span>
        </span>
      )}
      {removable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove?.() }}
          className="ml-0.5 hover:text-error transition-colors"
          aria-label={`Quitar ${skill.name}`}
        >
          <span className="material-symbols-outlined text-[12px]" aria-hidden="true">close</span>
        </button>
      )}
    </Tag>
  )
}

// ─── Skill list for profile display ──────────────────────────────────────────
interface SkillListProps {
  skills: Skill[]
  maxVisible?: number
  showLevel?: boolean
  className?: string
}

export function SkillList({ skills, maxVisible = 99, showLevel = false, className }: SkillListProps) {
  const visible = skills.slice(0, maxVisible)
  const remaining = skills.length - visible.length

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {visible.map((skill) => (
        <SkillPill key={skill.id} skill={skill} showLevel={showLevel} />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/20">
          +{remaining} más
        </span>
      )}
    </div>
  )
}
