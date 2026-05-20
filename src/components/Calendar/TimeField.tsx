import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type HTMLAttributes,
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

export type TimeFieldValue = string

export type TimeFieldProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  variant?: FieldVariant
  value?: TimeFieldValue
  defaultValue?: TimeFieldValue
  onChange?: (value: TimeFieldValue) => void
  name?: string
  min?: TimeFieldValue
  max?: TimeFieldValue
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  error?: boolean
  inputClassName?: string
  'aria-describedby'?: string
}

type TimeSegments = {
  hour: string
  minute: string
}

type TimeSegment = keyof TimeSegments

const emptySegments: TimeSegments = {
  hour: '',
  minute: '',
}

function getSegmentsFromValue(value?: TimeFieldValue): TimeSegments {
  const match = value?.match(/^(\d{2}):(\d{2})$/)

  if (!match) {
    return emptySegments
  }

  return {
    hour: match[1],
    minute: match[2],
  }
}

function getValueFromSegments(segments: TimeSegments) {
  if (segments.hour.length !== 2 || segments.minute.length !== 2) {
    return ''
  }

  return `${segments.hour}:${segments.minute}`
}

function isValidTimeValue(value: TimeFieldValue) {
  const match = value.match(/^(\d{2}):(\d{2})$/)

  if (!match) {
    return false
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59
}

function normalizeSegmentValue(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength)
}

export const TimeField = forwardRef<HTMLDivElement, TimeFieldProps>(function TimeField(
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
  const fieldId = id ?? `timefield-${autoId}`
  const descriptionId = description != null ? `${fieldId}-description` : undefined
  const errorId = errorMessage != null ? `${fieldId}-error` : undefined
  const [uncontrolledSegments, setUncontrolledSegments] = useState(() =>
    getSegmentsFromValue(value ?? defaultValue),
  )
  const [activeSegment, setActiveSegment] = useState<TimeSegment | null>(null)
  const [shouldReplaceSegment, setShouldReplaceSegment] = useState(true)
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)

  const segments = value !== undefined ? getSegmentsFromValue(value) : uncontrolledSegments
  const timeValue = useMemo(() => getValueFromSegments(segments), [segments])
  const isComplete = timeValue !== ''
  const isOutOfRange =
    isComplete &&
    ((min != null && timeValue < min) || (max != null && timeValue > max))
  const isInvalid =
    invalid || error || (isComplete && (!isValidTimeValue(timeValue) || isOutOfRange))
  const helperId = isInvalid ? errorId : descriptionId
  const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
  const helperText = isInvalid ? errorMessage : description
  const labelClass = getFieldLabelClass(disabled)
  const helperClass = getFieldHelperClass(isInvalid)

  const groupBase = cx(
    'inline-flex w-full min-w-0 items-center rounded-lg border px-3 py-2 text-sm',
    'font-sans transition-[border-color,box-shadow] focus-within:outline-none',
    'disabled:cursor-not-allowed',
  )
  const segmentClass = cx(
    'min-w-0 shrink-0 select-none p-0 text-center font-sans text-sm tabular-nums caret-transparent outline-none',
    'placeholder:text-field-placeholder disabled:cursor-not-allowed disabled:text-foreground-tertiary',
  )
  const segmentCellClass =
    'inline-flex h-5 items-center justify-center rounded px-[1.4px] transition-colors'
  const activeSegmentClass = 'bg-accent/15 text-accent placeholder:!text-accent'

  function getSegmentRef(segment: TimeSegment) {
    if (segment === 'hour') {
      return hourRef
    }

    return minuteRef
  }

  function getNextSegment(segment: TimeSegment) {
    if (segment === 'hour') {
      return 'minute'
    }

    return undefined
  }

  function getPreviousSegment(segment: TimeSegment) {
    if (segment === 'minute') {
      return 'hour'
    }

    return undefined
  }

  function focusSegment(segment: TimeSegment) {
    setActiveSegment(segment)
    setShouldReplaceSegment(true)
    getSegmentRef(segment).current?.focus()
  }

  function commitSegments(nextSegments: TimeSegments) {
    if (value === undefined) {
      setUncontrolledSegments(nextSegments)
    }

    onChange?.(getValueFromSegments(nextSegments))
  }

  function updateSegment(segment: TimeSegment, nextValue: string) {
    const digits = nextValue.replace(/\D/g, '')

    if (digits.length > 2) {
      const nextSegments = { ...segments }

      if (segment === 'hour') {
        nextSegments.hour = digits.slice(0, 2)
        nextSegments.minute = digits.slice(2, 4)
      } else {
        nextSegments.minute = digits.slice(0, 2)
      }

      commitSegments(nextSegments)

      if (nextSegments.minute.length === 2) {
        focusSegment('minute')
      } else {
        focusSegment('minute')
      }

      return
    }

    const nextSegmentValue = normalizeSegmentValue(nextValue, 2)
    const nextSegments = { ...segments, [segment]: nextSegmentValue }
    commitSegments(nextSegments)

    if (nextSegmentValue.length === 2) {
      const nextSegment = getNextSegment(segment)

      if (nextSegment) {
        focusSegment(nextSegment)
      }
    }
  }

  function handleSegmentKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    segment: TimeSegment,
  ) {
    if (/^\d$/.test(event.key)) {
      event.preventDefault()

      const currentValue = shouldReplaceSegment ? '' : segments[segment]
      const nextValue = `${currentValue}${event.key}`.slice(0, 2)
      const nextSegments = { ...segments, [segment]: nextValue }
      commitSegments(nextSegments)
      setShouldReplaceSegment(false)

      if (nextValue.length === 2) {
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

    if (digits.length !== 4) {
      return
    }

    event.preventDefault()
    commitSegments({
      hour: digits.slice(0, 2),
      minute: digits.slice(2, 4),
    })
  }

  function handleFieldMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (disabled || event.target instanceof HTMLInputElement) {
      return
    }

    event.preventDefault()
    focusSegment('hour')
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
        <label id={`${fieldId}-label`} className={cx('text-sm font-medium leading-snug', labelClass)}>
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
          ref={hourRef}
          aria-label="Hour"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          placeholder="hh"
          value={segments.hour}
          onFocus={() => focusSegment('hour')}
          onChange={(event) => updateSegment('hour', event.target.value)}
          onKeyDown={(event) => handleSegmentKeyDown(event, 'hour')}
          className={cx(
            segmentCellClass,
            activeSegment === 'hour' && activeSegmentClass,
            segmentClass,
            'w-[3.35ch]',
          )}
        />
        <span className="px-0.5 text-foreground-tertiary" aria-hidden>
          :
        </span>
        <input
          ref={minuteRef}
          aria-label="Minute"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          placeholder="mm"
          value={segments.minute}
          onFocus={() => focusSegment('minute')}
          onChange={(event) => updateSegment('minute', event.target.value)}
          onKeyDown={(event) => handleSegmentKeyDown(event, 'minute')}
          className={cx(
            segmentCellClass,
            activeSegment === 'minute' && activeSegmentClass,
            segmentClass,
            'w-[3.35ch]',
          )}
        />
      </div>
      {name != null ? <input type="hidden" name={name} value={timeValue} /> : null}
      {helperText != null ? (
        <p
          id={helperId}
          className={cx('text-xs leading-snug', helperClass)}
          aria-live={isInvalid ? 'polite' : undefined}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

TimeField.displayName = 'TimeField'
