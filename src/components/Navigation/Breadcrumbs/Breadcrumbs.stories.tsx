import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurfaceFit } from '../../../docs/story-surfaces'
import { Breadcrumbs } from './Breadcrumbs'

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    items: [
      {
        label: 'Projects',
        href: '#projects',
      },
      {
        label: 'Website redesign',
        href: '#website-redesign',
      },
      {
        label: 'Overview',
      },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className={secondaryStorySurfaceFit}>
      <Breadcrumbs {...args} />
    </div>
  ),
}

export const LongPath: Story = {
  name: 'Long Path',
  args: {
    items: [
      {
        label: 'Workspace',
        href: '#workspace',
      },
      {
        label: 'Design System',
        href: '#design-system',
      },
      {
        label: 'Navigation',
        href: '#navigation',
      },
      {
        label: 'Breadcrumbs',
      },
    ],
  },
  render: (args) => (
    <div className={secondaryStorySurfaceFit}>
      <Breadcrumbs {...args} />
    </div>
  ),
}
