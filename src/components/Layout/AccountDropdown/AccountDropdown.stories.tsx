import type { Meta, StoryObj } from '@storybook/react-vite'

import { AccountDropdown } from './AccountDropdown'

const meta = {
  title: 'Layout/AccountDropdown',
  component: AccountDropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    name: 'Alex Krasnov',
    company: 'Binance Afrika',
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-56 w-[260px] items-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongContent: Story = {
  args: {
    name: 'Alexandr Konstantin Krasnov',
    company: 'Very Long Company Name Ltd.',
  },
}

export const Compact: Story = {
  args: {
    compact: true,
  },
}
