import type { Meta, StoryObj } from '@storybook/react-vite'

import { CloseButton } from './CloseButton'

const meta = {
  title: 'Buttons/Close Button',
  component: CloseButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
} satisfies Meta<typeof CloseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <CloseButton size="sm" variant="default" aria-label="Close small default" />
        <CloseButton size="md" variant="default" aria-label="Close medium default" />
      </div>
      <div className="flex items-center gap-3">
        <CloseButton size="sm" variant="ghost" aria-label="Close small ghost" />
        <CloseButton size="md" variant="ghost" aria-label="Close medium ghost" />
      </div>
    </div>
  ),
}
