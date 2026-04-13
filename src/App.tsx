import { Button } from './components/Button'

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
      <h1 className="font-sans text-2xl font-semibold tracking-tight">@remide/ui-kit</h1>
      <p className="max-w-md text-center text-sm opacity-70">
        Vite playground. Develop components in Storybook (
        <code className="rounded-md bg-default px-1.5 py-0.5 font-mono text-sm text-default-foreground">
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
