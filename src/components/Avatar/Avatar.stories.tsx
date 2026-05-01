import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar } from './Avatar'

const meta = {
  title: 'UI Chunks/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    fallback: { control: 'text' },
    icon: { control: 'boolean' },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** Один визуальный стиль: `surface-secondary` + инициалы или иконка. */
export const Default: Story = {
  args: {
    size: 'md',
    fallback: 'JD',
    icon: false,
  },
  render: (args) => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar {...args} aria-label="With initials" />
      <Avatar size={args.size} className={args.className} icon aria-label="Icon avatar" />
    </div>
  ),
}

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-4">
      <Avatar size="sm" fallback="S" aria-label="Small" />
      <Avatar size="md" fallback="M" aria-label="Medium" />
    </div>
  ),
}
