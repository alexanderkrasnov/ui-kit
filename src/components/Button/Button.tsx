import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Icon before label (any React node, typically an SVG icon) */
  startIcon?: ReactNode
  /** Icon after label */
  endIcon?: ReactNode
}

const iconSlot =
  'inline-flex shrink-0 items-center justify-center [&_svg]:size-[1.125em] [&_svg]:shrink-0'

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  startIcon,
  endIcon,
  ...props
}: ButtonProps) {
  const hasText =
    children != null &&
    !(typeof children === 'string' && children.trim() === '')
  const hideIconFromA11y = Boolean(hasText)

  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors ' +
    'rounded-lg shadow-sm ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50'

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-accent text-accent-foreground hover:bg-accent-hover ' +
      'focus-visible:outline-focus',
    secondary:
      'bg-default text-default-foreground hover:bg-default-hover ' +
      'focus-visible:outline-focus',
    ghost:
      'bg-transparent text-foreground shadow-none hover:bg-default-hover ' +
      'focus-visible:outline-focus',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {startIcon != null ? (
        <span
          className={iconSlot}
          aria-hidden={hideIconFromA11y ? true : undefined}
        >
          {startIcon}
        </span>
      ) : null}
      {children}
      {endIcon != null ? (
        <span
          className={iconSlot}
          aria-hidden={hideIconFromA11y ? true : undefined}
        >
          {endIcon}
        </span>
      ) : null}
    </button>
  )
}
