<script setup lang="ts">
import type { InventoryItem, InventoryResponse } from '~/composables/useInventory';

const { getInventory, getItemImageUrl } = useInventory();

const items = ref<InventoryItem[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchInventory(refresh = false) {
    loading.value = true;
    error.value = null;

    try {
        const response: InventoryResponse = await getInventory(refresh);

        if (response.error) {
            error.value = response.error;
            items.value = [];
        } else {
            items.value = response.items;
            totalCount.value = response.total_count;
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to load inventory';
        items.value = [];
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchInventory();
});
</script>

<template>
    <div class="w-full">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold">CS2 Inventory</h2>
            <div class="flex items-center gap-2">
                <span v-if="totalCount > 0" class="text-sm text-muted-foreground">
                    {{ totalCount }} items
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="loading"
                    @click="() => fetchInventory(true)"
                >
                    <span v-if="loading">Loading...</span>
                    <span v-else>Refresh</span>
                </Button>
            </div>
        </div>

        <div
            v-if="error"
            class="mb-4 rounded border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
            {{ error }}
        </div>

        <div
            v-if="loading && items.length === 0"
            class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
            <div
                v-for="n in 12"
                :key="n"
                class="aspect-square animate-pulse rounded bg-muted"
            />
        </div>

        <div
            v-else-if="items.length === 0"
            class="rounded border border-dashed p-8 text-center text-muted-foreground"
        >
            <p v-if="error">Unable to load inventory</p>
            <p v-else>No items found in your inventory</p>
        </div>

        <div
            v-else
            class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
            <div
                v-for="item in items"
                :key="item.assetid"
                class="group relative overflow-hidden rounded border bg-card p-2 transition-colors hover:border-primary/50"
                :class="{ 'opacity-60': !item.tradable }"
            >
                <div class="relative aspect-square overflow-hidden rounded bg-muted/50">
                    <img
                        v-if="item.icon_url"
                        :src="getItemImageUrl(item.icon_url) || ''"
                        :alt="item.name"
                        class="h-full w-full object-contain p-1"
                        loading="lazy"
                    />
                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center text-muted-foreground"
                    >
                        <span class="text-xs">No Image</span>
                    </div>

                    <div
                        v-if="item.rarity"
                        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1 pb-1 pt-4"
                    >
                        <span class="text-[10px] font-medium uppercase tracking-wide text-white">
                            {{ item.rarity }}
                        </span>
                    </div>
                </div>

                <div class="mt-2 space-y-0.5">
                    <p class="line-clamp-2 text-xs font-medium leading-tight">
                        {{ item.name }}
                    </p>
                    <p v-if="item.type" class="text-[10px] text-muted-foreground">
                        {{ item.type }}
                    </p>
                </div>

                <div class="mt-1 flex items-center gap-1">
                    <span
                        v-if="!item.tradable"
                        class="rounded bg-destructive/20 px-1 py-0.5 text-[9px] text-destructive"
                    >
                        Not Tradable
                    </span>
                    <span
                        v-else-if="item.marketable"
                        class="rounded bg-primary/20 px-1 py-0.5 text-[9px] text-primary"
                    >
                        Marketable
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
