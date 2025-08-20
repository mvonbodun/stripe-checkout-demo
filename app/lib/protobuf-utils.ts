/**
 * Protocol Buffer utilities for catalog service
 * Handles encoding/decoding of protobuf messages for categories and products
 */

import * as protobuf from 'protobufjs';
import path from 'path';

// Load protocol buffer definitions
let catalogRoot: protobuf.Root | null = null;
let inventoryRoot: protobuf.Root | null = null;
let pricingRoot: protobuf.Root | null = null;

async function loadProtoDefinitions(): Promise<protobuf.Root> {
  if (catalogRoot) {
    return catalogRoot;
  }

  try {
    // First try the public directory (for Vercel deployment)
    let protoPath = path.join(process.cwd(), 'public', 'proto', 'catalog', 'catalog.proto');
    
    try {
      catalogRoot = await protobuf.load(protoPath);
      console.log('Successfully loaded catalog proto from public directory');
      return catalogRoot;
    } catch (publicError) {
      console.log('Failed to load from public directory, trying original proto directory...', String(publicError));
      
      // Fallback to original proto directory (for local development)
      protoPath = path.join(process.cwd(), 'proto', 'catalog', 'catalog.proto');
      catalogRoot = await protobuf.load(protoPath);
      console.log('Successfully loaded catalog proto from proto directory');
      return catalogRoot;
    }
  } catch (error) {
    console.error('Failed to load protobuf definitions:', error);
    throw new Error('Unable to load protocol buffer definitions');
  }
}

async function loadInventoryProtoDefinitions(): Promise<protobuf.Root> {
  if (inventoryRoot) {
    return inventoryRoot;
  }

  try {
    // First try the public directory (for Vercel deployment)
    let protoPath = path.join(process.cwd(), 'public', 'proto', 'inventory', 'inventory.proto');
    
    try {
      inventoryRoot = await protobuf.load(protoPath);
      console.log('Successfully loaded inventory proto from public directory');
      return inventoryRoot;
    } catch (publicError) {
      console.log('Failed to load inventory proto from public directory, trying original proto directory...', String(publicError));
      
      // Fallback to original proto directory (for local development)
      protoPath = path.join(process.cwd(), 'proto', 'inventory', 'inventory.proto');
      inventoryRoot = await protobuf.load(protoPath);
      console.log('Successfully loaded inventory proto from proto directory');
      return inventoryRoot;
    }
  } catch (error) {
    console.error('Failed to load inventory protobuf definitions:', error);
    throw new Error('Unable to load inventory protocol buffer definitions');
  }
}

async function loadPricingProtoDefinitions(): Promise<protobuf.Root> {
  if (pricingRoot) {
    return pricingRoot;
  }

  try {
    // First try the public directory (for Vercel deployment)
    let protoPath = path.join(process.cwd(), 'public', 'proto', 'price', 'offer.proto');
    
    try {
      pricingRoot = await protobuf.load(protoPath);
      console.log('Successfully loaded pricing proto from public directory');
      return pricingRoot;
    } catch (publicError) {
      console.log('Failed to load pricing proto from public directory, trying original proto directory...', String(publicError));
      
      // Fallback to original proto directory (for local development)
      protoPath = path.join(process.cwd(), 'proto', 'price', 'offer.proto');
      pricingRoot = await protobuf.load(protoPath);
      console.log('Successfully loaded pricing proto from proto directory');
      return pricingRoot;
    }
  } catch (error) {
    console.error('Failed to load pricing protobuf definitions:', error);
    throw new Error('Unable to load pricing protocol buffer definitions');
  }
}

// TypeScript interfaces matching protobuf messages

// Category interfaces
export interface CategoryTreeRequest {
  maxDepth?: number;
  includeInactive?: boolean;
  rebuildCache?: boolean;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  level: number;
  productCount: number;
  children: CategoryTreeNode[];
  path: string;
}

export interface CategoryTreeResponse {
  tree: CategoryTreeNode[];
  status: Status;
}

// Product interfaces
export interface ProductGetBySlugRequest {
  slug: string;
}

export interface ProductGetBySlugResponse {
  product?: Product;
  status: Status;
}

export interface GetProductSlugsRequest {
  batchSize?: number;
  cursor?: string;
  includeInactive?: boolean;
}

export interface GetProductSlugsResponse {
  slugs: string[];
  nextCursor?: string;
  totalCount: number;
  hasMore: boolean;
  status: Status;
}

// Pricing interfaces
export interface GetBestOfferPricesRequest {
  skus: string[];
  quantity: number;
  date?: string;
  currency: string;
}

