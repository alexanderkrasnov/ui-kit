import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DateRange } from 'react-day-picker'

import { Button } from '../Button'
import { Calendar } from './Calendar'

const meta = {
  title: 'Date and Time/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-full p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth())
}

function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

const rangeYear = 2026
const rangeYearEnd = new Date(rangeYear, 11, 31)

function clampDate(date: Date, min: Date, max: Date) {
  if (date < min) {
    return min
  }

  if (date > max) {
    return max
  }

  return date
}

function getRangeAnchorDate() {
  return clampDate(startOfDay(new Date()), new Date(rangeYear, 0, 1), rangeYearEnd)
}

function getRangeSelectableStart(anchorDate: Date) {
  return startOfDay(addMonths(anchorDate, -12))
}

function getPresetRange(
  preset: (typeof presetItems)[number],
  anchorDate: Date,
  minDate = getRangeSelectableStart(anchorDate),
) {
  const range = preset.getRange(anchorDate)

  return {
    from: range.from
      ? clampDate(startOfDay(range.from), minDate, anchorDate)
      : range.from,
    to: range.to
      ? clampDate(startOfDay(range.to), minDate, anchorDate)
      : range.to,
  }
}

function BasicCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 3, 24))

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 3)}
    />
  )
}

function RangeCalendarDemo() {
  const today = getRangeAnchorDate()
  const selectableStart = getRangeSelectableStart(today)
  const calendarStartMonth = startOfMonth(selectableStart)
  const [range, setRange] = useState<DateRange | undefined>(
    getPresetRange(presetItems[1], today, selectableStart),
  )
  const [month, setMonth] = useState(startOfMonth(today))

  function handlePresetSelect(nextRange: DateRange) {
    setRange(nextRange)

    if (nextRange.from) {
      setMonth(startOfMonth(nextRange.from))
    }
  }

  return (
    <div className="mx-auto flex w-fit flex-col overflow-hidden rounded-[14px] bg-surface-primary shadow-[0_0_0_1px_var(--color-border)]">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        month={month}
        onMonthChange={setMonth}
        startMonth={calendarStartMonth}
        endMonth={rangeYearEnd}
        disabled={[{ before: selectableStart }, { after: today }]}
        excludeDisabled
        numberOfMonths={2}
        resetOnSelect
        showOutsideDays={false}
        className="rounded-none border-0 shadow-none"
      />
      <CalendarPresetActions today={today} onSelect={handlePresetSelect} />
    </div>
  )
}

function MonthAndYearSelectorDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 3, 24))

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 3)}
      captionLayout="dropdown"
      startMonth={new Date(1926, 0)}
      endMonth={new Date(2026, 11)}
    />
  )
}

const presetItems: Array<{
  label: string
  getRange: (today: Date) => DateRange
}> = [
  { label: 'Today', getRange: (today) => ({ from: today, to: today }) },
  {
    label: 'Last 7 days',
    getRange: (today) => ({ from: addDays(today, -6), to: today }),
  },
  {
    label: 'Last 30 days',
    getRange: (today) => ({ from: addDays(today, -29), to: today }),
  },
  {
    label: 'Last 90 days',
    getRange: (today) => ({ from: addDays(today, -89), to: today }),
  },
  {
    label: 'Last 12 months',
    getRange: (today) => ({ from: addMonths(today, -12), to: today }),
  },
]

type CalendarPresetActionsProps = {
  today: Date
  onSelect: (range: DateRange) => void
}

function CalendarPresetActions({ today, onSelect }: CalendarPresetActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-border bg-surface-secondary/50 p-3">
      {presetItems.map((preset) => {
        return (
          <Button
            key={preset.label}
            size="small"
            variant="secondary"
            className="min-w-fit flex-1 whitespace-nowrap px-3"
            onClick={() => onSelect(getPresetRange(preset, today))}
          >
            {preset.label}
          </Button>
        )
      })}
    </div>
  )
}

export const Basic: Story = {
  render: () => <BasicCalendarDemo />,
}

export const RangeCalendar: Story = {
  name: 'Range Calendar',
  render: () => <RangeCalendarDemo />,
}

export const MonthAndYearSelector: Story = {
  name: 'Month and Year Selector',
  render: () => <MonthAndYearSelectorDemo />,
}
