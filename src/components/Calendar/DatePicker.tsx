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
  type FocusEvent,
  type MouseEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

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

export type DatePickerValue = string

type DateSegments = {
  day: string
  month: string
  year: string
}

type DateSegment = keyof DateSegments

const emptySegments: DateSegments = {
  day: '',
  month: '',
  year: '',
}

export type DatePickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  variant?: FieldVariant
  value?: DatePickerValue
  defaultValue?: DatePickerValue
  onChange?: (value: DatePickerValue) => void
  name?: string
  min?: DatePickerValue
  max?: DatePickerValue
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  error?: boolean
  placeholder?: string
  inputClassName?: string
  'aria-describedby'?: string
}

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

function getSegmentsFromValue(value?: DatePickerValue): DateSegments {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return emptySegments
  }

  return {
    year: match[1],
    day: match[3],
    month: match[2],
  }
}

function getValueFromSegments(segments: DateSegments) {
  if (segments.year.length !== 4 || segments.month.length !== 2 || segments.day.length !== 2) {
    return ''
  }

  return `${segments.year}-${segments.month}-${segments.day}`
}

function normalizeSegmentValue(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
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
  const fieldId = id ?? `datepicker-${autoId}`
  const descriptionId = description != null ? `${fieldId}-description` : undefined
  const errorId = errorMessage != null ? `${fieldId}-error` : undefined
  const rootRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [uncontrolledSegments, setUncontrolledSegments] = useState(() =>
    getSegmentsFromValue(value ?? defaultValue),
  )
  const [activeSegment, setActiveSegment] = useState<DateSegment | null>(null)
  const [shouldReplaceSegment, setShouldReplaceSegment] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({
    left: 0,
    top: 0,
  })
  const dateValue = value ?? internalValue
  const selectedDate = useMemo(() => parseDateValue(dateValue), [dateValue])
  const minDate = useMemo(() => parseDateValue(min), [min])
  const maxDate = useMemo(() => parseDateValue(max), [max])
  const segments = value !== undefined ? getSegmentsFromValue(value) : uncontrolledSegments
  const disabledMatchers: Array<{ before: Date } | { after: Date }> = []

  if (minDate) {
    disabledMatchers.push({ before: minDate })
  }

  if (maxDate) {
    disabledMatchers.push({ after: maxDate })
  }

  const isOutOfRange =
    dateValue !== '' && ((min != null && dateValue < min) || (max != null && dateValue > max))
  const isInvalid =
    invalid || error || (dateValue !== '' && (!parseDateValue(dateValue) || isOutOfRange))
  const helperId = isInvalid ? errorId : descriptionId
  const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
  const helperText = isInvalid ? errorMessage : description
  const labelClass = getFieldLabelClass(disabled)
  const helperClass = getFieldHelperClass(isInvalid)
  const [dayPlaceholder = 'dd', monthPlaceholder = 'mm', yearPlaceholder = 'yyyy'] =
    placeholder.split('.')

  useEffect(() => {
    function updatePopoverPosition() {
      const rect = fieldRef.current?.getBoundingClientRect()

      if (!rect) {
        return
      }

      const calendarHeight = 340
      const gap = 8
      const opensAbove =
        window.innerHeight - rect.bottom < calendarHeight && rect.top > calendarHeight
      const top = opensAbove
        ? Math.max(gap, rect.top - calendarHeight - gap)
        : rect.bottom + gap

      setPopoverStyle({
        left: Math.max(gap, rect.left),
        top,
        width: rect.width,
      })
    }

    if (isOpen) {
      updatePopoverPosition()
      window.addEventListener('resize', updatePopoverPosition)
      window.addEventListener('scroll', updatePopoverPosition, true)
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

  const groupBase =
    'inline-flex w-full min-w-0 items-center rounded-lg border py-2 pl-3 pr-2 text-sm ' +
    'font-sans transition-[border-color,box-shadow] focus-within:outline-none'
  const segmentClass =
    'min-w-0 shrink-0 select-none p-0 text-center font-sans text-sm tabular-nums caret-transparent outline-none ' +
    'placeholder:text-field-placeholder disabled:cursor-not-allowed disabled:text-foreground-tertiary'
  const segmentCellClass =
    'inline-flex h-5 items-center justify-center rounded px-[0.7px] transition-colors'
  const activeSegmentClass = 'bg-accent/15 text-accent placeholder:!text-accent'

  function commitValue(nextValue: DatePickerValue) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  function commitSegments(nextSegments: DateSegments) {
    const nextValue = getValueFromSegments(nextSegments)

    if (value === undefined) {
      setUncontrolledSegments(nextSegments)
    }

    commitValue(nextValue)
  }

  function commitDate(nextDate: Date | undefined) {
    const nextValue = nextDate ? formatDateValue(nextDate) : ''

    if (value === undefined) {
      setUncontrolledSegments(getSegmentsFromValue(nextValue))
    }

    commitValue(nextValue)
  }

  function getSegmentRef(segment: DateSegment) {
    if (segment === 'day') {
      return dayRef
    }

    if (segment === 'month') {
      return monthRef
    }

    return yearRef
  }

  function getNextSegment(segment: DateSegment) {
    if (segment === 'day') {
      return 'month'
    }

    if (segment === 'month') {
      return 'year'
    }

    return undefined
  }

  function getPreviousSegment(segment: DateSegment) {
    if (segment === 'year') {
      return 'month'
    }

    if (segment === 'month') {
      return 'day'
    }

    return undefined
  }

  function focusSegment(segment: DateSegment) {
    setActiveSegment(segment)
    setShouldReplaceSegment(true)
    getSegmentRef(segment).current?.focus()
  }

  function updateSegment(segment: DateSegment, nextValue: string) {
    const maxLength = segment === 'year' ? 4 : 2
    const digits = nextValue.replace(/\D/g, '')

    if (digits.length > maxLength) {
      const nextSegments = { ...segments }

      if (segment === 'day') {
        nextSegments.day = digits.slice(0, 2)
        nextSegments.month = digits.slice(2, 4)
        nextSegments.year = digits.slice(4, 8)
      } else if (segment === 'month') {
        nextSegments.month = digits.slice(0, 2)
        nextSegments.year = digits.slice(2, 6)
      } else {
        nextSegments.year = digits.slice(0, 4)
      }

      commitSegments(nextSegments)

      if (nextSegments.year.length === 4) {
        focusSegment('year')
      } else if (nextSegments.month.length === 2) {
        focusSegment('year')
      } else {
        focusSegment('month')
      }

      return
    }

    const nextSegmentValue = normalizeSegmentValue(nextValue, maxLength)
    const nextSegments = { ...segments, [segment]: nextSegmentValue }
    commitSegments(nextSegments)

    if (nextSegmentValue.length === maxLength) {
      const nextSegment = getNextSegment(segment)

      if (nextSegment) {
        focusSegment(nextSegment)
      }
    }
  }

  function handleSegmentKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    segment: DateSegment,
  ) {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault()

      const maxLength = segment === 'year' ? 4 : 2
      const currentValue = shouldReplaceSegment ? '' : segments[segment]
      const nextValue = `${currentValue}${event.key}`.slice(0, maxLength)
      const nextSegments = { ...segments, [segment]: nextValue }
      commitSegments(nextSegments)
      setShouldReplaceSegment(false)

      if (nextValue.length === maxLength) {
        const nextSegment = getNextSegment(segment)

        if (nextSegment) {
          focusSegment(nextSegment)
        }
      }

      return
    }

    if (event.key === 'Backspace') {
      event.preventDefault()

      if (shouldReplaceSegment || segments[segment] === '') {
        const previousSegment = getPreviousSegment(segment)

        commitSegments({ ...segments, [segment]: '' })

        if (previousSegment && segments[segment] === '') {
          focusSegment(previousSegment)
        }
      } else {
        commitSegments({ ...segments, [segment]: segments[segment].slice(0, -1) })
        setShouldReplaceSegment(false)
      }

      return
    }

    if (event.key === 'ArrowLeft') {
      const previousSegment = getPreviousSegment(segment)

      if (previousSegment) {
        event.preventDefault()
        focusSegment(previousSegment)
      }
    }

    if (event.key === 'ArrowRight') {
      const nextSegment = getNextSegment(segment)

      if (nextSegment) {
        event.preventDefault()
        focusSegment(nextSegment)
      }
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
    focusSegment('day')
  }

  function handleCalendarButtonMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
  }

  function handleFieldBlur(event: FocusEvent<HTMLDivElement>) {
    if (
      event.currentTarget.contains(event.relatedTarget as Node | null) ||
      popoverRef.current?.contains(event.relatedTarget as Node | null)
    ) {
      return
    }

    setActiveSegment(null)
    setShouldReplaceSegment(true)
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
            className="date-picker-popover fixed z-50"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                commitDate(date)
                setIsOpen(false)
                focusSegment('day')
              }}
              defaultMonth={selectedDate ?? new Date(2026, 3)}
              captionLayout="dropdown"
              startMonth={minDate ?? new Date(1926, 0)}
              endMonth={maxDate ?? new Date(2026, 11)}
              disabled={disabledMatchers}
              classNames={{
                root:
                  'w-full rounded-[14px] border border-border bg-surface-primary p-3 font-sans text-foreground shadow-sm',
                month: 'w-full space-y-4',
                month_grid: 'w-full border-collapse',
                weekday:
                  'flex h-8 min-w-0 items-center justify-center pb-1 text-center text-xs font-normal text-foreground-tertiary',
                day: 'relative h-8 min-w-0 p-0 text-center text-sm',
                day_button:
                  'inline-flex size-8 items-center justify-center rounded-[10px] text-sm font-normal leading-none transition-colors ' +
                  'hover:bg-surface-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
                  'focus-visible:outline-accent disabled:pointer-events-none',
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
          <label htmlFor={fieldId} id={`${fieldId}-label`} className={`text-sm font-medium leading-snug ${labelClass}`}>
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
        onBlur={handleFieldBlur}
        className={cx(
          groupBase,
          getFieldSurfaceClass(variant),
          getFieldBorderClass(isInvalid),
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text',
          inputClassName,
        )}
      >
        <input
          ref={dayRef}
          id={fieldId}
          aria-label="Day"
          inputMode="numeric"
          autoComplete="bday-day"
          disabled={disabled}
          placeholder={dayPlaceholder}
          value={segments.day}
          onFocus={() => focusSegment('day')}
          onChange={(event) => updateSegment('day', event.target.value)}
          onKeyDown={(event) => handleSegmentKeyDown(event, 'day')}
          className={`${segmentCellClass} ${
            activeSegment === 'day' ? activeSegmentClass : ''
          } ${segmentClass} w-[3.35ch]`}
        />
        <span className="px-[0.7px] text-foreground-tertiary" aria-hidden>
          .
        </span>
        <input
          ref={monthRef}
          aria-label="Month"
          inputMode="numeric"
          autoComplete="bday-month"
          disabled={disabled}
          placeholder={monthPlaceholder}
          value={segments.month}
          onFocus={() => focusSegment('month')}
          onChange={(event) => updateSegment('month', event.target.value)}
          onKeyDown={(event) => handleSegmentKeyDown(event, 'month')}
          className={`${segmentCellClass} ${
            activeSegment === 'month' ? activeSegmentClass : ''
          } ${segmentClass} w-[3.35ch]`}
        />
        <span className="px-[0.7px] text-foreground-tertiary" aria-hidden>
          .
        </span>
        <input
          ref={yearRef}
          aria-label="Year"
          inputMode="numeric"
          autoComplete="bday-year"
          disabled={disabled}
          placeholder={yearPlaceholder}
          value={segments.year}
          onFocus={() => focusSegment('year')}
          onChange={(event) => updateSegment('year', event.target.value)}
          onKeyDown={(event) => handleSegmentKeyDown(event, 'year')}
          className={`${segmentCellClass} ${
            activeSegment === 'year' ? activeSegmentClass : ''
          } ${segmentClass} w-[5ch]`}
        />
        <span className="min-w-0 flex-1" aria-hidden />
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
      </div>
      {name != null ? <input type="hidden" name={name} value={dateValue} /> : null}
      {helperText != null ? (
        <p
          id={helperId}
          className={`text-xs leading-snug ${helperClass}`}
          aria-live={isInvalid ? 'polite' : undefined}
        >
          {helperText}
        </p>
      ) : null}
      {calendarPopover}
    </div>
  )
})

DatePicker.displayName = 'DatePicker'
