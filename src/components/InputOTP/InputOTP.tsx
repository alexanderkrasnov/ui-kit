import {
  forwardRef,
  Fragment,
  useEffect,
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
  getFieldDescribedBy,
  getFieldHelperClass,
  getFieldLabelClass,
  getFieldSurfaceClass,
  type FieldVariant,
} from '../_internal/fieldStyles'

export type InputOTPValue = string

export type InputOTPProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & {
  /** Number of visible OTP slots */
  length?: number
  /** Controlled OTP value */
  value?: InputOTPValue
  /** Uncontrolled initial OTP value */
  defaultValue?: InputOTPValue
  /** Called whenever the OTP value changes */
  onChange?: (value: InputOTPValue) => void
  /** Called when every slot has a digit */
  onComplete?: (value: InputOTPValue) => void
  /** Removes focus from the last slot when fully completed. */
  blurOnComplete?: boolean
  /** Visual style variant */
  variant?: FieldVariant
  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  /** Invalid / error visual state */
  invalid?: boolean
  /** Alias for `invalid` */
  error?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  slotClassName?: string
  'aria-describedby'?: string
}

const DEFAULT_LENGTH = 6

function sanitizeValue(value: string | undefined, length: number) {
  return (value ?? '').replace(/\D/g, '').slice(0, length)
}

function getSlotCount(length: number | undefined) {
  if (length == null || !Number.isFinite(length)) {
    return DEFAULT_LENGTH
  }

  return Math.max(1, Math.floor(length))
}

function getFirstEmptyIndex(slots: string[]) {
  const index = slots.findIndex((slot) => slot === '')

  return index === -1 ? undefined : index
}

function clampIndex(index: number, max: number) {
  return Math.min(Math.max(index, 0), max)
}

