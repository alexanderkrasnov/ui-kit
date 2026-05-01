import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ForwardedRef,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

import { Button, type ButtonProps } from '../Button'
import { CloseButton } from '../CloseButton'

export type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'aria-describedby' | 'aria-invalid' | 'className' | 'type'
> & {
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  /** Visual style variant */
  variant?: 'default' | 'secondary'
  /** Invalid / error visual state */
  invalid?: boolean
  /** Alias for `invalid`, aligned with the lower-level Input prop */
  error?: boolean
  /** Optional action rendered at the right edge of the field */
  actionLabel?: ReactNode
  actionProps?: Omit<ButtonProps, 'children' | 'size'>
  className?: string
  inputClassName?: string
  'aria-describedby'?: string
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
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

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
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
    variant = 'default',
    actionLabel,
    actionProps,
    value,
    defaultValue,
    onBlur,
    onChange,
    onFocus,
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [internalValue, setInternalValue] = useState(() => String(value ?? defaultValue ?? ''))
  const [isInputFocused, setIsInputFocused] = useState(false)
  const {
    onClick: actionOnClick,
    variant: actionVariant = 'primary',
    ...restActionProps
  } = actionProps ?? {}
  const inputId = id ?? `searchfield-${autoId}`
  const descriptionId = description != null ? `${inputId}-description` : undefined
  const errorId = errorMessage != null ? `${inputId}-error` : undefined
  const isInvalid = invalid || error
  const helperId = isInvalid ? errorId : descriptionId
  const hasAction = actionLabel != null
  const currentValue = String(value ?? internalValue ?? '')
  const showClearButton = !disabled && currentValue.length > 0 && !isInputFocused

  const describedBy =
    [ariaDescribedByProp, helperId].filter(Boolean).join(' ') || undefined

  const labelClass = disabled ? 'text-foreground-tertiary' : 'text-foreground'
  const helperClass = isInvalid ? 'text-danger' : 'text-foreground-tertiary'
  const helperText = isInvalid ? errorMessage : description

  const fieldBase =
    'flex w-full min-w-0 items-center border text-sm transition-[border-color,box-shadow] ' +
    'font-sans focus-within:outline-none disabled:cursor-not-allowed'

  const fieldSize = hasAction ? 'h-10 py-1 pl-3 pr-1' : 'h-9 px-3 py-2'
  const fieldRadius = hasAction ? 'rounded-xl' : 'rounded-lg'

  const variants: Record<NonNullable<SearchFieldProps['variant']>, string> = {
    default: 'bg-field-background shadow-sm text-field-foreground',
    secondary: 'bg-surface-secondary text-foreground',
  }

  const normal = 'border-transparent focus-within:border-field-border-focus'
  const invalidClass = 'border-danger focus-within:border-field-border-invalid-focus'

  function handleActionClick(event: React.MouseEvent<HTMLButtonElement>) {
    const query = inputRef.current?.value.trim() ?? ''

    if (query.length === 0) {
      inputRef.current?.focus()
      return
    }

    actionOnClick?.(event)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (value == null) {
      setInternalValue(event.currentTarget.value)
    }

    onChange?.(event)
  }

  function handleInputFocus(event: FocusEvent<HTMLInputElement>) {
    setIsInputFocused(true)
    onFocus?.(event)
  }

  function handleInputBlur(event: FocusEvent<HTMLInputElement>) {
    setIsInputFocused(false)
    onBlur?.(event)
  }

  function handleClearClick() {
    const input = inputRef.current

    if (input == null) {
      return
    }

    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set

    valueSetter?.call(input, '')
    setInternalValue('')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.focus()
  }

  return (
    <div className={`inline-flex min-w-[250px] flex-col gap-1.5 font-sans ${className}`.trim()}>
      {label != null ? (
        <label htmlFor={inputId} className={`text-sm font-medium leading-snug ${labelClass}`}>
          {label}
          {required ? (
            <span className="ml-1 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        className={`${fieldBase} ${fieldSize} ${fieldRadius} ${variants[variant]} ${
          isInvalid ? invalidClass : normal
        } ${disabled ? 'opacity-50' : ''}`.trim()}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="inline-flex shrink-0 text-foreground-secondary [&_svg]:size-4">
            <SearchIcon />
          </span>
          <input
            ref={(node) => {
              inputRef.current = node
              assignRef(ref, node)
            }}
            id={inputId}
            type="search"
            required={required}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={isInvalid ? true : undefined}
            aria-describedby={describedBy}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={`min-w-0 flex-1 appearance-none bg-transparent p-0 text-sm text-inherit outline-none placeholder:text-field-placeholder disabled:cursor-not-allowed [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none ${inputClassName}`.trim()}
            {...props}
          />
        </div>
        {showClearButton ? (
          <CloseButton
            size="sm"
            variant="ghost"
            aria-label="Clear search"
            className={hasAction ? 'ml-1' : '-mr-2'}
            onClick={handleClearClick}
          />
        ) : null}
        {hasAction ? (
          <Button
            type="button"
            size="small"
            variant={actionVariant}
            className="ml-1 shrink-0"
            disabled={disabled}
            onClick={handleActionClick}
            {...restActionProps}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
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

SearchField.displayName = 'SearchField'
