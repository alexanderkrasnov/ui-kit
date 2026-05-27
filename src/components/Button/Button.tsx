import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../_internal/cx'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
  /** Visual size scale */
  size?: 'small' | 'medium' | 'large'
  /** Square icon-only layout */
  iconOnly?: boolean
  /** Icon before label (any React node, typically an SVG icon) */
  startIcon?: ReactNode
  /** Icon after label */
  endIcon?: ReactNode
}

const iconSlot =
  'inline-flex shrink-0 items-center justify-center [&_svg]:size-[1.125em] [&_svg]:shrink-0'

export function Button({
  variant = 'primary',
  size = 'medium',
  iconOnly = false,
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

  const base = cx(
    'inline-flex items-center justify-center gap-2 font-medium transition-colors ease-in-out duration-150',
    'rounded-lg',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  )

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    small: 'h-8 px-3 text-sm',
    medium: 'h-9 px-4 text-sm',
    large: 'h-10 px-5 text-base',
  }

  const iconSizes: Record<NonNullable<ButtonProps['size']>, string> = {
    small: 'size-8 p-0 text-sm',
    medium: 'size-9 p-0 text-sm',
    large: 'size-10 p-0 text-base',
  }

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: cx(
      'bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover',
      'focus-visible:outline-accent',
    ),
    secondary: cx(
      'bg-surface-secondary text-foreground shadow-none hover:bg-surface-secondary-hover',
      'focus-visible:outline-surface-tertiary',
    ),
    ghost: cx(
      'bg-transparent text-foreground shadow-none hover:bg-surface-secondary-hover',
      'focus-visible:outline-surface-primary',
    ),
    success: cx(
      'bg-success text-accent-foreground shadow-sm hover:bg-success-hover',
      'focus-visible:outline-success',
    ),
    danger: cx(
      'bg-danger text-accent-foreground shadow-sm hover:bg-danger-hover',
      'focus-visible:outline-danger',
    ),
  }

  return (
    <button
      type={type}
      className={cx(base, iconOnly ? iconSizes[size] : sizes[size], variants[variant], className)}
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
