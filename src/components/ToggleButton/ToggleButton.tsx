import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ToggleButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> & {
  /** Visual style variant */
  variant?: 'primary' | 'secondary'
  /** Pressed state */
  pressed?: boolean
  /** Icon before label */
  startIcon?: ReactNode
  /** Icon after label */
  endIcon?: ReactNode
}

const iconSlot =
  'inline-flex shrink-0 items-center justify-center [&_svg]:size-[1.125em] [&_svg]:shrink-0'

export function ToggleButton({
  variant = 'primary',
  pressed = false,
  className = '',
  type = 'button',
  children,
  startIcon,
  endIcon,
  ...props
}: ToggleButtonProps) {
  const hasText =
    children != null &&
    !(typeof children === 'string' && children.trim() === '')
  const hideIconFromA11y = Boolean(hasText)

  const base =
    'inline-flex h-8 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium ' +
    'font-sans transition-colors ease-in-out duration-150 ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
    'disabled:pointer-events-none disabled:opacity-50'

  const variants: Record<NonNullable<ToggleButtonProps['variant']>, string> = {
    primary:
      'bg-transparent text-foreground shadow-none hover:bg-surface-secondary-hover ' +
      'aria-pressed:bg-accent/15 aria-pressed:hover:bg-accent/20 aria-pressed:text-accent aria-pressed:shadow-none',
    secondary:
      'bg-surface-secondary text-foreground shadow-none hover:bg-surface-tertiary ' +
      'aria-pressed:bg-accent/15 aria-pressed:hover:bg-accent/20 aria-pressed:text-accent',
  }

  return (
    <button
      type={type}
      aria-pressed={pressed}
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
