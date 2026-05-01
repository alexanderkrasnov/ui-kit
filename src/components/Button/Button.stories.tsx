import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button, type ButtonProps } from './Button'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4 animate-spin"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" strokeLinecap="round" />
    </svg>
  )
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="M21.44 11.05L12.6 19.9a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.55 9.54a2 2 0 0 1-2.83-2.82l8.84-8.84"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LoadingButtonDemo(args: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
    }, 1800)
  }

  return (
    <Button
      {...args}
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading ? 'true' : undefined}
      startIcon={isLoading ? <LoadingSpinner /> : <PaperclipIcon />}
      endIcon={undefined}
    >
      {isLoading ? 'Uploading...' : 'Upload file'}
    </Button>
  )
}

const meta = {
  title: 'Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'All Variants',
  args: {
    size: 'medium',
  },
  argTypes: {
    variant: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" size={args.size}>
        Primary
      </Button>
      <Button variant="secondary" size={args.size}>
        Secondary
      </Button>
      <Button variant="ghost" size={args.size}>
        Ghost
      </Button>
      <Button variant="danger" size={args.size}>
        Danger
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Sizes',
  args: {
    variant: 'primary',
  },
  argTypes: {
    size: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap items-end gap-3">
      <Button variant={args.variant} size="small">
        {`${args.variant} Small`}
      </Button>
      <Button variant={args.variant} size="medium">
        {`${args.variant} Medium`}
      </Button>
      <Button variant={args.variant} size="large">
        {`${args.variant} Large`}
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    children: 'Disabled',
    disabled: true,
    size: 'medium',
  },
}

export const WithIcons: Story = {
  name: 'With Icons',
  args: {
    children: 'Action',
    variant: 'primary',
    size: 'medium',
    startIcon: <PlusIcon />,
    endIcon: undefined,
  },
  argTypes: {
    startIcon: {
      options: ['off', 'on'],
      mapping: {
        off: undefined,
        on: <PlusIcon />,
      },
      control: {
        type: 'inline-radio',
      },
    },
    endIcon: {
      options: ['off', 'on'],
      mapping: {
        off: undefined,
        on: <ChevronIcon />,
      },
      control: {
        type: 'inline-radio',
      },
    },
  },
  render: (args) => <LoadingButtonDemo {...args} />,
}

export const WithLoadingState: Story = {
  name: 'With Loading State',
  args: {
    variant: 'primary',
    size: 'medium',
  },
  argTypes: {
    children: {
      control: false,
      table: {
        disable: true,
      },
    },
    startIcon: {
      control: false,
      table: {
        disable: true,
      },
    },
    endIcon: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  render: (args) => <LoadingButtonDemo {...args} />,
}

export const IconOnly: Story = {
  name: 'Icon Only',
  args: {
    children: undefined,
    startIcon: <PlusIcon />,
    size: 'medium',
    'aria-label': 'Добавить',
  },
  argTypes: {
    variant: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="primary" />
      <Button {...args} variant="secondary" />
      <Button {...args} variant="ghost" />
    </div>
  ),
}
