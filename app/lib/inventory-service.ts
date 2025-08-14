/**
 * Inventory Service
 * High-level service for inventory operations using NATS and protobuf
 */

import { natsClient } from './nats-client';
import { ProtobufUtils } from './protobuf-utils';

// Inventory data structures
export interface InventoryInfo {
  sku: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  inStock: boolean;
  locationCount: number;
}

export type InventoryMap = Map<string, InventoryInfo>;

interface CachedInventory {
  data: InventoryMap;
  timestamp: number;
}

// Protobuf message interfaces for inventory
export interface InventoryGetAllLocationsBySkuRequest {
  skus: string[];
}

export interface InventoryGetAllLocationsBySkuResponse {
  skuSummaries: SkuInventorySummary[];
  notFoundSkus: string[];
  status: {
    code: number;
    message: string;
  };
}

export interface SkuInventorySummary {
  sku: string;
  totalInventory: InventoryAggregation;
  locationDetails: InventoryLocationDetail[];
}

export interface InventoryAggregation {
  totalQuantity: number;
  totalReservedQuantity: number;
  totalAvailableQuantity: number;
  minStockLevelAcrossLocations: number;
  locationCount: number;
}

export interface InventoryLocationDetail {
  location: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minStockLevel: number;
  lastUpdated: string;
  createdAt: string;
}

export class InventoryService {
  private static instance: InventoryService | null = null;
  private cache: Map<string, CachedInventory> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_TIMEOUT = 5000; // 5 seconds

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): InventoryService {
    if (!this.instance) {
      this.instance = new InventoryService();
    }
    return this.instance;
  }

  /**
   * Get inventory for multiple SKUs in one batch request
   */
  async getInventoryBySKUs(skus: string[]): Promise<InventoryMap> {
    if (!skus || skus.length === 0) {
      return new Map();
    }

    // Create cache key from sorted SKUs to enable cache hits for different orders
    const cacheKey = [...skus].sort().join(',');
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      console.log(`Returning cached inventory for ${skus.length} SKUs`);
      return cached.data;
    }

    try {
      console.log(`Fetching inventory for ${skus.length} SKUs:`, skus);
      
      // Create request
      const request: InventoryGetAllLocationsBySkuRequest = {
        skus
      };

      // Encode request
      const requestBuffer = await ProtobufUtils.encodeInventoryGetAllLocationsBySkuRequest(request);

      // Send NATS request
      const subject = process.env.NATS_SUBJECT_INVENTORY_GET_ALL_LOCATIONS || 'inventory.get_all_locations_by_sku';
      const responseBuffer = await natsClient.request(subject, requestBuffer, this.REQUEST_TIMEOUT);

      // Decode response
      const response = await ProtobufUtils.decodeInventoryGetAllLocationsBySkuResponse(responseBuffer) as InventoryGetAllLocationsBySkuResponse;

      // Check response status
      if (response.status?.code !== 0) {
        console.warn(`Inventory service error: ${response.status?.message || 'Unknown error'}`);
        return this.getFallbackInventory(skus);
      }

      // Transform response to frontend format
      const inventoryMap = this.transformInventoryResponse(response);

      // Cache the result
      this.cache.set(cacheKey, {
        data: inventoryMap,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched inventory for ${inventoryMap.size} SKUs`);
      return inventoryMap;

    } catch (error) {
      console.error(`Failed to fetch inventory for SKUs:`, skus, error);
      
      // Return cached data if available, even if expired
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.warn(`Returning expired cached inventory data for ${skus.length} SKUs`);
        return cached.data;
      }
      
      // Fallback: assume all SKUs are in stock
      return this.getFallbackInventory(skus);
    }
  }

  /**
   * Transform protobuf response to frontend inventory format
   */
  private transformInventoryResponse(response: InventoryGetAllLocationsBySkuResponse): InventoryMap {
    const inventoryMap = new Map<string, InventoryInfo>();

    // Process successful SKU summaries
    response.skuSummaries.forEach(summary => {
      const inventory: InventoryInfo = {
        sku: summary.sku,
        totalQuantity: summary.totalInventory.totalQuantity,
        availableQuantity: summary.totalInventory.totalAvailableQuantity,
        reservedQuantity: summary.totalInventory.totalReservedQuantity,
        inStock: summary.totalInventory.totalAvailableQuantity > 0,
        locationCount: summary.totalInventory.locationCount
      };
      
      inventoryMap.set(summary.sku, inventory);
    });

    // Mark not found SKUs as out of stock
    response.notFoundSkus.forEach(sku => {
      const inventory: InventoryInfo = {
        sku,
        totalQuantity: 0,
        availableQuantity: 0,
        reservedQuantity: 0,
        inStock: false,
        locationCount: 0
      };
      
      inventoryMap.set(sku, inventory);
    });

    return inventoryMap;
  }

  /**
   * Get fallback inventory data (assume all SKUs are in stock)
   * This is used when the inventory service is unavailable
   */
  private getFallbackInventory(skus: string[]): InventoryMap {
    console.log(`Using fallback inventory data for ${skus.length} SKUs`);
    const inventoryMap = new Map<string, InventoryInfo>();

    skus.forEach(sku => {
      // Fallback: assume in stock with generic quantity
      const inventory: InventoryInfo = {
        sku,
        totalQuantity: 100, // Generic fallback quantity
        availableQuantity: 100,
        reservedQuantity: 0,
        inStock: true,
        locationCount: 1
      };
      
      inventoryMap.set(sku, inventory);
    });

    return inventoryMap;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Inventory cache cleared');
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const inventoryService = InventoryService.getInstance();
