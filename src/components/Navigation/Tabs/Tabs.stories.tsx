import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurfaceFit } from '../../../docs/story-surfaces'
import { Tabs, type TabsItem } from './Tabs'

const demoItems: TabsItem[] = [
  {
    value: 'overview',
    label: 'Overview',
  },
  {
    value: 'analytics',
    label: 'Analytics',
  },
  {
    value: 'reports',
    label: 'Reports',
  },
]

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    items: demoItems,
    'aria-label': 'Project sections',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 'overview',
    size: 'medium',
    variant: 'default',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Tabs {...args} items={demoItems} size="small" defaultValue="overview" />
      <Tabs {...args} items={demoItems} size="medium" defaultValue="analytics" />
    </div>
  ),
}

export const Secondary: Story = {
  args: {
    defaultValue: 'overview',
    size: 'medium',
    variant: 'secondary',
  },
  render: (args) => (
    <div className={secondaryStorySurfaceFit}>
      <Tabs {...args} />
    </div>
  ),
}
