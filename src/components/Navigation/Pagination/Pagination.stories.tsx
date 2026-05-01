import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Pagination } from './Pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    total: 10,
    defaultPage: 1,
    'aria-label': 'Pages',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'sm'],
    },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Pagination {...args} total={10} defaultPage={1} size="md" />
      <Pagination {...args} total={10} defaultPage={1} size="sm" />
    </div>
  ),
}

function PaginationWithSummary() {
  const [page, setPage] = useState(1)
  const totalPages = 10
  const pageSize = 10
  const totalResults = 100
  const startResult = (page - 1) * pageSize + 1
  const endResult = Math.min(page * pageSize, totalResults)

  return (
    <Pagination
      total={totalPages}
      page={page}
      onPageChange={setPage}
      summary={`Showing ${startResult}-${endResult} of ${totalResults} results`}
      aria-label="Pages with summary"
    />
  )
}

export const WithSummary: Story = {
  name: 'With Summary',
  render: () => <PaginationWithSummary />,
}
