<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{
    private const STEAMAPIS_BASE_URL = 'https://api.steamapis.com/steam/inventory';
    private const CS2_APP_ID = '730';
    private const CS2_CONTEXT_ID = '2';
    private const CACHE_TTL = 300;

    public function getInventory(Request $request): JsonResponse
    {
        $user = $request->user();

        if (empty($user->steam_id)) {
            return response()->json([
                'error' => 'User has no Steam ID associated',
            ], 400);
        }

        $steamId = $user->steam_id;
        $cacheKey = "inventory:{$steamId}";

        $skipCache = $request->boolean('refresh');

        if (!$skipCache) {
            $cached = Cache::get($cacheKey);
            if ($cached) {
                return response()->json($cached);
            }
        } else {
            Cache::forget($cacheKey);
        }

        $apiKey = config('services.steamapis.key');

        if (empty($apiKey)) {
            return response()->json([
                'error' => 'SteamApis configuration missing',
            ], 500);
        }

        $url = sprintf(
            '%s/%s/%s/%s',
            self::STEAMAPIS_BASE_URL,
            $steamId,
            self::CS2_APP_ID,
            self::CS2_CONTEXT_ID
        );


        try {
            $response = Http::get($url, [
                'api_key' => $apiKey,
            ]);

            if ($response->status() === 403) {
                return response()->json([
                    'error' => 'Steam inventory is private',
                    'items' => [],
                    'total_count' => 0,
                ], 403);
            }

            if ($response->status() === 429) {
                return response()->json([
                    'error' => 'Rate limit exceeded. Please try again later.',
                ], 429);
            }

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Failed to fetch inventory from Steam',
                ], 502);
            }


            $data = $response->json();

            Log::info('Steam inventory total assets: ' . count($data['assets'] ?? []));
            Log::info('Steam inventory total descriptions: ' . count($data['descriptions'] ?? []));

            $items = $this->formatInventoryItems($data);

            Log::info('Formatted items count: ' . count($items));

            $result = [
                'items' => $items,
                'total_count' => count($items),
            ];

            Cache::put($cacheKey, $result, self::CACHE_TTL);

            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch inventory',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function formatInventoryItems(array $data): array
    {
        if (empty($data['assets']) || empty($data['descriptions'])) {
            return [];
        }

        $descriptions = [];
        foreach ($data['descriptions'] as $desc) {
            $key = $desc['classid'] . '_' . ($desc['instanceid'] ?? '0');
            $descriptions[$key] = $desc;
        }

        $items = [];
        foreach ($data['assets'] as $asset) {
            $key = $asset['classid'] . '_' . ($asset['instanceid'] ?? '0');
            $description = $descriptions[$key] ?? null;

            if (!$description) {
                continue;
            }

            $rarity = $this->extractRarity($description);

            $items[] = [
                'assetid' => $asset['assetid'],
                'classid' => $asset['classid'],
                'instanceid' => $asset['instanceid'] ?? '0',
                'name' => $description['name'] ?? 'Unknown Item',
                'market_hash_name' => $description['market_hash_name'] ?? null,
                'icon_url' => $description['icon_url'] ?? null,
                'icon_url_large' => $description['icon_url_large'] ?? null,
                'tradable' => ($description['tradable'] ?? 0) === 1,
                'marketable' => ($description['marketable'] ?? 0) === 1,
                'rarity' => $rarity,
                'type' => $description['type'] ?? null,
                'descriptions' => $description['descriptions'] ?? [],
                'tags' => $description['tags'] ?? [],
            ];
        }

        return $items;
    }

    private function extractRarity(array $description): ?string
    {
        if (empty($description['tags'])) {
            return null;
        }

        foreach ($description['tags'] as $tag) {
            if (isset($tag['category']) && $tag['category'] === 'Rarity') {
                return $tag['localized_tag_name'] ?? $tag['name'] ?? null;
            }
        }

        return null;
    }
}