export interface OfferPrice {
  price: string;
  currency: string;
}

export interface Offer {
  id?: string;
  sku: string;
  startDate: string;
  endDate: string;
  minQuantity: number;
  maxQuantity?: number;
  offerPrices: OfferPrice[];
}

export interface SkuOfferResult {
  sku: string;
  offer?: Offer;
  found: boolean;
}

export interface GetBestOfferPricesResponse {
  skuResults: SkuOfferResult[];
  status: Status;
}

export interface Product {
  id?: string;
  name: string;
  longDescription?: string;
  brand?: string;
  slug?: string;
  productRef: string;
  productType?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  displayOnSite: boolean;
  taxCode?: string;
  relatedProducts: string[];
  reviews?: Reviews;
  hierarchicalCategories?: HierarchicalCategories;
  listCategories: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
  updatedBy?: string;
  definingAttributes: { [key: string]: string };
  descriptiveAttributes: { [key: string]: string };
  defaultVariant?: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  sku: string;
  definingAttributes: { [key: string]: string };
  abbreviatedColor?: string;
  abbreviatedSize?: string;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  weightUnit?: string;
  packaging?: Packaging;
  imageUrls: string[];
}

export interface Reviews {
  bayesianAvg: number;
  count: number;
  rating: number;
}

export interface HierarchicalCategories {
  lvl0?: string;
  lvl1?: string;
  lvl2?: string;
}

export interface Packaging {
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  weightUnit?: string;
}

// Common interfaces
export interface Status {
  code: number;
  message: string;
  details?: unknown[];
}

// Utility functions for encoding/decoding
export class ProtobufUtils {
  private static root: protobuf.Root | null = null;

  private static async getRoot(): Promise<protobuf.Root> {
    if (!this.root) {
      this.root = await loadProtoDefinitions();
    }
    return this.root;
  }

  /**
   * Encode CategoryTreeRequest to protobuf
   */
  static async encodeCategoryTreeRequest(request: CategoryTreeRequest): Promise<Uint8Array> {
    try {
      const root = await this.getRoot();
      const CategoryTreeRequestType = root.lookupType('catalog_messages.CategoryTreeRequest');
      
      // Create message instance
      const message = CategoryTreeRequestType.create({
        maxDepth: request.maxDepth,
        includeInactive: request.includeInactive,
        rebuildCache: request.rebuildCache
      });

      // Encode to buffer
      return CategoryTreeRequestType.encode(message).finish();
    } catch (error) {
      console.error('Failed to encode CategoryTreeRequest:', error);
      throw new Error('Failed to encode protobuf message');
    }
  }

  /**
   * Decode CategoryTreeResponse from protobuf
   */
  static async decodeCategoryTreeResponse(buffer: Uint8Array): Promise<CategoryTreeResponse> {
    try {
      const root = await this.getRoot();
      const CategoryTreeResponseType = root.lookupType('catalog_messages.CategoryTreeResponse');
      
      // Decode the buffer
      const message = CategoryTreeResponseType.decode(buffer);
      
      // Convert to plain object and return
      const plainObject = CategoryTreeResponseType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });

