interface FontFamilyItem {
  name: string
  token: string
  utilityClass: string
}

interface TypeScaleItem {
  className: string
  px: string
  rem: string
  lineHeightRem: string
}

const fontFamilies: FontFamilyItem[] = [
  {
    name: 'Sans',
    token: 'Inter',
    utilityClass: '--font-sans',
  },
  {
    name: 'Mono',
    token: 'IBM Plex Mono',
    utilityClass: '--font-mono',
  },
]

const typeScale: TypeScaleItem[] = [
  { className: 'text-xs', px: '12px', rem: '0.75rem', lineHeightRem: '1rem' },
  { className: 'text-sm', px: '14px', rem: '0.875rem', lineHeightRem: '1.25rem' },
  { className: 'text-base', px: '16px', rem: '1rem', lineHeightRem: '1.5rem' },
  { className: 'text-lg', px: '18px', rem: '1.125rem', lineHeightRem: '1.75rem' },
  { className: 'text-xl', px: '20px', rem: '1.25rem', lineHeightRem: '1.75rem' },
  { className: 'text-2xl', px: '24px', rem: '1.5rem', lineHeightRem: '2rem' },
  { className: 'text-3xl', px: '30px', rem: '1.875rem', lineHeightRem: '2.25rem' },
  { className: 'text-4xl', px: '36px', rem: '2.25rem', lineHeightRem: '2.5rem' },
]

function FontFamilyCard({ name, token, utilityClass }: FontFamilyItem) {
  return (
    <div className="rounded-3xl bg-surface-primary p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <code className="text-xs opacity-70">{utilityClass}</code>
        </div>
        <code className="rounded-md bg-surface-primary px-2 py-1 text-xs text-foreground">
          {token}
        </code>
      </div>
    </div>
  )
}

export function TypographySystemsPreview() {
  return (
    <div className="plexo-typography-system mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Typography System</h1>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Font Families</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {fontFamilies.map((fontFamily) => (
            <FontFamilyCard key={fontFamily.token} {...fontFamily} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Type Scale</h2>
        <div className="overflow-hidden rounded-3xl border border-border bg-surface-primary shadow-sm">
          {typeScale.map((item) => (
            <div key={item.className} className="border-b border-border p-4 last:border-b-0">
              <div className="mb-2 flex flex-wrap items-center gap-1 text-xs">
                <code className="rounded-md bg-surface-secondary px-2 py-1 text-foreground">
                  {item.className}
                </code>
                <span className="rounded-md border border-border px-2 py-1 text-foreground-tertiary">
                  {item.px}
                </span>
                <span className="rounded-md border border-border px-2 py-1 text-foreground-tertiary">
                  {item.rem}
                </span>
                <span className="rounded-md border border-border px-2 py-1 text-foreground-tertiary">
                  lh {item.lineHeightRem}
                </span>
              </div>

              <p
                className="font-sans text-foreground"
                style={{ fontSize: item.rem, lineHeight: item.lineHeightRem }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
