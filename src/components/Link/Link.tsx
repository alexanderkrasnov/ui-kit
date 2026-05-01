import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { ArrowUpRight } from 'lucide-react'

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Visual color variant */
  variant?: 'primary' | 'secondary'
  /** Underline visibility behavior */
  underline?: 'always' | 'hover' | 'none'
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    className = '',
    children,
    variant = 'primary',
    underline = 'hover',
    ...props
  },
  ref,
) {
  const base =
    'inline-flex w-fit items-center justify-center gap-1 rounded-sm font-sans text-sm font-medium ' +
    'transition-colors duration-150 ease-in-out ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  const variants: Record<NonNullable<LinkProps['variant']>, string> = {
    primary: 'text-accent hover:text-accent-hover',
    secondary: 'text-foreground hover:text-foreground/80',
  }

  const underlines: Record<NonNullable<LinkProps['underline']>, string> = {
    always: 'underline underline-offset-4 decoration-current',
    hover: 'no-underline hover:underline hover:underline-offset-4',
    none: 'no-underline',
  }

  return (
    <a
      ref={ref}
      className={`${base} ${variants[variant]} ${underlines[underline]} ${className}`.trim()}
      {...props}
    >
      {children}
      <span className="inline-flex size-4 shrink-0 items-center justify-center" aria-hidden>
        <ArrowUpRight className="size-4" />
      </span>
    </a>
  )
})

Link.displayName = 'Link'
