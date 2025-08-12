/**
 * Protocol Buffer utilities for category service
 * Handles encoding/decoding of protobuf messages
 */

import * as protobuf from 'protobufjs';
import path from 'path';

// Load protocol buffer definitions
let categoryRoot: protobuf.Root | null = null;

async function loadProtoDefinitions(): Promise<protobuf.Root> {
  if (categoryRoot) {
    return categoryRoot;
  }

  try {
    // Load the category.proto file
    const protoPath = path.join(process.cwd(), 'proto', 'category.proto');
    categoryRoot = await protobuf.load(protoPath);
    return categoryRoot;
  } catch (error) {
    console.error('Failed to load protobuf definitions:', error);
    throw new Error('Unable to load protocol buffer definitions');
  }
}

// TypeScript interfaces matching protobuf messages
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

export interface Status {
  code: number;
  message: string;
  details?: any[];
}

export interface CategoryTreeResponse {
  tree: CategoryTreeNode[];
  status: Status;
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
}
