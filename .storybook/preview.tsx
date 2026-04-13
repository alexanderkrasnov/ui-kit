import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'

import '../src/styles/tailwind.css'
import './docs-overrides.css'
import { ThemedDocsContainer } from './ThemedDocsContainer'

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
    docs: {
      container: ThemedDocsContainer,
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
