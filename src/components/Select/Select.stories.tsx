import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown, Funnel } from 'lucide-react'
import { useState } from 'react'

import deFlag from 'flag-icons/flags/4x3/de.svg?url'
import frFlag from 'flag-icons/flags/4x3/fr.svg?url'
import geFlag from 'flag-icons/flags/4x3/ge.svg?url'
import usFlag from 'flag-icons/flags/4x3/us.svg?url'

import { Checkbox } from '../Checkbox'
import { Select } from './Select'

function CountryFlag({ src, label }: { src: string; label: string }) {
  return (
    <img
      src={src}
      alt=""
      title={label}
      className="rounded-[1px] object-cover shadow-sm ring-1 ring-black/10"
    />
  )
}

const countryItems = [
  {
    label: 'United States',
    value: 'us',
    icon: <CountryFlag src={usFlag} label="United States" />,
  },
  {
    label: 'Germany',
    value: 'de',
    icon: <CountryFlag src={deFlag} label="Germany" />,
  },
  {
    label: 'France',
    value: 'fr',
    icon: <CountryFlag src={frFlag} label="France" />,
  },
  {
    label: 'Georgia',
    value: 'ge',
    icon: <CountryFlag src={geFlag} label="Georgia" />,
  },
]

const columnItems = [
  { label: 'Name', value: 'name' },
  { label: 'Status', value: 'status' },
  { label: 'Email', value: 'email' },
  { label: 'Role', value: 'role' },
  { label: 'Last active', value: 'lastActive' },
]

function ColumnsSelectDemo({ variant }: { variant: 'default' | 'secondary' }) {
  const [selectedColumns, setSelectedColumns] = useState([
    'name',
    'status',
    'email',
    'role',
  ])

  return (
    <Select
      label="Columns"
      prefixIcon={<Funnel />}
      variant={variant}
      className="w-fit"
      triggerClassName="justify-start"
      menuClassName="w-fit p-2"
      menuContent={
        <div className="flex flex-col gap-2">
          {columnItems.map((item) => {
            const checked = selectedColumns.includes(item.value)

            return (
              <Checkbox
                key={item.value}
                label={item.label}
                checked={checked}
                variant="default"
                onChange={() => {
                  setSelectedColumns((current) =>
                    checked
                      ? current.filter((value) => value !== item.value)
                      : [...current, item.value],
                  )
                }}
              />
            )
          })}
        </div>
      }
    />
  )
}

const meta = {
  title: 'Forms/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[250px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col items-start gap-3">
      <ColumnsSelectDemo variant="default" />
      <ColumnsSelectDemo variant="secondary" />
      <Select
        items={countryItems}
        placeholder="Select country"
        icon={<ChevronDown />}
        variant="default"
        className="w-full"
        triggerClassName="w-full justify-between"
      />
      <Select
        items={countryItems}
        placeholder="Select country"
        icon={<ChevronDown />}
        variant="secondary"
        className="w-full"
        triggerClassName="w-full justify-between"
      />
    </div>
  ),
}

export const ColumnsPrimary: Story = {
  name: 'Columns primary',
  render: () => <ColumnsSelectDemo variant="default" />,
}

export const ColumnsSecondary: Story = {
  name: 'Columns secondary',
  render: () => <ColumnsSelectDemo variant="secondary" />,
}

export const SelectCountryPrimary: Story = {
  name: 'Select country primary',
  args: {
    items: countryItems,
    placeholder: 'Select country',
    icon: <ChevronDown />,
    variant: 'default',
    className: 'w-full',
    triggerClassName: 'w-full justify-between',
  },
}

export const SelectCountrySecondary: Story = {
  name: 'Select country secondary',
  args: {
    items: countryItems,
    placeholder: 'Select country',
    icon: <ChevronDown />,
    variant: 'secondary',
    className: 'w-full',
    triggerClassName: 'w-full justify-between',
  },
}
