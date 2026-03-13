export { apiClient } from "./client"
export type { ApiError, ApiResponse, PaginatedResponse } from "./types"

export {
  useInventory,
  useInventoryItem,
  useUser,
  useSteamLogin,
  useLogout,
} from "./hooks"

export type {
  AuthUser,
  UseInventoryReturn,
  UseInventoryItemReturn,
  UseUserReturn,
  UseLoginReturn,
  UseLogoutReturn,
} from "./hooks"

import { cookies } from "next/headers"
import { InventoryResponse } from "@/lib/types/inventory"
import { AuthUser } from "./hooks/useAuth"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function serverFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? url : `/${url}`}`

  const headers = new Headers(options.headers)

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>
  }

  return response.text() as unknown as Promise<T>
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await serverFetch<AuthUser>("/api/user")
  } catch {
    return null
  }
}

export async function getInventory(refresh = false): Promise<InventoryResponse> {
  const url = refresh ? "/api/inventory?refresh=1" : "/api/inventory"
  return await serverFetch<InventoryResponse>(url)
}
