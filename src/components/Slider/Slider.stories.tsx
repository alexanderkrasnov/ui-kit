import type { Meta, StoryObj } from '@storybook/react-vite'

import { Slider } from './Slider'

function formatCompactCurrencyValue(value: number) {
  if (value >= 1_000_000) {
    return `$${Math.round(value / 1_000_000)}M`
  }

  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`
  }

  return `$${value}`
}

const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[min(100%,24rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Slider
        label="Volume"
        defaultValue={30}
        min={0}
        max={100}
        step={1}
      />
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div className="w-80">
      <Slider
        label="Price Range"
        defaultValue={[0, 100_000_000]}
        min={0}
        max={100_000_000}
        step={1_000_000}
        formatValue={(value) =>
          Array.isArray(value)
            ? `${formatCompactCurrencyValue(value[0])} – ${formatCompactCurrencyValue(value[1])}`
            : formatCompactCurrencyValue(value)
        }
      />
    </div>
  ),
}
