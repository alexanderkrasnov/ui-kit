import {
  useId,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

import { cx } from '../_internal/cx'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label?: ReactNode
  description?: ReactNode
  size?: 'small' | 'medium' | 'large'
  onCheckedChange?: (checked: boolean) => void
}

const shell = cx(
  'group inline-flex max-w-full items-center gap-3 select-none font-sans',
  'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
)

const trackBase = cx(
  'relative inline-flex shrink-0 overflow-hidden rounded-full bg-surface-secondary transition-colors duration-150 ease-in-out',
  'group-has-[input:checked]:bg-accent group-has-[input:focus-visible]:outline group-has-[input:focus-visible]:outline-2',
  'group-has-[input:focus-visible]:outline-offset-2 group-has-[input:focus-visible]:outline-accent',
)

const thumbBase =
  'absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-surface-primary transition-[left,transform] duration-150 ease-in-out'

const thumbShadow = '0 0 5px rgb(0 0 0 / 0.02), 0 2px 10px rgb(0 0 0 / 0.06), 0 0 1px rgb(0 0 0 / 0.3)'

const sizeStyles: Record<
  NonNullable<SwitchProps['size']>,
  { control: string; thumb: string; style: CSSProperties; thumbStyle: CSSProperties }
> = {
  small: {
    control: 'h-4 w-8',
    thumb: 'h-3 w-[1.125rem]',
    style: {
      ['--switch-thumb-offset' as string]: '2px',
      ['--switch-thumb-checked-left' as string]: 'calc(100% - 18px - 2px)',
    },
    thumbStyle: {
      boxShadow: thumbShadow,
    },
  },
  medium: {
    control: 'h-5 w-10',
    thumb: 'h-4 w-[1.375rem]',
    style: {
      ['--switch-thumb-offset' as string]: '2px',
      ['--switch-thumb-checked-left' as string]: 'calc(100% - 22px - 2px)',
    },
    thumbStyle: {
      boxShadow: thumbShadow,
    },
  },
  large: {
    control: 'h-6 w-12',
    thumb: 'h-5 w-[1.625rem]',
    style: {
      ['--switch-thumb-offset' as string]: '2px',
      ['--switch-thumb-checked-left' as string]: 'calc(100% - 26px - 2px)',
    },
    thumbStyle: {
      boxShadow: thumbShadow,
    },
  },
}

export function Switch({
  id,
  label,
  description,
  size = 'medium',
  className = '',
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  onCheckedChange,
  'aria-label': ariaLabel,
  ...props
}: SwitchProps) {
  const generatedId = useId()
  const inputId = id ?? `switch-${generatedId}`
  const descriptionId = description != null ? `${inputId}-description` : undefined
  const isControlled = checked !== undefined
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked))
  const isChecked = isControlled ? checked : internalChecked
  const sizeConfig = sizeStyles[size]

  const handleChange: SwitchProps['onChange'] = (event) => {
    if (!isControlled) {
      setInternalChecked(event.target.checked)
    }

    onChange?.(event)
    onCheckedChange?.(event.target.checked)
  }

  const thumbStyle: CSSProperties = {
    left: isChecked ? 'var(--switch-thumb-checked-left)' : 'var(--switch-thumb-offset)',
    ...sizeConfig.thumbStyle,
  }

  return (
    <label htmlFor={inputId} className={cx(shell, className)}>
      <span className="relative inline-flex shrink-0">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-label={label == null ? ariaLabel ?? 'Switch' : undefined}
          aria-describedby={descriptionId}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className={cx(trackBase, sizeConfig.control)}
          style={sizeConfig.style}
        >
          <span
            className={cx(thumbBase, sizeConfig.thumb)}
            style={thumbStyle}
          />
        </span>
      </span>

      {(label != null || description != null) && (
        <span className="flex min-w-0 flex-col">
          {label != null ? (
            <span className="text-sm font-sans font-medium leading-snug text-foreground">{label}</span>
          ) : null}
          {description != null ? (
            <span id={descriptionId} className="text-sm font-sans leading-snug text-foreground-tertiary">
              {description}
            </span>
          ) : null}
        </span>
      )}
    </label>
  )
}
