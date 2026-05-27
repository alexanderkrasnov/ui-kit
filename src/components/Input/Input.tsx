import { forwardRef, type InputHTMLAttributes } from 'react'

import { cx } from '../_internal/cx'
import { getFieldBorderClass, getFieldSurfaceClass, type FieldVariant } from '../_internal/fieldStyles'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Visual style variant */
  variant?: FieldVariant
  /** Invalid / error visual state (border усиливается при фокусе) */
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', error = false, variant = 'default', ...props },
  ref,
) {
  const base = cx(
    'block w-full min-w-0 rounded-lg border px-3 py-2 text-sm transition-[border-color,box-shadow]',
    'font-sans',
    'placeholder:text-field-placeholder',
    'focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  )

  return (
    <input
      ref={ref}
      aria-invalid={error ? true : undefined}
      className={cx(base, getFieldSurfaceClass(variant), getFieldBorderClass(error), className)}
      {...props}
    />
  )
})

Input.displayName = 'Input'
