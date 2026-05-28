import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import { NumberField } from './NumberField'

const meta = {
  title: 'Forms/Number Field',
  component: NumberField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[240px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary'] },
    format: { control: 'select', options: ['number', 'currency', 'percent'] },
    textAlign: { control: 'select', options: ['left', 'center'] },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: (args) => (
    <div className="flex w-[240px] flex-col gap-4">
      <NumberField
        {...args}
        label="Quantity"
        defaultValue={1000}
        min={0}
        step={1}
        variant="default"
      />
      <div className={secondaryStorySurface}>
        <NumberField
          {...args}
          label="Quantity"
          defaultValue={1000}
          min={0}
          step={1}
          variant="secondary"
        />
      </div>
    </div>
  ),
}

export const WithFormatOptions: Story = {
  name: 'With Format Options',
  render: () => (
    <div className="flex w-[240px] flex-col gap-4">
      <NumberField
        label="Price"
        defaultValue={1200}
        min={0}
        step={100}
        format="currency"
        currencySymbol="$"
        description="Amount in USD"
      />
      <NumberField
        label="Centered quantity"
        defaultValue={42}
        min={0}
        step={1}
        textAlign="center"
      />
      <NumberField
        label="Company ownership"
        defaultValue={15}
        min={0}
        max={100}
        step={1}
        format="percent"
        textAlign="center"
        description="Value from 0 to 100"
      />
    </div>
  ),
}
