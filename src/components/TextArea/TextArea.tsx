import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react'

import { cx } from '../_internal/cx'
import {
  getFieldBorderClass,
  getFieldContainerClass,
  getFieldDescribedBy,
  getFieldHelperClass,
  getFieldLabelClass,
  getFieldSurfaceClass,
  type FieldVariant,
} from '../_internal/fieldStyles'

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'aria-describedby' | 'aria-invalid' | 'className'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  /** Visual style variant */
  variant?: FieldVariant
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

  const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
  const labelClass = getFieldLabelClass(disabled)
  const helperClass = getFieldHelperClass(isInvalid)
  const helperText = isInvalid ? errorMessage : description

  const base = cx(
    'block w-full min-w-0 resize-y rounded-lg border px-3 py-2 text-sm transition-[border-color,box-shadow]',
    'font-sans placeholder:text-field-placeholder focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  )

  return (
    <div className={getFieldContainerClass(className)}>
      {label != null ? (
        <label htmlFor={textareaId} className={cx('text-sm font-medium leading-snug', labelClass)}>
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
        className={cx(base, getFieldSurfaceClass(variant), getFieldBorderClass(isInvalid), textareaClassName)}
        {...props}
      />
      {helperText != null ? (
        <p
          id={helperId}
          className={cx('text-xs leading-snug', helperClass)}
          aria-live={isInvalid ? 'polite' : undefined}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

TextArea.displayName = 'TextArea'
