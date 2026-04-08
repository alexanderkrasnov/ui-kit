import { Button } from './components/Button'

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-ui-background p-8 text-ui-foreground">
      <h1 className="font-ui-sans text-2xl font-semibold tracking-tight">@remide/ui-kit</h1>
      <p className="max-w-md text-center text-sm text-ui-muted-foreground">
        Vite playground. Develop components in Storybook (
        <code className="rounded-ui-input bg-ui-muted px-1.5 py-0.5 font-ui-mono text-sm text-ui-foreground">
          npm run storybook
        </code>
        ).
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  )
}
