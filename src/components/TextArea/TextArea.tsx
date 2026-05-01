import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react'

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'aria-describedby' | 'aria-invalid' | 'className'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  /** Visual style variant */
  variant?: 'default' | 'secondary'
  /** Invalid / error visual state */
  invalid?: boolean
  /** Alias for `invalid`, aligned with the lower-level Input prop */
  error?: boolean
  className?: string
  textareaClassName?: string
  'aria-describedby'?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    className = '',
    textareaClassName = '',
    label,
    description,
    errorMessage,
    id,
    required,
    invalid = false,
    error = false,
    disabled,
    variant = 'default',
    rows = 4,
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const textareaId = id ?? `textarea-${autoId}`
  const descriptionId = description != null ? `${textareaId}-description` : undefined
  const errorId = errorMessage != null ? `${textareaId}-error` : undefined
  const isInvalid = invalid || error
  const helperId = isInvalid ? errorId : descriptionId

  const describedBy =
    [ariaDescribedByProp, helperId].filter(Boolean).join(' ') || undefined

  const labelClass = disabled ? 'text-foreground-tertiary' : 'text-foreground'
  const helperClass = isInvalid ? 'text-danger' : 'text-foreground-tertiary'
  const helperText = isInvalid ? errorMessage : description

  const base =
    'block w-full min-w-0 resize-y rounded-lg border px-3 py-2 text-sm transition-[border-color,box-shadow] ' +
    'font-sans placeholder:text-field-placeholder focus-visible:outline-none ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

  const variants: Record<NonNullable<TextAreaProps['variant']>, string> = {
    default: 'bg-field-background shadow-sm text-field-foreground',
    secondary: 'bg-surface-secondary text-foreground',
  }

  const normal = 'border-transparent focus-visible:border-field-border-focus'
  const invalidClass = 'border-danger focus-visible:border-field-border-invalid-focus'

  return (
    <div className={`inline-flex w-full max-w-sm flex-col gap-1.5 font-sans ${className}`.trim()}>
      {label != null ? (
        <label htmlFor={textareaId} className={`text-sm font-medium leading-snug ${labelClass}`}>
          {label}
          {required ? (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-invalid={isInvalid ? true : undefined}
        aria-describedby={describedBy}
        className={`${base} ${variants[variant]} ${
          isInvalid ? invalidClass : normal
        } ${textareaClassName}`.trim()}
        {...props}
      />
      {helperText != null ? (
        <p
          id={helperId}
          className={`text-xs leading-snug ${helperClass}`}
          aria-live={isInvalid ? 'polite' : undefined}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

TextArea.displayName = 'TextArea'
