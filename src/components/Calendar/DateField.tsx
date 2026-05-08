import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'

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

export type DateFieldValue = string

export type DateFieldProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  variant?: FieldVariant
  value?: DateFieldValue
  defaultValue?: DateFieldValue
  onChange?: (value: DateFieldValue) => void
  name?: string
  min?: DateFieldValue
  max?: DateFieldValue
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  error?: boolean
  inputClassName?: string
  'aria-describedby'?: string
}

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

function getSegmentsFromValue(value?: DateFieldValue): DateSegments {
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

function isValidDateValue(value: DateFieldValue) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) {
    return false
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function normalizeSegmentValue(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

export const DateField = forwardRef<HTMLDivElement, DateFieldProps>(function DateField(
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
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? `datefield-${autoId}`
  const descriptionId = description != null ? `${fieldId}-description` : undefined
  const errorId = errorMessage != null ? `${fieldId}-error` : undefined
  const [uncontrolledSegments, setUncontrolledSegments] = useState(() =>
    getSegmentsFromValue(value ?? defaultValue),
  )
  const [activeSegment, setActiveSegment] = useState<DateSegment | null>(null)
  const [shouldReplaceSegment, setShouldReplaceSegment] = useState(true)
  const dayRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  const segments = value !== undefined ? getSegmentsFromValue(value) : uncontrolledSegments
  const dateValue = useMemo(() => getValueFromSegments(segments), [segments])
  const isComplete = dateValue !== ''
  const isOutOfRange =
    isComplete &&
    ((min != null && dateValue < min) || (max != null && dateValue > max))
  const isInvalid =
    invalid || error || (isComplete && (!isValidDateValue(dateValue) || isOutOfRange))
  const helperId = isInvalid ? errorId : descriptionId
  const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
  const helperText = isInvalid ? errorMessage : description
  const labelClass = getFieldLabelClass(disabled)
  const helperClass = getFieldHelperClass(isInvalid)

  const groupBase =
    'inline-flex w-full min-w-0 items-center rounded-lg border px-3 py-2 text-sm ' +
    'font-sans transition-[border-color,box-shadow] focus-within:outline-none ' +
    'disabled:cursor-not-allowed'
  const segmentClass =
    'min-w-0 shrink-0 select-none p-0 text-center font-sans text-sm tabular-nums caret-transparent outline-none ' +
    'placeholder:text-field-placeholder disabled:cursor-not-allowed disabled:text-foreground-tertiary'
  const segmentCellClass =
    'inline-flex h-5 items-center justify-center rounded px-[0.7px] transition-colors'
  const activeSegmentClass = 'bg-accent/15 text-accent placeholder:!text-accent'

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

  function commitSegments(nextSegments: DateSegments) {
    if (value === undefined) {
      setUncontrolledSegments(nextSegments)
    }

    onChange?.(getValueFromSegments(nextSegments))
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

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData.getData('text')
    const digits = pasted.replace(/\D/g, '')

    if (digits.length !== 8) {
      return
    }

    event.preventDefault()
    commitSegments({
      day: digits.slice(0, 2),
      month: digits.slice(2, 4),
      year: digits.slice(4, 8),
    })
  }

  function handleFieldMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (disabled || event.target instanceof HTMLInputElement) {
      return
    }

    event.preventDefault()
    focusSegment('day')
  }

  function handleFieldBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }

    setActiveSegment(null)
    setShouldReplaceSegment(true)
  }

  return (
    <div
      ref={ref}
      className={getFieldContainerClass(className)}
      {...props}
    >
      {label != null ? (
        <label id={`${fieldId}-label`} className={`text-sm font-medium leading-snug ${labelClass}`}>
          {label}
          {required ? (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        role="group"
        aria-labelledby={label != null ? `${fieldId}-label` : undefined}
        aria-describedby={describedBy}
        aria-invalid={isInvalid ? true : undefined}
        aria-disabled={disabled ? true : undefined}
        onMouseDown={handleFieldMouseDown}
        onBlur={handleFieldBlur}
        onPaste={handlePaste}
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
          aria-label="Day"
          inputMode="numeric"
          autoComplete="bday-day"
          disabled={disabled}
          placeholder="dd"
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
          placeholder="mm"
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
          placeholder="yyyy"
          value={segments.year}
          onFocus={() => focusSegment('year')}
          onChange={(event) => updateSegment('year', event.target.value)}
          onKeyDown={(event) => handleSegmentKeyDown(event, 'year')}
          className={`${segmentCellClass} ${
            activeSegment === 'year' ? activeSegmentClass : ''
          } ${segmentClass} w-[5ch]`}
        />
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
    </div>
  )
})

DateField.displayName = 'DateField'
