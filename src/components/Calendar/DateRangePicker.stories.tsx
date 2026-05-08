import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import { Button } from '../Button'
import { DateRangePicker, type DateRangePickerValue } from './DateRangePicker'

const meta = {
  title: 'Date and Time/Date Range Picker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary'] },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

function ValidationDemo() {
  const [value, setValue] = useState<DateRangePickerValue>({
    start: '2026-04-24',
    end: '2026-04-28',
  })
  const isInvalid = value.start !== '' && value.start != null && value.start < '2026-04-30'

  return (
    <DateRangePicker
      label="Booking dates"
      value={value}
      onChange={setValue}
      min="2026-04-30"
      invalid={isInvalid}
      description="Choose dates from April 30, 2026 onwards."
      errorMessage="Start date must be April 30, 2026 or later."
    />
  )
}

function FormExampleDemo() {
  const [range, setRange] = useState<DateRangePickerValue>({ start: '', end: '' })
  const [submittedRange, setSubmittedRange] = useState<DateRangePickerValue | null>(null)
  const hasError = submittedRange != null && (range.start === '' || range.end === '')

  return (
    <form
      className="flex w-[360px] flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmittedRange(range)
      }}
    >
      <DateRangePicker
        label="Booking dates"
        name="bookingDates"
        value={range}
        onChange={setRange}
        required
        invalid={hasError}
        description="Choose a valid date range."
        errorMessage="Select start and end dates."
      />
      <Button type="submit">Submit</Button>
      {submittedRange != null && submittedRange.start !== '' && submittedRange.end !== '' ? (
        <p className="text-xs text-foreground-tertiary">
          Submitted value: {submittedRange.start} / {submittedRange.end}
        </p>
      ) : null}
    </form>
  )
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-4">
      <DateRangePicker
        label="Default"
        defaultValue={{ start: '2026-04-24', end: '2026-04-30' }}
        variant="default"
      />
      <div className={secondaryStorySurface}>
        <DateRangePicker
          label="Secondary"
          defaultValue={{ start: '2026-04-24', end: '2026-04-30' }}
          variant="secondary"
        />
      </div>
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
  render: (args) => (
    <div className={secondaryStorySurface}>
      <DateRangePicker {...args} />
    </div>
  ),
}

export const WithValidation: Story = {
  name: 'With Validation',
  render: () => <ValidationDemo />,
}

export const Disabled: Story = {
  args: {
    label: 'Date',
    defaultValue: { start: '2026-04-24', end: '2026-04-30' },
    description: 'This date range picker is disabled.',
    disabled: true,
  },
}

export const FormExample: Story = {
  name: 'Form Example',
  render: () => <FormExampleDemo />,
}
