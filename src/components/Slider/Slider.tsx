import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

import { cx } from '../_internal/cx'

export type SliderRangeValue = [number, number]
export type SliderValue = number | SliderRangeValue

export type SliderProps = {
  label?: ReactNode
  value?: SliderValue
  defaultValue?: SliderValue
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  formatValue?: (value: SliderValue) => string
  onChange?: (value: SliderValue) => void
  onChangeEnd?: (value: SliderValue) => void
  'aria-label'?: string
  startThumbAriaLabel?: string
  endThumbAriaLabel?: string
}

type SliderThumbModel = {
  value: number
  min: number
  max: number
  left: string
  ariaLabel: string
  ariaValueText: string
}

type SliderState = {
  isRange: boolean
  values: number[]
  formattedValue: string
  fillClassName: string
  fillStyle: CSSProperties
  thumbs: SliderThumbModel[]
}

const thumbWidth = 28

const shellClass = 'flex min-w-[200px] w-full flex-col gap-1 font-sans'
const headerClass = 'flex items-center justify-between gap-3'
const labelClass = 'text-sm font-sans font-medium leading-snug text-foreground'
const outputBaseClass = 'text-sm font-sans font-medium leading-snug tabular-nums'
const trackClass = 'relative flex h-5 w-full touch-none items-center'
const railClass = 'absolute inset-x-0 top-1/2 h-5 -translate-y-1/2 overflow-hidden rounded-full bg-surface-secondary'
const fillBaseClass = 'absolute top-0 h-full bg-accent'
const thumbClass =
  'absolute top-1/2 z-10 h-5 w-7 -translate-x-1/2 -translate-y-1/2 appearance-none rounded-full border-0 bg-accent p-0.5 outline-none transition-transform'
const thumbInnerClass = 'block h-4 w-6 rounded-full bg-surface-primary shadow-md'

