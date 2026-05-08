import type { Decorator, Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'

import '../src/styles/tailwind.css'
import './docs-overrides.css'
import { ThemedDocsContainer } from './ThemedDocsContainer'

function syncStorybookThemeRoot(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  root.classList.remove('light', 'dark', 'default')
  root.classList.add(theme)
  root.dataset.theme = theme
}

const withThemeRoot: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light'

  syncStorybookThemeRoot(theme)

  return <Story />
}

const preview: Preview = {
  decorators: [
    withThemeRoot,
    withThemeByClassName({
      defaultTheme: 'light',
      themes: {
        light: 'light',
        dark: 'dark',
      },
    }),
  ],
  parameters: {
    docs: {
      container: ThemedDocsContainer,
    },
    options: {
      storySort: {
        order: [
          'Design System',
          ['Color System', 'Typography System'],
          'Buttons',
          ['Button', 'Toggle Button', 'Close Button', 'Link'],
          'Navigation',
          ['Tabs', 'Pagination'],
          'UI Chunks',
          ['Avatar', 'Chip', 'Spinner', 'Tooltip', 'Icons', 'Flags'],
          'Date and Time',
          ['Calendar', 'Date Field', 'Date Picker'],
          'Forms',
          [
            'Checkbox',
            'Dropdown',
            'Input',
            'Text Field',
            'Search Field',
            'Text Area',
            'Input OTP',
            'Radio Button',
          ],
          'Controls',
          ['Slider', 'Switcher'],
        ],
      },
    },
    backgrounds: {
      default: 'theme background',
      values: [
        { name: 'theme background', value: 'var(--color-background)' },
        { name: 'white', value: '#ffffff' },
        { name: 'surface primary', value: 'var(--color-surface-primary)' },
        { name: 'surface secondary', value: 'var(--color-surface-secondary)' },
        { name: 'neutral light', value: '#f5f5f5' },
        { name: 'neutral dark', value: '#121212' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
