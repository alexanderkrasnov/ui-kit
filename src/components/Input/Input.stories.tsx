import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './Input'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
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
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'url'] },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[min(100%,24rem)] flex-col gap-3">
      <Input placeholder="Default input" variant="default" />
      <Input placeholder="Secondary input" variant="secondary" />
    </div>
  ),
}

export const Default: Story = {
  args: {
    placeholder: 'Placeholder',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    placeholder: 'Secondary input',
    variant: 'secondary',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    placeholder: 'Invalid value',
    defaultValue: 'bad@',
    error: true,
  },
}
