import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'

import { cx } from '../_internal/cx'

export type SelectItem = {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
}

type SelectBaseProps = {
  items: SelectItem[]
  label?: string
  placeholder?: string
  icon?: ReactNode
  prefixIcon?: ReactNode
  /** Extra classes for the floating listbox panel */
  menuClassName?: string
  /** Floating menu width. Defaults to trigger width. */
  menuWidth?: number | string
  /** Как у `Checkbox` / `Input`: `default` — field, `secondary` — surface-secondary */
  variant?: 'default' | 'secondary'
  className?: string
  triggerClassName?: string
}

export type SelectSingleProps = SelectBaseProps & {
  selectionMode?: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, item: SelectItem) => void
}

export type SelectMultipleProps = SelectBaseProps & {
  selectionMode: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[], item: SelectItem) => void
}

export type SelectProps = SelectSingleProps | SelectMultipleProps

const triggerShell =
  'inline-flex h-9 items-center justify-center gap-2 rounded-lg border text-sm font-medium font-sans ' +
  'transition-[border-color,colors,box-shadow] ease-in-out duration-150 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:pointer-events-none disabled:opacity-50'

const triggerVariant: Record<NonNullable<SelectProps['variant']>, string> = {
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
  'hover:bg-surface-secondary-hover focus-visible:bg-surface-secondary-hover focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const itemIconClass =
  'inline-flex h-3 shrink-0 items-center justify-center text-foreground-secondary [&_img]:h-3 [&_img]:w-auto [&_svg]:size-4'

const selectedIconClass =
  'ml-4 inline-flex size-4 shrink-0 items-center justify-center text-accent'

const checkboxClass =
  'mr-2 inline-flex size-4 shrink-0 items-center justify-center rounded-sm font-sans shadow-sm'

function isMultipleSelect(props: SelectProps): props is SelectMultipleProps {
  return props.selectionMode === 'multiple'
}

function getMenuPosition(rect: DOMRect, menuWidth: SelectProps['menuWidth']): CSSProperties {
  return {
    left: rect.left,
    top: rect.bottom + 6,
    minWidth: rect.width,
    width: menuWidth ?? rect.width,
  }
}

function getMultipleLabel(
  selectedItems: SelectItem[],
  label: string | undefined,
  placeholder: string | undefined,
) {
  if (label != null) return label
  if (selectedItems.length === 0) return placeholder ?? 'Select'
  if (selectedItems.length === 1) return selectedItems[0].label
  return `${selectedItems.length} selected`
}

export function Select(props: SelectProps) {
  const {
    items,
    label,
    placeholder,
    icon,
    prefixIcon,
    menuClassName = '',
    menuWidth,
    variant = 'default',
    className = '',
    triggerClassName = '',
  } = props
  const isMultiple = isMultipleSelect(props)
  const [open, setOpen] = useState(false)
  const [singleValue, setSingleValue] = useState(() =>
    isMultiple ? '' : props.defaultValue ?? '',
  )
  const [multipleValue, setMultipleValue] = useState<string[]>(() =>
    isMultiple ? props.defaultValue ?? [] : [],
  )
  const [menuStyle, setMenuStyle] = useState<CSSProperties>()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selectedValue = isMultiple ? '' : props.value ?? singleValue
  const selectedValues = isMultiple ? props.value ?? multipleValue : []
  const selectedItem = isMultiple
    ? undefined
    : items.find((item) => item.value === selectedValue)
  const selectedItems = isMultiple
    ? items.filter((item) => selectedValues.includes(item.value))
    : []
  const selectedValueSet = new Set(
    isMultiple ? selectedValues : selectedValue ? [selectedValue] : [],
  )
  const triggerLabel = isMultiple
    ? getMultipleLabel(selectedItems, label, placeholder)
    : selectedItem?.label ?? placeholder ?? label ?? 'Select'
  const triggerPrefixIcon = isMultiple ? prefixIcon : selectedItem?.icon ?? prefixIcon
  const isPlaceholder =
    (isMultiple && selectedItems.length === 0 && label == null && placeholder != null) ||
    (!isMultiple && selectedItem == null && placeholder != null)

  function getCurrentMenuPosition() {
    const rect = triggerRef.current?.getBoundingClientRect()
    return rect == null ? undefined : getMenuPosition(rect, menuWidth)
  }

  function openMenu() {
    const nextMenuStyle = getCurrentMenuPosition()

    if (nextMenuStyle != null) {
      setMenuStyle(nextMenuStyle)
    }

    setOpen(true)
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
    const onKey = (e: globalThis.KeyboardEvent) => {
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

  function selectItem(item: SelectItem) {
    if (item.disabled) return

    if (isMultipleSelect(props)) {
      const selected = selectedValues.includes(item.value)
      const nextValue = selected
        ? selectedValues.filter((value) => value !== item.value)
        : [...selectedValues, item.value]

      if (props.value === undefined) {
        setMultipleValue(nextValue)
      }

      props.onValueChange?.(nextValue, item)
      return
    }

    if (props.value === undefined) {
      setSingleValue(item.value)
    }

    props.onValueChange?.(item.value, item)
    setOpen(false)
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown') return
    event.preventDefault()
    openMenu()
  }

  const triggerClass = cx(
    triggerShell,
    'px-3',
    triggerVariant[variant],
    triggerClassName,
  )
  const labelClass = cx(
    'min-w-0 flex-1 truncate text-left',
    isPlaceholder && 'text-field-placeholder',
  )
  const menuClass = cx(menuPanel, menuClassName)
  const menu =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-multiselectable={isMultiple ? true : undefined}
            className={menuClass}
            style={menuStyle}
          >
            {items.map((item) => {
              const selected = selectedValueSet.has(item.value)

              return (
                <button
                  key={item.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={item.disabled}
                  className={menuItem}
                  onClick={() => selectItem(item)}
                >
                  {isMultiple ? (
                    <span
                      className={cx(
                        checkboxClass,
                        selected
                          ? 'bg-accent text-accent-foreground shadow-none'
                          : 'bg-field-background text-transparent',
                      )}
                      aria-hidden
                    >
                      {selected ? <Check strokeWidth={4} className="size-2.5" /> : null}
                    </span>
                  ) : item.icon != null ? (
                    <span className={`${itemIconClass} mr-2`} aria-hidden>
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {!isMultiple ? (
                    <span className={selectedIconClass} aria-hidden>
                      {selected ? <Check strokeWidth={3} className="size-4" /> : null}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={cx('inline-block text-left', className)}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => {
          if (open) {
            setOpen(false)
            return
          }

          openMenu()
        }}
        onKeyDown={handleTriggerKeyDown}
      >
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
      </button>
      {menu}
    </div>
  )
}
