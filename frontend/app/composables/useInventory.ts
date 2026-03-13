export interface InventoryItem {
    assetid: string;
    classid: string;
    instanceid: string;
    name: string;
    market_hash_name: string | null;
    icon_url: string | null;
    icon_url_large: string | null;
    tradable: boolean;
    marketable: boolean;
    rarity: string | null;
    type: string | null;
    descriptions: Array<{ type: string; value: string }>;
    tags: Array<{ category: string; localized_tag_name: string }>;
}

export interface InventoryResponse {
    items: InventoryItem[];
    total_count: number;
    error?: string;
}

export const useInventory = () => {
    const sanctumFetch = useSanctumClient();

    async function getInventory(refresh = false): Promise<InventoryResponse> {
        const query = refresh ? '?refresh=1' : '';
        return await sanctumFetch(`/api/inventory${query}`, {
            method: 'GET',
        });
    }

    function getItemImageUrl(iconUrl: string | null, large = false): string | null {
        if (!iconUrl) return null;
        const size = large ? iconUrl : iconUrl;
        return `https://community.cloudflare.steamstatic.com/economy/image/${size}`;
    }

    return {
        getInventory,
        getItemImageUrl,
    };
};
