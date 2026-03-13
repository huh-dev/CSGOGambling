"use client"

import { useState, useCallback } from "react"
import { apiClient } from "../client"
import { InventoryResponse } from "@/lib/types/inventory"

export interface UseInventoryReturn {
  inventory: InventoryResponse | null
  isLoading: boolean
  error: string | null
  fetchInventory: (refresh?: boolean) => Promise<void>
  refreshInventory: () => Promise<void>
}

const INVENTORY_URL = "/api/inventory"

export function useInventory(): UseInventoryReturn {
  const [inventory, setInventory] = useState<InventoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = useCallback(async (refresh = false): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const url = refresh ? `${INVENTORY_URL}?refresh=1` : INVENTORY_URL
      const data = await apiClient.get<InventoryResponse>(url)
      setInventory(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch inventory"
      setError(message)
      setInventory({
        items: [],
        total_count: 0,
        error: message,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshInventory = useCallback(async (): Promise<void> => {
    return fetchInventory(true)
  }, [fetchInventory])

  return {
    inventory,
    isLoading,
    error,
    fetchInventory,
    refreshInventory,
  }
}

export interface UseInventoryItemReturn {
  item: InventoryResponse["items"][number] | null
  isLoading: boolean
  error: string | null
  fetchItem: (assetId: string) => Promise<void>
}

export function useInventoryItem(): UseInventoryItemReturn {
  const [item, setItem] = useState<InventoryResponse["items"][number] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItem = useCallback(async (assetId: string): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await apiClient.get<InventoryResponse>(INVENTORY_URL)
      const foundItem = data.items.find((i) => i.assetid === assetId)
      if (foundItem) {
        setItem(foundItem)
      } else {
        setError("Item not found")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch item"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    item,
    isLoading,
    error,
    fetchItem,
  }
}
