import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown, MoreVertical } from 'lucide-react'

import { Dropdown } from './Dropdown'

const sampleItems = [
  { label: 'Edit', onSelect: () => undefined },
  { label: 'Duplicate', onSelect: () => undefined },
  { label: 'Delete', onSelect: () => undefined, disabled: true },
]

const meta = {
  title: 'UI/Dropdown',
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
      <div className="w-[min(100%,20rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className="flex w-[min(100%,24rem)] flex-col gap-3">
      <Dropdown items={sampleItems} mode="chevron" label="Default dropdown" icon={<ChevronDown />} variant="default" />
      <Dropdown
        items={sampleItems}
        mode="chevron"
        label="Secondary dropdown"
        icon={<ChevronDown />}
        variant="secondary"
      />
    </div>
  ),
}

export const AllModes: Story = {
  name: 'All modes',
  render: () => (
    <div className="flex flex-wrap items-start justify-center gap-6">
      <Dropdown items={sampleItems} mode="chevron" label="Menu" icon={<ChevronDown />} variant="default" />
      <Dropdown
        items={sampleItems}
        mode="icon"
        icon={<MoreVertical />}
        aria-label="More actions"
        variant="default"
      />
    </div>
  ),
}

export const WithChevron: Story = {
  name: 'With chevron',
  args: {
    mode: 'chevron',
    label: 'Options',
    icon: <ChevronDown />,
  },
}

export const WithMenuIcon: Story = {
  name: 'With menu icon',
  args: {
    mode: 'icon',
    icon: <MoreVertical />,
    'aria-label': 'More actions',
  },
}
