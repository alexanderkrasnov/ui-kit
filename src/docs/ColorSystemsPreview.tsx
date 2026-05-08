import { useLayoutEffect, useState } from 'react'

interface TokenItem {
  name: string
  variable: string
}

interface TokenGroup {
  title: string
  tokens: TokenItem[]
}

interface TokenSectionProps {
  description?: string
  title: string
  groups: TokenGroup[]
}

const bridgeGroups: TokenGroup[] = [
  {
    title: 'Base utilities',
    tokens: [
      { name: 'Color Background', variable: '--color-background' },
      { name: 'Color Foreground', variable: '--color-foreground' },
      { name: 'Color Foreground Secondary', variable: '--color-foreground-secondary' },
      { name: 'Color Foreground Tertiary', variable: '--color-foreground-tertiary' },
    ],
  },
  {
    title: 'Surface utilities',
    tokens: [
      { name: 'Color Surface Primary', variable: '--color-surface-primary' },
      { name: 'Color Surface Secondary', variable: '--color-surface-secondary' },
      { name: 'Color Surface Tertiary', variable: '--color-surface-tertiary' },
      { name: 'Color Surface Secondary Hover', variable: '--color-surface-secondary-hover' },
    ],
  },
  {
    title: 'Accent utilities',
    tokens: [
      { name: 'Color Accent', variable: '--color-accent' },
      { name: 'Color Accent Foreground', variable: '--color-accent-foreground' },
      { name: 'Color Accent Hover', variable: '--color-accent-hover' },
    ],
  },
  {
    title: 'Status utilities',
    tokens: [
      { name: 'Color Success', variable: '--color-success' },
      { name: 'Color Success Foreground', variable: '--color-success-foreground' },
      { name: 'Color Warning', variable: '--color-warning' },
      { name: 'Color Warning Foreground', variable: '--color-warning-foreground' },
      { name: 'Color Danger', variable: '--color-danger' },
      { name: 'Color Danger Foreground', variable: '--color-danger-foreground' },
      { name: 'Color Danger Hover', variable: '--color-danger-hover' },
    ],
  },
  {
    title: 'Border utilities',
    tokens: [{ name: 'Color Border', variable: '--color-border' }],
  },
  {
    title: 'Field utilities',
    tokens: [
      { name: 'Color Field Background', variable: '--color-field-background' },
      { name: 'Color Field Foreground', variable: '--color-field-foreground' },
      { name: 'Color Field Placeholder', variable: '--color-field-placeholder' },
      { name: 'Color Field Border', variable: '--color-field-border' },
      { name: 'Color Field Border Focus', variable: '--color-field-border-focus' },
      { name: 'Color Field Border Invalid Focus', variable: '--color-field-border-invalid-focus' },
    ],
  },
  {
    title: 'For labels',
    tokens: [
      { name: 'Color Label Olive', variable: '--color-label-olive' },
      { name: 'Color Label Orange', variable: '--color-label-orange' },
      { name: 'Color Label Violet', variable: '--color-label-violet' },
      { name: 'Color Label Teal', variable: '--color-label-teal' },
      { name: 'Color Label Red', variable: '--color-label-red' },
      { name: 'Color Label Pink', variable: '--color-label-pink' },
      { name: 'Color Label Lime', variable: '--color-label-lime' },
      { name: 'Color Label Blue', variable: '--color-label-blue' },
    ],
  },
]

function readComputedTokenValue(variable: string) {
  if (typeof window === 'undefined') return ''

  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}

function useThemeVersion() {
  const [version, setVersion] = useState(0)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
        setVersion((currentVersion) => currentVersion + 1)
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return version
}

function TokenCard({ name, variable }: TokenItem) {
  const computedValue = readComputedTokenValue(variable)

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-surface-primary p-4 shadow-sm sm:flex-row sm:items-start">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div
          aria-hidden="true"
          className="size-12 shrink-0 rounded-xl border border-border"
          style={{ backgroundColor: `var(${variable})` }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{name}</span>
            <code className="rounded-md bg-surface-secondary px-2 py-1 text-[11px] text-foreground-tertiary">
              {variable}
            </code>
          </div>
        </div>
      </div>
      {!!computedValue && (
        <code className="w-full min-w-0 rounded-md border border-border px-2 py-1 text-left font-mono text-xs leading-relaxed text-foreground-tertiary whitespace-normal [overflow-wrap:anywhere] sm:w-auto sm:max-w-[32rem]">
          {computedValue}
        </code>
      )}
    </div>
  )
}

function TokenGroupView({
  group,
}: {
  group: TokenGroup
}) {
  return (
    <section className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{group.title}</h3>
      <div className="grid gap-3">
        {group.tokens.map((token) => (
          <TokenCard key={token.variable} {...token} />
        ))}
      </div>
    </section>
  )
}

function TokenSection({
  description,
  groups,
  title,
}: TokenSectionProps) {
  useThemeVersion()

  return (
    <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">{title}</h2>
          {description ? <p className="max-w-3xl text-sm text-foreground-secondary">{description}</p> : null}
        </div>
      </div>
      <div className="grid gap-8">
        {groups.map((group) => (
          <TokenGroupView key={group.title} group={group} />
        ))}
      </div>
    </section>
  )
}

export function ColorSystemsPreview() {
  return (
    <div className="plexo-color-system mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Color System</h1>
        <p className="max-w-3xl text-sm text-foreground-secondary">
          Эта docs-страница показывает <code className="text-xs">@theme</code>-токены из
          <code className="text-xs">src/styles/tokens.css</code>. При переключении Light/Dark в
          Storybook карточки и вычисленные значения обновляются вместе с темой.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-foreground-secondary">
          Для консистентности OKLCH в проекте записывается как <code className="text-xs">oklch(L% C H)</code>:
          lightness через проценты, chroma числом, hue числом-углом.
        </p>
      </div>

      <div className="grid gap-8">
        <TokenSection
          description="Utility-токены из `@theme`, которые используют компоненты и Tailwind-классы."
          groups={bridgeGroups}
          title="Tailwind color bridge"
        />
      </div>
    </div>
  )
}
