import type { Meta, StoryObj } from '@storybook/react-vite'

import { Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

const meta = {
  title: 'UI/Radio',
  component: Radio,
  args: {
    value: 'b',
    variant: 'default' as const,
  },
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
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[min(100%,24rem)] flex-col gap-3">
      <RadioGroup defaultValue="b">
        <Radio value="a" label="Default radio" variant="default" />
        <Radio value="b" label="Another (default)" variant="default" />
      </RadioGroup>
      <RadioGroup defaultValue="y">
        <Radio value="x" label="Secondary radio" variant="secondary" />
        <Radio value="y" label="Another (secondary)" variant="secondary" />
      </RadioGroup>
    </div>
  ),
}

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <RadioGroup defaultValue="b">
      <Radio value="a" label="Option A" variant={args.variant} helperText={args.helperText} />
      <Radio value="b" label="Option B" variant={args.variant} helperText={args.helperText} />
      <Radio value="c" label="Option C" variant={args.variant} helperText={args.helperText} />
    </RadioGroup>
  ),
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => (
    <RadioGroup defaultValue="b">
      <Radio value="a" label="Option A" variant={args.variant} helperText={args.helperText} />
      <Radio value="b" label="Option B" variant={args.variant} helperText={args.helperText} />
      <Radio value="c" label="Option C" variant={args.variant} helperText={args.helperText} />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-[min(100%,24rem)] flex-col gap-4">
      <RadioGroup defaultValue="a">
        <Radio value="a" label="Default selected disabled" variant="default" disabled />
        <Radio value="b" label="Default unselected disabled" variant="default" disabled />
      </RadioGroup>
      <RadioGroup defaultValue="x">
        <Radio value="x" label="Secondary selected disabled" variant="secondary" disabled />
        <Radio value="y" label="Secondary unselected disabled" variant="secondary" disabled />
      </RadioGroup>
    </div>
  ),
}
