import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'

import '../src/styles/tailwind.css'
import './docs-overrides.css'

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      defaultTheme: 'light',
      themes: {
        light: 'light',
        dark: 'dark',
      },
    }),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Color System',
          'Typography System',
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
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'theme background', value: 'var(--color-background)' },
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
