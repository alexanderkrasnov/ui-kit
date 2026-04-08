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
    error: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'url'] },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Placeholder',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello',
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
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
