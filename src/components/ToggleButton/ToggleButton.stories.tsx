import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurfaceFit } from '../../docs/story-surfaces'
import { ToggleButton, type ToggleButtonProps } from './ToggleButton'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ToggleButtonDemo(args: ToggleButtonProps) {
  const [pressed, setPressed] = useState(false)

  return (
    <ToggleButton
      {...args}
      pressed={pressed}
      startIcon={<HeartIcon />}
      onClick={() => setPressed((prev) => !prev)}
    >
      Like
    </ToggleButton>
  )
}

const meta = {
  title: 'Buttons/Toggle Button',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    pressed: { control: 'boolean' },
  },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleButtonDemo variant="primary" />
      <div className={secondaryStorySurfaceFit}>
        <ToggleButtonDemo variant="secondary" />
      </div>
    </div>
  ),
}
