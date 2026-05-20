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
    const [internalValue, setInternalValue] = useState<DateRangePickerValue>(
      defaultValue ?? { start: '', end: '' },
    )
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

        const calendarHeight = 340
        const calendarWidth = 604
        const gap = 8
        const opensAbove =
          window.innerHeight - rect.bottom < calendarHeight && rect.top > calendarHeight
        const top = opensAbove
          ? Math.max(gap, rect.top - calendarHeight - gap)
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

    const selectedRange: DateRange | undefined =
      startDate || endDate ? { from: startDate, to: endDate } : undefined
    const groupBase = cx(
      'inline-flex w-full min-w-[360px] items-center rounded-lg border py-2 pl-3 pr-2 text-sm',
      'font-sans transition-[border-color,box-shadow] focus-within:outline-none',
    )
    const segmentClass = cx(
      'min-w-0 shrink-0 select-none p-0 text-center font-sans text-sm tabular-nums caret-transparent outline-none',
      'placeholder:text-field-placeholder disabled:cursor-not-allowed disabled:text-foreground-tertiary',
    )
    const segmentCellClass =
      'inline-flex h-5 items-center justify-center rounded px-[0.7px] transition-colors'
    const activeSegmentClass = 'bg-accent/15 text-accent placeholder:!text-accent'

    function commitValue(nextValue: DateRangePickerValue) {
      if (value === undefined) {
        setInternalValue(nextValue)
      }

      onChange?.(nextValue)
    }

    function commitSegments(nextSegments: RangeSegments) {
      const nextValue = getValueFromSegments(nextSegments)

      if (value === undefined) {
        setUncontrolledSegments(nextSegments)
      }

      commitValue(nextValue)
    }

    function commitRange(nextRange: DateRange | undefined) {
      const nextValue = {
        start: nextRange?.from ? formatDateValue(nextRange.from) : '',
        end: nextRange?.to ? formatDateValue(nextRange.to) : '',
      }

      if (value === undefined) {
        setUncontrolledSegments(getSegmentsFromRangeValue(nextValue))
      }

      commitValue(nextValue)

      if (nextValue.start !== '' && nextValue.end !== '') {
        setIsOpen(false)
        focusSegment({ boundary: 'start', segment: 'day' })
      } else if (nextValue.start !== '') {
        focusSegment({ boundary: 'end', segment: 'day' })
      }
    }

    function getSegmentRef({ boundary, segment }: ActiveSegment) {
      if (boundary === 'start' && segment === 'day') {
        return startDayRef
      }

      if (boundary === 'start' && segment === 'month') {
        return startMonthRef
      }

      if (boundary === 'start' && segment === 'year') {
        return startYearRef
      }

      if (boundary === 'end' && segment === 'day') {
        return endDayRef
      }

      if (boundary === 'end' && segment === 'month') {
        return endMonthRef
      }

      return endYearRef
    }

    function getNextSegment(current: ActiveSegment): ActiveSegment | undefined {
      if (current.boundary === 'start' && current.segment === 'day') {
        return { boundary: 'start', segment: 'month' }
      }

      if (current.boundary === 'start' && current.segment === 'month') {
        return { boundary: 'start', segment: 'year' }
      }

      if (current.boundary === 'start' && current.segment === 'year') {
        return { boundary: 'end', segment: 'day' }
      }

      if (current.boundary === 'end' && current.segment === 'day') {
        return { boundary: 'end', segment: 'month' }
      }

      if (current.boundary === 'end' && current.segment === 'month') {
        return { boundary: 'end', segment: 'year' }
      }

      return undefined
    }

    function getPreviousSegment(current: ActiveSegment): ActiveSegment | undefined {
      if (current.boundary === 'end' && current.segment === 'year') {
        return { boundary: 'end', segment: 'month' }
      }

      if (current.boundary === 'end' && current.segment === 'month') {
        return { boundary: 'end', segment: 'day' }
      }

      if (current.boundary === 'end' && current.segment === 'day') {
        return { boundary: 'start', segment: 'year' }
      }

      if (current.boundary === 'start' && current.segment === 'year') {
        return { boundary: 'start', segment: 'month' }
      }

      if (current.boundary === 'start' && current.segment === 'month') {
        return { boundary: 'start', segment: 'day' }
      }

      return undefined
    }

    function focusSegment(nextSegment: ActiveSegment) {
      setActiveSegment(nextSegment)
      setShouldReplaceSegment(true)
      getSegmentRef(nextSegment).current?.focus()
    }

    function updateSegment(current: ActiveSegment, nextValue: string) {
      const maxLength = current.segment === 'year' ? 4 : 2
      const digits = nextValue.replace(/\D/g, '')

      if (digits.length > maxLength) {
        const nextSegments = {
          start: { ...segments.start },
          end: { ...segments.end },
        }
        const boundarySegments = nextSegments[current.boundary]

        if (current.segment === 'day') {
          boundarySegments.day = digits.slice(0, 2)
          boundarySegments.month = digits.slice(2, 4)
          boundarySegments.year = digits.slice(4, 8)
        } else if (current.segment === 'month') {
          boundarySegments.month = digits.slice(0, 2)
          boundarySegments.year = digits.slice(2, 6)
        } else {
          boundarySegments.year = digits.slice(0, 4)
        }

        commitSegments(nextSegments)

        if (boundarySegments.year.length === 4) {
          focusSegment({ boundary: current.boundary, segment: 'year' })
        } else if (boundarySegments.month.length === 2) {
          focusSegment({ boundary: current.boundary, segment: 'year' })
        } else {
          focusSegment({ boundary: current.boundary, segment: 'month' })
        }

        return
      }

      const nextSegmentValue = normalizeSegmentValue(nextValue, maxLength)
      const nextSegments = {
        start: { ...segments.start },
        end: { ...segments.end },
      }

      nextSegments[current.boundary][current.segment] = nextSegmentValue
      commitSegments(nextSegments)

      if (nextSegmentValue.length === maxLength) {
        const nextSegment = getNextSegment(current)

        if (nextSegment) {
          focusSegment(nextSegment)
        }
      }
    }

    function handleSegmentKeyDown(
      event: KeyboardEvent<HTMLInputElement>,
      current: ActiveSegment,
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

        const maxLength = current.segment === 'year' ? 4 : 2
        const currentValue = shouldReplaceSegment
          ? ''
          : segments[current.boundary][current.segment]
        const nextValue = `${currentValue}${event.key}`.slice(0, maxLength)
        const nextSegments = {
          start: { ...segments.start },
          end: { ...segments.end },
        }

        nextSegments[current.boundary][current.segment] = nextValue
        commitSegments(nextSegments)
        setShouldReplaceSegment(false)

        if (nextValue.length === maxLength) {
          const nextSegment = getNextSegment(current)

          if (nextSegment) {
            focusSegment(nextSegment)
          }
        }

        return
      }

      if (event.key === 'Backspace') {
        event.preventDefault()

        const previousSegment = getPreviousSegment(current)
        const nextSegments = {
          start: { ...segments.start },
          end: { ...segments.end },
        }
        const currentValue = segments[current.boundary][current.segment]

        if (shouldReplaceSegment || currentValue === '') {
          nextSegments[current.boundary][current.segment] = ''
          commitSegments(nextSegments)

          if (previousSegment && currentValue === '') {
            focusSegment(previousSegment)
          }
        } else {
          nextSegments[current.boundary][current.segment] = currentValue.slice(0, -1)
          commitSegments(nextSegments)
          setShouldReplaceSegment(false)
        }

        return
      }

      if (event.key === 'ArrowLeft') {
        const previousSegment = getPreviousSegment(current)

        if (previousSegment) {
          event.preventDefault()
          focusSegment(previousSegment)
        }
      }

      if (event.key === 'ArrowRight') {
        const nextSegment = getNextSegment(current)

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
      focusSegment({ boundary: 'start', segment: 'day' })
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

    function renderDateSegments(boundary: DateBoundary, isFirstInput = false) {
      const daySegment = { boundary, segment: 'day' } satisfies ActiveSegment
      const monthSegment = { boundary, segment: 'month' } satisfies ActiveSegment
      const yearSegment = { boundary, segment: 'year' } satisfies ActiveSegment

      return (
        <>
          <input
            ref={boundary === 'start' ? startDayRef : endDayRef}
            id={isFirstInput ? fieldId : undefined}
            aria-label={boundary === 'start' ? 'Start day' : 'End day'}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            placeholder={dayPlaceholder}
            value={segments[boundary].day}
            onFocus={() => focusSegment(daySegment)}
            onChange={(event) => updateSegment(daySegment, event.target.value)}
            onKeyDown={(event) => handleSegmentKeyDown(event, daySegment)}
            className={cx(
              segmentCellClass,
              isSameSegment(activeSegment, daySegment) && activeSegmentClass,
              segmentClass,
              'w-[3.35ch]',
            )}
          />
          <span className="px-[0.7px] text-foreground-tertiary" aria-hidden>
            .
          </span>
          <input
            ref={boundary === 'start' ? startMonthRef : endMonthRef}
            aria-label={boundary === 'start' ? 'Start month' : 'End month'}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            placeholder={monthPlaceholder}
            value={segments[boundary].month}
            onFocus={() => focusSegment(monthSegment)}
            onChange={(event) => updateSegment(monthSegment, event.target.value)}
            onKeyDown={(event) => handleSegmentKeyDown(event, monthSegment)}
            className={cx(
              segmentCellClass,
              isSameSegment(activeSegment, monthSegment) && activeSegmentClass,
              segmentClass,
              'w-[3.35ch]',
            )}
          />
          <span className="px-[0.7px] text-foreground-tertiary" aria-hidden>
            .
          </span>
          <input
            ref={boundary === 'start' ? startYearRef : endYearRef}
            aria-label={boundary === 'start' ? 'Start year' : 'End year'}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            placeholder={yearPlaceholder}
            value={segments[boundary].year}
            onFocus={() => focusSegment(yearSegment)}
            onChange={(event) => updateSegment(yearSegment, event.target.value)}
            onKeyDown={(event) => handleSegmentKeyDown(event, yearSegment)}
            className={cx(
              segmentCellClass,
              isSameSegment(activeSegment, yearSegment) && activeSegmentClass,
              segmentClass,
              'w-[5ch]',
            )}
          />
        </>
      )
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
                defaultMonth={startDate ?? endDate ?? new Date(2026, 3)}
                startMonth={minDate ?? new Date(1926, 0)}
                endMonth={maxDate ?? new Date(2026, 11)}
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
          onBlur={handleFieldBlur}
          className={cx(
            groupBase,
            getFieldSurfaceClass(variant),
            getFieldBorderClass(isInvalid),
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text',
            inputClassName,
          )}
        >
          <div className="flex min-w-0 flex-none items-center">
            {renderDateSegments('start', true)}
            <span className="px-1.5 text-foreground-tertiary" aria-hidden>
              —
            </span>
            {renderDateSegments('end')}
          </div>
          <span className="ml-16 min-w-0 flex-1" aria-hidden />
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
