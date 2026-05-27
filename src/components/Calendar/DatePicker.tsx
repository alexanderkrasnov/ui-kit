import { Calendar as CalendarIcon } from 'lucide-react'
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'

import { cx } from '../_internal/cx'
import { Calendar } from './Calendar'
import { DateField, type DateFieldProps, type DateFieldValue } from './DateField'

export type DatePickerValue = DateFieldValue

export type DatePickerProps = Omit<
  DateFieldProps,
  'children'
>

function parseDateValue(value?: DatePickerValue) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return undefined
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

function formatDateValue(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    id,
    value,
    defaultValue,
    onChange,
    min,
    max,
    disabled,
    placeholder = 'dd.mm.yyyy',
    onKeyDown,
    onMouseDown,
    ...props
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const draftYearDigitsRef = useRef('')
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [draftMonth, setDraftMonth] = useState<Date | undefined>()
  const [isOpen, setIsOpen] = useState(false)
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({
    left: 0,
    top: 0,
  })
  const dateValue = value ?? internalValue
  const selectedDate = useMemo(() => parseDateValue(dateValue), [dateValue])
  const minDate = useMemo(() => parseDateValue(min), [min])
  const maxDate = useMemo(() => parseDateValue(max), [max])
  const calendarStartMonth = minDate ?? new Date(1926, 0)
  const calendarEndMonth = maxDate ?? new Date(2026, 11)
  const disabledMatchers: Array<{ before: Date } | { after: Date }> = []

  if (minDate) {
    disabledMatchers.push({ before: minDate })
  }

  if (maxDate) {
    disabledMatchers.push({ after: maxDate })
  }

  useEffect(() => {
    function updatePopoverPosition() {
      const rect = rootRef.current
        ?.querySelector('[data-date-field-control]')
        ?.getBoundingClientRect()

      if (!rect) {
        return
      }

      const gap = 8
      const popoverRect = popoverRef.current?.getBoundingClientRect()
      const calendarHeight = popoverRect?.height ?? 340
      const spaceBelow = window.innerHeight - rect.bottom
      const opensAbove =
        spaceBelow < calendarHeight + gap && rect.top >= calendarHeight + gap
      const top = opensAbove
        ? rect.top - calendarHeight - gap
        : rect.bottom + gap

      setPopoverStyle({
        left: Math.max(gap, rect.left),
        top,
        width: rect.width,
      })
    }

    if (isOpen) {
      updatePopoverPosition()
      const animationFrame = window.requestAnimationFrame(updatePopoverPosition)
      window.addEventListener('resize', updatePopoverPosition)
      window.addEventListener('scroll', updatePopoverPosition, true)

      return () => {
        window.cancelAnimationFrame(animationFrame)
        window.removeEventListener('resize', updatePopoverPosition)
        window.removeEventListener('scroll', updatePopoverPosition, true)
      }
    }

    return () => {
      window.removeEventListener('resize', updatePopoverPosition)
      window.removeEventListener('scroll', updatePopoverPosition, true)
    }
  }, [isOpen])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node

      if (
        !rootRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('pointerdown', handlePointerDown)
    }

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  function commitValue(nextValue: DatePickerValue) {
    if (nextValue !== '') {
      draftYearDigitsRef.current = ''
      setDraftMonth(undefined)
    }

    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  function getDraftMonthFromYear(year: number) {
    if (year < 1000) {
      return undefined
    }

    if (year < calendarStartMonth.getFullYear()) {
      return undefined
    }

    if (year > calendarEndMonth.getFullYear()) {
      return undefined
    }

    if (minDate && year === minDate.getFullYear()) {
      return new Date(year, minDate.getMonth())
    }

    if (maxDate && year === maxDate.getFullYear()) {
      return new Date(year, maxDate.getMonth())
    }

    return new Date(year, 0)
  }

  function rememberDraftYear(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      draftYearDigitsRef.current = ''
      setDraftMonth(undefined)
      return
    }

    if (!/^\d$/.test(event.key)) {
      return
    }

    const nextDigits = `${draftYearDigitsRef.current}${event.key}`.slice(-4)
    const nextMonth = getDraftMonthFromYear(Number(nextDigits))

    draftYearDigitsRef.current = nextDigits

    if (nextMonth) {
      setDraftMonth(nextMonth)
    }
  }

  function commitDate(nextDate: Date | undefined) {
    const nextValue = nextDate ? formatDateValue(nextDate) : ''

    commitValue(nextValue)
  }

  function focusInput() {
    rootRef.current?.querySelector<HTMLInputElement>('input[type="date"]')?.focus()
  }

  function handleFieldKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)

    if (event.defaultPrevented || !(event.target instanceof HTMLInputElement)) {
      return
    }

    rememberDraftYear(event as KeyboardEvent<HTMLInputElement>)

    if (event.key === 'Escape') {
      setIsOpen(false)
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
    }
  }

  function handleFieldMouseDown(event: MouseEvent<HTMLDivElement>) {
    onMouseDown?.(event)

    if (
      event.defaultPrevented ||
      disabled ||
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLButtonElement
    ) {
      return
    }

    event.preventDefault()
    focusInput()
  }

  function handleCalendarButtonMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
  }

  function setRootNode(node: HTMLDivElement | null) {
    rootRef.current = node

    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  const calendarButton = (
    <button
      type="button"
      disabled={disabled}
      aria-label="Open calendar"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onMouseDown={handleCalendarButtonMouseDown}
      onClick={() => setIsOpen((current) => !current)}
      className="ml-2 inline-flex size-5 shrink-0 items-center justify-center rounded text-foreground-tertiary transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed"
    >
      <CalendarIcon className="size-4 shrink-0" aria-hidden />
    </button>
  )

  const calendarPopover =
    isOpen && !disabled && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className="date-picker-popover fixed z-50"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                commitDate(date)
                setIsOpen(false)
                focusInput()
              }}
              defaultMonth={selectedDate ?? draftMonth ?? new Date(2026, 3)}
              captionLayout="dropdown"
              startMonth={calendarStartMonth}
              endMonth={calendarEndMonth}
              disabled={disabledMatchers}
              classNames={{
                root:
                  'w-full rounded-[14px] border border-border bg-surface-primary p-3 font-sans text-foreground shadow-sm',
                month: 'w-full space-y-4',
                month_grid: 'w-full border-collapse',
                weekday:
                  'flex h-8 min-w-0 items-center justify-center pb-1 text-center text-xs font-normal text-foreground-tertiary',
                day: 'relative h-8 min-w-0 p-0 text-center text-sm',
                day_button: cx(
                  'inline-flex size-8 items-center justify-center rounded-[10px] text-sm font-normal leading-none transition-colors',
                  'hover:bg-surface-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-accent disabled:pointer-events-none',
                ),
              }}
            />
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <DateField
        {...props}
        ref={setRootNode}
        id={id}
        value={dateValue}
        defaultValue={defaultValue}
        onChange={commitValue}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={handleFieldKeyDown}
        onMouseDown={handleFieldMouseDown}
      >
        {calendarButton}
      </DateField>
      {calendarPopover}
    </>
  )
})

DatePicker.displayName = 'DatePicker'
