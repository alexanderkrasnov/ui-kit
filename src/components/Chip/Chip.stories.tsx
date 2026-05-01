import { Fragment } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { User, X } from 'lucide-react'

import { Chip } from './Chip'

const colors = ['accent', 'default', 'success', 'warning', 'danger'] as const
const sizes = ['lg', 'md', 'sm'] as const
const tones = ['primary', 'soft'] as const

const colorLabels: Record<(typeof colors)[number], string> = {
  accent: 'accent',
  default: 'default',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
}

const sizeLabels: Record<(typeof sizes)[number], string> = {
  lg: 'lg',
  md: 'md',
  sm: 'sm',
}

const toneLabels: Record<(typeof tones)[number], string> = {
  primary: 'primary',
  soft: 'soft',
}

const meta = {
  title: 'UI Chunks/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[min(100%,56rem)] px-6 py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const PrimaryLabel: Story = {
  name: 'Primary Label',
  args: {
    children: 'Label',
    color: 'accent',
    tone: 'primary',
    size: 'md',
  },
}

export const SoftLabel: Story = {
  name: 'Soft Label',
  args: {
    children: 'Label',
    color: 'accent',
    tone: 'soft',
    size: 'md',
  },
}

export const Sizes: Story = {
  args: {
    children: 'Label',
  },
  render: () => (
    <div className="flex w-full flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-12 text-sm font-semibold text-foreground-secondary">{sizeLabels[size]}</span>
          <Chip size={size} color="accent" tone="primary">
            Label
          </Chip>
          <Chip size={size} color="accent" tone="soft">
            Label
          </Chip>
        </div>
      ))}
    </div>
  ),
}

export const WithIconLeftRight: Story = {
  name: 'With Icon Left/Right',
  args: {
    children: 'Label',
  },
  render: () => (
    <div className="flex w-full flex-wrap items-center gap-4">
      <Chip startIcon={User} color="accent" tone="primary">
        Left icon
      </Chip>
      <Chip endIcon={X} color="default" tone="primary">
        Right icon
      </Chip>
      <Chip startIcon={User} endIcon={X} color="success" tone="soft">
        Both sides
      </Chip>
    </div>
  ),
}

export const Overview: Story = {
  args: {
    children: 'Label',
  },
  render: () => (
    <div className="flex w-full flex-col gap-8 rounded-3xl bg-surface-primary p-6">
      {sizes.map((size, sizeIndex) => (
        <div key={size} className="flex flex-col gap-4">
          <div className="text-sm font-semibold capitalize text-foreground-secondary">{sizeLabels[size]}</div>

          <div className="overflow-x-auto">
            <div className="min-w-[46rem]">
              <div className="grid grid-cols-[6rem_repeat(5,minmax(0,1fr))] items-center gap-3">
                <div />
                {colors.map((color) => (
                  <div
                    key={`${size}-${color}-heading`}
                    className="text-center text-xs capitalize text-foreground-secondary"
                  >
                    {colorLabels[color]}
                  </div>
                ))}

                {tones.map((tone) => (
                  <Fragment key={`${size}-${tone}`}>
                    <div
                      className="text-sm capitalize text-foreground-secondary"
                    >
                      {toneLabels[tone]}
                    </div>
                    {colors.map((color) => (
                      <div
                        key={`${size}-${tone}-${color}`}
                        className="flex items-center justify-center"
                      >
                        <Chip
                          size={size}
                          color={color}
                          tone={tone}
                          startIcon={User}
                          endIcon={X}
                        >
                          Label
                        </Chip>
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          {sizeIndex < sizes.length - 1 ? <div className="h-px w-full bg-border" /> : null}
        </div>
      ))}
    </div>
  ),
}
