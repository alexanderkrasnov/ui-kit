import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

const buildLib = process.env.BUILD_LIB === '1'
const root = import.meta.dirname

export default defineConfig({
  ...(buildLib ? { publicDir: false as const } : {}),
  plugins: [react(), tailwindcss()],
  build: buildLib
    ? {
        lib: {
          entry: resolve(root, 'src/index.ts'),
          formats: ['es'],
          fileName: 'index',
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            preserveModules: true,
            preserveModulesRoot: resolve(root, 'src'),
            entryFileNames: '[name].js',
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      }
    : undefined,
})
