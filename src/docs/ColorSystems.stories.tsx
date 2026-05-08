import type { Meta, StoryObj } from '@storybook/react-vite'

import { ColorSystemsPreview } from './ColorSystemsPreview'

const meta = {
  title: 'Design System/Color System',
  component: ColorSystemsPreview,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'theme background', value: 'var(--color-background)' },
        { name: 'surface primary', value: 'var(--color-surface-primary)' },
        { name: 'surface secondary', value: 'var(--color-surface-secondary)' },
        { name: 'neutral light', value: '#f5f5f5' },
        { name: 'neutral dark', value: '#121212' },
      ],
    },
  },
} satisfies Meta<typeof ColorSystemsPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Colors: Story = {
  render: () => <ColorSystemsPreview />,
}
