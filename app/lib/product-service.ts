/**
 * Product Service
 * High-level service for product operations using NATS and protobuf
 */

import { natsClient } from './nats-client';
import { 
  ProtobufUtils, 
  ProductGetBySlugRequest, 
  GetProductSlugsRequest,
  // ProductGetBySlugResponse,
  Product as ProtoProduct,
  ProductVariant as ProtoProductVariant
} from './protobuf-utils';
import { Product, ProductVariant, ProductWithVariants } from '../models/product';
import { Status } from '../models/common';
import { getProductBySlug as getHardcodedProduct } from '../models/product';
import { InventoryService } from './inventory-service';
import { PricingService } from './pricing-service';

export class ProductService {
  private static instance: ProductService | null = null;
  private cache: Map<string, { data: Product; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ProductService {
    if (!this.instance) {
      this.instance = new ProductService();
    }
    return this.instance;
  }

  /**
   * Get product by slug from backend service
   */
  async getProductBySlug(
    slug: string, 
    includeVariants: boolean = false, 
    includeInventory: boolean = false, 
    includePricing: boolean = false,
    bustCache: boolean = false
  ): Promise<Product | null> {
    console.log(`Fetching product by slug from backend service: ${slug}`);
    
    const cacheKey = `${slug}_${includeVariants}_${includeInventory}_${includePricing}`;
    
    // Check cache first (unless cache busting is requested)
    if (!bustCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
        console.log(`Returning cached product for slug: ${slug}`);
        return cached.data;
      }
    } else {
      console.log(`Cache busting requested for slug: ${slug}`);
    }

    try {
      console.log(`Fetching product by slug from backend service: ${slug}`);
      
      // Create request
      const request: ProductGetBySlugRequest = {
        slug
      };

      // Encode request
      const requestBuffer = await ProtobufUtils.encodeProductGetBySlugRequest(request);

            // Send NATS request
      const subject = process.env.NATS_SUBJECT_CATALOG_GET_PRODUCT_BY_SLUG || 'catalog.get_product_by_slug';
      const responseBuffer = await natsClient.request(subject, requestBuffer, 8000); // Reduced from 10000

      // Decode response
      const response = await ProtobufUtils.decodeProductGetBySlugResponse(responseBuffer);

      // Check response status
      if (response.status.code !== 0) {
        console.warn(`Backend service error for slug ${slug}: ${response.status.message}`);
        return this.getFallbackProduct(slug);
      }

      if (!response.product) {
        console.warn(`No product found for slug: ${slug}`);
        return null;
      }

      // Transform to frontend Product format
      let product = this.transformToProduct(response.product, includeVariants);

      console.log(`🛍️ PRODUCT ${slug} → LOADED: "${product.name}" with ${(product as ProductWithVariants).variants?.length || 0} variants`);

      // Log all SKUs for this product
      const productWithVariants = product as Product & { variants?: ProductVariant[] };
      if (productWithVariants.variants && Array.isArray(productWithVariants.variants)) {
        console.log(`🛍️ PRODUCT ${slug} → SKUs: [${productWithVariants.variants.map(v => v.sku).join(', ')}]`);
      }

      // Integrate inventory and pricing data sequentially for better reliability
      if (includeInventory && product) {
        console.log(`🔄 PRODUCT ${slug} → FETCHING INVENTORY for ${productWithVariants.variants?.length || 0} variants`);
        const startTime = Date.now();
        
        try {
          product = await this.integrateInventoryData(product);
          const duration = Date.now() - startTime;
          console.log(`✅ PRODUCT ${slug} → INVENTORY INTEGRATION completed in ${duration}ms`);
        } catch (error) {
          console.warn('Inventory integration failed, continuing without inventory data:', error);
        }
      }
      
      if (includePricing && product) {
        console.log(`� PRODUCT ${slug} → FETCHING PRICING for ${productWithVariants.variants?.length || 0} variants`);
        const startTime = Date.now();
        
        try {
          product = await this.integratePricingData(product);
          const duration = Date.now() - startTime;
          console.log(`✅ PRODUCT ${slug} → PRICING INTEGRATION completed in ${duration}ms`);
        } catch (error) {
          console.warn('Pricing integration failed, continuing without pricing data:', error);
        }
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: product,
        timestamp: Date.now()
      });

      // Final summary log
      const finalProductWithVariants = product as Product & { variants?: ProductVariant[] };
      if (finalProductWithVariants.variants) {
        const variantsWithInventory = finalProductWithVariants.variants.filter(v => (v.inventoryQuantity || 0) > 0);
        const variantsWithPricing = finalProductWithVariants.variants.filter(v => (v.price || 0) > 0);
        console.log(`🎯 PRODUCT ${slug} → FINAL: ${finalProductWithVariants.variants.length} variants, ${variantsWithInventory.length} with inventory, ${variantsWithPricing.length} with pricing, hasReliableInventoryData: ${(product as Product & { hasReliableInventoryData?: boolean }).hasReliableInventoryData}`);
      }

      console.log(`Successfully fetched product: ${product.name}`);
      return product;

    } catch (error) {
      console.error(`Failed to fetch product by slug from backend: ${slug}`, error);
      
      // Return cached data if available, even if expired
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.warn(`Returning expired cached data for slug: ${slug}`);
        return cached.data;
      }
      
