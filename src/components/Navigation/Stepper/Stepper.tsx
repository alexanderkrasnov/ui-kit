import {
  createElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type Key,
  type ReactNode,
} from 'react'
import { Check, type LucideIcon } from 'lucide-react'

import { cx } from '../../_internal/cx'

export type StepperIcon = LucideIcon | ReactNode

export type StepperItem = {
  key?: Key
  label: ReactNode
  description?: ReactNode
  icon?: StepperIcon
  disabled?: boolean
}

export type StepperProps = Omit<HTMLAttributes<HTMLOListElement>, 'onChange'> & {
  items: StepperItem[]
  currentStep?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  listClassName?: string
  itemClassName?: string
}

type StepStatus = 'complete' | 'active' | 'inactive'

const sizeStyles: Record<
  NonNullable<StepperProps['size']>,
  {
    indicator: string
    icon: string
    contentGap: string
    contentMinHeight: string
    horizontalItem: string
    horizontalSeparator: string
    verticalItemGap: string
  }
> = {
  sm: {
    indicator: 'size-[22px] text-[11px] leading-none',
    icon: 'size-3',
    contentGap: 'gap-2',
    contentMinHeight: 'min-h-[22px]',
    horizontalItem: 'min-w-[104px]',
    horizontalSeparator: 'left-[calc(50%+19px)] right-[calc(-50%+19px)] top-[10px]',
    verticalItemGap: 'pb-3',
  },
  md: {
    indicator: 'size-[28px] text-xs leading-none',
    icon: 'size-3.5',
    contentGap: 'gap-2.5',
    contentMinHeight: 'min-h-[28px]',
    horizontalItem: 'min-w-[128px]',
    horizontalSeparator: 'left-[calc(50%+22px)] right-[calc(-50%+22px)] top-[13px]',
    verticalItemGap: 'pb-4',
  },
  lg: {
    indicator: 'size-[36px] text-sm leading-none',
    icon: 'size-4',
    contentGap: 'gap-3',
    contentMinHeight: 'min-h-[36px]',
    horizontalItem: 'min-w-[152px]',
    horizontalSeparator: 'left-[calc(50%+26px)] right-[calc(-50%+26px)] top-[17px]',
    verticalItemGap: 'pb-6',
  },
}

type VerticalConnectorStyle = {
  height: number
  left: number
  top: number
}

const indicatorStatusStyles: Record<StepStatus, string> = {
  complete: 'border-accent bg-surface-primary text-accent',
  active: 'border-foreground bg-foreground text-background',
  inactive: 'border-border bg-transparent text-foreground-tertiary',
}

function isComponentIcon(icon: StepperIcon): icon is LucideIcon {
  return (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) && !isValidElement(icon)
}

function renderIcon(icon: StepperIcon, sizeClass: string) {
  const content = isValidElement(icon)
    ? icon
    : isComponentIcon(icon)
      ? createElement(icon as ElementType, { strokeWidth: 2 })
      : icon

  return (
    <span className={cx(sizeClass, 'shrink-0 [&_svg]:size-full')} aria-hidden>
      {content}
    </span>
  )
}

function clampStep(step: number, itemsLength: number) {
  if (itemsLength === 0) {
    return 0
  }

  return Math.min(Math.max(0, Math.floor(step)), itemsLength - 1)
}

