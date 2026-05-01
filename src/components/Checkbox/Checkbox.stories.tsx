import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './Checkbox'

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[min(100%,20rem)]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary'] },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  args: {},
  render: () => (
    <div className="flex w-[min(100%,24rem)] flex-col gap-3">
      <Checkbox label="Default checkbox" variant="default" />
      <Checkbox label="Secondary checkbox" variant="secondary" />
    </div>
  ),
}

export const Default: Story = {
  args: {
    label: 'Remember me',
    variant: 'default',
    defaultChecked: false,
  },
}

export const Secondary: Story = {
  args: {
    label: 'Remember me',
    variant: 'secondary',
    defaultChecked: false,
  },
}

export const Error: Story = {
  args: {
    label: 'Accept terms',
    variant: 'default',
    error: true,
    defaultChecked: false,
  },
}
