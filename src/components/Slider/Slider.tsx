import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

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
  latestValueRef.current = currentValue

  useEffect(() => {
    if (isControlled) return

    setUncontrolledValue((previousValue) =>
      normalizeSliderValue(previousValue, min, resolvedMax, resolvedStep),
    )
  }, [isControlled, min, resolvedMax, resolvedStep])

  const isRange = isRangeValue(currentValue)
  const currentRange = isRange ? currentValue : undefined
  const currentValues = isRange ? [currentRange![0], currentRange![1]] : [currentValue]
  const styledAsRange = true
  const thumbWidth = styledAsRange ? 28 : 16

  const toPercent = (inputValue: number) => {
    if (resolvedMax === min) return 0
    return ((inputValue - min) / (resolvedMax - min)) * 100
  }

  const fillStart = isRange ? toPercent(currentValue[0]) : 0
  const fillEnd = isRange ? toPercent(currentValue[1]) : toPercent(currentValue)
  const visualFillStart = isRange ? getThumbCenter(fillStart, thumbWidth) : '0%'
  const visualFillEnd = getThumbCenter(fillEnd, thumbWidth)
  const visualFillWidth = isRange
    ? `calc(${visualFillEnd} - ${visualFillStart})`
    : visualFillEnd

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
    if (!isRange) {
      return normalizeSingleValue(candidate, min, resolvedMax, resolvedStep)
    }

    const [start, end] = currentRange!

    if (thumbIndex === 0) {
      return normalizeSingleValue(candidate, min, end, resolvedStep)
    }

    return normalizeSingleValue(candidate, start, resolvedMax, resolvedStep)
  }

  const updateThumbValue = (candidate: number, thumbIndex: number, options?: { emitEnd?: boolean }) => {
    if (disabled) return

    if (!isRange) {
      commitValue(clampThumbValue(candidate, thumbIndex), options)
      return
    }

    const [start, end] = currentRange!
    const nextThumbValue = clampThumbValue(candidate, thumbIndex)
    const nextValue: SliderRangeValue =
      thumbIndex === 0 ? [nextThumbValue, end] : [start, nextThumbValue]

    commitValue(nextValue, options)
  }

  const getValueFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()

    if (!rect || rect.width === 0) {
      return currentValues[0]
    }

    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return snapToStep(min + ratio * (resolvedMax - min), min, resolvedMax, resolvedStep)
  }

  const pickClosestThumb = (candidate: number) => {
    if (!isRange) return 0

    const [start, end] = currentValue
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
  }, [draggingThumb, handlePointerMove, handlePointerUp])

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

    const thumbValue = currentValues[thumbIndex]
    const siblingValue = isRange ? currentRange![thumbIndex === 0 ? 1 : 0] : undefined
    const thumbMin = thumbIndex === 0 || !isRange ? min : siblingValue ?? min
    const thumbMax = thumbIndex === 0 && isRange ? siblingValue ?? resolvedMax : resolvedMax
    const largeStep = resolvedStep * 10

    let nextValue = thumbValue

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        nextValue = thumbValue - resolvedStep
        break
      case 'ArrowRight':
      case 'ArrowUp':
        nextValue = thumbValue + resolvedStep
        break
      case 'PageDown':
        nextValue = thumbValue - largeStep
        break
      case 'PageUp':
        nextValue = thumbValue + largeStep
        break
      case 'Home':
        nextValue = thumbMin
        break
      case 'End':
        nextValue = thumbMax
        break
      default:
        return
    }

    event.preventDefault()
    updateThumbValue(clamp(nextValue, thumbMin, thumbMax), thumbIndex, { emitEnd: true })
  }

  const labelText = typeof label === 'string' ? label : undefined
  const shellClass = 'flex min-w-[200px] w-full flex-col gap-1 font-sans'
  const headerClass = 'flex items-center justify-between gap-3'
  const labelClass = 'text-sm font-sans font-medium leading-snug text-foreground'
  const outputClass = isRange
    ? 'text-sm font-sans font-medium leading-snug tabular-nums text-foreground'
    : 'text-sm font-sans font-medium leading-snug tabular-nums text-foreground-secondary'
  const trackShellClass = 'h-5'
  const railClass = 'absolute inset-x-0 top-1/2 h-5 -translate-y-1/2 rounded-full bg-surface-secondary'
  const fillClass = 'absolute top-1/2 h-5 -translate-y-1/2 rounded-full bg-accent'
  const thumbClass =
    'absolute top-1/2 z-10 h-5 w-7 -translate-x-1/2 -translate-y-1/2 appearance-none rounded-full border-0 bg-accent p-0.5 outline-none transition-transform'
  const thumbInnerClass = 'block h-4 w-6 rounded-full bg-surface-primary shadow-md'

  return (
    <div className={`${shellClass} ${className}`.trim()}>
      {(label != null || formatValue(currentValue)) && (
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
            {formatValue(currentValue)}
          </output>
        </div>
      )}

      <div
        ref={trackRef}
        className={`relative flex w-full touch-none items-center ${trackShellClass} ${disabled ? 'opacity-50' : ''}`.trim()}
        onPointerDown={handleTrackPointerDown}
      >
        <div className={railClass} />
        <div
          className={fillClass}
          style={{ left: visualFillStart, width: visualFillWidth }}
        />

        {currentValues.map((thumbValue, thumbIndex) => (
          <button
            key={thumbIndex}
            type="button"
            role="slider"
            aria-disabled={disabled}
            aria-labelledby={label != null ? labelId : undefined}
            aria-label={
              isRange
                ? thumbIndex === 0
                  ? startThumbAriaLabel ?? (labelText ? `${labelText} minimum` : 'Minimum value')
                  : endThumbAriaLabel ?? (labelText ? `${labelText} maximum` : 'Maximum value')
                : ariaLabel ?? labelText ?? 'Slider value'
            }
            aria-valuemin={thumbIndex === 0 || !isRange ? min : currentRange![0]}
            aria-valuemax={thumbIndex === 0 && isRange ? currentRange![1] : resolvedMax}
            aria-valuenow={thumbValue}
            aria-valuetext={isRange ? `${thumbValue}` : formatValue(thumbValue)}
            disabled={disabled}
            className={`${thumbClass} ${
              disabled ? '' : 'cursor-grab active:cursor-grabbing'
            }`.trim()}
            style={{ left: getThumbCenter(toPercent(thumbValue), thumbWidth) }}
            onPointerDown={handleThumbPointerDown(thumbIndex)}
            onKeyDown={handleThumbKeyDown(thumbIndex)}
          >
            <span aria-hidden className={thumbInnerClass} />
            <span className="sr-only">
              {isRange ? `Thumb ${thumbIndex + 1}` : 'Thumb'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
