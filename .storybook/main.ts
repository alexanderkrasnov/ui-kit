import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  "stories": ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
    })
  },
};
export default config;
