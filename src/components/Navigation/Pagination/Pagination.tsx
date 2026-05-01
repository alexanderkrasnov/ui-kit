import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationRangeItem = number | 'ellipsis'

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  total: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  size?: 'sm' | 'md'
  summary?: ReactNode
  listClassName?: string
  itemClassName?: string
  summaryClassName?: string
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getSafeTotal(total: number) {
  return Math.max(1, Math.floor(total))
}

function clampPage(page: number, total: number) {
  const safeTotal = getSafeTotal(total)
  return Math.min(Math.max(1, Math.floor(page)), safeTotal)
}

function getPaginationRange(total: number): PaginationRangeItem[] {
  const safeTotal = getSafeTotal(total)
  const visibleStartPages = Array.from(
    { length: Math.min(3, safeTotal) },
    (_, index) => index + 1,
  )

  if (safeTotal <= 4) {
    return visibleStartPages
  }

  return [...visibleStartPages, 'ellipsis', safeTotal]
}

export function Pagination({
  total,
  page,
  defaultPage = 1,
  onPageChange,
  size = 'md',
  summary,
  className = '',
  listClassName = '',
  itemClassName = '',
  summaryClassName = '',
  'aria-label': ariaLabel = 'Pagination',
  ...props
}: PaginationProps) {
  const safeTotal = getSafeTotal(total)
  const [uncontrolledPage, setUncontrolledPage] = useState(() =>
    clampPage(defaultPage, safeTotal),
  )
  const range = getPaginationRange(safeTotal)
  const rangePages = range.filter((item): item is number => typeof item === 'number')
  const currentPage = rangePages.includes(page ?? uncontrolledPage)
    ? page ?? uncontrolledPage
    : rangePages[0]
  const currentPageIndex = Math.max(
    0,
    rangePages.findIndex((item) => item === currentPage),
  )
  const isFirstPage = currentPageIndex === 0
  const isLastPage = currentPageIndex === rangePages.length - 1

  const sizes: Record<NonNullable<PaginationProps['size']>, {
    page: string
    control: string
    ellipsis: string
  }> = {
    sm: {
      page: 'size-8 text-sm',
      control: 'h-8 px-3 text-sm',
      ellipsis: 'size-8 text-sm',
    },
    md: {
      page: 'size-9 text-sm',
      control: 'h-9 px-4 text-sm',
      ellipsis: 'size-9 text-sm',
    },
  }

  const selectedSize = sizes[size]
  const baseButton =
    'inline-flex shrink-0 items-center justify-center rounded-lg font-sans font-medium ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
    'disabled:pointer-events-none disabled:opacity-50'
  const controlButton =
    'gap-2 bg-surface-primary text-foreground shadow-sm hover:text-foreground/80'
  const pageButton =
    'bg-transparent text-foreground-secondary hover:bg-surface-secondary-hover hover:text-foreground'
  const activePageButton =
    'bg-surface-secondary-hover text-foreground'

  function selectPage(nextPage: number) {
    const clampedPage = rangePages.includes(nextPage) ? nextPage : currentPage

    if (clampedPage === currentPage) {
      return
    }

    if (page == null) {
      setUncontrolledPage(clampedPage)
    }

    onPageChange?.(clampedPage)
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={cx('inline-flex items-center gap-4 font-sans', className)}
      {...props}
    >
      {summary != null ? (
        <span className={cx('text-sm font-medium text-foreground-secondary', summaryClassName)}>
          {summary}
        </span>
      ) : null}
      <ul className={cx('inline-flex items-center gap-2', listClassName)}>
        <li>
          <button
            type="button"
            aria-label="Go to previous page"
            disabled={isFirstPage}
            className={cx(baseButton, controlButton, selectedSize.control, 'pl-2 pr-3', itemClassName)}
            onClick={() => selectPage(rangePages[currentPageIndex - 1])}
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            Prev
          </button>
        </li>
        {range.map((item) => {
          if (typeof item !== 'number') {
            return (
              <li key={item} aria-hidden="true">
                <span
                  className={cx(
                    'inline-flex items-center justify-center rounded-lg text-foreground-tertiary',
                    selectedSize.ellipsis,
                  )}
                >
                  ...
                </span>
              </li>
            )
          }

          const isCurrent = item === currentPage

          return (
            <li key={item}>
              <button
                type="button"
                aria-label={`Go to page ${item}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={cx(
                  baseButton,
                  selectedSize.page,
                  isCurrent ? activePageButton : pageButton,
                  itemClassName,
                )}
                onClick={() => selectPage(item)}
              >
                {item}
              </button>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            aria-label="Go to next page"
            disabled={isLastPage}
            className={cx(baseButton, controlButton, selectedSize.control, 'pl-3 pr-2', itemClassName)}
            onClick={() => selectPage(rangePages[currentPageIndex + 1])}
          >
            Next
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  )
}
