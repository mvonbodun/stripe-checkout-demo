/**
 * Pricing Service
 * High-level service for pricing operations using NATS and protobuf
 */

import { natsClient } from './nats-client';
import { 
  ProtobufUtils, 
  GetBestOfferPricesRequest,
  GetBestOfferPricesResponse,
  SkuOfferResult,
  Offer
} from './protobuf-utils';

export interface PricingInfo {
  sku: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  offer?: Offer;
  found: boolean;
}

export class PricingService {
  private static instance: PricingService | null = null;
  private cache: Map<string, { data: Map<string, PricingInfo>; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): PricingService {
    if (!this.instance) {
      this.instance = new PricingService();
    }
    return this.instance;
  }

  /**
   * Get pricing information for multiple SKUs
   */
  async getPricingBySKUs(
    skus: string[], 
    quantity: number = 1, 
    currency: string = 'USD',
    date?: string
  ): Promise<Map<string, PricingInfo>> {
    if (skus.length === 0) {
      return new Map();
    }

    const cacheKey = `${skus.sort().join(',')}_${quantity}_${currency}_${date || 'current'}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      console.log(`Returning cached pricing for ${skus.length} SKUs`);
      return cached.data;
    }

    try {
      console.log(`Fetching pricing for ${skus.length} SKUs: [${skus.slice(0, 5).join(', ')}${skus.length > 5 ? '...' : ''}]`);
      
      // Create request
      const request: GetBestOfferPricesRequest = {
        skus,
        quantity,
        currency,
        date
      };

      // Encode request
      const requestBuffer = await ProtobufUtils.encodeGetBestOfferPricesRequest(request);

      // Send NATS request
      const subject = process.env.NATS_SUBJECT_OFFERS_GET_BEST_OFFER_PRICES || 'offers.get_best_offer_prices';
      const responseBuffer = await natsClient.request(subject, requestBuffer, 10000);

      // Decode response
      const response: GetBestOfferPricesResponse = await ProtobufUtils.decodeGetBestOfferPricesResponse(responseBuffer);

      // Check response status
      if (response.status.code !== 0) {
        console.warn(`Pricing service error: ${response.status.message}`);
        return this.createDefaultPricingMap(skus, currency);
      }

      // Transform response to PricingInfo map
      const pricingMap = this.transformToPricingMap(response.skuResults, currency);

      // Cache the result
      this.cache.set(cacheKey, {
        data: pricingMap,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched pricing for ${pricingMap.size} SKUs`);
      return pricingMap;

    } catch (error) {
      console.error('Failed to fetch pricing from backend:', error);
      
      // Return cached data if available, even if expired
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.warn(`Returning expired cached pricing data for ${skus.length} SKUs`);
        return cached.data;
      }
      
      // Return default pricing as fallback
      return this.createDefaultPricingMap(skus, currency);
    }
  }

  /**
   * Get pricing for a single SKU
   */
  async getPricingBySKU(
    sku: string, 
    quantity: number = 1, 
    currency: string = 'USD',
    date?: string
  ): Promise<PricingInfo | null> {
    const pricingMap = await this.getPricingBySKUs([sku], quantity, currency, date);
    return pricingMap.get(sku) || null;
  }

  /**
   * Transform backend response to PricingInfo map
   */
  private transformToPricingMap(skuResults: SkuOfferResult[], currency: string): Map<string, PricingInfo> {
    const pricingMap = new Map<string, PricingInfo>();

    console.log(`💰 PRICING SERVICE RESPONSE: ${skuResults.length} SKU results`);

    for (const result of skuResults) {
      const pricingInfo: PricingInfo = {
        sku: result.sku,
        price: this.extractPrice(result.offer),
        compareAtPrice: this.extractCompareAtPrice(result.offer),
        currency,
        offer: result.offer,
        found: result.found
      };

      if (result.found) {
        console.log(`💰 SKU ${result.sku} → PRICING: $${pricingInfo.price.toFixed(2)} ${currency} (found: ${result.found})`);
      } else {
        console.warn(`❌ SKU ${result.sku} → PRICING: NOT FOUND in service`);
      }

      pricingMap.set(result.sku, pricingInfo);
    }

    return pricingMap;
  }

  /**
   * Extract the best price from an offer
   */
  private extractPrice(offer?: Offer): number {
    if (!offer || !offer.offerPrices || offer.offerPrices.length === 0) {
      return 0;
    }

    // Get the first price (assuming it's the best offer)
    const priceString = offer.offerPrices[0].price;
    return this.parsePrice(priceString);
  }

  /**
   * Extract compare-at price (if available)
   */
  private extractCompareAtPrice(offer?: Offer): number | undefined {
    if (!offer || !offer.offerPrices || offer.offerPrices.length <= 1) {
      return undefined;
    }

    // If multiple prices exist, use the highest as compare-at price
    const prices = offer.offerPrices.map(p => this.parsePrice(p.price));
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    
    return maxPrice > minPrice ? maxPrice : undefined;
  }

  /**
   * Parse price string to number (dollars)
   */
  private parsePrice(priceString: string): number {
    try {
      // Handle different price formats
      if (priceString.includes('.')) {
        // Decimal format like "19.99" - return as-is
        return parseFloat(priceString);
      } else {
        // If it's a whole number, check if it's likely in cents or dollars
        const intValue = parseInt(priceString, 10);
        
        // If the value is very large (> 1000), assume it's in cents and convert to dollars
        if (intValue > 1000) {
          return intValue / 100;
        } else {
          // Otherwise assume it's already in dollars
          return intValue;
        }
      }
    } catch (error) {
      console.warn(`Failed to parse price: ${priceString}`, error);
      return 0;
    }
  }

  /**
   * Create default pricing map for fallback scenarios
   */
  private createDefaultPricingMap(skus: string[], currency: string): Map<string, PricingInfo> {
    const pricingMap = new Map<string, PricingInfo>();

    for (const sku of skus) {
      pricingMap.set(sku, {
        sku,
        price: 0, // Default price
        currency,
        found: false
      });
    }

    return pricingMap;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Pricing cache cleared');
  }
}

// Export singleton instance
export const pricingService = PricingService.getInstance();
