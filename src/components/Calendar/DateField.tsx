import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
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
  placeholder?: string
  'aria-describedby'?: string
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
    placeholder,
    children,
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? `datefield-${autoId}`
  const descriptionId = description != null ? `${fieldId}-description` : undefined
  const errorId = errorMessage != null ? `${fieldId}-error` : undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const dateValue = value ?? internalValue
  const isOutOfRange =
    dateValue !== '' && ((min != null && dateValue < min) || (max != null && dateValue > max))
  const isInvalid =
    invalid || error || (dateValue !== '' && (!isValidDateValue(dateValue) || isOutOfRange))
  const helperId = isInvalid ? errorId : descriptionId
  const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
  const helperText = isInvalid ? errorMessage : description
  const labelClass = getFieldLabelClass(disabled)
  const helperClass = getFieldHelperClass(isInvalid)

  const fieldBase = cx(
    'inline-flex w-full min-w-0 items-center rounded-lg border py-2 pl-3 text-sm',
    'font-sans transition-[border-color,box-shadow] focus-within:outline-none',
  )
  const nativeInputBase = cx(
    'min-w-0 flex-1 bg-transparent p-0 font-sans text-sm outline-none',
    'placeholder:text-field-placeholder disabled:cursor-not-allowed',
  )
  const nativePickerIndicatorClass =
    children != null
      ? '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
      : ''

  function commitValue(nextValue: DateFieldValue) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)
  }

  return (
    <div
      ref={ref}
      className={getFieldContainerClass(className)}
      {...props}
    >
      {label != null ? (
        <label htmlFor={fieldId} id={`${fieldId}-label`} className={cx('text-sm font-medium leading-snug', labelClass)}>
          {label}
          {required ? (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        data-date-field-control
        role={children != null ? 'group' : undefined}
        aria-labelledby={children != null && label != null ? `${fieldId}-label` : undefined}
        aria-disabled={disabled ? true : undefined}
        className={cx(
          fieldBase,
          children != null ? 'pr-2' : 'pr-3',
          getFieldSurfaceClass(variant),
          getFieldBorderClass(isInvalid),
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text',
          inputClassName,
        )}
      >
        <input
          id={fieldId}
          type="date"
          name={name}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={dateValue}
          aria-describedby={describedBy}
          aria-invalid={isInvalid ? true : undefined}
          onChange={(event) => commitValue(event.target.value)}
          className={cx(
            nativeInputBase,
            dateValue === '' ? 'text-foreground-tertiary' : 'text-inherit',
            nativePickerIndicatorClass,
          )}
        />
        {children}
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

DateField.displayName = 'DateField'
