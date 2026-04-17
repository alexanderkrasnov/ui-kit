import { createContext, useContext } from 'react'

export type RadioGroupContextValue = {
  name: string
  value: string | undefined
  onChange: (value: string) => void
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export function useRadioGroup() {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) {
    throw new Error('Radio must be used inside RadioGroup')
  }
  return ctx
}
