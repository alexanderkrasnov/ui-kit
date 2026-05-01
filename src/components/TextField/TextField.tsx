import { forwardRef, useId, type ReactNode } from 'react'

import { Input, type InputProps } from '../Input'

export type TextFieldProps = Omit<
  InputProps,
  'aria-describedby' | 'aria-invalid' | 'className' | 'error'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  /** Invalid / error visual state */
  invalid?: boolean
  /** Alias for `invalid`, aligned with the lower-level `Input` prop */
  error?: boolean
  className?: string
  inputClassName?: string
  'aria-describedby'?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    className = '',
    inputClassName = '',
    label,
    description,
    errorMessage,
    id,
    required,
    invalid = false,
    error = false,
    disabled,
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `textfield-${autoId}`
  const descriptionId = description != null ? `${inputId}-description` : undefined
  const errorId = errorMessage != null ? `${inputId}-error` : undefined
  const isInvalid = invalid || error
  const helperId = isInvalid ? errorId : descriptionId

  const describedBy =
    [ariaDescribedByProp, helperId].filter(Boolean).join(' ') || undefined

  const labelClass = disabled ? 'text-foreground-tertiary' : 'text-foreground'
  const helperClass = isInvalid ? 'text-danger' : 'text-foreground-tertiary'
  const helperText = isInvalid ? errorMessage : description

  return (
    <div className={`inline-flex w-full max-w-sm flex-col gap-1.5 font-sans ${className}`.trim()}>
      {label != null ? (
        <label htmlFor={inputId} className={`text-sm font-medium leading-snug ${labelClass}`}>
          {label}
          {required ? (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <Input
        ref={ref}
        id={inputId}
        required={required}
        disabled={disabled}
        error={isInvalid}
        aria-invalid={isInvalid ? true : undefined}
        aria-describedby={describedBy}
        className={inputClassName}
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

TextField.displayName = 'TextField'
