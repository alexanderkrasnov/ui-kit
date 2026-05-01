import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './Spinner'

const meta = {
  title: 'UI Chunks/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-6">
      <Spinner size="sm" aria-label="Small loading" />
      <Spinner size="md" aria-label="Medium loading" />
      <Spinner size="lg" aria-label="Large loading" />
      <Spinner size="xl" aria-label="Extra large loading" />
    </div>
  ),
}
