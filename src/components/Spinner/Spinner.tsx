import type { HTMLAttributes } from 'react'

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  'aria-label'?: string
}

const sizeStyles: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-10',
}

export function Spinner({
  size = 'md',
  className = '',
  'aria-label': ariaLabel = 'Loading',
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={`inline-flex shrink-0 items-center justify-center text-accent ${sizeStyles[size]} ${className}`.trim()}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-full animate-spin"
        aria-hidden
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.18"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
