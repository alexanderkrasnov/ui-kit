import type { Meta, StoryObj } from '@storybook/react-vite'

import { DateField } from './DateField'

const meta = {
  title: 'Date and Time/Date Field',
  component: DateField,
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
} satisfies Meta<typeof DateField>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <DateField label="Default" defaultValue="2026-04-24" variant="default" />
      <DateField label="Secondary" defaultValue="2026-04-24" variant="secondary" />
    </div>
  ),
}

export const Default: Story = {
  args: {
    label: 'Date',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Date',
    variant: 'secondary',
  },
}

export const Required: Story = {
  args: {
    label: 'Start date',
    required: true,
  },
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Birth date',
    description: 'Enter your date of birth.',
  },
}

export const Invalid: Story = {
  args: {
    label: 'Date',
    defaultValue: '2026-02-31',
    invalid: true,
    errorMessage: 'Please enter a valid date.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Date',
    defaultValue: '2026-04-24',
    description: 'This date field is disabled.',
    disabled: true,
  },
}

export const InputTypes: Story = {
  name: 'Input Types',
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <DateField label="Empty date" />
      <DateField label="Selected date" defaultValue="2026-04-24" />
      <DateField
        label="Appointment date"
        defaultValue="2026-02-31"
        invalid
        errorMessage="Please enter a valid appointment date."
      />
    </div>
  ),
}
