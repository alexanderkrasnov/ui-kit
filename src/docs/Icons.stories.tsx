import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Bell,
  Calendar,
  Heart,
  Home,
  Mail,
  Search,
  Settings,
  User,
} from 'lucide-react'

/**
 * Иконки из [Lucide](https://lucide.dev/icons/) — обычные React-компоненты, которые рендерят SVG.
 * В Storybook их можно импортировать напрямую: отдельного «рендерера» не нужно, пакет `lucide-react`
 * уже подключён в проекте и tree-shakeable.
 */
const meta = {
  title: 'UI Chunks/Icons',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Catalog: Story = {
  name: 'Catalog',
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-6 text-foreground">
      <Home className="size-6" aria-hidden />
      <Search className="size-6" aria-hidden />
      <Bell className="size-6" aria-hidden />
      <Mail className="size-6" aria-hidden />
      <Calendar className="size-6" aria-hidden />
      <Settings className="size-6" aria-hidden />
      <User className="size-6" aria-hidden />
      <Heart className="size-6 text-danger" aria-hidden />
    </div>
  ),
}
