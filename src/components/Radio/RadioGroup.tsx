import { useId, useState, type ReactNode } from 'react'

import { cx } from '../_internal/cx'
import { RadioGroupContext } from './RadioGroupContext'

export type RadioGroupProps = {
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

export function RadioGroup({
  name: nameProp,
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className = '',
}: RadioGroupProps) {
  const autoName = useId()
  const name = nameProp ?? `radio-${autoName}`
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '')
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolled

  const onChange = (next: string) => {
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div role="radiogroup" className={cx('flex flex-col gap-2', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}
