import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { cx } from '../_internal/cx'
import { useRadioGroup } from './RadioGroupContext'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'> & {
  value: string
  label?: ReactNode
  /** Текст под строкой (вторичный цвет текста) */
  helperText?: ReactNode
  /** Как у `Checkbox`: `default` — field, `secondary` — surface-secondary */
  variant?: 'default' | 'secondary'
}

/** Минимальный radio без анимаций */
const shell = cx(
  'relative inline-flex size-4 shrink-0 items-center justify-center rounded-full font-sans',
  'ring-2 ring-transparent ring-offset-2 ring-offset-[var(--color-background)]',
  'group-has-[input:focus-visible]:ring-accent/35',
  'group-has-[input:disabled]:opacity-50',
)

const variantRing: Record<NonNullable<RadioProps['variant']>, string> = {
  default: cx(
    shell,
    'shadow-sm bg-field-background',
    'group-has-[input:checked]:bg-accent group-has-[input:checked]:shadow-none',
  ),
  secondary: cx(shell, 'bg-surface-secondary', 'group-has-[input:checked]:bg-accent'),
}

const dotIndicatorWrapClass = cx(
  'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0',
  'group-has-[input:checked]:opacity-100',
)

const dotFill = 'block size-2 shrink-0 rounded-full bg-[var(--color-accent-foreground)]'

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    className = '',
    label,
    value,
    id,
    helperText,
    variant = 'default',
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const { name, value: groupValue, onChange } = useRadioGroup()
  const autoId = useId()
  const inputId = id ?? `radio-${name}-${value}-${autoId}`
  const helperId = `radio-helper-${autoId}`

  const ringClass = variantRing[variant]

  const describedBy =
    [ariaDescribedByProp, helperText != null ? helperId : undefined].filter(Boolean).join(' ') ||
    undefined
  const isDisabled = Boolean(props.disabled)

  const control = (
    <>
      <input
        ref={ref}
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={groupValue === value}
        onChange={() => onChange(value)}
        className={cx('sr-only', className)}
        aria-describedby={describedBy}
        aria-label={label == null ? (props['aria-label'] as string | undefined) ?? value : undefined}
        {...props}
      />
      <span className={ringClass} aria-hidden>
        <span className={dotIndicatorWrapClass}>
          <span className={dotFill} />
        </span>
      </span>
    </>
  )

  const labelTextClass = 'text-foreground group-has-[input:disabled]:text-foreground-tertiary'
  const helperClass = isDisabled ? 'text-sm text-foreground-tertiary' : 'text-sm text-foreground-tertiary'

  const row = (
    <>
      <label
        htmlFor={inputId}
        className="group inline-flex cursor-pointer items-center gap-2 select-none group-has-[input:disabled]:cursor-not-allowed"
      >
        {control}
        {label != null ? (
          <span className={cx('text-sm font-sans leading-snug', labelTextClass)}>{label}</span>
        ) : null}
      </label>
      {helperText != null ? (
        <div id={helperId} className={cx(helperClass, 'font-sans', label != null && 'ml-6')}>
          {helperText}
        </div>
      ) : null}
    </>
  )

  if (label != null || helperText != null) {
    return <div className="inline-flex flex-col gap-1">{row}</div>
  }

  return (
    <span className="group inline-flex items-center group-has-[input:disabled]:cursor-not-allowed">
      {control}
    </span>
  )
})

Radio.displayName = 'Radio'
