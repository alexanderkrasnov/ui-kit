import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown, Funnel } from 'lucide-react'
import { useState } from 'react'

import deFlag from 'flag-icons/flags/4x3/de.svg?url'
import frFlag from 'flag-icons/flags/4x3/fr.svg?url'
import geFlag from 'flag-icons/flags/4x3/ge.svg?url'
import usFlag from 'flag-icons/flags/4x3/us.svg?url'

import { secondaryStorySurface } from '../../docs/story-surfaces'
import { Select, type SelectProps } from './Select'

function CountryFlag({ src, label }: { src: string; label: string }) {
  return (
    <img
      src={src}
      alt=""
      title={label}
      className="max-h-3 rounded-[1px] object-cover shadow-sm ring-1 ring-black/10"
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

const pethRoleItems = [
  { label: 'Compliance officer', value: 'complianceOfficer' },
  { label: 'Risk analyst', value: 'riskAnalyst' },
  { label: 'Treasury manager', value: 'treasuryManager' },
  { label: 'Operations reviewer', value: 'operationsReviewer' },
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
      selectionMode="multiple"
      items={columnItems}
      value={selectedColumns}
      onValueChange={setSelectedColumns}
      label="Columns"
      prefixIcon={<Funnel />}
      variant={variant}
      className="w-fit"
      triggerClassName="justify-start"
      menuWidth={250}
    />
  )
}

function RoleSelectDemo({ variant }: { variant: 'default' | 'secondary' }) {
  return (
    <Select
      items={pethRoleItems}
      defaultValue="complianceOfficer"
      placeholder="Select role"
      icon={<ChevronDown />}
      variant={variant}
      className="w-full"
      triggerClassName="w-full justify-between"
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
} satisfies Meta<SelectProps>

export default meta
type Story = StoryObj<SelectProps>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[250px] flex-col items-start gap-6">
      <div className="flex w-full flex-col items-start gap-3">
        <ColumnsSelectDemo variant="default" />
        <RoleSelectDemo variant="default" />
        <Select
          items={countryItems}
          placeholder="Select country"
          icon={<ChevronDown />}
          variant="default"
          className="w-full"
          triggerClassName="w-full justify-between"
        />
      </div>
      <div className={`${secondaryStorySurface} flex flex-col items-start gap-6`}>
        <ColumnsSelectDemo variant="secondary" />
        <RoleSelectDemo variant="secondary" />
        <Select
          items={countryItems}
          placeholder="Select country"
          icon={<ChevronDown />}
          variant="secondary"
          className="w-full"
          triggerClassName="w-full justify-between"
        />
      </div>
    </div>
  ),
}

export const ColumnsPrimary: Story = {
  name: 'Columns primary',
  render: () => <ColumnsSelectDemo variant="default" />,
}

export const ColumnsSecondary: Story = {
  name: 'Columns secondary',
  render: () => (
    <div className={secondaryStorySurface}>
      <ColumnsSelectDemo variant="secondary" />
    </div>
  ),
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
  render: (args: SelectProps) => (
    <div className={secondaryStorySurface}>
      <Select {...args} />
    </div>
  ),
}

export const SingleValueWithCheckmark: Story = {
  name: 'Single value with checkmark',
  args: {
    items: pethRoleItems,
    defaultValue: 'complianceOfficer',
    placeholder: 'Select role',
    icon: <ChevronDown />,
    variant: 'default',
    className: 'w-full',
    triggerClassName: 'w-full justify-between',
  },
}

export const SingleValueWithCheckmarkSecondary: Story = {
  name: 'Single value with checkmark secondary',
  args: {
    items: pethRoleItems,
    defaultValue: 'complianceOfficer',
    placeholder: 'Select role',
    icon: <ChevronDown />,
    variant: 'secondary',
    className: 'w-full',
    triggerClassName: 'w-full justify-between',
  },
  render: (args: SelectProps) => (
    <div className={secondaryStorySurface}>
      <Select {...args} />
    </div>
  ),
}
