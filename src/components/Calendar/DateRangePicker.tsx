import { Calendar as CalendarIcon } from 'lucide-react'
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import type { DateRange } from 'react-day-picker'

import { cx } from '../_internal/cx'
import {
  getFieldBorderClass,
  getFieldContainerClass,
  getFieldDescribedBy,
  getFieldHelperClass,
  getFieldLabelClass,
  getFieldSurfaceClass,
  type FieldVariant,
} from '../_internal/fieldStyles'
import { Calendar } from './Calendar'

export type DateRangePickerDateValue = string

export type DateRangePickerValue = {
  start?: DateRangePickerDateValue
  end?: DateRangePickerDateValue
}

type DateBoundary = 'start' | 'end'

export type DateRangePickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  variant?: FieldVariant
  value?: DateRangePickerValue
  defaultValue?: DateRangePickerValue
  onChange?: (value: DateRangePickerValue) => void
  name?: string
  min?: DateRangePickerDateValue
  max?: DateRangePickerDateValue
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  error?: boolean
  placeholder?: string
  inputClassName?: string
  'aria-describedby'?: string
}

function parseDateValue(value?: DateRangePickerDateValue) {
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

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      className = '',
      inputClassName = '',
      label,
      description,
      errorMessage,
      id,
      value,
      defaultValue,
      onChange,
      name,
      min,
      max,
      required,
      disabled,
      invalid = false,
      error = false,
      variant = 'default',
      placeholder = 'dd.mm.yyyy',
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref,
  ) {
    const autoId = useId()
    const fieldId = id ?? `daterangepicker-${autoId}`
    const descriptionId = description != null ? `${fieldId}-description` : undefined
    const errorId = errorMessage != null ? `${fieldId}-error` : undefined
    const rootRef = useRef<HTMLDivElement>(null)
    const fieldRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    const startInputRef = useRef<HTMLInputElement>(null)
    const endInputRef = useRef<HTMLInputElement>(null)
    const draftYearDigitsRef = useRef<Record<DateBoundary, string>>({
      start: '',
      end: '',
    })
    const [internalValue, setInternalValue] = useState<DateRangePickerValue>(
      defaultValue ?? { start: '', end: '' },
    )
    const [activeBoundary, setActiveBoundary] = useState<DateBoundary>('start')
    const [draftMonths, setDraftMonths] = useState<Partial<Record<DateBoundary, Date>>>({})
    const [isOpen, setIsOpen] = useState(false)
    const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({
      left: 0,
      top: 0,
    })
    const rangeValue = value ?? internalValue
    const startValue = rangeValue.start ?? ''
    const endValue = rangeValue.end ?? ''
    const startDate = useMemo(() => parseDateValue(startValue), [startValue])
    const endDate = useMemo(() => parseDateValue(endValue), [endValue])
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

    const isStartOutOfRange =
      startValue !== '' &&
      ((min != null && startValue < min) || (max != null && startValue > max))
    const isEndOutOfRange =
      endValue !== '' &&
      ((min != null && endValue < min) || (max != null && endValue > max))
    const isRangeOutOfOrder =
      startValue !== '' &&
      endValue !== '' &&
      startValue > endValue
    const isInvalid =
      invalid ||
      error ||
      (startValue !== '' && (!parseDateValue(startValue) || isStartOutOfRange)) ||
      (endValue !== '' && (!parseDateValue(endValue) || isEndOutOfRange)) ||
      isRangeOutOfOrder
    const helperId = isInvalid ? errorId : descriptionId
    const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
    const helperText = isInvalid ? errorMessage : description
    const labelClass = getFieldLabelClass(disabled)
    const helperClass = getFieldHelperClass(isInvalid)

    useEffect(() => {
      function updatePopoverPosition() {
        const rect = fieldRef.current?.getBoundingClientRect()

        if (!rect) {
          return
        }

        const gap = 8
        const popoverRect = popoverRef.current?.getBoundingClientRect()
        const calendarHeight = popoverRect?.height ?? 340
        const calendarWidth = popoverRect?.width ?? 604
        const spaceBelow = window.innerHeight - rect.bottom
        const opensAbove =
          spaceBelow < calendarHeight + gap && rect.top >= calendarHeight + gap
        const top = opensAbove
          ? rect.top - calendarHeight - gap
          : rect.bottom + gap
        const left = Math.min(
          Math.max(gap, rect.left),
          Math.max(gap, window.innerWidth - calendarWidth - gap),
        )

        setPopoverStyle({
          left,
          top,
          minWidth: rect.width,
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

    const selectedRange: DateRange | undefined =
      startDate || endDate ? { from: startDate, to: endDate } : undefined
    const groupBase = cx(
      'inline-flex w-full min-w-[360px] items-center rounded-lg border py-2 pl-3 pr-2 text-sm',
      'font-sans transition-[border-color,box-shadow] focus-within:outline-none',
    )
    const nativeInputClass = cx(
      'w-[10ch] shrink-0 appearance-none bg-transparent p-0 font-sans text-sm tabular-nums outline-none',
      'placeholder:text-field-placeholder disabled:cursor-not-allowed disabled:text-foreground-tertiary',
      '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
    )

    function commitValue(nextValue: DateRangePickerValue) {
      if (value === undefined) {
        setInternalValue(nextValue)
      }

      onChange?.(nextValue)
    }

    function clearDraftYear(boundary: DateBoundary) {
      draftYearDigitsRef.current[boundary] = ''
      setDraftMonths((current) => {
        if (current[boundary] == null) {
          return current
        }

        const nextMonths = { ...current }
        delete nextMonths[boundary]

        return nextMonths
      })
    }

    function commitDateInput(boundary: DateBoundary, nextDateValue: string) {
      const nextValue =
        boundary === 'start'
          ? { start: nextDateValue, end: endValue }
          : { start: startValue, end: nextDateValue }

      clearDraftYear(boundary)
      commitValue(nextValue)
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

    function rememberDraftYear(boundary: DateBoundary, event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        clearDraftYear(boundary)
        return
      }

      if (!/^\d$/.test(event.key)) {
        return
      }

      const nextDigits = `${draftYearDigitsRef.current[boundary]}${event.key}`.slice(-4)
      const nextMonth = getDraftMonthFromYear(Number(nextDigits))

      draftYearDigitsRef.current[boundary] = nextDigits

      if (nextMonth) {
        setDraftMonths((current) => ({
          ...current,
          [boundary]: nextMonth,
        }))
      }
    }

    function focusInput(inputRef: RefObject<HTMLInputElement | null>) {
      if (typeof window === 'undefined') {
        inputRef.current?.focus()
        return
      }

      window.requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }

    function commitRange(nextRange: DateRange | undefined) {
      const nextValue = {
        start: nextRange?.from ? formatDateValue(nextRange.from) : '',
        end: nextRange?.to ? formatDateValue(nextRange.to) : '',
      }

      commitValue(nextValue)

      if (nextValue.start !== '' && nextValue.end !== '') {
        setIsOpen(false)
        focusInput(startInputRef)
      } else if (nextValue.start !== '') {
        focusInput(endInputRef)
      }
    }

    function handleDateInputKeyDown(
      event: KeyboardEvent<HTMLInputElement>,
      boundary: DateBoundary,
    ) {
      rememberDraftYear(boundary, event)

      if (event.key === 'Escape') {
        setIsOpen(false)
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    function handleFieldMouseDown(event: MouseEvent<HTMLDivElement>) {
      if (
        disabled ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLButtonElement
      ) {
        return
      }

      event.preventDefault()
      startInputRef.current?.focus()
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

    const calendarPopover =
      isOpen && !disabled && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={popoverRef}
              style={popoverStyle}
              className="date-picker-popover fixed z-50 max-w-[calc(100vw-16px)] overflow-x-auto"
            >
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={commitRange}
                defaultMonth={
                  startDate ??
                  endDate ??
                  draftMonths[activeBoundary] ??
                  draftMonths.start ??
                  draftMonths.end ??
                  new Date(2026, 3)
                }
                startMonth={calendarStartMonth}
                endMonth={calendarEndMonth}
                disabled={disabledMatchers}
                excludeDisabled
                numberOfMonths={2}
                resetOnSelect
                showOutsideDays={false}
                classNames={{
                  root:
                    'rounded-[14px] border border-border bg-surface-primary p-3 font-sans text-foreground shadow-sm',
                }}
              />
            </div>,
            document.body,
          )
        : null

    return (
      <div
        ref={setRootNode}
        className={getFieldContainerClass(className)}
        {...props}
      >
        <div>
          {label != null ? (
            <label
              htmlFor={fieldId}
              id={`${fieldId}-label`}
              className={cx('text-sm font-medium leading-snug', labelClass)}
            >
              {label}
              {required ? (
                <span className="ml-1 text-danger" aria-hidden>
                  *
                </span>
              ) : null}
            </label>
          ) : null}
        </div>
        <div
          ref={fieldRef}
          role="group"
          aria-labelledby={label != null ? `${fieldId}-label` : undefined}
          aria-describedby={describedBy}
          aria-invalid={isInvalid ? true : undefined}
          aria-disabled={disabled ? true : undefined}
          onMouseDown={handleFieldMouseDown}
          className={cx(
            groupBase,
            getFieldSurfaceClass(variant),
            getFieldBorderClass(isInvalid),
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text',
            inputClassName,
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <input
              ref={startInputRef}
              id={fieldId}
              type="date"
              aria-label="Start date"
              aria-describedby={describedBy}
              aria-invalid={isInvalid ? true : undefined}
              autoComplete="off"
              disabled={disabled}
              max={max}
              min={min}
              placeholder={placeholder}
              required={required}
              value={startValue}
              onFocus={() => setActiveBoundary('start')}
              onChange={(event) => commitDateInput('start', event.target.value)}
              onKeyDown={(event) => handleDateInputKeyDown(event, 'start')}
              className={cx(
                nativeInputClass,
                startValue === '' ? 'text-foreground-tertiary' : 'text-inherit',
              )}
            />
            <span className="shrink-0 text-foreground-tertiary" aria-hidden>
              —
            </span>
            <input
              ref={endInputRef}
              type="date"
              aria-label="End date"
              aria-describedby={describedBy}
              aria-invalid={isInvalid ? true : undefined}
              autoComplete="off"
              disabled={disabled}
              max={max}
              min={min}
              placeholder={placeholder}
              required={required}
              value={endValue}
              onFocus={() => setActiveBoundary('end')}
              onChange={(event) => commitDateInput('end', event.target.value)}
              onKeyDown={(event) => handleDateInputKeyDown(event, 'end')}
              className={cx(
                nativeInputClass,
                endValue === '' ? 'text-foreground-tertiary' : 'text-inherit',
              )}
            />
          </div>
          <button
            type="button"
            disabled={disabled}
            aria-label="Open calendar"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onMouseDown={handleCalendarButtonMouseDown}
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex size-5 shrink-0 items-center justify-center rounded text-foreground-tertiary transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed"
          >
            <CalendarIcon className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
        {name != null ? (
          <input
            type="hidden"
            name={name}
            value={
              rangeValue.start != null && rangeValue.end != null
                ? `${rangeValue.start}/${rangeValue.end}`
                : ''
            }
          />
        ) : null}
        {helperText != null ? (
          <p
            id={helperId}
            className={cx('type-body-xs leading-snug', helperClass)}
            aria-live={isInvalid ? 'polite' : undefined}
          >
            {helperText}
          </p>
        ) : null}
        {calendarPopover}
      </div>
    )
  },
)

DateRangePicker.displayName = 'DateRangePicker'
