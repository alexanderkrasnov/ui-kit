import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

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

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const WithStartIcon: Story = {
  args: {
    children: 'Добавить',
    startIcon: <PlusIcon />,
    variant: 'primary',
  },
}

export const WithEndIcon: Story = {
  args: {
    children: 'Далее',
    endIcon: <ChevronIcon />,
    variant: 'secondary',
  },
}

export const IconOnly: Story = {
  name: 'Только иконка',
  args: {
    children: undefined,
    startIcon: <PlusIcon />,
    variant: 'primary',
    'aria-label': 'Добавить',
  },
}
