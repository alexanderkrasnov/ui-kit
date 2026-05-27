import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Binoculars,
  CircleCheckBig,
  ShieldAlert,
  Siren,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import {
  RadioButtonGroup,
  type RadioButtonGroupItem,
} from './RadioButtonGroup'

const pepStatusItems: RadioButtonGroupItem[] = [
  {
    value: 'not-screened',
    label: 'Not screened',
    icon: Binoculars,
  },
  {
    value: 'not-pep',
    label: 'Not PEP',
    icon: CircleCheckBig,
  },
  {
    value: 'potential-pep-match',
    label: 'Potential PEP match',
    icon: ShieldAlert,
  },
  {
    value: 'confirmed-pep',
    label: 'Confirmed PEP',
    icon: Siren,
  },
]

const meta = {
  title: 'Layout/RadioButtonGroup',
  component: RadioButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    items: pepStatusItems,
    defaultValue: 'not-pep',
    columns: 'responsive',
  },
  argTypes: {
    columns: {
      control: 'select',
      options: ['responsive', 'one', 'two', 'four'],
    },
  },
} satisfies Meta<typeof RadioButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

function StorySurface({
  children,
  className = 'w-[min(58rem,calc(100vw-2rem))]',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className={secondaryStorySurface}>{children}</div>
    </div>
  )
}

export const PepStatus: Story = {
  render: (args) => (
    <StorySurface>
      <RadioButtonGroup {...args} />
    </StorySurface>
  ),
}

export const OneColumn: Story = {
  args: {
    columns: 'one',
  },
  render: (args) => (
    <StorySurface className="w-[min(18rem,calc(100vw-2rem))]">
      <RadioButtonGroup {...args} />
    </StorySurface>
  ),
}

export const TwoColumns: Story = {
  args: {
    columns: 'two',
  },
  render: (args) => (
    <StorySurface className="w-[min(34rem,calc(100vw-2rem))]">
      <RadioButtonGroup {...args} />
    </StorySurface>
  ),
}
