import { forwardRef, type ButtonHTMLAttributes } from 'react'

export type CloseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Visual size scale */
  size?: 'sm' | 'md'
  /** Visual style variant */
  variant?: 'default' | 'ghost'
}

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        clipRule="evenodd"
        d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(function CloseButton(
  {
    size = 'md',
    variant = 'default',
    className = '',
    type = 'button',
    'aria-label': ariaLabel = 'Close',
    ...props
  },
  ref,
) {
  const sizes: Record<NonNullable<CloseButtonProps['size']>, {
    root: string
    circle: string
    icon: string
  }> = {
    sm: {
      root: 'size-8',
      circle: 'size-4 rounded-full',
      icon: 'size-3',
    },
    md: {
      root: 'size-6',
      circle: 'size-6 rounded-xl',
      icon: 'size-4',
    },
  }

  const selectedSize = sizes[size]
  const variants: Record<NonNullable<CloseButtonProps['variant']>, string> = {
    default:
      'bg-surface-primary text-foreground-secondary group-hover:bg-surface-primary group-hover:text-foreground',
    ghost:
      'bg-transparent text-foreground-tertiary group-hover:bg-transparent group-hover:text-foreground',
  }

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={(
        'group inline-flex shrink-0 items-center justify-center border border-transparent bg-transparent ' +
        'font-sans transition-colors duration-150 ease-in-out ' +
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
        'disabled:pointer-events-none disabled:opacity-50 ' +
        `${selectedSize.root} ${className}`
      ).trim()}
      {...props}
    >
      <span
        className={(
          'inline-flex shrink-0 items-center justify-center transition-colors duration-150 ease-in-out ' +
          variants[variant] +
          ' ' +
          selectedSize.circle
        ).trim()}
      >
        <CloseIcon className={selectedSize.icon} />
      </span>
    </button>
  )
})

CloseButton.displayName = 'CloseButton'
