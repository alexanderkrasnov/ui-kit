import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Book, ChartBar, Inbox, MessageSquare } from 'lucide-react'

import { Sidebar, type SidebarNavItem, type SidebarProps } from './Sidebar'
import symbolUrl from './assets/symbol.svg?url'
import wordmarkUrl from './assets/wordmark.svg?url'

function PlexoSymbol({ labelled = true }: { labelled?: boolean }) {
  return (
    <span
      className="inline-flex size-5 shrink-0 items-center justify-center text-[0]"
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? 'Plexo' : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <img src={symbolUrl} alt="" className="size-5 shrink-0" />
    </span>
  )
}

function PlexoLogo() {
  return (
    <span
      className="inline-flex h-5 items-center gap-2 text-[0]"
      role="img"
      aria-label="Plexo"
    >
      <PlexoSymbol labelled={false} />
      <img src={wordmarkUrl} alt="" className="h-[18px] w-[46px] shrink-0" />
    </span>
  )
}

function PlexoWordmark() {
  return (
    <span
      className="inline-flex h-5 items-center text-[0]"
      role="img"
      aria-label="Plexo"
    >
      <img src={wordmarkUrl} alt="" className="h-[18px] w-[46px] shrink-0" />
    </span>
  )
}

function StoryShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[600px] bg-background text-foreground">
      {children}
      <main className="min-w-0 flex-1 p-6">
        <div className="type-body-sm text-foreground-secondary">Dashboard content</div>
      </main>
    </div>
  )
}

function StorySidebar(args: SidebarProps) {
  return (
    <Sidebar
      {...args}
      className={['!h-[600px]', args.className].filter(Boolean).join(' ')}
    />
  )
}

const defaultItems: SidebarNavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <ChartBar />,
    active: true,
    href: '#dashboard',
  },
  {
    key: 'partners',
    label: 'Partners',
    icon: <Book />,
    href: '#partners',
  },
]

const badgeItems: SidebarNavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <ChartBar />,
    active: true,
    badge: 3,
    href: '#dashboard',
  },
  {
    key: 'requests',
    label: 'Requests',
    icon: <Inbox />,
    badge: 24,
    href: '#requests',
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: <MessageSquare />,
    badge: 130,
    href: '#messages',
  },
  {
    key: 'partners',
    label: 'Partners',
    icon: <Book />,
    href: '#partners',
  },
]

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    logo: <PlexoLogo />,
    collapsedLogo: <PlexoSymbol />,
    items: defaultItems,
    account: {
      name: 'Alex Krasnov',
      company: 'Binance Afrika',
    },
  },
  argTypes: {
    logo: { control: false },
    collapsedLogo: { control: false },
    items: { control: false },
    account: { control: false },
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <StoryShell>
      <StorySidebar {...args} />
    </StoryShell>
  ),
}

export const Collapsed: Story = {
  args: {
    defaultCollapsed: true,
  },
  render: (args) => (
    <StoryShell>
      <StorySidebar {...args} />
    </StoryShell>
  ),
}

export const WithBadges: Story = {
  args: {
    items: badgeItems,
  },
  render: (args) => (
    <StoryShell>
      <StorySidebar {...args} />
    </StoryShell>
  ),
}

export const CollapsedWithBadges: Story = {
  args: {
    defaultCollapsed: true,
    items: badgeItems,
  },
  render: (args) => (
    <StoryShell>
      <StorySidebar {...args} />
    </StoryShell>
  ),
}

export const WordmarkOnly: Story = {
  args: {
    logo: <PlexoWordmark />,
    collapsedLogo: null,
    defaultCollapsed: true,
  },
  render: (args) => (
    <StoryShell>
      <StorySidebar {...args} />
    </StoryShell>
  ),
}
