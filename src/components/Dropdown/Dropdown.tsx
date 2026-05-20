import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

export type DropdownItem = {
  label: string
  icon?: ReactNode
  onSelect?: () => void
  disabled?: boolean
}

export type DropdownProps = {
  items?: DropdownItem[]
  /** Label next to chevron (chevron mode) */
  label?: string
  /** `chevron` — text + ChevronDown; `icon` — icon-only trigger (e.g. three dots) */
  mode?: 'chevron' | 'icon'
  /** Used when mode is `icon` */
  icon?: ReactNode
  /** Icon before label in chevron mode */
  prefixIcon?: ReactNode
  /** Custom menu body rendered instead of plain items */
  menuContent?: ReactNode
  /** Extra classes for the floating menu panel */
  menuClassName?: string
  /** Floating menu width. Defaults to trigger width for chevron dropdowns. */
  menuWidth?: number | string
  /** aria-label for icon-only trigger */
  'aria-label'?: string
  /** Как у `Checkbox` / `Input`: `default` — field, `secondary` — surface-secondary */
  variant?: 'default' | 'secondary'
  className?: string
  triggerClassName?: string
}

const triggerShell =
  'inline-flex h-9 items-center justify-center gap-2 rounded-lg border text-sm font-medium font-sans ' +
  'transition-[border-color,colors,box-shadow] ease-in-out duration-150 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:pointer-events-none disabled:opacity-50'

const triggerVariant: Record<NonNullable<DropdownProps['variant']>, string> = {
  default:
    'border-transparent bg-field-background text-field-foreground shadow-sm ' +
    'focus-visible:border-field-border-focus',
  secondary:
    'border-transparent bg-surface-secondary text-foreground ' +
    'focus-visible:border-field-border-focus',
}

const menuPanel =
  'fixed z-[9999] max-h-[min(18rem,calc(100vh-1rem))] overflow-auto rounded-lg border border-border ' +
  'bg-surface-primary text-foreground shadow-md dropdown-menu-enter'

const menuItem =
  'inline-flex w-full cursor-pointer items-center whitespace-nowrap px-3 py-2 text-left text-sm text-foreground ' +
  'hover:bg-surface-secondary-hover focus:bg-surface-secondary-hover focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const itemIconClass =
  'inline-flex h-3 shrink-0 items-center justify-center text-foreground-secondary [&_img]:h-3 [&_img]:w-auto [&_svg]:size-4'

function getMenuPosition(
  rect: DOMRect,
  mode: NonNullable<DropdownProps['mode']>,
  menuWidth: DropdownProps['menuWidth'],
): CSSProperties {
  const resolvedMenuWidth = mode === 'icon' ? undefined : menuWidth ?? rect.width

  return {
    left: rect.left,
    top: rect.bottom + 6,
    minWidth: mode === 'icon' ? 192 : rect.width,
    width: resolvedMenuWidth,
  }
}

export function Dropdown({
  items,
  label = 'Actions',
  mode = 'chevron',
  icon,
  prefixIcon,
  menuContent,
  menuClassName = '',
  menuWidth,
  'aria-label': ariaLabel,
  variant = 'default',
  className = '',
  triggerClassName = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  function getCurrentMenuPosition() {
    const rect = triggerRef.current?.getBoundingClientRect()
    return rect == null ? undefined : getMenuPosition(rect, mode, menuWidth)
  }

  const updateMenuPosition = useEffectEvent(() => {
    const nextMenuStyle = getCurrentMenuPosition()

    if (nextMenuStyle != null) {
      setMenuStyle(nextMenuStyle)
    }
  })

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node

      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [open])

  const isIcon = mode === 'icon'
  const triggerPadding = isIcon ? 'px-2.5' : 'px-3'
  const triggerClass = `${triggerShell} ${triggerPadding} ${triggerVariant[variant]} ${triggerClassName}`.trim()
  const menuClass = `${menuPanel} ${isIcon ? 'min-w-48' : ''} ${menuClassName}`.trim()
  const menu =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            id={listId}
            className={menuClass}
            style={menuStyle}
          >
            {menuContent ?? (
              <ul role="menu">
                {(items ?? []).map((item, index) => (
                  <li key={`${item.label}-${index}`} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      disabled={item.disabled}
                      className={menuItem}
                      onClick={() => {
                        item.onSelect?.()
                        setOpen(false)
                      }}
                    >
                      {item.icon != null ? (
                        <span className={`${itemIconClass} mr-2`} aria-hidden>
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={`inline-block text-left ${className}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={listId}
        aria-label={isIcon ? (ariaLabel ?? 'Open menu') : undefined}
        onClick={() => {
          if (!open) {
            const nextMenuStyle = getCurrentMenuPosition()

            if (nextMenuStyle != null) {
              setMenuStyle(nextMenuStyle)
            }
          }

          setOpen((v) => !v)
        }}
      >
        {isIcon ? (
          <span className="inline-flex shrink-0 [&_svg]:size-4">{icon}</span>
        ) : (
          <>
            {prefixIcon != null ? (
              <span className={itemIconClass} aria-hidden>
                {prefixIcon}
              </span>
            ) : null}
            <span className="min-w-0 flex-1 truncate text-left">{label}</span>
            {icon != null ? (
              <span className="inline-flex shrink-0 text-foreground-secondary [&_svg]:size-4" aria-hidden>
                {icon}
              </span>
            ) : null}
          </>
        )}
      </button>
      {menu}
    </div>
  )
}
