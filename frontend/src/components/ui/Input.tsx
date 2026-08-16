import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

// ─── Text Input ───────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?:  string
  icon?:  string
  iconRight?: string
  variant?: 'underline' | 'filled'
  /** Show a "n/maxLength" character counter — requires maxLength to be set */
  showCount?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, variant = 'underline', showCount, maxLength, className, id, value, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const count = typeof value === 'string' ? value.length : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {(label || (showCount && maxLength)) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {label}
              </label>
            )}
            {showCount && maxLength && (
              <span className={cn('text-[11px] tabular-nums', count !== undefined && count >= maxLength ? 'text-error' : 'text-outline')}>
                {count ?? 0}/{maxLength}
              </span>
            )}
          </div>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined absolute left-0 text-[20px] text-outline pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            maxLength={maxLength}
            value={value}
            className={cn(
              'w-full bg-transparent text-on-surface placeholder:text-outline transition-all duration-200 outline-none',
              variant === 'underline'
                ? 'border-b border-outline-variant pb-2 focus:border-primary focus:border-b-2'
                : 'bg-surface-container-low px-4 py-2.5 rounded-lg border border-transparent focus:border-primary',
              icon    && 'pl-7',
              iconRight && 'pr-7',
              error   && variant === 'underline' && 'border-error focus:border-error',
              error   && variant === 'filled'    && 'border-error focus:border-error',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="material-symbols-outlined absolute right-0 text-[20px] text-outline pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        {hint && !error && <p className="text-xs text-outline">{hint}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?:  string
  /** Show a "n/maxLength" character counter — requires maxLength to be set */
  showCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount, maxLength, className, id, value, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const count = typeof value === 'string' ? value.length : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {(label || (showCount && maxLength)) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {label}
              </label>
            )}
            {showCount && maxLength && (
              <span className={cn('text-[11px] tabular-nums', count !== undefined && count >= maxLength ? 'text-error' : 'text-outline')}>
                {count ?? 0}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          className={cn(
            'w-full bg-surface-container-low text-on-surface placeholder:text-outline rounded-lg px-4 py-3 border border-transparent focus:border-primary outline-none transition-all duration-200 resize-none',
            error && 'border-error',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
        {hint && !error && <p className="text-xs text-outline">{hint}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

// ─── Password Input (with toggle) ─────────────────────────────────────────────
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'iconRight'>>(
  (props, ref) => {
    const [show, setShow] = useState(false)
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-0 bottom-2.5 text-outline hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
