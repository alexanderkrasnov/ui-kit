import { Check } from 'lucide-react'
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: ReactNode
  /** Текст под строкой чекбокса; при `error` — цвет `danger`, как у рамки */
  helperText?: ReactNode
  /** Как у `Input`: `default` — field, `secondary` — surface-secondary */
  variant?: 'default' | 'secondary'
  /** Invalid / error (как у `Input`) */
  error?: boolean
}

const peerShell =
  'peer relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-sm ' +
  'overflow-hidden font-sans ' +
  'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ' +
  'peer-focus-visible:ring-offset-[var(--color-background)] ' +
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50'

const variantBox: Record<
  NonNullable<CheckboxProps['variant']>,
  { normal: string; error: string }
> = {
  default: {
    normal:
      `${peerShell} shadow-sm bg-field-background peer-checked:bg-accent peer-checked:shadow-none ` +
      'peer-focus-visible:ring-field-border-focus/35',
    error:
      `${peerShell} shadow-sm bg-field-background peer-checked:bg-accent peer-checked:shadow-none ` +
      'peer-focus-visible:ring-field-border-focus/35',
  },
  secondary: {
    normal:
      `${peerShell} bg-surface-secondary peer-checked:bg-accent ` +
      'peer-focus-visible:ring-field-border-focus/35',
    error:
      `${peerShell} bg-surface-secondary peer-checked:bg-accent ` +
      'peer-focus-visible:ring-field-border-focus/35',
  },
}

/** Минимальный checkmark без анимации */
const checkWrapClass =
  'pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 ' +
  'group-has-[input:checked]:opacity-100'

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    className = '',
    label,
    helperText,
    id,
    error = false,
    variant = 'default',
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `checkbox-${autoId}`
  const helperId = `checkbox-helper-${autoId}`

  const boxClass = (error ? variantBox[variant].error : variantBox[variant].normal).trim()

  const describedBy =
    [ariaDescribedByProp, helperText != null ? helperId : undefined].filter(Boolean).join(' ') ||
    undefined
  const isDisabled = Boolean(props.disabled)

  /** В checked-состоянии error должен выглядеть как default */
  const checkStroke = 'var(--color-accent-foreground)'

  const control = (
    <>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={`peer sr-only ${className}`.trim()}
        {...props}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={describedBy}
        aria-label={label == null ? (props['aria-label'] as string | undefined) ?? 'Checkbox' : undefined}
      />
      <span className={boxClass} aria-hidden>
        <span className={checkWrapClass}>
          <Check
            strokeWidth={4}
            color={checkStroke}
            className="size-2.5 shrink-0"
            aria-hidden
          />
        </span>
      </span>
    </>
  )

  const labelTextClass = isDisabled
    ? 'text-foreground-secondary'
    : error
      ? 'text-danger group-has-[input:checked]:text-foreground'
      : 'text-foreground'
  const helperClass = isDisabled
    ? 'text-sm text-foreground-secondary'
    : error
      ? 'text-sm text-danger'
      : 'text-sm text-foreground-tertiary'

  const row = (
    <>
      <label
        htmlFor={inputId}
        className="group inline-flex cursor-pointer items-center gap-2 select-none"
      >
        {control}
        {label != null ? (
          <span className={`text-sm font-sans leading-snug ${labelTextClass}`}>{label}</span>
        ) : null}
      </label>
      {helperText != null ? (
        <div
          id={helperId}
          className={`${helperClass} font-sans ${label != null ? 'ml-6' : ''}`.trim()}
          aria-live={error ? 'polite' : undefined}
        >
          {helperText}
        </div>
      ) : null}
    </>
  )

  if (label != null || helperText != null) {
    return <div className="inline-flex flex-col gap-1">{row}</div>
  }

  return <span className="group inline-flex items-center">{control}</span>
})

Checkbox.displayName = 'Checkbox'
