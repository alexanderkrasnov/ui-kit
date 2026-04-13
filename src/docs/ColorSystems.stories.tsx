import type { Meta, StoryObj } from '@storybook/react-vite'

import { ColorSystemsPreview } from './ColorSystemsPreview'

const meta = {
  title: 'Color System',
  component: ColorSystemsPreview,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ColorSystemsPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Colors: Story = {
  render: () => <ColorSystemsPreview />,
}
