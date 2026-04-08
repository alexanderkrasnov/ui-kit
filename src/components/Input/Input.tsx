import { forwardRef, type InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Invalid / error visual state (border + focus ring) */
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', error = false, ...props },
  ref,
) {
  const base =
    'block w-full min-w-0 rounded-ui-input border px-3 py-2 text-sm transition-shadow ' +
    'font-ui-sans text-ui-foreground shadow-ui-sm ' +
    'placeholder:text-ui-muted-foreground ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
    'dark:bg-ui-background-dark dark:text-ui-foreground-dark dark:placeholder:text-ui-muted-foreground-dark ' +
    'dark:focus-visible:ring-offset-ui-background-dark'

  const normal =
    'border-ui-border bg-ui-background ' +
    'focus-visible:border-ui-primary focus-visible:ring-ui-primary ' +
    'focus-visible:ring-offset-ui-background ' +
    'dark:border-ui-border-dark'

  const invalid =
    'border-ui-destructive bg-ui-background ' +
    'focus-visible:border-ui-destructive focus-visible:ring-ui-destructive-ring ' +
    'focus-visible:ring-offset-ui-background ' +
    'dark:border-ui-destructive dark:focus-visible:ring-ui-destructive-ring'

  return (
    <input
      ref={ref}
      aria-invalid={error ? true : undefined}
      className={`${base} ${error ? invalid : normal} ${className}`.trim()}
      {...props}
    />
  )
})

Input.displayName = 'Input'
