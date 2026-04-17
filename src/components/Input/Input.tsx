import { forwardRef, type InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Visual style variant */
  variant?: 'default' | 'secondary'
  /** Invalid / error visual state (border усиливается при фокусе) */
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', error = false, variant = 'default', ...props },
  ref,
) {
  const base =
    'block w-full min-w-0 rounded-md border px-3 py-2 text-sm transition-[border-color,box-shadow] ' +
    'font-sans  ' +
    'placeholder:text-field-placeholder ' +
    'focus-visible:outline-none ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

  const variants: Record<NonNullable<InputProps['variant']>, string> = {
    default: 'bg-field-background shadow-sm text-field-foreground',
    secondary: 'bg-surface-secondary text-foreground',
  }

  const normal = 'border-transparent focus-visible:border-field-border-focus'

  const invalid = 'border-danger focus-visible:border-field-border-invalid-focus'

  return (
    <input
      ref={ref}
      aria-invalid={error ? true : undefined}
      className={`${base} ${variants[variant]} ${error ? invalid : normal} ${className}`.trim()}
      {...props}
    />
  )
})

Input.displayName = 'Input'
