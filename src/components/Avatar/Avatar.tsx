import type { HTMLAttributes } from 'react'

import { cx } from '../_internal/cx'

function UserPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

const shellStyle = cx(
  'inline-flex items-center justify-center rounded-full font-medium',
  'bg-surface-secondary text-foreground',
)

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, 'size'> & {
  /** Two letters or short initials */
  fallback?: string
  /** Render icon instead of initials */
  icon?: boolean
  size?: 'sm' | 'md'
  'aria-label'?: string
}

const sizes = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
} as const

export function Avatar({
  fallback,
  icon = false,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...props
}: AvatarProps) {
  const initials = fallback?.trim().slice(0, 2).toUpperCase()
  const a11yName = ariaLabel ?? (initials ? `Avatar ${initials}` : 'Avatar icon')

  const shell = cx(shellStyle, sizes[size], className)

  if (initials && !icon) {
    return (
      <span className={shell} role="img" aria-label={a11yName} {...props}>
        {initials}
      </span>
    )
  }

  return (
    <span className={shell} role="img" aria-label={a11yName} {...props}>
      <UserPlaceholder className="size-[55%] opacity-80" />
    </span>
  )
}
