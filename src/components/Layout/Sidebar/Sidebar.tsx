import { useState, type CSSProperties, type Key, type ReactNode } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { AccountDropdown, type AccountDropdownProps } from '../AccountDropdown'
import { cx } from '../../_internal/cx'

export type SidebarNavItem = {
  key: Key
  label: ReactNode
  icon: ReactNode
  active?: boolean
  disabled?: boolean
  href?: string
  onSelect?: () => void
  ariaLabel?: string
}

export type SidebarProps = {
  items: SidebarNavItem[]
  logo: ReactNode
  collapsedLogo?: ReactNode
  account: AccountDropdownProps
  width?: number
  collapsedWidth?: number
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

const DEFAULT_WIDTH = 260
const DEFAULT_COLLAPSED_WIDTH = 52

function getItemLabel(item: SidebarNavItem) {
  if (item.ariaLabel != null) return item.ariaLabel
  if (typeof item.label === 'string' || typeof item.label === 'number') {
    return String(item.label)
  }

  return String(item.key)
}

export function Sidebar({
  items,
  logo,
  collapsedLogo,
  account,
  width = DEFAULT_WIDTH,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className = '',
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isControlled = collapsed != null
  const isCollapsed = collapsed ?? internalCollapsed
  const sidebarWidth = isCollapsed ? collapsedWidth : width
  const sidebarStyle = {
    width: sidebarWidth,
    minWidth: sidebarWidth,
  } satisfies CSSProperties
  const hasCollapsedLogo = collapsedLogo != null
  const accountClassName = account.className
  const accountTriggerClassName = account.triggerClassName

  function handleCollapsedChange(nextCollapsed: boolean) {
    if (!isControlled) {
      setInternalCollapsed(nextCollapsed)
    }

    onCollapsedChange?.(nextCollapsed)
  }

  return (
    <aside
      aria-label="Sidebar"
      className={cx(
        'flex h-dvh min-h-0 shrink-0 flex-col overflow-hidden border-r border-border bg-surface-primary text-foreground',
        'transition-[width,min-width] duration-150 ease-in-out',
        className,
      )}
      style={sidebarStyle}
    >
      <div className="flex h-full min-h-0 w-full flex-col bg-surface-primary">
        <header className="flex min-h-0 flex-1 flex-col gap-6 bg-surface-primary px-1.5 pt-3">
          <div className="relative h-7 w-full shrink-0">
            <button
              type="button"
              className={cx(
                'group absolute left-0 top-0 inline-flex h-7 w-fit shrink-0 items-center justify-center overflow-hidden rounded-lg bg-transparent px-[10px] text-foreground transition-[opacity,background-color] duration-150 ease-in-out hover:bg-surface-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                isCollapsed || hasCollapsedLogo ? 'opacity-100' : 'opacity-0',
                !isCollapsed && 'pointer-events-none',
              )}
              aria-label="Expand sidebar"
              aria-hidden={!isCollapsed}
              tabIndex={isCollapsed ? undefined : -1}
              onClick={() => handleCollapsedChange(false)}
            >
              <span className="inline-flex items-center justify-center transition-opacity duration-[80ms] ease-out group-hover:opacity-0 group-focus-visible:opacity-0">
                {collapsedLogo ?? logo}
              </span>
              <span
                className="absolute inset-0 inline-flex items-center justify-center text-foreground-tertiary opacity-0 transition-opacity duration-[80ms] ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                aria-hidden
              >
                <PanelLeftOpen className="size-4" />
              </span>
            </button>

            <div
              className={cx(
                'absolute left-[10px] top-0 flex h-7 min-w-0 items-center overflow-hidden text-foreground transition-opacity duration-150 ease-in-out',
                isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
              )}
              aria-hidden={isCollapsed}
            >
              {logo}
            </div>

            <button
              type="button"
              className={cx(
                'absolute right-[10px] top-0 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-transparent text-foreground-tertiary transition-[opacity,background-color,color] duration-150 ease-in-out hover:bg-surface-primary-hover hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                isCollapsed ? 'pointer-events-none opacity-0' : 'opacity-100',
              )}
              aria-label="Collapse sidebar"
              tabIndex={isCollapsed ? -1 : undefined}
              onClick={() => handleCollapsedChange(true)}
            >
              <PanelLeftClose className="size-4" aria-hidden />
            </button>
          </div>

          <nav
            aria-label="Primary navigation"
            className="flex min-h-0 w-full flex-col gap-1 overflow-x-hidden overflow-y-auto"
          >
            {items.map((item) => {
              const itemLabel = getItemLabel(item)
              const itemClassName = cx(
                'group inline-flex h-8 shrink-0 items-center rounded-lg py-1.5 text-sm font-normal leading-5',
                'transition-[width,background-color,color] duration-150 ease-in-out',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                isCollapsed ? 'w-fit justify-start gap-0 px-[10px]' : 'w-full justify-start gap-[10px] px-[10px]',
                item.active
                  ? 'bg-surface-secondary text-foreground'
                  : 'text-foreground hover:bg-surface-primary-hover',
                item.disabled && 'pointer-events-none opacity-50',
              )
              const content = (
                <>
                  <span
                    className="inline-flex size-5 shrink-0 items-center justify-center p-0.5 [&_svg]:size-4"
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  <span
                    className={cx(
                      'min-w-0 truncate text-left transition-[width,opacity] duration-150 ease-in-out',
                      isCollapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100',
                    )}
                    aria-hidden={isCollapsed}
                  >
                    {item.label}
                  </span>
                </>
              )

              if (item.href != null && !item.disabled) {
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className={itemClassName}
                    aria-current={item.active ? 'page' : undefined}
                    aria-label={isCollapsed ? itemLabel : undefined}
                    title={isCollapsed ? itemLabel : undefined}
                    onClick={() => item.onSelect?.()}
                  >
                    {content}
                  </a>
                )
              }

              return (
                <button
                  key={item.key}
                  type="button"
                  className={itemClassName}
                  disabled={item.disabled}
                  aria-current={item.active ? 'page' : undefined}
                  aria-label={isCollapsed ? itemLabel : undefined}
                  title={isCollapsed ? itemLabel : undefined}
                  onClick={() => item.onSelect?.()}
                >
                  {content}
                </button>
              )
            })}
          </nav>
        </header>

        <footer
          className={cx(
            'mt-auto flex h-16 w-full shrink-0 items-center justify-start transition-[height,padding] duration-150 ease-in-out',
            isCollapsed ? 'px-[10px] py-[14px]' : 'px-4 py-2',
          )}
        >
          <AccountDropdown
            {...account}
            compact={isCollapsed}
            className={cx(
              'transition-[width] duration-150 ease-in-out',
              isCollapsed ? '[&&]:!w-8' : '[&&]:!w-full',
              accountClassName,
            )}
            triggerClassName={cx(
              '[&&]:!justify-start [&&]:!gap-3 [&&]:!shadow-none',
              '[&&]:transition-[width,height,min-height,padding,background-color] [&&]:duration-150 [&&]:ease-in-out',
              isCollapsed
                ? '[&&]:!h-9 [&&]:!min-h-9 [&&]:!w-8 [&&]:!bg-transparent [&&]:!p-0 hover:!bg-transparent'
                : '[&&]:!w-full hover:bg-surface-primary-hover',
              accountTriggerClassName,
            )}
          />
        </footer>
      </div>
    </aside>
  )
}
