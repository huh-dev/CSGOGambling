export interface InventoryItemDescription {
  type: string
  value: string
}

export interface InventoryItemTag {
  category: string
  internal_name: string
  localized_category_name: string
  localized_tag_name: string
  name?: string
}

export interface InventoryItem {
  assetid: string
  classid: string
  instanceid: string
  name: string
  market_hash_name: string | null
  icon_url: string | null
  icon_url_large: string | null
  tradable: boolean
  marketable: boolean
  rarity: string | null
  type: string | null
  descriptions: InventoryItemDescription[]
  tags: InventoryItemTag[]
}

export interface InventoryResponse {
  items: InventoryItem[]
  total_count: number
  error?: string
}
