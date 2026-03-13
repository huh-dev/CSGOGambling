import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/api/logout")
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-medium">Dashboard</h1>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 font-medium">Welcome, {user.name}!</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Steam ID:</span>
                <span className="font-mono">{user.steam_id}</span>
              </div>

              {user.email && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user.email}</span>
                </div>
              )}

              {user.avatar && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Avatar:</span>
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-lg border p-6">
            <h3 className="mb-2 font-medium">Session Info</h3>
            <p className="text-sm text-muted-foreground">
              You are authenticated via Steam. Your session is secured with an
              httpOnly cookie.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
