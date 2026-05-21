import type { HTMLAttributes } from 'react'

import { cx } from '../_internal/cx'

export type ActionStackProps = HTMLAttributes<HTMLDivElement> & {
  /** Axis behavior. `responsive` stacks vertically on mobile and horizontally from `sm` up. */
  direction?: 'responsive' | 'row' | 'column'
  /** Space between direct children. */
  gap?: 'xs' | 'sm' | 'md'
  /** Cross-axis alignment. Defaults to stretch for stack-like layouts and center for rows. */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between'
  /** Stretch direct button children on narrow layouts. */
  fullWidthOnMobile?: boolean
}

const directions: Record<NonNullable<ActionStackProps['direction']>, string> = {
  responsive: 'flex-col sm:flex-row',
  row: 'flex-row',
  column: 'flex-col',
}

const gaps: Record<NonNullable<ActionStackProps['gap']>, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
}

const aligns: Record<NonNullable<ActionStackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifies: Record<NonNullable<ActionStackProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

function getDefaultAlign(direction: NonNullable<ActionStackProps['direction']>) {
  if (direction === 'row') return 'items-center'
  if (direction === 'responsive') return 'items-stretch sm:items-center'

  return 'items-stretch'
}

function getFullWidthButtonClass(
  direction: NonNullable<ActionStackProps['direction']>,
  fullWidthOnMobile: boolean,
) {
  if (!fullWidthOnMobile || direction === 'row') return undefined
  if (direction === 'responsive') return '[&>button]:w-full sm:[&>button]:w-auto'

  return '[&>button]:w-full'
}

export function ActionStack({
  direction = 'responsive',
  gap = 'sm',
  align,
  justify = 'end',
  fullWidthOnMobile = true,
  className = '',
  ...props
}: ActionStackProps) {
  return (
    <div
      className={cx(
        'flex min-w-0 font-sans',
        directions[direction],
        gaps[gap],
        align == null ? getDefaultAlign(direction) : aligns[align],
        justifies[justify],
        getFullWidthButtonClass(direction, fullWidthOnMobile),
        className,
      )}
      {...props}
    />
  )
}
