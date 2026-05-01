import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from './Tooltip'

const meta = {
  title: 'UI Chunks/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      story: {
        height: '360px',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children:
      'Legal Entity Identifier is a 20-character alphanumeric code (ISO 17442) that uniquely identifies legal entities.',
    iconLabel: 'About Legal Entity Identifier',
  },
  argTypes: {
    children: { control: 'text' },
    iconLabel: { control: 'text' },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex h-80 w-[480px] items-center justify-center">
      <Tooltip {...args} />
    </div>
  ),
}
