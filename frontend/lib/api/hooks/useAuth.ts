"use client"

import { useState, useCallback } from "react"
import { apiClient } from "../client"

export interface AuthUser {
  id: number
  name: string
  email: string | null
  steam_id: string
  avatar: string | null
}

export interface UseUserReturn {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  fetchUser: () => Promise<void>
  clearUser: () => void
}

const USER_URL = "/api/user"

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await apiClient.get<AuthUser>(USER_URL)
      setUser(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch user"
      setError(message)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearUser = useCallback((): void => {
    setUser(null)
    setError(null)
  }, [])

  return {
    user,
    isLoading,
    error,
    fetchUser,
    clearUser,
  }
}

export interface UseLoginReturn {
  isLoading: boolean
  error: string | null
  loginWithSteam: () => void
}

export function useSteamLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithSteam = useCallback((): void => {
    setIsLoading(true)
    setError(null)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    window.location.href = `${apiUrl}/api/auth/steam`
  }, [])

  return {
    isLoading,
    error,
    loginWithSteam,
  }
}

export interface UseLogoutReturn {
  isLoading: boolean
  error: string | null
  logout: () => Promise<void>
}

export function useLogout(): UseLogoutReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      await apiClient.post("/api/logout")
      window.location.href = "/"
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to logout"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    logout,
  }
}
