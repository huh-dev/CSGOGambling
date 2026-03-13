import { redirect } from "next/navigation"
import { getCurrentUser, getInventory } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions"
import { InventoryGrid } from "@/components/InventoryGrid"
import { InventoryResponse } from "@/lib/types/inventory"

async function fetchInventory(refresh = false): Promise<InventoryResponse> {
  try {
    return await getInventory(refresh)
  } catch (error) {
    return {
      items: [],
      total_count: 0,
      error: error instanceof Error ? error.message : "Failed to fetch inventory",
    }
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/api/logout")
  }

  const params = await searchParams
  const refresh = params.refresh === "1"
  const inventory = await fetchInventory(refresh)

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
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
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

            <div className="lg:col-span-2">
              <div className="rounded-lg border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Inventory</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {inventory.total_count} items
                    </span>
                    <a
                      href="/dashboard?refresh=1"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Refresh
                    </a>
                  </div>
                </div>

                {inventory.error ? (
                  <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                    {inventory.error}
                  </div>
                ) : (
                  <InventoryGrid items={inventory.items} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
