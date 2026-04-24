import type { Meta, StoryObj } from '@storybook/react-vite'

import { Switch } from './Switch'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[min(100%,24rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Enable notifications',
    defaultChecked: true,
  },
}

export const WithoutLabel: Story = {
  name: 'Without Label',
  args: {
    'aria-label': 'Enable notifications',
    defaultChecked: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-[min(100%,24rem)] flex-col gap-4">
      <Switch size="small" label="Small switch" defaultChecked />
      <Switch size="medium" label="Medium switch" defaultChecked />
      <Switch size="large" label="Large switch" defaultChecked />
    </div>
  ),
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Automatic updates',
    description: 'Install the latest improvements in the background.',
    defaultChecked: true,
  },
}
