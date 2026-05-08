import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import { TextField } from './TextField'

const meta = {
  title: 'Forms/Text Field',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[250px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary'] },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'url'] },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

function EmailValidationDemo() {
  const [email, setEmail] = useState('alex@')
  const isInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <TextField
      label="Email"
      type="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      placeholder="name@example.com"
      invalid={isInvalid}
      errorMessage="Enter a valid email address"
    />
  )
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <TextField label="Default" placeholder="Default text field" variant="default" />
      <div className={secondaryStorySurface}>
        <TextField label="Secondary" placeholder="Secondary text field" variant="secondary" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    variant: 'secondary',
  },
  render: (args) => (
    <div className={secondaryStorySurface}>
      <TextField {...args} />
    </div>
  ),
}

export const Required: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  },
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    description: 'Use 3 to 16 characters.',
  },
}

export const Invalid: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    defaultValue: 'jo',
    invalid: true,
    errorMessage: 'Username must be at least 3 characters.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
    disabled: true,
  },
}

export const InputTypes: Story = {
  name: 'Input Types',
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <TextField label="Name" placeholder="Enter your name" />
      <TextField label="Your password" type="password" defaultValue="password" />
      <EmailValidationDemo />
    </div>
  ),
}
