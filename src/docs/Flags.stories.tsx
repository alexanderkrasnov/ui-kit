import type { Meta, StoryObj } from '@storybook/react-vite'

import brFlag from 'flag-icons/flags/4x3/br.svg?url'
import deFlag from 'flag-icons/flags/4x3/de.svg?url'
import euFlag from 'flag-icons/flags/4x3/eu.svg?url'
import frFlag from 'flag-icons/flags/4x3/fr.svg?url'
import gbFlag from 'flag-icons/flags/4x3/gb.svg?url'
import geFlag from 'flag-icons/flags/4x3/ge.svg?url'
import jpFlag from 'flag-icons/flags/4x3/jp.svg?url'
import usFlag from 'flag-icons/flags/4x3/us.svg?url'

const flags = [
  { src: geFlag, label: 'Georgia' },
  { src: usFlag, label: 'United States' },
  { src: gbFlag, label: 'United Kingdom' },
  { src: deFlag, label: 'Germany' },
  { src: frFlag, label: 'France' },
  { src: jpFlag, label: 'Japan' },
  { src: brFlag, label: 'Brazil' },
  { src: euFlag, label: 'European Union' },
] as const

/**
 * Флаги из [flag-icons](https://github.com/lipis/flag-icons) — обычные SVG-ассеты.
 * В Storybook их можно импортировать напрямую из `flag-icons/flags/4x3/{code}.svg?url`.
 */
const meta = {
  title: 'UI Chunks/Flags',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Catalog: Story = {
  name: 'Catalog',
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {flags.map((flag) => (
        <img
          key={flag.label}
          className="h-6 w-8 rounded-[2px] object-cover shadow-sm ring-1 ring-black/10"
          src={flag.src}
          alt={flag.label}
          title={flag.label}
        />
      ))}
    </div>
  ),
}
