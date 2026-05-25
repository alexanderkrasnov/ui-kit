import type { HTMLAttributes } from 'react'

import { cx } from '../_internal/cx'

export type ActionStackProps = HTMLAttributes<HTMLDivElement> & {
  /** Axis behavior. */
  direction?: 'row' | 'column'
  /** Space between direct children. `xs` is the only supported spacing token. */
  gap?: 'xs'
  /** Main-axis distribution. */
  justify?: 'start' | 'end'
  /** Stretch direct button children in column layouts. */
  fullWidthOnMobile?: boolean
}

const directions: Record<NonNullable<ActionStackProps['direction']>, string> = {
  row: 'flex-row',
  column: 'flex-col',
}

const gaps: Record<NonNullable<ActionStackProps['gap']>, string> = {
  xs: 'gap-2',
}

const justifies: Record<NonNullable<ActionStackProps['justify']>, string> = {
  start: 'justify-start',
  end: 'justify-end',
}

function getDefaultAlign(direction: NonNullable<ActionStackProps['direction']>) {
  if (direction === 'row') return 'items-center'

  return 'items-stretch'
}

function getFullWidthButtonClass(
  direction: NonNullable<ActionStackProps['direction']>,
  fullWidthOnMobile: boolean,
) {
  if (!fullWidthOnMobile || direction === 'row') return undefined

  return '[&>button]:w-full'
}

export function ActionStack({
  direction = 'row',
  gap = 'xs',
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
        getDefaultAlign(direction),
        justifies[justify],
        getFullWidthButtonClass(direction, fullWidthOnMobile),
        className,
      )}
      {...props}
    />
  )
}
