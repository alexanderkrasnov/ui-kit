import type { Key, ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

import { cx } from '../../_internal/cx'

export type BreadcrumbsItem = {
  key?: Key
  label: ReactNode
  href?: string
  current?: boolean
}

export type BreadcrumbsProps = {
  items: BreadcrumbsItem[]
  className?: string
  ariaLabel?: string
}

export function Breadcrumbs({
  items,
  className = '',
  ariaLabel = 'Breadcrumb',
}: BreadcrumbsProps) {
  const lastIndex = items.length - 1

  return (
    <nav
      aria-label={ariaLabel}
      className={cx('font-sans type-body-xs font-medium', className)}
    >
      <ol className="flex min-w-0 items-center gap-2">
        {items.map(({ key, label, href, current }, index) => {
          const isCurrent = current ?? index === lastIndex
          const itemKey = key ?? href ?? index

          return (
            <li
              key={itemKey}
              className="flex min-w-0 items-center gap-2"
            >
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="min-w-0 truncate text-foreground"
                >
                  {label}
                </span>
              ) : (
                <a
                  className={cx(
                    'min-w-0 truncate rounded-sm text-foreground-tertiary transition-colors duration-[80ms] ease-out',
                    'hover:cursor-pointer hover:text-foreground',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  )}
                  href={href}
                >
                  {label}
                </a>
              )}
              {index < lastIndex ? (
                <ChevronRight
                  className="size-4 shrink-0 text-foreground-tertiary"
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
