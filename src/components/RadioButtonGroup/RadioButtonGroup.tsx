import type { HTMLAttributes, ReactNode } from 'react'
import { useId, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cx } from '../_internal/cx'

export type RadioButtonGroupItem = {
  value: string
  label: ReactNode
  icon?: LucideIcon
}

export type RadioButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  items: RadioButtonGroupItem[]
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  columns?: 'responsive' | 'one' | 'two' | 'four'
}

const columnClasses: Record<NonNullable<RadioButtonGroupProps['columns']>, string> = {
  responsive: 'grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-4',
  one: 'grid-cols-1',
  two: 'grid-cols-2',
  four: 'grid-cols-4',
}

const radioShell = cx(
  'relative inline-flex size-4 shrink-0 items-center justify-center rounded-full font-sans',
  'ring-2 ring-transparent ring-offset-2 ring-offset-[var(--color-background)]',
  'shadow-sm bg-field-background',
  'group-has-[input:checked]:bg-accent group-has-[input:checked]:shadow-none',
)

const radioIndicator = cx(
  'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0',
  'group-has-[input:checked]:opacity-100',
)

export function RadioButtonGroup({
  items,
  name: nameProp,
  value: controlledValue,
  defaultValue,
  onValueChange,
  columns = 'responsive',
  className = '',
  ...props
}: RadioButtonGroupProps) {
  const autoName = useId()
  const name = nameProp ?? `radio-button-group-${autoName}`
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = (nextValue: string) => {
    if (!isControlled) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <div
      role="radiogroup"
      className={cx(
        'min-w-0 bg-transparent p-0 font-sans @container',
        className,
      )}
      {...props}
    >
      <div className={cx('grid gap-2', columnClasses[columns])}>
        {items.map((item) => {
          const Icon = item.icon
          const checked = value === item.value

          return (
            <label
              key={item.value}
              className={cx(
                'group grid h-9 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg px-3',
                'bg-background text-foreground transition-colors',
                'has-[input:checked]:bg-accent/15',
                'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2',
                'has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent',
              )}
            >
              <input
                type="radio"
                name={name}
                value={item.value}
                checked={checked}
                onChange={() => handleValueChange(item.value)}
                className="sr-only"
              />
              {Icon != null ? (
                <Icon
                  className={cx(
                    'size-4 shrink-0',
                    checked ? 'text-accent' : 'text-foreground-tertiary',
                  )}
                  aria-hidden
                />
              ) : (
                <span aria-hidden />
              )}
              <span className="min-w-0 truncate text-sm font-medium leading-5">{item.label}</span>
              <span className={radioShell} aria-hidden>
                <span className={radioIndicator}>
                  <span className="block size-2 shrink-0 rounded-full bg-[var(--color-accent-foreground)]" />
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
