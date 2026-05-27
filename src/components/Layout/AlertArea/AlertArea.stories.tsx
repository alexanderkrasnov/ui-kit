import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../Button'
import { AlertArea, type AlertAreaColor, type AlertAreaVariant } from './AlertArea'

type AlertAreaExample = {
  title: string
  description?: string
  color: AlertAreaColor
  renderAction?: () => ReactNode
  loading?: boolean
  dismissible?: boolean
}

const contentOnlyExamples: AlertAreaExample[] = [
  {
    title: 'Scheduled maintenance',
    description:
      'Our services will be unavailable on Sunday, March 15th from 2:00 AM to 6:00 AM UTC for scheduled maintenance.',
    color: 'warning',
  },
  {
    title: 'New features available',
    description:
      'Check out our latest updates including dark mode support and improved accessibility features.',
    color: 'default',
  },
]

const dismissibleExamples: AlertAreaExample[] = [
  {
    title: 'Profile updated successfully',
    color: 'success',
    dismissible: true,
  },
]

const actionExamples: AlertAreaExample[] = [
  {
    title: 'Update available',
    description:
      'A new version of the application is available. Please refresh to get the latest features and bug fixes.',
    color: 'accent',
    renderAction: () => <Button size="small">Refresh</Button>,
  },
  {
    title: 'Payment successful',
    description:
      'Your payment of $49.99 has been processed. A confirmation email has been sent to your inbox.',
    color: 'success',
    renderAction: () => (
      <Button variant="success" size="small">
        View Receipt
      </Button>
    ),
  },
  {
    title: 'Unable to connect to server',
    description: "We're experiencing connection issues.",
    color: 'danger',
    renderAction: () => (
      <Button variant="danger" size="small">
        Retry
      </Button>
    ),
  },
]

const processingExamples: AlertAreaExample[] = [
  {
    title: 'Processing your request',
    description: 'Please wait while we sync your data. This may take a few moments.',
    color: 'accent',
    loading: true,
  },
]

function StoryAlert({
  example,
  variant,
}: {
  example: AlertAreaExample
  variant: AlertAreaVariant
}) {
  return (
    <AlertArea
      variant={variant}
      color={example.color}
      title={example.title}
      action={example.renderAction?.()}
      loading={example.loading}
      onClose={example.dismissible ? () => undefined : undefined}
    >
      {example.description}
    </AlertArea>
  )
}

function AlertAreaPair({ example }: { example: AlertAreaExample }) {
  return (
    <div className="flex flex-col gap-3">
      <StoryAlert example={example} variant="primary" />
      <div className="rounded-2xl bg-surface-primary p-3">
        <StoryAlert example={example} variant="secondary" />
      </div>
    </div>
  )
}

function AlertAreaStory({ examples }: { examples: AlertAreaExample[] }) {
  return (
    <div className="mx-auto flex w-[min(39rem,calc(100vw-2rem))] flex-col gap-6">
      {examples.map((example) => (
        <AlertAreaPair key={example.title} example={example} />
      ))}
    </div>
  )
}

const meta = {
  title: 'Layout/Alert Area',
  component: AlertArea,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    title: 'Alert area',
    color: 'accent',
    variant: 'primary',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['accent', 'default', 'success', 'warning', 'danger'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    icon: { control: false },
    action: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof AlertArea>

export default meta
type Story = StoryObj<typeof meta>

export const ContentOnly: Story = {
  name: 'Content Only',
  render: () => <AlertAreaStory examples={contentOnlyExamples} />,
}

export const Dismissible: Story = {
  render: () => <AlertAreaStory examples={dismissibleExamples} />,
}

export const WithActions: Story = {
  name: 'With Actions',
  render: () => <AlertAreaStory examples={actionExamples} />,
}

export const Processing: Story = {
  render: () => <AlertAreaStory examples={processingExamples} />,
}
