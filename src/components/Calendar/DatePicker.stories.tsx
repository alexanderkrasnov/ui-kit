import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Date and Time/Date Picker',
  component: DatePicker,
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
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

function ValidationDemo() {
  const [value, setValue] = useState('2026-04-24')
  const isInvalid = value !== '' && value < '2026-04-30'

  return (
    <DatePicker
      label="Appointment date"
      value={value}
      onChange={setValue}
      min="2026-04-30"
      invalid={isInvalid}
      description="Choose a date from April 30, 2026 onwards."
      errorMessage="Appointment date must be April 30, 2026 or later."
    />
  )
}

function FormExampleDemo() {
  const [date, setDate] = useState('')
  const [submittedDate, setSubmittedDate] = useState('')
  const hasError = submittedDate === 'missing' && date === ''

  return (
    <form
      className="flex w-[250px] flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmittedDate(date || 'missing')
      }}
    >
      <DatePicker
        label="Appointment date"
        name="appointmentDate"
        value={date}
        onChange={setDate}
        required
        invalid={hasError}
        description="Choose a valid appointment date."
        errorMessage="Select an appointment date."
      />
      <Button type="submit">Submit</Button>
      {submittedDate && submittedDate !== 'missing' ? (
        <p className="text-xs text-foreground-tertiary">Submitted value: {submittedDate}</p>
      ) : null}
    </form>
  )
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <DatePicker label="Default" defaultValue="2026-04-24" variant="default" />
      <DatePicker label="Secondary" defaultValue="2026-04-24" variant="secondary" />
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

export const WithValidation: Story = {
  name: 'With Validation',
  render: () => <ValidationDemo />,
}

export const Disabled: Story = {
  args: {
    label: 'Date',
    defaultValue: '2026-04-24',
    description: 'This date picker is disabled.',
    disabled: true,
  },
}

export const FormExample: Story = {
  name: 'Form Example',
  render: () => <FormExampleDemo />,
}
