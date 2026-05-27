import {
  createElement,
  isValidElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'

import { CloseButton } from '../../CloseButton'
import { Spinner } from '../../Spinner'
import { cx } from '../../_internal/cx'

export type AlertAreaColor = 'accent' | 'default' | 'success' | 'warning' | 'danger'
export type AlertAreaVariant = 'primary' | 'secondary'
export type AlertAreaIcon = LucideIcon | ReactNode

export type AlertAreaProps = Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title'> & {
  title: ReactNode
  color?: AlertAreaColor
  variant?: AlertAreaVariant
  icon?: AlertAreaIcon | null
  action?: ReactNode
  loading?: boolean
  onClose?: () => void
  closeLabel?: string
}

const defaultIcons: Record<AlertAreaColor, LucideIcon> = {
  accent: Info,
  default: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
}

const colorStyles: Record<AlertAreaColor, string> = {
  accent: 'text-accent',
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

const secondaryBackgrounds: Record<AlertAreaColor, string> = {
  accent: 'bg-accent/10',
  default: 'bg-surface-secondary',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-danger/10',
}

function isComponentIcon(icon: AlertAreaIcon): icon is LucideIcon {
  return (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) && !isValidElement(icon)
}

function renderIcon(icon: AlertAreaIcon, colorClass: string) {
  const content = isValidElement(icon)
    ? icon
    : isComponentIcon(icon)
      ? createElement(icon as ElementType, { strokeWidth: 2 })
      : icon

  return (
    <span
      className={cx(
        'flex size-6 shrink-0 items-center justify-center p-1',
        'mr-3',
        colorClass,
        '[&_svg]:size-4 [&_svg]:shrink-0',
      )}
      aria-hidden
    >
      {content}
    </span>
  )
}

function renderLoadingIcon(colorClass: string) {
  return (
    <span className={cx('mr-3 flex size-6 shrink-0 items-center justify-center p-1', colorClass)}>
      <Spinner size="sm" aria-label="Loading" className={colorClass} />
    </span>
  )
}

export function AlertArea({
  title,
  children,
  color = 'accent',
  variant = 'primary',
  icon,
  action,
  loading = false,
  onClose,
  closeLabel = 'Close alert',
  className = '',
  ...props
}: AlertAreaProps) {
  const colorClass = colorStyles[color]
  const iconContent = icon === null ? null : icon ?? defaultIcons[color]
  const showActions = action != null || onClose != null

  return (
    <div
      className={cx(
        'flex w-full min-w-0 items-start justify-start rounded-xl px-4 py-3 font-sans',
        'transition-colors duration-150 ease-in-out',
        variant === 'primary'
          ? 'bg-surface-primary shadow-sm'
          : cx('shadow-none', secondaryBackgrounds[color]),
        className,
      )}
      {...props}
    >
      {loading ? renderLoadingIcon(colorClass) : iconContent != null ? renderIcon(iconContent, colorClass) : null}

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium leading-6 text-foreground">
          {title}
        </div>
        {children != null ? (
          <div className="text-sm leading-5 text-foreground-secondary">
            {children}
          </div>
        ) : null}
      </div>

      {showActions ? (
        <div className="ml-6 flex shrink-0 items-center gap-2 self-start">
          {action}
          {onClose != null ? (
            <CloseButton
              size="md"
              variant="default"
              aria-label={closeLabel}
              onClick={onClose}
              className={
                variant === 'primary'
                  ? cx(
                      '[&>span]:bg-surface-secondary [&>span]:text-foreground-secondary',
                      '[&:hover>span]:bg-surface-secondary-hover [&:hover>span]:text-foreground',
                    )
                  : undefined
              }
            />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
