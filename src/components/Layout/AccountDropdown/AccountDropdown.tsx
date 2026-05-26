import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'

import { Avatar } from '../../Avatar'
import { Dropdown, type DropdownItem } from '../../Dropdown'
import { cx } from '../../_internal/cx'

export type AccountDropdownItem = DropdownItem

export type AccountDropdownProps = {
  name: string
  company: string
  avatarFallback?: string
  avatarAriaLabel?: string
  compact?: boolean
  items?: AccountDropdownItem[]
  onSettingsSelect?: () => void
  onSignOutSelect?: () => void
  className?: string
  triggerClassName?: string
  menuClassName?: string
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export function AccountDropdown({
  name,
  company,
  avatarFallback,
  avatarAriaLabel,
  compact = false,
  items,
  onSettingsSelect,
  onSignOutSelect,
  className = '',
  triggerClassName = '',
  menuClassName = '',
}: AccountDropdownProps) {
  const resolvedItems =
    items ??
    [
      {
        label: 'Settings',
        icon: <Settings />,
        onSelect: onSettingsSelect,
      },
      {
        label: 'Sign out',
        icon: <LogOut />,
        onSelect: onSignOutSelect,
        separatorBefore: true,
        tone: 'danger' as const,
      },
    ]

  return (
    <Dropdown
      items={resolvedItems}
      mode={compact ? 'icon' : 'chevron'}
      placement="top"
      aria-label={`${name} account menu`}
      className={cx(compact ? 'w-fit' : 'w-full', className)}
      triggerClassName={cx(
        'group transition-[width,height,min-height,opacity,background-color] duration-150 ease-in-out',
        compact
          ? '!size-8 !min-h-8 !justify-center overflow-visible !border-0 !p-0 bg-transparent !shadow-none hover:!bg-transparent'
          : 'h-9 w-full !justify-start overflow-hidden bg-surface-primary !p-0 !shadow-none hover:bg-transparent',
        triggerClassName,
      )}
      menuClassName={menuClassName}
      triggerContent={
        <span
          className={cx(
            'relative items-center gap-3',
            compact
              ? 'inline-flex h-8 w-8 min-w-8 justify-center'
              : 'grid h-full w-full min-w-0 grid-cols-[2rem_minmax(0,1fr)_1rem] px-3',
          )}
        >
          <Avatar
            size="sm"
            fallback={avatarFallback ?? getInitials(name)}
            aria-label={avatarAriaLabel ?? `${name} avatar`}
            className="shrink-0 group-hover:bg-accent/15"
          />
          {!compact ? (
            <>
              <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                <span className="type-body-sm block w-full truncate text-left font-semibold leading-5 text-foreground">
                  {name}
                </span>
                <span className="type-body-xs block w-full truncate text-left leading-4 text-foreground-tertiary">
                  {company}
                </span>
              </span>
              <span
                className="inline-flex size-4 shrink-0 items-center justify-center text-foreground-tertiary transition-colors duration-150 ease-in-out group-hover:text-accent [&_svg]:size-4"
                aria-hidden
              >
                <ChevronsUpDown />
              </span>
            </>
          ) : null}
        </span>
      }
    />
  )
}
