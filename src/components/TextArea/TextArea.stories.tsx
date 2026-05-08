import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import { TextArea } from './TextArea'

const meta = {
  title: 'Forms/Text Area',
  component: TextArea,
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
    rows: { control: { type: 'number', min: 2, max: 10 } },
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

function MessageValidationDemo() {
  const [message, setMessage] = useState('Too short')
  const isInvalid = message.length > 0 && message.length < 20

  return (
    <TextArea
      label="Message"
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      placeholder="Tell us a little more"
      invalid={isInvalid}
      errorMessage="Message must be at least 20 characters."
    />
  )
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <TextArea label="Default" placeholder="Default text area" variant="default" />
      <div className={secondaryStorySurface}>
        <TextArea label="Secondary" placeholder="Secondary text area" variant="secondary" />
      </div>
    </div>
  ),
}

export const Default: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    variant: 'secondary',
  },
  render: (args) => (
    <div className={secondaryStorySurface}>
      <TextArea {...args} />
    </div>
  ),
}

export const Required: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    required: true,
  },
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    description: 'Use 20 to 240 characters.',
  },
}

export const Invalid: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    defaultValue: 'Too short',
    invalid: true,
    errorMessage: 'Bio must be at least 20 characters.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message',
    disabled: true,
  },
}

export const Validation: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <TextArea label="Comment" placeholder="Leave a comment" />
      <TextArea label="Support request" defaultValue="I need help with my account." rows={5} />
      <MessageValidationDemo />
    </div>
  ),
}
