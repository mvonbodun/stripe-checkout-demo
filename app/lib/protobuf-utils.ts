/**
 * Protocol Buffer utilities for catalog service
 * Handles encoding/decoding of protobuf messages for categories and products
 */

import * as protobuf from 'protobufjs';
import path from 'path';

// Load protocol buffer definitions
let catalogRoot: protobuf.Root | null = null;
let inventoryRoot: protobuf.Root | null = null;

async function loadProtoDefinitions(): Promise<protobuf.Root> {
  if (catalogRoot) {
    return catalogRoot;
  }

  try {
    // Load the catalog.proto file (includes both category and product definitions)
    const protoPath = path.join(process.cwd(), 'proto', 'catalog', 'catalog.proto');
    catalogRoot = await protobuf.load(protoPath);
    return catalogRoot;
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
    // Load the inventory.proto file
    const protoPath = path.join(process.cwd(), 'proto', 'inventory', 'inventory.proto');
    inventoryRoot = await protobuf.load(protoPath);
    return inventoryRoot;
  } catch (error) {
    console.error('Failed to load inventory protobuf definitions:', error);
    throw new Error('Unable to load inventory protocol buffer definitions');
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
}
