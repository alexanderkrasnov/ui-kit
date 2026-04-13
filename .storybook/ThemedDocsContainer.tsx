import type { FC, PropsWithChildren } from 'react'
import { useLayoutEffect } from 'react'
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'

/** Must match `withThemeByClassName` in preview.tsx */
const THEME_CLASSES = {
  light: 'light',
  dark: 'dark',
} as const

function syncDocumentTheme(themeKey: string) {
  const el = document.documentElement
  for (const c of Object.values(THEME_CLASSES)) {
    el.classList.remove(c)
  }
  const cls = THEME_CLASSES[themeKey as keyof typeof THEME_CLASSES] ?? THEME_CLASSES.light
  el.classList.add(cls)
}

function themeFromChannelPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return 'light'
  const p = payload as { globals?: Record<string, unknown> }
  const g = p.globals
  if (!g || typeof g !== 'object') return 'light'
  return String(g.theme ?? 'light')
}

/** Toolbar / URL often use `?globals=theme:dark` */
function readThemeFromSearch(): string {
  if (typeof window === 'undefined') return 'light'
  try {
    const raw = new URLSearchParams(window.location.search).get('globals') ?? ''
    if (raw.includes('theme:dark')) return 'dark'
    if (raw.includes('theme:light')) return 'light'
  } catch {
    /* ignore */
  }
  return 'light'
}

/**
 * Docs container is not a story/decorator — `useGlobals` / `useChannel` from preview-api are invalid here.
 * Sync theme via `context.channel` (core events `updateGlobals` / `setGlobals`) + initial URL.
 */
export const ThemedDocsContainer: FC<PropsWithChildren<DocsContainerProps>> = (props) => {
  const channel = props.context.channel

  useLayoutEffect(() => {
    syncDocumentTheme(readThemeFromSearch())

    const handler = (payload: unknown) => {
      syncDocumentTheme(themeFromChannelPayload(payload))
    }

    channel.on('updateGlobals', handler)
    channel.on('setGlobals', handler)

    return () => {
      channel.off('updateGlobals', handler)
      channel.off('setGlobals', handler)
    }
  }, [channel])

  return <DocsContainer {...props} />
}
