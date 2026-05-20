import type { ButtonHTMLAttributes } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import {
  DayPicker,
  type ClassNames,
  type DayPickerProps,
} from 'react-day-picker'

import { cx } from '../_internal/cx'
import { Button } from '../Button'

export type CalendarProps = DayPickerProps

type CalendarChevronProps = {
  className?: string
  disabled?: boolean
  orientation?: 'up' | 'down' | 'left' | 'right'
  size?: number
}

function CalendarChevron({
  className,
  orientation = 'right',
}: CalendarChevronProps) {
  const Icon =
    orientation === 'left'
      ? ChevronLeft
      : orientation === 'up'
        ? ChevronUp
        : orientation === 'down'
          ? ChevronDown
          : ChevronRight

  return (
    <Icon
      aria-hidden
      className={cx('size-4 shrink-0', className)}
      strokeWidth={2}
    />
  )
}

function CalendarNavigationButton({
  className,
  disabled,
  'aria-disabled': ariaDisabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const isDisabled = disabled || ariaDisabled === true || ariaDisabled === 'true'

  return (
    <Button
      variant="ghost"
      size="small"
      iconOnly
      className={cx('pointer-events-auto', className)}
      disabled={isDisabled}
      aria-disabled={ariaDisabled}
      {...props}
    />
  )
}

const calendarClassNames: Partial<ClassNames> = {
  root:
    'w-fit rounded-[14px] bg-surface-primary p-3 font-sans text-foreground',
  months: 'relative flex flex-col gap-4 md:flex-row',
  month: 'space-y-4',
  month_caption: 'relative flex h-8 items-center justify-center',
  caption_label: 'text-sm font-medium text-foreground',
  nav:
    'pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between',
  chevron: 'text-current',
  dropdowns: 'flex items-center justify-center gap-2',
  dropdown_root:
    'relative inline-flex h-8 items-center rounded-lg text-sm font-medium text-foreground transition-colors ' +
    'hover:bg-surface-secondary-hover data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 ' +
    '[&>span]:pointer-events-none [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1.5 ' +
    '[&>span]:px-3 [&>span_svg]:size-4',
  dropdown:
    'absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 outline-none disabled:cursor-default',
  months_dropdown: '',
  years_dropdown: '',
  month_grid: 'w-full border-collapse',
  weekdays: 'grid grid-cols-7',
  weekday:
    'flex size-[38px] items-center justify-center pb-1 text-center text-xs font-normal text-foreground-tertiary',
  weeks: 'flex flex-col gap-2',
  week: 'grid grid-cols-7',
  day: 'relative size-[38px] p-0 text-center text-sm',
  day_button:
    'inline-flex size-[38px] items-center justify-center rounded-[10px] text-sm font-normal leading-none transition-colors ' +
    'hover:bg-surface-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'focus-visible:outline-accent disabled:pointer-events-none',
  selected:
    '[&_button]:bg-accent [&_button]:text-accent-foreground [&_button]:hover:bg-accent-hover',
  today:
    '[&_button]:font-medium [&_button]:text-accent [&[data-selected=true]_button]:!text-accent-foreground',
  outside:
    '[&_button]:text-foreground-tertiary [&_button]:opacity-45',
  disabled:
    '[&_button]:text-foreground-tertiary [&_button]:opacity-40',
  hidden: 'invisible',
  range_start:
    'plexo-range-start overflow-hidden rounded-l-[10px] before:absolute before:inset-y-0 before:left-1/2 before:right-0 before:bg-accent/15 before:content-[""] ' +
    '[&.plexo-range-end]:before:hidden [&_button]:relative [&_button]:z-[1] [&_button]:bg-accent [&_button]:text-accent-foreground [&_button]:hover:bg-accent-hover',
  range_middle:
    'bg-accent/15 first:rounded-l-[10px] last:rounded-r-[10px] ' +
    '[&_button]:rounded-none [&_button]:bg-transparent [&_button]:text-foreground [&_button]:hover:bg-accent/20',
  range_end:
    'plexo-range-end overflow-hidden rounded-r-[10px] before:absolute before:inset-y-0 before:left-0 before:right-1/2 before:bg-accent/15 before:content-[""] ' +
    '[&.plexo-range-start]:before:hidden [&_button]:relative [&_button]:z-[1] [&_button]:bg-accent [&_button]:text-accent-foreground [&_button]:hover:bg-accent-hover',
}

export function Calendar({
  className = '',
  classNames,
  components,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        ...calendarClassNames,
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        PreviousMonthButton: CalendarNavigationButton,
        NextMonthButton: CalendarNavigationButton,
        ...components,
      }}
      {...props}
    />
  )
}
