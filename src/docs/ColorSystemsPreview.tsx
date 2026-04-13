interface ColorItemProps {
  name: string
  variable: string
  cssVariable?: string
}

function ColorItem({ cssVariable, name, variable }: ColorItemProps) {
  const computedColor =
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(cssVariable || variable).trim()
      : ''

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-background p-4 shadow-sm">
      <div
        className="size-12 shrink-0 rounded-xl border border-border"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <code className="text-xs opacity-70">{variable}</code>
      </div>
      {!!computedColor && (
        <div className="text-right">
          <code className="font-mono text-xs opacity-70">{computedColor}</code>
        </div>
      )}
    </div>
  )
}

interface ColorSectionProps {
  title: string
  colors: ColorItemProps[]
}

function ColorSection({ colors, title }: ColorSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid gap-3">
        {colors.map((color) => (
          <ColorItem key={color.variable} {...color} />
        ))}
      </div>
    </div>
  )
}

export function ColorSystemsPreview() {
  const baseColors: ColorItemProps[] = [
    { name: 'Background', variable: '--color-background' },
    { name: 'Foreground', variable: '--color-foreground' },
  ]

  const backgroundAndSurfaceColors: ColorItemProps[] = [
    { name: 'Default', variable: '--color-default' },
    { name: 'Default Foreground', variable: '--color-default-foreground' },
    { name: 'Border', variable: '--color-border' },
    { name: 'Focus', variable: '--color-focus' },
  ]

  const primaryColors: ColorItemProps[] = [
    { name: 'Accent', variable: '--color-accent' },
    { name: 'Accent Foreground', variable: '--color-accent-foreground' },
  ]

  const statusColors: ColorItemProps[] = [{ name: 'Danger', variable: '--color-danger' }]

  const formFieldColors: ColorItemProps[] = [
    { name: 'Field Background', variable: '--color-field-background' },
    { name: 'Field Foreground', variable: '--color-field-foreground' },
    { name: 'Field Placeholder', variable: '--color-field-placeholder' },
    { name: 'Field Border', variable: '--color-field-border' },
  ]

  const otherColors: ColorItemProps[] = [
    { name: 'Default Hover', variable: '--color-default-hover' },
    { name: 'Accent Hover', variable: '--color-accent-hover' },
  ]

  return (
    <div className="plexo-color-system mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Color System</h1>
        <p className="opacity-70">
          Цветовые токены, которые реально используются текущими{' '}
          <code className="text-xs">Button</code> и <code className="text-xs">Input</code>, разложены
          по hero-ui-подобным секциям.
        </p>
      </div>

      <ColorSection colors={baseColors} title="Base Colors" />
      <ColorSection colors={backgroundAndSurfaceColors} title="Background & Surface" />
      <ColorSection colors={primaryColors} title="Primary Colors" />
      <ColorSection colors={statusColors} title="Status Colors" />
      <ColorSection colors={formFieldColors} title="Form Field Colors" />
      <ColorSection colors={otherColors} title="Other Colors" />
    </div>
  )
}
