import { cookies } from "next/headers"
import { InventoryResponse } from "./types/inventory"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface AuthUser {
  id: number
  name: string
  email: string | null
  steam_id: string
  avatar: string | null
}

interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean
}

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options

  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? url : `/${url}`}`
  const headers = new Headers(fetchOptions.headers)

  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  if (!skipAuth) {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(fullUrl, {
    ...fetchOptions,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    )
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>
  }

  return response.text() as unknown as Promise<T>
}
export async function getCurrentUser() {
  try {
    return await apiFetch<AuthUser>("/api/user")
  } catch {
    return null
  }
}

export async function getInventory(): Promise<InventoryResponse> {
  const response = await apiFetch<InventoryResponse>("/api/inventory")
  console.log(response)
  return response
}
