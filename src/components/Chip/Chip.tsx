import {
  createElement,
  isValidElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { type LucideIcon } from 'lucide-react'

export type ChipIcon = LucideIcon | ReactNode

export type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'color'> & {
  children: ReactNode
  color?: 'accent' | 'default' | 'success' | 'warning' | 'danger'
  tone?: 'primary' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  /** By default, icons are expected to come from `lucide-react`. */
  startIcon?: ChipIcon
  /** By default, icons are expected to come from `lucide-react`. */
  endIcon?: ChipIcon
}

const shell =
  'inline-flex max-w-full items-center justify-center rounded-full font-sans font-medium align-middle select-none'

const sizeStyles: Record<
  NonNullable<ChipProps['size']>,
  { shell: string; icon: string; label: string }
> = {
  lg: {
    shell: 'min-h-8 gap-0.5 px-3 py-1 text-sm leading-5',
    icon: 'size-3.5',
    label: 'px-0.5',
  },
  md: {
    shell: 'min-h-6 gap-0.5 px-2 py-0.5 text-xs leading-4',
    icon: 'size-3',
    label: 'px-0.5',
  },
  sm: {
    shell: 'min-h-5 gap-0.5 px-1 text-xs leading-4',
    icon: 'size-3',
    label: 'px-0.5',
  },
}

const toneStyles: Record<NonNullable<ChipProps['tone']>, Record<NonNullable<ChipProps['color']>, string>> = {
  primary: {
    accent: 'bg-accent text-accent-foreground',
    default: 'bg-surface-secondary text-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    danger: 'bg-danger text-danger-foreground',
  },
  soft: {
    accent: 'bg-accent/15 text-accent',
    default: 'bg-surface-secondary text-foreground',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/15 text-danger',
  },
}

function isComponentIcon(icon: ChipIcon): icon is LucideIcon {
  return (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) && !isValidElement(icon)
}

function renderIcon(icon: ChipIcon, sizeClass: string) {
  const content = isValidElement(icon)
    ? icon
    : isComponentIcon(icon)
      ? createElement(icon as ElementType, { strokeWidth: 2 })
      : icon

  return (
    <span className={`${sizeClass} shrink-0 [&_svg]:size-full`.trim()} aria-hidden>
      {content}
    </span>
  )
}

export function Chip({
  children,
  color = 'accent',
  tone = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  className = '',
  ...props
}: ChipProps) {
  const sizeConfig = sizeStyles[size]
  const toneClass = toneStyles[tone][color]

  return (
    <span
      className={`${shell} ${sizeConfig.shell} ${toneClass} ${className}`.trim()}
      {...props}
    >
      {startIcon != null ? renderIcon(startIcon, sizeConfig.icon) : null}
      <span className={`${sizeConfig.label} truncate`.trim()}>{children}</span>
      {endIcon != null ? renderIcon(endIcon, sizeConfig.icon) : null}
    </span>
  )
}
