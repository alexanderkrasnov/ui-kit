import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check } from 'lucide-react'

import { Button } from '../Button'
import { ActionStack } from './ActionStack'

const meta = {
  title: 'Layout/ActionStack',
  component: ActionStack,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column'],
    },
    justify: {
      control: 'select',
      options: ['start', 'end'],
    },
  },
} satisfies Meta<typeof ActionStack>

export default meta
type Story = StoryObj<typeof meta>

export const PopoverFooter: Story = {
  args: {
    direction: 'row',
    justify: 'end',
    fullWidthOnMobile: true,
  },
  render: (args) => (
    <div className="w-[min(22rem,calc(100vw-2rem))] rounded-[14px] border border-border bg-surface-primary p-4 shadow-sm">
      <div className="space-y-1 pb-4">
        <h3 className="text-sm font-semibold text-foreground">Validate thoughts</h3>
        <p className="text-sm leading-5 text-foreground-secondary">
          Save this draft or keep editing the current validation flow.
        </p>
      </div>
      <ActionStack {...args}>
        <Button startIcon={<Check />} size="small">
          Save
        </Button>
        <Button variant="secondary" size="small">
          Keep editing
        </Button>
      </ActionStack>
    </div>
  ),
}

export const Column: Story = {
  render: () => (
    <ActionStack
      direction="column"
      className="w-[min(18rem,calc(100vw-2rem))] rounded-[14px] border border-border bg-surface-primary p-4 shadow-sm"
    >
      <Button size="small">Run validation</Button>
      <Button variant="secondary" size="small">
        Save as draft
      </Button>
      <Button variant="ghost" size="small">
        Cancel
      </Button>
    </ActionStack>
  ),
}
