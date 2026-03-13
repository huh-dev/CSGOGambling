"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setError("No token provided")
      setTimeout(() => {
        router.push("/?error=auth_failed")
      }, 2000)
      return
    }

    const storeToken = async () => {
      try {
        const response = await fetch("/api/set-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          throw new Error("Failed to store token")
        }

        const data = await response.json()

        if (data.success) {
          router.push("/dashboard")
        } else {
          throw new Error(data.error || "Failed to store token")
        }
      } catch (err) {
        setError("Authentication failed")
        setTimeout(() => {
          router.push("/?error=auth_failed")
        }, 2000)
      }
    }

    storeToken()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-destructive">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
