import type { Meta, StoryObj } from '@storybook/react-vite'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import { SearchField } from './SearchField'

const meta = {
  title: 'Forms/Search Field',
  component: SearchField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-w-[250px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary'] },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col gap-4">
      <SearchField label="Default" placeholder="Search" variant="default" defaultValue="Design" />
      <div className={secondaryStorySurface}>
        <SearchField label="Secondary" placeholder="Search" variant="secondary" defaultValue="Design" />
      </div>
    </div>
  ),
}

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Search',
    placeholder: 'Search projects',
    description: 'Search by name, status, or owner.',
  },
}

export const Required: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search projects',
    required: true,
  },
}

export const PrimaryWithButton: Story = {
  name: 'Primary with Button',
  args: {
    label: 'Search',
    placeholder: 'Search projects',
    variant: 'default',
    actionLabel: 'Search',
    className: 'w-[300px] max-w-none',
  },
}

export const SecondaryWithButton: Story = {
  name: 'Secondary with Button',
  args: {
    label: 'Search',
    placeholder: 'Search projects',
    variant: 'secondary',
    actionLabel: 'Search',
    actionProps: {
      variant: 'secondary',
    },
    className: 'w-[300px] max-w-none',
  },
  render: (args) => (
    <div className={secondaryStorySurface}>
      <SearchField {...args} />
    </div>
  ),
}
