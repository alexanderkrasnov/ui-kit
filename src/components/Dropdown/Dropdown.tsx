import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

export type DropdownItem = {
  label: string
  value?: string
  icon?: ReactNode
  onSelect?: () => void
  disabled?: boolean
}

export type DropdownProps = {
  items?: DropdownItem[]
  /** Label next to chevron (chevron mode) */
  label?: string
  /** Placeholder for select-like dropdowns */
  placeholder?: string
  /** Controlled selected item value */
  value?: string
  /** Uncontrolled initial selected item value */
  defaultValue?: string
  /** Called when an item is selected */
  onValueChange?: (value: string, item: DropdownItem) => void
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
  'bg-surface-primary text-foreground shadow-md'

const menuItem =
  'inline-flex w-fit cursor-pointer items-center whitespace-nowrap px-3 py-2 text-left text-sm text-foreground ' +
  'hover:bg-surface-secondary-hover focus:bg-surface-secondary-hover focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const itemIconClass =
  'inline-flex shrink-0 text-foreground-secondary [&_img]:h-4 [&_img]:w-5 [&_svg]:size-4'

function getItemValue(item: DropdownItem) {
  return item.value ?? item.label
}

export function Dropdown({
  items,
  label = 'Actions',
  placeholder,
  value,
  defaultValue,
  onValueChange,
  mode = 'chevron',
  icon,
  prefixIcon,
  menuContent,
  menuClassName = '',
  'aria-label': ariaLabel,
  variant = 'default',
  className = '',
  triggerClassName = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [menuStyle, setMenuStyle] = useState<CSSProperties>()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const currentValue = value ?? internalValue
  const isSelectDropdown =
    placeholder != null || value != null || defaultValue != null || onValueChange != null
  const selectedItem = isSelectDropdown
    ? items?.find((item) => getItemValue(item) === currentValue)
    : undefined
  const triggerLabel = selectedItem?.label ?? placeholder ?? label
  const triggerPrefixIcon = selectedItem?.icon ?? prefixIcon
  const isPlaceholder = isSelectDropdown && selectedItem == null && placeholder != null

  function updateMenuPosition() {
    const rect = triggerRef.current?.getBoundingClientRect()

    if (rect == null) {
      return
    }

    setMenuStyle({
      left: rect.left,
      top: rect.bottom + 4,
      minWidth: mode === 'icon' ? 192 : rect.width,
      width: mode === 'icon' ? undefined : rect.width,
    })
  }

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
    const onPositionChange = () => updateMenuPosition()

    updateMenuPosition()
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onPositionChange)
    window.addEventListener('scroll', onPositionChange, true)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onPositionChange)
      window.removeEventListener('scroll', onPositionChange, true)
    }
  }, [open])

  const isIcon = mode === 'icon'
  const triggerPadding = isIcon ? 'px-2.5' : 'px-3'
  const triggerClass = `${triggerShell} ${triggerPadding} ${triggerVariant[variant]} ${triggerClassName}`.trim()
  const labelClass = `${isSelectDropdown ? 'min-w-0 flex-1 truncate text-left' : ''} ${
    isPlaceholder ? 'text-field-placeholder' : ''
  }`.trim()
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
              <ul role="menu" className="py-1">
                {(items ?? []).map((item) => {
                  const itemValue = getItemValue(item)
                  const selected = isSelectDropdown && itemValue === currentValue

                  return (
                    <li key={itemValue} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        disabled={item.disabled}
                        aria-selected={selected ? true : undefined}
                        className={menuItem}
                        onClick={() => {
                          item.onSelect?.()

                          if (isSelectDropdown) {
                            if (value === undefined) {
                              setInternalValue(itemValue)
                            }

                            onValueChange?.(itemValue, item)
                          }

                          setOpen(false)
                        }}
                      >
                        {item.icon != null ? (
                          <span className={`${itemIconClass} mr-2`} aria-hidden>
                            {item.icon}
                          </span>
                        ) : null}
                        {item.label}
                      </button>
                    </li>
                  )
                })}
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
            updateMenuPosition()
          }

          setOpen((v) => !v)
        }}
      >
        {isIcon ? (
          <span className="inline-flex shrink-0 [&_svg]:size-4">{icon}</span>
        ) : (
          <>
            {triggerPrefixIcon != null ? (
              <span className={itemIconClass} aria-hidden>
                {triggerPrefixIcon}
              </span>
            ) : null}
            <span className={labelClass}>{triggerLabel}</span>
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
