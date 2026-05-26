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
      placement="top"
      className={cx('w-full', className)}
      triggerClassName={cx(
        'w-full !justify-start bg-surface-primary !px-3 !py-2 !shadow-none hover:bg-surface-primary-hover',
        triggerClassName,
      )}
      menuClassName={menuClassName}
      triggerContent={
        <span className="grid w-full min-w-0 grid-cols-[2rem_minmax(0,1fr)_1rem] items-center gap-3">
          <Avatar
            size="sm"
            fallback={avatarFallback ?? getInitials(name)}
            aria-label={avatarAriaLabel ?? `${name} avatar`}
            className="shrink-0"
          />
          <span className="flex min-w-0 flex-1 flex-col items-start text-left">
            <span className="type-body-sm block w-full truncate text-left font-semibold leading-5 text-foreground">
              {name}
            </span>
            <span className="type-body-xs block w-full truncate text-left leading-4 text-foreground-tertiary">
              {company}
            </span>
          </span>
          <span
            className="inline-flex size-4 shrink-0 items-center justify-center text-foreground-tertiary [&_svg]:size-4"
            aria-hidden
          >
            <ChevronsUpDown />
          </span>
        </span>
      }
    />
  )
}