function isRangeValue(value: SliderValue): value is SliderRangeValue {
  return Array.isArray(value)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function snapToStep(value: number, min: number, max: number, step: number) {
  const next = min + Math.round((value - min) / step) * step
  return clamp(Number(next.toFixed(6)), min, max)
}

function normalizeSingleValue(value: number | undefined, min: number, max: number, step: number) {
  return snapToStep(value ?? min, min, max, step)
}

function normalizeRangeValue(
  value: SliderRangeValue | undefined,
  min: number,
  max: number,
  step: number,
): SliderRangeValue {
  const start = normalizeSingleValue(value?.[0], min, max, step)
  const end = normalizeSingleValue(value?.[1], min, max, step)

  return start <= end ? [start, end] : [end, start]
}

function normalizeSliderValue(value: SliderValue | undefined, min: number, max: number, step: number): SliderValue {
  if (value === undefined) {
    return min
  }

  return isRangeValue(value)
    ? normalizeRangeValue(value, min, max, step)
    : normalizeSingleValue(value, min, max, step)
}

function formatDefaultValue(value: SliderValue) {
  return isRangeValue(value) ? `${value[0]} – ${value[1]}` : `${value}`
}

function getThumbCenter(percent: number, thumbWidth: number) {
  const halfThumb = thumbWidth / 2
  const pixelOffset = halfThumb - (thumbWidth * percent) / 100

  return `calc(${percent}% + ${pixelOffset}px)`
}

function valueToPercent(value: number, min: number, max: number) {
  if (max === min) return 0
  return ((value - min) / (max - min)) * 100
}

function getRangeValues(value: SliderValue) {
  return isRangeValue(value) ? value : undefined
}

function getSliderValues(value: SliderValue) {
  return isRangeValue(value) ? [value[0], value[1]] : [value]
}

function getThumbBounds(
  thumbIndex: number,
  isRange: boolean,
  values: number[],
  min: number,
  max: number,
) {
  if (!isRange) {
    return { min, max }
  }

  return thumbIndex === 0
    ? { min, max: values[1] }
    : { min: values[0], max }
}

function getFillGeometry(value: SliderValue, min: number, max: number) {
  const isRange = isRangeValue(value)
  const values = getSliderValues(value)
  const fillStart = isRange ? valueToPercent(values[0], min, max) : 0
  const fillEnd = valueToPercent(values[isRange ? 1 : 0], min, max)
  const visualFillStart = isRange ? getThumbCenter(fillStart, thumbWidth) : '0%'
  const visualFillEnd = getThumbCenter(fillEnd, thumbWidth)

  return {
    className: cx(fillBaseClass, !isRange && 'rounded-l-full'),
    style: {
      left: visualFillStart,
      width: isRange ? `calc(${visualFillEnd} - ${visualFillStart})` : visualFillEnd,
    },
  }
}

function getThumbAriaLabel({
  ariaLabel,
  endThumbAriaLabel,
  isRange,
  labelText,
  startThumbAriaLabel,
  thumbIndex,
}: {
  ariaLabel: string | undefined
  endThumbAriaLabel: string | undefined
  isRange: boolean
  labelText: string | undefined
  startThumbAriaLabel: string | undefined
  thumbIndex: number
}) {
  if (!isRange) {
    return ariaLabel ?? labelText ?? 'Slider value'
  }

  if (thumbIndex === 0) {
    return startThumbAriaLabel ?? (labelText ? `${labelText} minimum` : 'Minimum value')
  }

  return endThumbAriaLabel ?? (labelText ? `${labelText} maximum` : 'Maximum value')
}

function getNextSliderValue(
  currentValue: SliderValue,
  nextThumbValue: number,
  thumbIndex: number,
): SliderValue {
  if (!isRangeValue(currentValue)) {
    return nextThumbValue
  }

  return thumbIndex === 0
    ? [nextThumbValue, currentValue[1]]
    : [currentValue[0], nextThumbValue]
}

function getSliderState({
  ariaLabel,
  currentValue,
  endThumbAriaLabel,
  formatValue,
  labelText,
  max,
  min,
  startThumbAriaLabel,
}: {
  ariaLabel: string | undefined
  currentValue: SliderValue
  endThumbAriaLabel: string | undefined
  formatValue: (value: SliderValue) => string
  labelText: string | undefined
  max: number
  min: number
  startThumbAriaLabel: string | undefined
}): SliderState {
  const isRange = isRangeValue(currentValue)
  const values = getSliderValues(currentValue)
  const fillGeometry = getFillGeometry(currentValue, min, max)

  return {
    isRange,
    values,
    formattedValue: formatValue(currentValue),
    fillClassName: fillGeometry.className,
    fillStyle: fillGeometry.style,
    thumbs: values.map((thumbValue, thumbIndex) => {
      const bounds = getThumbBounds(thumbIndex, isRange, values, min, max)

      return {
        value: thumbValue,
        min: bounds.min,
        max: bounds.max,
        left: getThumbCenter(valueToPercent(thumbValue, min, max), thumbWidth),
        ariaLabel: getThumbAriaLabel({
          ariaLabel,
          endThumbAriaLabel,
          isRange,
          labelText,
          startThumbAriaLabel,
          thumbIndex,
        }),
        ariaValueText: isRange ? `${thumbValue}` : formatValue(thumbValue),
      }
    }),
  }
}

export function Slider({
  label,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = '',
  formatValue = formatDefaultValue,
  onChange,
  onChangeEnd,
  'aria-label': ariaLabel,
  startThumbAriaLabel,
  endThumbAriaLabel,
}: SliderProps) {
  const resolvedMax = Math.max(max, min)
  const resolvedStep = step > 0 ? step : 1
  const labelId = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const [draggingThumb, setDraggingThumb] = useState<number | null>(null)
  const [uncontrolledValue, setUncontrolledValue] = useState<SliderValue>(() => {
    return normalizeSliderValue(value ?? defaultValue, min, resolvedMax, resolvedStep)
  })

  const isControlled = value !== undefined
  const currentValue = normalizeSliderValue(
    isControlled ? value : uncontrolledValue,
    min,
    resolvedMax,
    resolvedStep,
  )

  const latestValueRef = useRef<SliderValue>(currentValue)

  useEffect(() => {
    latestValueRef.current = currentValue
  }, [currentValue])

  const labelText = typeof label === 'string' ? label : undefined
  const sliderState = getSliderState({
    ariaLabel,
    currentValue,
    endThumbAriaLabel,
    formatValue,
    labelText,
    max: resolvedMax,
    min,
    startThumbAriaLabel,
  })

  const commitValue = (nextValue: SliderValue, options?: { emitEnd?: boolean }) => {
    latestValueRef.current = nextValue

    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }

    onChange?.(nextValue)

    if (options?.emitEnd) {
      onChangeEnd?.(nextValue)
    }
  }

  const clampThumbValue = (candidate: number, thumbIndex: number) => {
    if (!sliderState.isRange) {
      return normalizeSingleValue(candidate, min, resolvedMax, resolvedStep)
    }

    const { min: thumbMin, max: thumbMax } = sliderState.thumbs[thumbIndex]

    return normalizeSingleValue(candidate, thumbMin, thumbMax, resolvedStep)
  }

  const updateThumbValue = (candidate: number, thumbIndex: number, options?: { emitEnd?: boolean }) => {
    if (disabled) return

    const nextThumbValue = clampThumbValue(candidate, thumbIndex)
    commitValue(getNextSliderValue(currentValue, nextThumbValue, thumbIndex), options)
  }

  const getValueFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()

    if (!rect || rect.width === 0) {
      return sliderState.values[0]
    }

    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return snapToStep(min + ratio * (resolvedMax - min), min, resolvedMax, resolvedStep)
  }

  const pickClosestThumb = (candidate: number) => {
    const rangeValues = getRangeValues(currentValue)

    if (!rangeValues) return 0

    const [start, end] = rangeValues
    return Math.abs(candidate - start) <= Math.abs(candidate - end) ? 0 : 1
  }

  const handlePointerMove = useEffectEvent((event: PointerEvent) => {
    if (draggingThumb == null) return

    updateThumbValue(getValueFromClientX(event.clientX), draggingThumb)
  })

  const handlePointerUp = useEffectEvent(() => {
    if (draggingThumb == null) return

    onChangeEnd?.(latestValueRef.current)
    setDraggingThumb(null)
  })

  useEffect(() => {
    if (draggingThumb == null) return undefined

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [draggingThumb])

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return

    event.preventDefault()

    const candidate = getValueFromClientX(event.clientX)
    const thumbIndex = pickClosestThumb(candidate)

    setDraggingThumb(thumbIndex)
    updateThumbValue(candidate, thumbIndex)
  }

  const handleThumbPointerDown = (thumbIndex: number) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) return

    event.preventDefault()
    event.stopPropagation()
    setDraggingThumb(thumbIndex)
    event.currentTarget.focus()
  }

  const handleThumbKeyDown = (thumbIndex: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    const thumb = sliderState.thumbs[thumbIndex]
    const largeStep = resolvedStep * 10

    let nextValue = thumb.value

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        nextValue = thumb.value - resolvedStep
        break
      case 'ArrowRight':
      case 'ArrowUp':
        nextValue = thumb.value + resolvedStep
        break
      case 'PageDown':
        nextValue = thumb.value - largeStep
        break
      case 'PageUp':
        nextValue = thumb.value + largeStep
        break
      case 'Home':
        nextValue = thumb.min
        break
      case 'End':
        nextValue = thumb.max
        break
      default:
        return
    }

    event.preventDefault()
    updateThumbValue(clamp(nextValue, thumb.min, thumb.max), thumbIndex, { emitEnd: true })
  }

  const outputClass = cx(
    outputBaseClass,
    sliderState.isRange ? 'text-foreground' : 'text-foreground-secondary',
  )

  return (
    <div className={cx(shellClass, className)}>
      {(label != null || sliderState.formattedValue) && (
        <div className={headerClass}>
          {label != null ? (
            <label id={labelId} className={labelClass}>
              {label}
            </label>
          ) : (
            <span id={labelId} className="sr-only">
              {ariaLabel ?? 'Slider'}
            </span>
          )}
          <output className={outputClass} aria-live="off">
            {sliderState.formattedValue}
          </output>
        </div>
      )}

      <div
        ref={trackRef}
        className={cx(trackClass, disabled && 'opacity-50')}
        onPointerDown={handleTrackPointerDown}
      >
        <div className={railClass}>
          <div
            className={sliderState.fillClassName}
            style={sliderState.fillStyle}
          />
        </div>

        {sliderState.thumbs.map((thumb, thumbIndex) => (
          <button
            key={thumbIndex}
            type="button"
            role="slider"
            aria-disabled={disabled}
            aria-labelledby={label != null ? labelId : undefined}
            aria-label={thumb.ariaLabel}
            aria-valuemin={thumb.min}
            aria-valuemax={thumb.max}
            aria-valuenow={thumb.value}
            aria-valuetext={thumb.ariaValueText}
            disabled={disabled}
            className={cx(
              thumbClass,
              !disabled && 'cursor-grab active:cursor-grabbing',
            )}
            style={{ left: thumb.left }}
            onPointerDown={handleThumbPointerDown(thumbIndex)}
            onKeyDown={handleThumbKeyDown(thumbIndex)}
          >
            <span aria-hidden className={thumbInnerClass} />
            <span className="sr-only">
              {sliderState.isRange ? `Thumb ${thumbIndex + 1}` : 'Thumb'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