      // Fallback to hardcoded data
      return this.getFallbackProduct(slug);
    }
  }

  /**
   * Get all product slugs for static generation
   * Uses cursor-based pagination to retrieve all slugs from backend
   */
  async getAllProductSlugs(): Promise<string[]> {
    try {
      console.log('Fetching all product slugs for static generation...');
      
      const allSlugs: string[] = [];
      let cursor: string | undefined = undefined;
      let hasMore = true;
      const batchSize = 100; // Default batch size
      
      while (hasMore) {
        const request: GetProductSlugsRequest = {
          batchSize,
          cursor,
          includeInactive: false // Only get active products for static generation
        };

        // Encode request
        const requestBuffer = await ProtobufUtils.encodeGetProductSlugsRequest(request);

        // Send NATS request
        const subject = process.env.NATS_SUBJECT_CATALOG_GET_PRODUCT_SLUGS || 'catalog.get_product_slugs';
        const responseBuffer = await natsClient.request(subject, requestBuffer, 3000); // Reduced timeout

        // Decode response
        const response = await ProtobufUtils.decodeGetProductSlugsResponse(responseBuffer);

        // Check response status
        if (response.status.code !== 0) {
          console.warn(`Backend service error getting product slugs: ${response.status.message}`);
          break;
        }

        // Add slugs to our collection
        allSlugs.push(...response.slugs);
        
        // Update pagination variables
        hasMore = response.hasMore;
        cursor = response.nextCursor;
        
        console.log(`Fetched ${response.slugs.length} slugs, total so far: ${allSlugs.length}, hasMore: ${hasMore}`);
      }
      
      console.log(`Successfully fetched ${allSlugs.length} product slugs from backend`);
      return allSlugs;
      
    } catch (error) {
      console.error('Failed to fetch product slugs from backend:', error);
      
      // Fallback to hardcoded data only in case of complete failure
      console.warn('Falling back to hardcoded product slugs due to backend error');
      return this.getFallbackProductSlugs();
    }
  }

  /**
   * Get fallback product slugs from hardcoded data
   */
  private getFallbackProductSlugs(): string[] {
    try {
      // Import the mockProducts here to avoid circular dependencies
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { mockProducts } = require('../models/product');
      return mockProducts.map((product: { slug: string }) => product.slug);
    } catch (error) {
      console.error('Failed to get fallback product slugs:', error);
      return [];
    }
  }

  /**
   * Get fallback product from hardcoded data
   */
  private getFallbackProduct(slug: string): Product | null {
    try {
      console.log(`Using fallback hardcoded data for slug: ${slug}`);
      const product = getHardcodedProduct(slug);
      return product || null;
    } catch (error) {
      console.error(`Failed to get fallback product for slug: ${slug}`, error);
      return null;
    }
  }

  /**
   * Transform protobuf Product to frontend Product format
   */
  private transformToProduct(protoProduct: ProtoProduct, includeVariants: boolean): Product {
    // Transform variants if requested
    const variants: ProductVariant[] = includeVariants && protoProduct.variants 
      ? protoProduct.variants.map(variant => this.transformVariant(variant))
      : [];

    // Calculate price range from variants
    const prices = variants.length > 0 
      ? variants.map(v => v.price || 0).filter(p => p > 0)
      : [];
    
    const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : undefined;

    return {
      id: protoProduct.id || protoProduct.productRef,
      name: protoProduct.name,
      slug: protoProduct.slug || '',
      description: protoProduct.longDescription || '',
      shortDescription: protoProduct.longDescription?.substring(0, 200) || '',
      categoryId: protoProduct.listCategories?.[0] || '',
      categoryIds: protoProduct.listCategories || [],
      brand: protoProduct.brand || '',
      status: protoProduct.displayOnSite ? Status.ACTIVE : Status.INACTIVE,
      
      // Media - use variant images or placeholder
      images: this.extractProductImages(protoProduct),
      videos: [],
      documents: [],
      
      // Content
      features: this.extractFeatures(protoProduct),
      productLevelSpecifications: this.extractSpecifications(protoProduct),
      itemDefiningSpecifications: this.extractDefiningSpecifications(protoProduct),
      
      // Pricing
      basePrice: minPrice || 0,
      compareAtPrice: undefined,
      priceRange: minPrice && maxPrice ? { min: minPrice, max: maxPrice } : undefined,
      taxCode: protoProduct.taxCode || 'txcd_00000000',
      
      // Computed fields
      variantCount: protoProduct.variants?.length || 0,
      minPrice,
      maxPrice,
      inStock: variants.some(v => (v.inventoryQuantity || 0) > 0),
      totalInventory: variants.reduce((sum, v) => sum + (v.inventoryQuantity || 0), 0),
      
      // SEO
      seoTitle: protoProduct.seoTitle || protoProduct.name,
      seoDescription: protoProduct.seoDescription || protoProduct.longDescription?.substring(0, 160) || '',
      seoKeywords: protoProduct.seoKeywords ? protoProduct.seoKeywords.split(',').map(k => k.trim()) : [],
      
      // Metadata
      createdAt: protoProduct.createdAt ? new Date(protoProduct.createdAt) : new Date(),
      updatedAt: protoProduct.updatedAt ? new Date(protoProduct.updatedAt) : new Date(),
      
      // Add variants if requested
      ...(includeVariants && { variants })
    } as Product;
  }

  /**
   * Transform protobuf ProductVariant to frontend ProductVariant
   */
  private transformVariant(protoVariant: ProtoProductVariant): ProductVariant {
    return {
      id: protoVariant.sku,
      productId: '', // Will be set by parent
      sku: protoVariant.sku,
      name: this.generateVariantName(protoVariant),
      
      // Pricing - default for now, should come from separate pricing service
      price: 0,
      compareAtPrice: undefined,
      
      // Inventory - default for now, should come from inventory service
      inventoryQuantity: 0,
      inventoryTracking: true,
      
      // Convert defining attributes to options
      options: Object.entries(protoVariant.definingAttributes || {}).map(([name, value]) => ({
        name,
        value: value as string
      })),
      
      // Media - convert imageUrls to MediaItem format
      images: protoVariant.imageUrls?.map((url: string, index: number) => ({
        id: `${protoVariant.sku}_${index}`,
        url,
        altText: `${protoVariant.sku} image ${index + 1}`,
        order: index,
        type: 'image' as const
      })) || [],
      
      // Physical attributes
      weight: protoVariant.weight ? {
        value: protoVariant.weight,
        unit: (protoVariant.weightUnit || 'oz') as 'lb' | 'kg' | 'g' | 'oz'
      } : undefined,
      
      dimensions: (protoVariant.height || protoVariant.width || protoVariant.length) ? {
        height: protoVariant.height || 0,
        width: protoVariant.width || 0,
        length: protoVariant.length || 0,
        unit: 'in'
      } : undefined,
      
      // Other fields
      barcode: undefined,
      status: Status.ACTIVE,
      position: 0
    };
  }

  /**
   * Generate variant name from defining attributes
   */
  private generateVariantName(protoVariant: ProtoProductVariant): string {
    const attributes = protoVariant.definingAttributes || {};
    const parts: string[] = [];
    
    if (attributes.color) parts.push(attributes.color);
    if (attributes.size) parts.push(attributes.size);
    
    return parts.length > 0 ? parts.join(' / ') : protoVariant.sku;
  }

  /**
   * Extract product images from variants or use placeholder
   */
  private extractProductImages(protoProduct: ProtoProduct) {
    // Get first variant's first image as product image
    const firstVariant = protoProduct.variants?.[0];
    const firstImage = firstVariant?.imageUrls?.[0];
    
    if (firstImage) {
      return [{
        id: `${protoProduct.productRef}_main`,
        url: firstImage,
        altText: protoProduct.name,
        order: 0,
        type: 'image' as const
      }];
    }
    
    // Fallback to placeholder
    return [{
      id: `${protoProduct.productRef}_placeholder`,
      url: `https://placehold.co/600x600/e5e7eb/6b7280?text=${encodeURIComponent(protoProduct.name)}`,
      altText: protoProduct.name,
      order: 0,
      type: 'image' as const
    }];
  }

  /**
   * Extract features from descriptive attributes
   */
  private extractFeatures(protoProduct: ProtoProduct): string[] {
    const attributes = protoProduct.descriptiveAttributes || {};
    const features: string[] = [];
    
    // Convert some descriptive attributes to features
    for (const [key, value] of Object.entries(attributes)) {
      if (value && typeof value === 'string') {
        features.push(`${key}: ${value}`);
      }
    }
    
    return features;
  }

  /**
   * Extract specifications from descriptive attributes
   */
  private extractSpecifications(protoProduct: ProtoProduct) {
    const attributes = protoProduct.descriptiveAttributes || {};
    
    return Object.entries(attributes).map(([key, value]) => ({
      id: key,
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value || '',
      unit: '',
      category: 'General'
    }));
  }

  /**
   * Extract defining specifications from defining attributes
   */
  private extractDefiningSpecifications(protoProduct: ProtoProduct) {
    const definingAttrs = protoProduct.definingAttributes || {};
    
    return Object.keys(definingAttrs).map(key => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      group: 'Product Options',
      required: true,
      order: 0
    }));
  }

  /**
   * Integrate inventory data into product and variants
   */
  private async integrateInventoryData(product: Product): Promise<Product> {
    try {
      const inventoryService = InventoryService.getInstance();
      
      // Collect all SKUs from the product and its variants
      const skus: string[] = [];
      
      // Check if this product has variants (ProductWithVariants type)
      const productWithVariants = product as Product & { variants?: ProductVariant[] };
      if (productWithVariants.variants && Array.isArray(productWithVariants.variants)) {
        productWithVariants.variants.forEach((variant: ProductVariant) => {
          if (variant.sku) {
            skus.push(variant.sku);
          }
        });
      }

      if (skus.length === 0) {
        console.log(`No SKUs found for product ${product.slug}, skipping inventory integration`);
        return product;
      }

      // Get inventory data for all SKUs
      const inventoryData = await inventoryService.getInventoryBySKUs(skus);

      console.log(`🔧 INVENTORY INTEGRATION: Received inventory map with ${inventoryData.size} entries`);
      console.log(`🔧 INVENTORY MAP KEYS: [${Array.from(inventoryData.keys()).join(', ')}]`);

      // Check if inventory data is reliable
      const isInventoryReliable = inventoryService.isInventoryDataReliable(inventoryData);
      if (!isInventoryReliable) {
        console.warn(`Inventory data for product ${product.slug} is unreliable (fallback data), AttributeSelector should not render`);
      }

      // Update variants with inventory data if variants exist
      if (productWithVariants.variants && Array.isArray(productWithVariants.variants)) {
        console.log(`🔧 INVENTORY INTEGRATION: Processing ${productWithVariants.variants.length} variants for product ${product.slug}`);
        console.log(`🔧 INVENTORY MAP: Has ${inventoryData.size} inventory records`);
        
        let variantsUpdated = 0;
        productWithVariants.variants = productWithVariants.variants.map((variant: ProductVariant) => {
          const inventoryInfo = inventoryData.get(variant.sku);
          console.log(`🔧 VARIANT ${variant.sku}: inventory found = ${!!inventoryInfo}, quantity = ${inventoryInfo?.totalQuantity || 0}`);
          
          if (inventoryInfo) {
            variantsUpdated++;
            return {
              ...variant,
              inventoryQuantity: inventoryInfo.totalQuantity,
              inventoryTracking: inventoryInfo.totalQuantity > 0
            };
          }
          return variant;
        });

        console.log(`🔧 INVENTORY INTEGRATION: Updated ${variantsUpdated} of ${productWithVariants.variants.length} variants`);

        // Calculate product-level inventory aggregates
        const totalInventory = productWithVariants.variants.reduce((sum: number, variant: ProductVariant) => 
          sum + (variant.inventoryQuantity || 0), 0
        );
        
        const inStock = productWithVariants.variants.some((variant: ProductVariant) => 
          (variant.inventoryQuantity || 0) > 0
        );

        console.log(`🔧 INVENTORY TOTALS: totalInventory=${totalInventory}, inStock=${inStock}, isReliable=${isInventoryReliable}`);

        // Update product with calculated inventory data and reliability flag
        return {
          ...product,
          totalInventory,
          inStock,
          hasReliableInventoryData: isInventoryReliable
        };
      }

      return {
        ...product,
        hasReliableInventoryData: isInventoryReliable
      };

    } catch (error) {
      console.error('Failed to integrate inventory data:', error);
      // Return product without inventory data if integration fails
      return product;
    }
  }

  /**
   * Integrate pricing data into product and variants
   */
  private async integratePricingData(product: Product): Promise<Product> {
    try {
      const pricingService = PricingService.getInstance();
      
      // Collect all SKUs from the product and its variants
      const skus: string[] = [];
      
      // Check if this product has variants (ProductWithVariants type)
      const productWithVariants = product as Product & { variants?: ProductVariant[] };
      if (productWithVariants.variants && Array.isArray(productWithVariants.variants)) {
        productWithVariants.variants.forEach((variant: ProductVariant) => {
          if (variant.sku) {
            skus.push(variant.sku);
          }
        });
      }

      if (skus.length === 0) {
        console.log(`No SKUs found for product ${product.slug}, skipping pricing integration`);
        return product;
      }

      // Get pricing data for all SKUs
      const pricingData = await pricingService.getPricingBySKUs(skus, 1, 'USD');

      // Update variants with pricing data if variants exist
      if (productWithVariants.variants && Array.isArray(productWithVariants.variants)) {
        productWithVariants.variants = productWithVariants.variants.map((variant: ProductVariant) => {
          const pricingInfo = pricingData.get(variant.sku);
          if (pricingInfo && pricingInfo.found) {
            return {
              ...variant,
              price: pricingInfo.price,
              compareAtPrice: pricingInfo.compareAtPrice
            };
          }
          return variant;
        });

        // Calculate product-level pricing aggregates
        const validPrices = productWithVariants.variants
          .map((variant: ProductVariant) => variant.price || 0)
          .filter(price => price > 0);
        
        const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : undefined;
        const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : undefined;
        
        // Get pricing for default variant if available
        const defaultVariantSku = this.getDefaultVariantSku(product, productWithVariants.variants);
        const defaultPricing = defaultVariantSku ? pricingData.get(defaultVariantSku) : null;

        // Update product with calculated pricing data
        return {
          ...product,
          basePrice: defaultPricing?.price || minPrice || 0,
          compareAtPrice: defaultPricing?.compareAtPrice,
          minPrice,
          maxPrice,
          priceRange: minPrice && maxPrice && minPrice !== maxPrice ? { min: minPrice, max: maxPrice } : undefined
        };
      }

      return product;

    } catch (error) {
      console.error('Failed to integrate pricing data:', error);
      // Return product without pricing data if integration fails
      return product;
    }
  }

  /**
   * Get the SKU for the default variant
   */
  private getDefaultVariantSku(product: Product, variants: ProductVariant[]): string | null {
    // Try to find default variant from product data
    const protoProduct = product as Product & { defaultVariant?: string };
    if (protoProduct.defaultVariant) {
      return protoProduct.defaultVariant;
    }

    // Fallback to first variant
    return variants.length > 0 ? variants[0].sku : null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Product cache cleared');
  }
}

// Export singleton instance
export const productService = ProductService.getInstance();
