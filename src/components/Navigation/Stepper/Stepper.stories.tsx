import { useState } from 'react'
import { Check, CreditCard, PackageCheck, Truck } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurfaceFit } from '../../../docs/story-surfaces'
import { Stepper, type StepperItem } from './Stepper'

const defaultItems: StepperItem[] = [
  { label: 'Draft' },
  { label: 'Link Activated' },
  { label: 'Password Set' },
  { label: '2FA Enabled' },
]

const descriptionItems: StepperItem[] = [
  {
    label: 'Draft',
    description: 'Basic profile',
  },
  {
    label: 'Link Activated',
    description: 'Two-factor setup',
  },
  {
    label: 'Password Set',
    description: 'Payment method',
  },
  {
    label: '2FA Enabled',
    description: 'Final check',
  },
]

const verticalTestItems: StepperItem[] = [
  {
    label: 'Draft',
    description: 'Initial setup saved for review',
  },
  {
    label: 'Link Activated',
    description: 'Secure invite link is ready',
  },
  {
    label: 'Password Set',
    description: 'User created a strong password',
  },
  {
    label: '2FA Enabled',
    description: 'Additional sign-in protection is active',
  },
]

const iconItems: StepperItem[] = [
  {
    label: 'Draft',
    icon: PackageCheck,
  },
  {
    label: 'Link Activated',
    icon: Truck,
  },
  {
    label: 'Password Set',
    icon: CreditCard,
  },
  {
    label: '2FA Enabled',
    icon: Check,
  },
]

const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    items: defaultItems,
    defaultStep: 1,
    'aria-label': 'Checkout steps',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

function ControlledStepper({
  items,
  orientation = 'horizontal',
}: {
  items: StepperItem[]
  orientation?: 'horizontal' | 'vertical'
}) {
  const [step, setStep] = useState(1)

  return (
    <Stepper
      items={items}
      currentStep={step}
      onStepChange={setStep}
      orientation={orientation}
      aria-label="Interactive steps"
    />
  )
}

export const Default: Story = {
  args: {
    size: 'md',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className={`${secondaryStorySurfaceFit} w-[640px]`}>
      <Stepper {...args} />
    </div>
  ),
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    items: descriptionItems,
    defaultStep: 1,
    size: 'md',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className={`${secondaryStorySurfaceFit} w-[720px]`}>
      <Stepper {...args} />
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    items: verticalTestItems,
    defaultStep: 2,
    size: 'md',
    orientation: 'vertical',
    itemClassName: 'pb-8 last:pb-0',
  },
  render: (args) => (
    <div className={`${secondaryStorySurfaceFit} w-[260px]`}>
      <Stepper {...args} />
    </div>
  ),
}

export const WithIcons: Story = {
  name: 'With Icons',
  args: {
    items: iconItems,
    defaultStep: 2,
    size: 'md',
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className={`${secondaryStorySurfaceFit} w-[640px]`}>
      <Stepper {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className={`${secondaryStorySurfaceFit} flex w-[720px] flex-col gap-8`}>
      <Stepper {...args} items={defaultItems} defaultStep={1} size="sm" />
      <Stepper {...args} items={defaultItems} defaultStep={1} size="md" />
      <Stepper {...args} items={defaultItems} defaultStep={1} size="lg" />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => (
    <div className={`${secondaryStorySurfaceFit} w-[640px]`}>
      <ControlledStepper items={defaultItems} />
    </div>
  ),
}
