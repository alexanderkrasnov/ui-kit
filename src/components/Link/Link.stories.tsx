import type { Meta, StoryObj } from '@storybook/react-vite'

import { Link } from './Link'

const meta = {
  title: 'Buttons/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    href: '#',
    children: 'Link',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    underline: {
      control: 'select',
      options: ['always', 'hover', 'none'],
    },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Link href="#" variant="primary">
        Primary
      </Link>
      <Link href="#" variant="secondary">
        Secondary
      </Link>
    </div>
  ),
}

export const AlwaysVisibleUnderline: Story = {
  name: 'Always visible underline',
  args: {
    href: '#',
    children: 'Always visible underline',
    underline: 'always',
  },
}

export const UnderlineVisibleOnHover: Story = {
  name: 'Underline visible on hover',
  args: {
    href: '#',
    children: 'Underline visible on hover',
    underline: 'hover',
  },
}