export function Stepper({
  items,
  currentStep,
  defaultStep = 0,
  onStepChange,
  orientation = 'horizontal',
  size = 'md',
  className = '',
  listClassName = '',
  itemClassName = '',
  'aria-label': ariaLabel = 'Steps',
  ...props
}: StepperProps) {
  const [uncontrolledStep, setUncontrolledStep] = useState(() =>
    clampStep(defaultStep, items.length),
  )
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const indicatorRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [verticalConnectorStyles, setVerticalConnectorStyles] = useState<
    Record<number, VerticalConnectorStyle>
  >({})
  const selectedSize = sizeStyles[size]
  const activeStep = clampStep(currentStep ?? uncontrolledStep, items.length)
  const isInteractive = onStepChange != null

  useEffect(() => {
    if (orientation !== 'vertical') {
      return
    }

    function updateVerticalConnectors() {
      const nextStyles: Record<number, VerticalConnectorStyle> = {}

      items.forEach((_, index) => {
        const itemNode = itemRefs.current[index]
        const currentIndicator = indicatorRefs.current[index]
        const nextIndicator = indicatorRefs.current[index + 1]

        if (itemNode == null || currentIndicator == null || nextIndicator == null) {
          return
        }

        const itemRect = itemNode.getBoundingClientRect()
        const currentRect = currentIndicator.getBoundingClientRect()
        const nextRect = nextIndicator.getBoundingClientRect()
        const connectorGap = 8
        const top = currentRect.bottom - itemRect.top + connectorGap
        const end = nextRect.top - itemRect.top - connectorGap

        nextStyles[index] = {
          height: Math.max(0, end - top),
          left: currentRect.left - itemRect.left + currentRect.width / 2 - 0.5,
          top,
        }
      })

      setVerticalConnectorStyles(nextStyles)
    }

    updateVerticalConnectors()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateVerticalConnectors)
      return () => window.removeEventListener('resize', updateVerticalConnectors)
    }

    const observer = new ResizeObserver(updateVerticalConnectors)

    itemRefs.current.forEach((node) => {
      if (node != null) {
        observer.observe(node)
      }
    })

    indicatorRefs.current.forEach((node) => {
      if (node != null) {
        observer.observe(node)
      }
    })

    window.addEventListener('resize', updateVerticalConnectors)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateVerticalConnectors)
    }
  }, [items, orientation, size])

  function getStatus(index: number, disabled?: boolean): StepStatus {
    if (disabled) {
      return 'inactive'
    }

    if (index < activeStep) {
      return 'complete'
    }

    if (index === activeStep) {
      return 'active'
    }

    return 'inactive'
  }

  function selectStep(index: number, disabled?: boolean) {
    if (!isInteractive || disabled) {
      return
    }

    if (currentStep == null) {
      setUncontrolledStep(index)
    }

    onStepChange?.(index)
  }

  return (
    <ol
      aria-label={ariaLabel}
      className={cx(
        'font-sans',
        orientation === 'horizontal'
          ? 'flex w-full items-start'
          : 'flex flex-col',
        className,
        listClassName,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const status = getStatus(index, item.disabled)
        const isCurrent = status === 'active'
        const isComplete = status === 'complete'
        const canClick = isInteractive && !item.disabled
        const itemKey = item.key ?? index
        const verticalConnectorStyle = verticalConnectorStyles[index]
        const connectorStyle = orientation === 'vertical' && verticalConnectorStyle != null
          ? ({
              height: verticalConnectorStyle.height,
              left: verticalConnectorStyle.left,
              top: verticalConnectorStyle.top,
            } satisfies CSSProperties)
          : undefined
        const indicator = (
          <span
            ref={(node) => {
              indicatorRefs.current[index] = node
            }}
            data-status={status}
            className={cx(
              'inline-flex shrink-0 items-center justify-center rounded-full border text-center font-sans font-medium transition-colors duration-[80ms] ease-out',
              selectedSize.indicator,
              indicatorStatusStyles[status],
            )}
          >
            {isComplete ? (
              renderIcon(Check, selectedSize.icon)
            ) : item.icon != null ? (
              renderIcon(item.icon, selectedSize.icon)
            ) : (
              <span className="w-full text-center tabular-nums">{index + 1}</span>
            )}
          </span>
        )
        const content = (
          <span
            className={cx(
              'flex min-w-0 flex-col gap-0.5',
              orientation === 'horizontal'
                ? 'items-center text-center'
                : cx('items-start justify-center text-left', selectedSize.contentMinHeight),
            )}
          >
            <span
              className={cx(
                'type-body-xs font-medium leading-snug',
                item.disabled ? 'text-foreground-tertiary' : 'text-foreground',
              )}
            >
              {item.label}
            </span>
            {item.description != null ? (
              <span className="type-body-xs font-normal leading-snug text-foreground-tertiary">
                {item.description}
              </span>
            ) : null}
          </span>
        )
        const stepContent = canClick ? (
          <button
            type="button"
            aria-current={isCurrent ? 'step' : undefined}
            className={cx(
              'group min-w-0 rounded-lg transition-opacity duration-[80ms] ease-out',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              'hover:opacity-85 active:opacity-70',
              orientation === 'horizontal'
                ? 'inline-flex flex-col items-center'
                : 'grid grid-cols-[auto_1fr] items-center text-left',
              selectedSize.contentGap,
            )}
            onClick={() => selectStep(index, item.disabled)}
          >
            {indicator}
            {content}
          </button>
        ) : (
          <span
            aria-current={isCurrent ? 'step' : undefined}
            className={cx(
              'min-w-0',
              orientation === 'horizontal'
                ? 'inline-flex flex-col items-center'
                : 'grid grid-cols-[auto_1fr] items-center',
              selectedSize.contentGap,
            )}
          >
            {indicator}
            {content}
          </span>
        )

        return (
          <li
            key={itemKey}
            ref={(node) => {
              itemRefs.current[index] = node
            }}
            data-status={status}
            data-disabled={item.disabled ? 'true' : undefined}
            className={cx(
              'relative min-w-0',
              orientation === 'horizontal'
                ? cx('flex flex-1 justify-center px-2', selectedSize.horizontalItem)
                : !isLast && selectedSize.verticalItemGap,
              itemClassName,
            )}
          >
            {stepContent}
            {!isLast ? (
              <span
                aria-hidden
                className={cx(
                  'pointer-events-none absolute block overflow-hidden bg-border',
                  orientation === 'horizontal'
                    ? cx('h-px', selectedSize.horizontalSeparator)
                    : 'w-px',
                )}
                style={connectorStyle}
              >
                <span
                  className={cx(
                    'block bg-accent',
                    orientation === 'horizontal' ? 'h-full w-full' : 'h-full w-full',
                    isComplete ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
