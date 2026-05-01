import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown, MoreVertical } from 'lucide-react'

import { Dropdown } from './Dropdown'

const sampleItems = [
  { label: 'Edit', onSelect: () => undefined },
  { label: 'Duplicate', onSelect: () => undefined },
  { label: 'Delete', onSelect: () => undefined, disabled: true },
]

const meta = {
  title: 'Forms/Dropdown menu',
  component: Dropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    variant: 'default' as const,
    items: sampleItems,
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary'] },
  },
  decorators: [
    (Story) => (
      <div className="flex items-start">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Dropdown
        items={sampleItems}
        mode="chevron"
        label="Dropdown menu"
        icon={<ChevronDown />}
        variant="default"
      />
      <Dropdown
        items={sampleItems}
        mode="chevron"
        label="Dropdown menu"
        icon={<ChevronDown />}
        variant="secondary"
      />
      <Dropdown
        items={sampleItems}
        mode="icon"
        icon={<MoreVertical />}
        aria-label="Icon only default"
        variant="default"
      />
      <Dropdown
        items={sampleItems}
        mode="icon"
        icon={<MoreVertical />}
        aria-label="Icon only secondary"
        variant="secondary"
      />
    </div>
  ),
}

export const Default: Story = {
  args: {
    mode: 'chevron',
    label: 'Dropdown menu',
    icon: <ChevronDown />,
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    mode: 'chevron',
    label: 'Dropdown menu',
    icon: <ChevronDown />,
    variant: 'secondary',
  },
}

export const IconOnlyDefault: Story = {
  name: 'Icon only default',
  args: {
    mode: 'icon',
    icon: <MoreVertical />,
    'aria-label': 'Icon only default',
    variant: 'default',
  },
}

export const IconOnlySecondary: Story = {
  name: 'Icon only secondary',
  args: {
    mode: 'icon',
    icon: <MoreVertical />,
    'aria-label': 'Icon only secondary',
    variant: 'secondary',
  },
}
