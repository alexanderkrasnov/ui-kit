import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertTriangle, Check, Clock, RotateCcw, Trash2 } from 'lucide-react'

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
      options: ['responsive', 'row', 'column'],
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between'],
    },
  },
} satisfies Meta<typeof ActionStack>

export default meta
type Story = StoryObj<typeof meta>

export const PopoverFooter: Story = {
  args: {
    direction: 'responsive',
    gap: 'sm',
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

export const DestructiveActions: Story = {
  render: () => (
    <div className="w-[min(24rem,calc(100vw-2rem))] rounded-[14px] border border-border bg-surface-primary p-4 shadow-sm">
      <div className="mb-4 flex gap-3">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger">
          <AlertTriangle className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Delete validation?</h3>
          <p className="mt-1 text-sm leading-5 text-foreground-secondary">
            This removes the saved reasoning and cannot be undone.
          </p>
        </div>
      </div>
      <ActionStack>
        <Button variant="danger" size="small" startIcon={<Trash2 />}>
          Delete
        </Button>
        <Button variant="ghost" size="small">
          Cancel
        </Button>
      </ActionStack>
    </div>
  ),
}

export const WithLeadingContent: Story = {
  render: () => (
    <ActionStack
      justify="between"
      className="w-[min(34rem,calc(100vw-2rem))] rounded-[14px] border border-border bg-surface-primary p-4 shadow-sm"
    >
      <div className="min-w-0 text-sm text-foreground-secondary">
        <span className="inline-flex items-center gap-2">
          <Clock className="size-4 shrink-0" aria-hidden />
          Last autosaved 2 min ago
        </span>
      </div>
      <ActionStack direction="row" gap="xs">
        <Button variant="ghost" size="small">
          Dismiss
        </Button>
        <Button size="small">Apply</Button>
      </ActionStack>
    </ActionStack>
  ),
}

export const CompactRow: Story = {
  render: () => (
    <ActionStack direction="row" gap="xs">
      <Button variant="secondary" size="small" startIcon={<RotateCcw />}>
        Reset
      </Button>
      <Button variant="ghost" size="small">
        Preview
      </Button>
      <Button size="small">Publish</Button>
    </ActionStack>
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
