import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { cx } from '../../_internal/cx'

export type TabsItem = {
  value: string
  label: ReactNode
  disabled?: boolean
}

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & {
  items: TabsItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: 'default' | 'secondary'
  size?: 'small' | 'medium'
  listClassName?: string
  tabClassName?: string
}

type IndicatorState = {
  width: number
  height: number
  x: number
  y: number
  ready: boolean
}

function getInitialValue(items: TabsItem[], defaultValue?: string) {
  if (defaultValue != null) {
    return defaultValue
  }

  return items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? ''
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'default',
  size = 'medium',
  className = '',
  listClassName = '',
  tabClassName = '',
  'aria-label': ariaLabel = 'Tabs',
  ...props
}: TabsProps) {
  const autoId = useId()
  const listRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    getInitialValue(items, defaultValue),
  )
  const [indicator, setIndicator] = useState<IndicatorState>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    ready: false,
  })

  const activeValue = value ?? uncontrolledValue

  const sizes: Record<NonNullable<TabsProps['size']>, string> = {
    small: 'h-8 px-3 text-sm',
    medium: 'h-9 px-4 text-sm',
  }

  const listClasses: Record<NonNullable<TabsProps['variant']>, string> = {
    default: 'rounded-xl bg-surface-secondary p-1',
    secondary: 'border-b border-border',
  }

  const tabBase =
    'relative z-10 inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg ' +
    'font-sans font-medium transition-colors duration-[80ms] ease-out ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
    'disabled:pointer-events-none disabled:opacity-50'

  const tabVariants: Record<NonNullable<TabsProps['variant']>, string> = {
    default: 'text-foreground-secondary hover:text-foreground aria-selected:text-foreground',
    secondary:
      'rounded-none text-foreground-secondary hover:text-foreground aria-selected:text-foreground',
  }

  function selectTab(nextValue: string, shouldFocus = false) {
    const nextItem = items.find((item) => item.value === nextValue)

    if (nextItem == null || nextItem.disabled) {
      return
    }

    if (value == null) {
      setUncontrolledValue(nextValue)
    }

    onValueChange?.(nextValue)

    if (shouldFocus) {
      window.requestAnimationFrame(() => {
        tabRefs.current[nextValue]?.focus()
      })
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const enabledItems = items.filter((item) => !item.disabled)

    if (enabledItems.length === 0) {
      return
    }

    const currentIndex = enabledItems.findIndex((item) => item.value === activeValue)
    const safeIndex = currentIndex >= 0 ? currentIndex : 0
    let nextIndex = safeIndex

    if (event.key === 'ArrowRight') {
      nextIndex = (safeIndex + 1) % enabledItems.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (safeIndex - 1 + enabledItems.length) % enabledItems.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = enabledItems.length - 1
    } else {
      return
    }

    event.preventDefault()
    selectTab(enabledItems[nextIndex].value, true)
  }

  useEffect(() => {
    function updateIndicator() {
      const list = listRef.current
      const activeTab = tabRefs.current[activeValue]

      if (list == null || activeTab == null) {
        setIndicator((current) => ({ ...current, ready: false }))
        return
      }

      setIndicator({
        width: activeTab.offsetWidth,
        height: activeTab.offsetHeight,
        x: activeTab.offsetLeft,
        y: activeTab.offsetTop,
        ready: true,
      })
    }

    updateIndicator()

    const list = listRef.current
    const activeTab = tabRefs.current[activeValue]

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateIndicator)
      return () => window.removeEventListener('resize', updateIndicator)
    }

    const observer = new ResizeObserver(updateIndicator)

    if (list != null) {
      observer.observe(list)
    }

    if (activeTab != null) {
      observer.observe(activeTab)
    }

    window.addEventListener('resize', updateIndicator)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeValue, items, size, variant])

  const indicatorStyle = {
    width: indicator.width,
    height: variant === 'default' ? indicator.height : 1,
    transform:
      variant === 'default'
        ? `translate3d(${indicator.x}px, ${indicator.y}px, 0)`
        : `translate3d(${indicator.x}px, 0, 0)`,
    opacity: indicator.ready ? 1 : 0,
  } satisfies CSSProperties

  return (
    <div className={cx('w-fit font-sans', className)} {...props}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={cx(
          'relative inline-flex w-fit items-center gap-1',
          listClasses[variant],
          listClassName,
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'pointer-events-none absolute left-0 transition-[transform,width,height,opacity] duration-[80ms] ease-out',
            variant === 'default'
              ? 'top-0 rounded-lg bg-tabs-active-background shadow-sm'
              : '-bottom-px rounded-full bg-accent',
          )}
          style={indicatorStyle}
        />
        {items.map((item) => {
          const selected = item.value === activeValue
          const currentTabId = `${autoId}-tab-${item.value}`

          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[item.value] = node
              }}
              id={currentTabId}
              role="tab"
              type="button"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={cx(tabBase, sizes[size], tabVariants[variant], tabClassName)}
              onClick={() => selectTab(item.value)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
