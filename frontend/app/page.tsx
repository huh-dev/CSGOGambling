import LoginButton from "@/components/LoginButton"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium">Welcome</h1>
          <p className="text-muted-foreground">
            Sign in with your Steam account to continue
          </p>
        </div>

        <LoginButton />

        <p className="text-xs text-muted-foreground">
          Press <kbd className="rounded bg-muted px-1 py-0.5">d</kbd> to toggle
          dark mode
        </p>
      </div>
    </div>
  )
}
