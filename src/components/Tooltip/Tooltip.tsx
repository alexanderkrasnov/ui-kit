import { type ButtonHTMLAttributes, type ReactNode, useId } from 'react'
import { Info } from 'lucide-react'

import { cx } from '../_internal/cx'

export type TooltipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode
  iconLabel?: string
}

const defaultContent =
  'Legal Entity Identifier is a 20-character alphanumeric code (ISO 17442) that uniquely identifies legal entities.'

export function Tooltip({
  children = defaultContent,
  iconLabel = 'Show additional information',
  className = '',
  type = 'button',
  ...props
}: TooltipProps) {
  const tooltipId = useId()

  return (
    <span className={cx('group relative inline-flex font-sans', className)}>
      <button
        type={type}
        aria-label={iconLabel}
        aria-describedby={tooltipId}
        className="inline-flex size-6 items-center justify-center rounded-md bg-transparent text-foreground-secondary hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        {...props}
      >
        <Info className="size-4 shrink-0" aria-hidden />
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-1 w-max max-w-[250px] -translate-x-1/2 opacity-0 transition-opacity duration-50 ease-out group-hover:opacity-100 group-hover:duration-150 group-focus-within:opacity-100 group-focus-within:duration-150"
      >
        <span className="block rounded-lg bg-black px-3 py-2 text-xs font-semibold leading-4 text-white shadow-sm dark:bg-surface-tertiary group-hover:animate-[tooltip-enter_150ms_ease-out] group-focus-within:animate-[tooltip-enter_150ms_ease-out]">
          {children}
        </span>
      </span>
    </span>
  )
}