export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(function InputOTP(
  {
    className = '',
    slotClassName = '',
    id,
    length,
    value,
    defaultValue,
    onChange,
    onComplete,
    blurOnComplete = true,
    variant = 'default',
    label,
    description,
    errorMessage,
    invalid = false,
    error = false,
    disabled = false,
    required = false,
    name,
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? `input-otp-${autoId}`
  const slotCount = getSlotCount(length)
  const isControlled = value != null
  const [internalValue, setInternalValue] = useState(() =>
    sanitizeValue(defaultValue, slotCount),
  )
  const currentValue = sanitizeValue(isControlled ? value : internalValue, slotCount)
  const slots = useMemo(
    () => Array.from({ length: slotCount }, (_, index) => currentValue[index] ?? ''),
    [currentValue, slotCount],
  )
  const firstEmptyIndex = getFirstEmptyIndex(slots)
  const [activeIndex, setActiveIndex] = useState(firstEmptyIndex ?? 0)
  const [animationKeys, setAnimationKeys] = useState(() =>
    Array.from({ length: slotCount }, () => 0),
  )
  const previousSlotsRef = useRef(slots)
  const expectedFocusIndexRef = useRef<number | undefined>(undefined)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const descriptionId = description != null ? `${inputId}-description` : undefined
  const errorId = errorMessage != null ? `${inputId}-error` : undefined
  const isInvalid = invalid || error
  const helperId = isInvalid ? errorId : descriptionId
  const describedBy = getFieldDescribedBy(ariaDescribedByProp, helperId)
  const helperText = isInvalid ? errorMessage : description
  const labelClass = getFieldLabelClass(disabled)
  const helperClass = getFieldHelperClass(isInvalid)
  const activeSlotIndex = clampIndex(activeIndex, slotCount - 1)
  const tabStopIndex = firstEmptyIndex ?? activeSlotIndex
  const shouldResetForInvalidRetry = isInvalid && currentValue.length === slotCount

  useEffect(() => {
    setAnimationKeys((current) => {
      let changed = false
      const next = Array.from({ length: slotCount }, (_, index) => {
        const key = current[index] ?? 0
        const slot = slots[index] ?? ''
        const previousSlot = previousSlotsRef.current[index] ?? ''

        if (slot !== '' && slot !== previousSlot) {
          changed = true
          return key + 1
        }

        return key
      })

      return changed ? next : current
    })

    previousSlotsRef.current = slots
  }, [slots, slotCount])

  function focusSlot(index: number) {
    const nextIndex = clampIndex(index, slotCount - 1)

    expectedFocusIndexRef.current = nextIndex
    setActiveIndex(nextIndex)
    inputRefs.current[nextIndex]?.focus()
    inputRefs.current[nextIndex]?.select()
  }

  function blurAllSlots() {
    for (const input of inputRefs.current) {
      input?.blur()
    }
  }

  function resetSlotsForRetry() {
    const clearedSlots = Array.from({ length: slotCount }, () => '')

    commitSlots(clearedSlots)
    focusSlot(0)
  }

  function commitSlots(nextSlots: string[]) {
    const nextValue = sanitizeValue(nextSlots.join(''), slotCount)

    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onChange?.(nextValue)

    const isComplete =
      nextSlots.every((slot) => slot !== '') && nextValue.length === slotCount

    if (isComplete) {
      onComplete?.(nextValue)

      if (blurOnComplete) {
        setTimeout(() => {
          blurAllSlots()
        }, 0)
      }
    }

    return isComplete
  }

  function commitDigitsFromIndex(index: number, digits: string) {
    const nextDigits = sanitizeValue(digits, slotCount)

    if (nextDigits === '') {
      return
    }

    const nextSlots = [...slots]
    let cursor = index

    for (const digit of nextDigits) {
      if (cursor >= slotCount) {
        break
      }

      nextSlots[cursor] = digit
      cursor += 1
    }

    const isComplete = commitSlots(nextSlots)

    if (isComplete && blurOnComplete) {
      return
    }

    const nextEmptyIndex = nextSlots.findIndex(
      (slot, slotIndex) => slotIndex >= cursor && slot === '',
    )

    if (nextEmptyIndex !== -1) {
      focusSlot(nextEmptyIndex)
      return
    }

    focusSlot(Math.min(cursor, slotCount) - 1)
  }

  function handleSlotMouseDown(event: MouseEvent<HTMLInputElement>, index: number) {
    if (disabled) {
      return
    }

    event.preventDefault()

    if (shouldResetForInvalidRetry) {
      resetSlotsForRetry()
      return
    }

    focusSlot(firstEmptyIndex ?? index)
  }

  function handleSlotFocus(event: FocusEvent<HTMLInputElement>, index: number) {
    if (disabled) {
      return
    }

    if (expectedFocusIndexRef.current === index) {
      expectedFocusIndexRef.current = undefined
      setActiveIndex(index)
      event.currentTarget.select()
      return
    }

    if (shouldResetForInvalidRetry) {
      resetSlotsForRetry()
      return
    }

    if (firstEmptyIndex != null && firstEmptyIndex !== index) {
      focusSlot(firstEmptyIndex)
      return
    }

    setActiveIndex(index)
    event.currentTarget.select()
  }

  function handleSlotChange(index: number, nextValue: string) {
    const digits = sanitizeValue(nextValue, slotCount)

    if (digits === '') {
      if (slots[index] === '') {
        return
      }

      const nextSlots = [...slots]
      nextSlots[index] = ''
      commitSlots(nextSlots)
      focusSlot(index)
      return
    }

    commitDigitsFromIndex(index, digits)
  }

  function handleSlotPaste(event: ClipboardEvent<HTMLInputElement>, index: number) {
    event.preventDefault()
    commitDigitsFromIndex(index, event.clipboardData.getData('text'))
  }

  function handleSlotKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === 'Backspace') {
      event.preventDefault()

      const nextSlots = [...slots]
      const targetIndex = slots[index] === '' ? Math.max(index - 1, 0) : index
      nextSlots[targetIndex] = ''
      commitSlots(nextSlots)
      focusSlot(targetIndex)
      return
    }

    if (event.key === 'Delete') {
      event.preventDefault()

      const nextSlots = [...slots]
      nextSlots[index] = ''
      commitSlots(nextSlots)
      focusSlot(index)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusSlot(Math.max(index - 1, 0))
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusSlot(Math.min(index + 1, slotCount - 1))
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusSlot(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusSlot(slotCount - 1)
    }
  }

  const slotBase = cx(
    'relative inline-flex h-10 w-8 shrink-0 items-center justify-center rounded-lg border',
    'text-center font-sans text-2xl tabular-nums transition-[background-color,border-color,box-shadow,color]',
    'focus-within:outline-none',
  )
  const inputClass = cx(
    'absolute inset-0 h-full w-full rounded-lg border-0 bg-transparent p-0 text-center',
    'font-sans text-2xl tabular-nums text-transparent caret-transparent outline-none',
    'selection:bg-transparent disabled:cursor-not-allowed',
  )
  const digitClass = cx(
    'input-otp-digit pointer-events-none absolute inset-0 flex items-center justify-center',
    'text-2xl tabular-nums leading-none',
  )

  return (
    <div
      ref={ref}
      className={cx('inline-flex w-full max-w-sm flex-col gap-3 font-sans', className)}
      {...props}
    >
      {label != null ? (
        <label htmlFor={`${inputId}-slot-0`} className={cx('text-sm font-medium leading-snug', labelClass)}>
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
        aria-describedby={describedBy}
        aria-invalid={isInvalid ? true : undefined}
        aria-required={required ? true : undefined}
        aria-disabled={disabled ? true : undefined}
        className={cx('flex w-full items-center gap-2', disabled && 'opacity-50')}
      >
        {slots.map((slot, index) => (
          <Fragment key={index}>
            <div
              className={cx(
                slotBase,
                getFieldSurfaceClass(variant),
                getFieldBorderClass(isInvalid),
                slotClassName,
              )}
            >
              <input
                ref={(node) => {
                  inputRefs.current[index] = node
                }}
                id={`${inputId}-slot-${index}`}
                aria-label={`Digit ${index + 1}`}
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                disabled={disabled}
                value={slot}
                maxLength={slotCount}
                tabIndex={index === tabStopIndex ? 0 : -1}
                onMouseDown={(event) => handleSlotMouseDown(event, index)}
                onFocus={(event) => handleSlotFocus(event, index)}
                onChange={(event) => handleSlotChange(index, event.currentTarget.value)}
                onPaste={(event) => handleSlotPaste(event, index)}
                onKeyDown={(event) => handleSlotKeyDown(event, index)}
                className={inputClass}
              />
              {slot !== '' ? (
                <span
                  key={`${slot}-${animationKeys[index] ?? 0}`}
                  className={digitClass}
                  aria-hidden
                >
                  {slot}
                </span>
              ) : null}
            </div>
            {slotCount === 6 && index === 2 ? (
              <span className="text-sm text-foreground-tertiary" aria-hidden>
                -
              </span>
            ) : null}
          </Fragment>
        ))}
      </div>
      {name != null ? <input type="hidden" name={name} value={currentValue} /> : null}
      {helperText != null ? (
        <p
          id={helperId}
          className={cx('min-h-[34px] text-xs leading-snug', helperClass)}
          aria-live={isInvalid ? 'polite' : undefined}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

InputOTP.displayName = 'InputOTP'
