import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ForwardedRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Minus, Plus } from 'lucide-react'

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

export type NumberFieldFormat = 'number' | 'currency' | 'percent'

export type NumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'aria-describedby' | 'aria-invalid' | 'className' | 'defaultValue' | 'type' | 'value'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  /** Visual style variant */
  variant?: FieldVariant
  /** Invalid / error visual state */
  invalid?: boolean
  /** Alias for `invalid`, aligned with the lower-level Input prop */
  error?: boolean
  /** Display format for the accepted value */
  format?: NumberFieldFormat
  /** Currency suffix, used when `format="currency"` */
  currencySymbol?: string
  value?: number
  defaultValue?: number
  onValueChange?: (value: number | undefined) => void
  className?: string
  inputClassName?: string
  'aria-describedby'?: string
}

function assignRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
    return
  }

  if (ref != null) {
    ref.current = value
  }
}

function getRawNumberText(value: string) {
  return value.replaceAll(',', '').replace(/[^\d.+-]/g, '').trim()
}

function parseNumberText(value: string) {
  const rawValue = getRawNumberText(value)
  const parsedValue = Number(rawValue)

  return rawValue === '' || !Number.isFinite(parsedValue) ? undefined : parsedValue
}

function getNumberProp(value: string | number | undefined) {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? parsedValue : undefined
}

function clampNumber(
  value: number,
  min: number | undefined,
  max: number | undefined,
  format: NumberFieldFormat,
) {
  const lowerBound = min ?? value
  const upperBound = max ?? (format === 'percent' ? 100 : value)

  return Math.min(Math.max(value, lowerBound), upperBound)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatAcceptedValue(
  value: number | undefined,
  format: NumberFieldFormat,
  currencySymbol: string,
) {
  if (value == null) {
    return ''
  }

  if (format === 'currency') {
    return `${formatCurrency(value)} ${currencySymbol}`
  }

  return format === 'percent' ? `${value} %` : String(value)
}

function formatDraftValue(value: string, format: NumberFieldFormat) {
  return format === 'number' ? value : getRawNumberText(value)
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    className = '',
    inputClassName = '',
    label,
    description,
    errorMessage,
    id,
    required,
    invalid = false,
    error = false,
    disabled,
    readOnly,
    variant = 'default',
    format = 'number',
    currencySymbol = '$',
    value,
    defaultValue,
    placeholder,
    min,
    max,
    step = 1,
    style,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    onValueChange,
    'aria-describedby': ariaDescribedByProp,
    ...inputProps
  },
  ref,
) {
  const autoId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = id ?? `numberfield-${autoId}`
  const descriptionId = description != null ? `${inputId}-description` : undefined
  const errorId = errorMessage != null ? `${inputId}-error` : undefined
  const isInvalid = invalid || error
  const helperId = isInvalid ? errorId : descriptionId
  const helperText = isInvalid ? errorMessage : description
  const isFormatted = format !== 'number'
  const isStepDisabled = disabled || readOnly
  const minValue = getNumberProp(min)
  const maxValue = getNumberProp(max)
  const stepValue = getNumberProp(step) ?? 1
  const acceptedValue = value == null ? defaultValue : value
  const [draftValue, setDraftValue] = useState(() =>
    formatAcceptedValue(acceptedValue, format, currencySymbol),
  )
  const [isEditing, setIsEditing] = useState(false)
  const visibleValue = value != null && !isEditing
    ? formatAcceptedValue(value, format, currencySymbol)
    : draftValue
  const inputSizerText = String(visibleValue || placeholder || '0')

  const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
  const labelClass = getFieldLabelClass(disabled)
  const helperClass = getFieldHelperClass(isInvalid)

  function normalizeValue(nextValue: number | undefined) {
    return nextValue == null
      ? undefined
      : clampNumber(nextValue, minValue, maxValue, format)
  }

  function commitValue(nextText: string) {
    const nextValue = normalizeValue(parseNumberText(nextText))

    setDraftValue(formatAcceptedValue(nextValue, format, currencySymbol))
    onValueChange?.(nextValue)
  }

  function stepBy(direction: 'down' | 'up') {
    if (disabled || readOnly) {
      return
    }

    const currentValue = parseNumberText(visibleValue) ?? 0
    const rawNextValue = currentValue + (direction === 'up' ? stepValue : -stepValue)
    const nextValue = normalizeValue(rawNextValue)

    setDraftValue(formatAcceptedValue(nextValue, format, currencySymbol))
    onValueChange?.(nextValue)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDraftValue = formatDraftValue(event.currentTarget.value, format)

    setDraftValue(nextDraftValue)
    onValueChange?.(parseNumberText(nextDraftValue))
    onChange?.(event)
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setIsEditing(true)
    setDraftValue(formatDraftValue(event.currentTarget.value, format))
    onFocus?.(event)
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setIsEditing(false)
    commitValue(event.currentTarget.value)
    onBlur?.(event)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event)

    if (event.key === 'Enter' && !event.defaultPrevented) {
      event.currentTarget.blur()
    }
  }

  return (
    <div className={cx(getFieldContainerClass(), 'w-[240px] max-w-[240px]', className)}>
      {label != null ? (
        <label htmlFor={inputId} className={cx('text-sm font-medium leading-snug', labelClass)}>
          {label}
          {required ? (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        className={cx(
          'flex h-9 w-full min-w-0 items-center overflow-hidden rounded-lg border text-sm transition-[border-color,box-shadow]',
          'font-sans focus-within:outline-none',
          getFieldSurfaceClass(variant),
          getFieldBorderClass(isInvalid),
          disabled ? 'opacity-50' : undefined,
        )}
      >
        <button
          type="button"
          aria-label="Decrease value"
          disabled={isStepDisabled}
          className={cx(
            'inline-flex h-full w-10 shrink-0 items-center justify-center bg-transparent text-foreground-secondary transition-colors',
            'border-r border-field-border hover:bg-surface-secondary-hover hover:text-foreground',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={() => stepBy('down')}
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <div className="grid min-w-0 flex-1 items-center px-3">
          <span
            className="invisible col-start-1 row-start-1 whitespace-pre text-sm"
            aria-hidden
          >
            {inputSizerText}
          </span>
          <input
            ref={(node) => {
              inputRef.current = node
              assignRef(ref, node)
            }}
            id={inputId}
            type={isFormatted ? 'text' : 'number'}
            inputMode="decimal"
            value={visibleValue}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step}
            aria-invalid={isInvalid ? true : undefined}
            aria-describedby={describedBy}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={cx(
              'col-start-1 row-start-1 w-full min-w-[1ch] appearance-none bg-transparent p-0 text-left text-sm text-inherit outline-none',
              'placeholder:text-field-placeholder disabled:cursor-not-allowed read-only:cursor-default',
              '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              inputClassName,
            )}
            style={style}
            {...inputProps}
          />
        </div>
        <button
          type="button"
          aria-label="Increase value"
          disabled={isStepDisabled}
          className={cx(
            'inline-flex h-full w-10 shrink-0 items-center justify-center bg-transparent text-foreground-secondary transition-colors',
            'border-l border-field-border hover:bg-surface-secondary-hover hover:text-foreground',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={() => stepBy('up')}
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
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

NumberField.displayName = 'NumberField'
