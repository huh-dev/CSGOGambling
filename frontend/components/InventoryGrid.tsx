"use client"

import Image from "next/image"
import { InventoryItem } from "@/lib/types/inventory"

interface InventoryGridProps {
  items: InventoryItem[]
}

const RARITY_COLORS: Record<string, string> = {
  "Consumer Grade": "#b0c3d9",
  "Industrial Grade": "#5e98d9",
  "Mil-Spec Grade": "#4b69ff",
  "Restricted": "#8847ff",
  "Classified": "#d32ce6",
  "Covert": "#eb4b4b",
  "Contraband": "#e4ae39",
  "Rare": "#e4ae39",
}

function getRarityColor(rarity: string | null): string {
  if (!rarity) return "#b0c3d9"
  return RARITY_COLORS[rarity] || "#b0c3d9"
}

function getItemImageUrl(item: InventoryItem): string {
  const iconUrl = item.icon_url_large || item.icon_url
  if (!iconUrl) {
    return "/placeholder-item.png"
  }
  return `https://steamcommunity-a.akamaihd.net/economy/image/${iconUrl}`
}

export function InventoryGrid({ items }: InventoryGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Your inventory is empty.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.assetid}
          className="group relative overflow-hidden rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={getItemImageUrl(item)}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-contain p-2"
            />
          </div>

          <div className="mt-2 space-y-1">
            <p
              className="truncate text-xs font-medium leading-tight"
              style={{ color: getRarityColor(item.rarity) }}
              title={item.name}
            >
              {item.name}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {item.tradable ? (
                <span className="text-green-500">Tradable</span>
              ) : (
                <span className="text-amber-500">Not Tradable</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
