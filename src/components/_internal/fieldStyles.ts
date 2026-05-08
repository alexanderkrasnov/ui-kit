import { cx } from './cx'

export type FieldVariant = 'default' | 'secondary'

export function getFieldSurfaceClass(variant: FieldVariant) {
  return variant === 'secondary'
    ? 'bg-surface-secondary text-foreground'
    : 'bg-field-background text-field-foreground shadow-sm'
}

export function getFieldBorderClass(invalid: boolean) {
  return invalid
    ? 'border-danger focus-within:border-field-border-invalid-focus focus-visible:border-field-border-invalid-focus'
    : 'border-transparent focus-within:border-field-border-focus focus-visible:border-field-border-focus'
}

export function getFieldLabelClass(disabled?: boolean) {
  return disabled ? 'text-foreground-tertiary' : 'text-foreground'
}

export function getFieldHelperClass(invalid: boolean) {
  return invalid ? 'text-danger' : 'text-foreground-tertiary'
}

export function getFieldDescribedBy(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(' ') || undefined
}

export function getFieldA11yState(invalid: boolean, disabled?: boolean) {
  return {
    'aria-invalid': invalid ? true : undefined,
    'aria-disabled': disabled ? true : undefined,
  } as const
}

export function getFieldContainerClass(className?: string) {
  return cx('inline-flex w-full max-w-sm flex-col gap-1.5 font-sans', className)
}