      return plainObject as CategoryTreeResponse;
    } catch (error) {
      console.error('Failed to decode CategoryTreeResponse:', error);
      throw new Error('Failed to decode protobuf message');
    }
  }

  /**
   * Create a default CategoryTreeRequest
   */
  static createDefaultRequest(): CategoryTreeRequest {
    return {
      maxDepth: 3,
      includeInactive: false,
      rebuildCache: false
    };
  }

  /**
   * Encode ProductGetBySlugRequest to protobuf
   */
  static async encodeProductGetBySlugRequest(request: ProductGetBySlugRequest): Promise<Uint8Array> {
    try {
      const root = await this.getRoot();
      const ProductGetBySlugRequestType = root.lookupType('catalog_messages.ProductGetBySlugRequest');
      
      // Create message instance
      const message = ProductGetBySlugRequestType.create({
        slug: request.slug
      });

      // Encode to buffer
      return ProductGetBySlugRequestType.encode(message).finish();
    } catch (error) {
      console.error('Failed to encode ProductGetBySlugRequest:', error);
      throw new Error('Failed to encode protobuf message');
    }
  }

  /**
   * Decode ProductGetBySlugResponse from protobuf
   */
  static async decodeProductGetBySlugResponse(buffer: Uint8Array): Promise<ProductGetBySlugResponse> {
    try {
      const root = await this.getRoot();
      const ProductGetBySlugResponseType = root.lookupType('catalog_messages.ProductGetBySlugResponse');
      
      // Decode the buffer
      const message = ProductGetBySlugResponseType.decode(buffer);
      
      // Convert to plain object and return
      const plainObject = ProductGetBySlugResponseType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });

      return plainObject as ProductGetBySlugResponse;
    } catch (error) {
      console.error('Failed to decode ProductGetBySlugResponse:', error);
      throw new Error('Failed to decode protobuf message');
    }
  }

  /**
   * Encode GetProductSlugsRequest to protobuf
   */
  static async encodeGetProductSlugsRequest(request: GetProductSlugsRequest): Promise<Uint8Array> {
    try {
      const root = await this.getRoot();
      const GetProductSlugsRequestType = root.lookupType('catalog_messages.GetProductSlugsRequest');
      
      const message = GetProductSlugsRequestType.create(request);
      return GetProductSlugsRequestType.encode(message).finish();
    } catch (error) {
      console.error('Failed to encode GetProductSlugsRequest:', error);
      throw new Error('Failed to encode protobuf message');
    }
  }

  /**
   * Decode GetProductSlugsResponse from protobuf
   */
  static async decodeGetProductSlugsResponse(buffer: Uint8Array): Promise<GetProductSlugsResponse> {
    try {
      const root = await this.getRoot();
      const GetProductSlugsResponseType = root.lookupType('catalog_messages.GetProductSlugsResponse');
      
      // Decode the buffer
      const message = GetProductSlugsResponseType.decode(buffer);
      
      // Convert to plain object and return
      const plainObject = GetProductSlugsResponseType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });

      return plainObject as GetProductSlugsResponse;
    } catch (error) {
      console.error('Failed to decode GetProductSlugsResponse:', error);
      throw new Error('Failed to decode protobuf message');
    }
  }

  /**
   * Encode InventoryGetAllLocationsBySkuRequest to protobuf
   */
  static async encodeInventoryGetAllLocationsBySkuRequest(requestData: {
    skus: string[];
  }): Promise<Uint8Array> {
    try {
      const root = await loadInventoryProtoDefinitions();
      const RequestType = root.lookupType('inventory_messages.InventoryGetAllLocationsBySkuRequest');
      
      const message = RequestType.create(requestData);
      return RequestType.encode(message).finish();
    } catch (error) {
      console.error('Failed to encode InventoryGetAllLocationsBySkuRequest:', error);
      throw new Error('Failed to encode protobuf message');
    }
  }

  /**
   * Decode InventoryGetAllLocationsBySkuResponse from protobuf
   */
  static async decodeInventoryGetAllLocationsBySkuResponse(buffer: Uint8Array): Promise<unknown> {
    try {
      const root = await loadInventoryProtoDefinitions();
      const ResponseType = root.lookupType('inventory_messages.InventoryGetAllLocationsBySkuResponse');
      
      // Decode the buffer
      const message = ResponseType.decode(buffer);
      
      // Convert to plain object and return
      return ResponseType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });
    } catch (error) {
      console.error('Failed to decode InventoryGetAllLocationsBySkuResponse:', error);
      throw new Error('Failed to decode protobuf message');
    }
  }

  /**
   * Encode GetBestOfferPricesRequest to protobuf
   */
  static async encodeGetBestOfferPricesRequest(request: GetBestOfferPricesRequest): Promise<Uint8Array> {
    try {
      const root = await loadPricingProtoDefinitions();
      const RequestType = root.lookupType('offer_messages.GetBestOfferPricesRequest');
      
      const message = RequestType.create(request);
      return RequestType.encode(message).finish();
    } catch (error) {
      console.error('Failed to encode GetBestOfferPricesRequest:', error);
      throw new Error('Failed to encode protobuf message');
    }
  }

  /**
   * Decode GetBestOfferPricesResponse from protobuf
   */
  static async decodeGetBestOfferPricesResponse(buffer: Uint8Array): Promise<GetBestOfferPricesResponse> {
    try {
      const root = await loadPricingProtoDefinitions();
      const ResponseType = root.lookupType('offer_messages.GetBestOfferPricesResponse');
      
      // Decode the buffer
      const message = ResponseType.decode(buffer);
      
      // Convert to plain object and return
      const plainObject = ResponseType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true
      });

      return plainObject as GetBestOfferPricesResponse;
    } catch (error) {
      console.error('Failed to decode GetBestOfferPricesResponse:', error);
      throw new Error('Failed to decode protobuf message');
    }
  }
}
