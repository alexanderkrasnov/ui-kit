import { Dropdown, type DropdownItem, type DropdownProps } from '../Dropdown'

export type SelectItem = DropdownItem

export type SelectProps = Omit<DropdownProps, 'mode' | 'aria-label'>

export function Select(props: SelectProps) {
  return <Dropdown {...props} mode="chevron" />
}

