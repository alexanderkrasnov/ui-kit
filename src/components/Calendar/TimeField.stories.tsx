import type { Meta, StoryObj } from '@storybook/react-vite'

import { TimeField } from './TimeField'

const meta = {
  title: 'Date and Time/Time Field',
  component: TimeField,
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
  },
} satisfies Meta<typeof TimeField>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <TimeField label="Default" defaultValue="09:30" variant="default" />
      <TimeField label="Secondary" defaultValue="09:30" variant="secondary" />
    </div>
  ),
}

export const Default: Story = {
  args: {
    label: 'Time',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Time',
    variant: 'secondary',
  },
}

export const Required: Story = {
  args: {
    label: 'Start time',
    required: true,
  },
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Meeting time',
    description: 'Enter the meeting start time.',
  },
}

export const Invalid: Story = {
  args: {
    label: 'Time',
    defaultValue: '25:70',
    invalid: true,
    errorMessage: 'Please enter a valid time.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Time',
    defaultValue: '09:30',
    description: 'This time field is disabled.',
    disabled: true,
  },
}

export const InputTypes: Story = {
  name: 'Input Types',
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <TimeField label="Empty time" />
      <TimeField label="Selected time" defaultValue="09:30" />
      <TimeField
        label="Appointment time"
        defaultValue="25:70"
        invalid
        errorMessage="Please enter a valid appointment time."
      />
    </div>
  ),
}
