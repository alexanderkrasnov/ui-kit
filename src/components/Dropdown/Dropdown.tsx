import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export type DropdownItem = {
  label: string
  onSelect?: () => void
  disabled?: boolean
}

export type DropdownProps = {
  items: DropdownItem[]
  /** Label next to chevron (chevron mode) */
  label?: string
  /** `chevron` — text + ChevronDown; `icon` — icon-only trigger (e.g. three dots) */
  mode?: 'chevron' | 'icon'
  /** Used when mode is `icon` */
  icon?: ReactNode
  /** aria-label for icon-only trigger */
  'aria-label'?: string
  /** Как у `Checkbox` / `Input`: `default` — field, `secondary` — surface-secondary */
  variant?: 'default' | 'secondary'
  className?: string
}

const triggerShell =
  'inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium font-sans ' +
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
  'absolute left-0 z-50 mt-1 min-w-[12rem] rounded-lg border border-border bg-surface-primary py-1 shadow-md ' +
  'text-foreground'

const menuItem =
  'flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm text-foreground ' +
  'hover:bg-surface-secondary-hover focus:bg-surface-secondary-hover focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export function Dropdown({
  items,
  label = 'Actions',
  mode = 'chevron',
  icon,
  'aria-label': ariaLabel,
  variant = 'default',
  className = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isIcon = mode === 'icon'
  const triggerClass = `${triggerShell} ${triggerVariant[variant]}`.trim()

  return (
    <div ref={rootRef} className={`relative inline-block text-left ${className}`.trim()}>
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={listId}
        aria-label={isIcon ? (ariaLabel ?? 'Open menu') : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {isIcon ? (
          <span className="inline-flex shrink-0 [&_svg]:size-4">{icon}</span>
        ) : (
          <>
            <span>{label}</span>
            <span className="inline-flex shrink-0 [&_svg]:size-4 opacity-70" aria-hidden>
              {icon}
            </span>
          </>
        )}
      </button>

      {open ? (
        <ul id={listId} role="menu" className={menuPanel}>
          {items.map((item) => (
            <li key={item.label} role="none">
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
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
