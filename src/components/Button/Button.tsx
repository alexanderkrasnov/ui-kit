import type { ButtonHTMLAttributes } from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors ' +
    'rounded-ui-button shadow-ui-sm ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50'

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-ui-primary text-ui-on-primary hover:bg-ui-primary-hover ' +
      'focus-visible:outline-ui-primary',
    secondary:
      'bg-ui-secondary text-ui-on-secondary hover:bg-ui-secondary-hover ' +
      'focus-visible:outline-ui-muted-foreground ' +
      'dark:bg-ui-muted-dark dark:text-ui-muted-foreground-dark dark:hover:bg-ui-secondary-hover-dark ' +
      'dark:focus-visible:outline-ui-muted-foreground-dark',
    ghost:
      'bg-transparent text-ui-ghost-fg shadow-none hover:bg-ui-ghost-hover ' +
      'focus-visible:outline-ui-ghost-fg ' +
      'dark:text-ui-ghost-fg-dark dark:hover:bg-ui-ghost-hover-dark ' +
      'dark:focus-visible:outline-ui-ghost-fg-dark',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  )
}
