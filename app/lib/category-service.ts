/**
 * Category Service
 * High-level service for category operations using NATS and protobuf
 */

import { natsClient } from './nats-client';
import { 
  ProtobufUtils, 
  CategoryTreeRequest, 
  CategoryTreeResponse, 
  CategoryTreeNode 
} from './protobuf-utils';
import { CategoryTree } from '../models/category';
import { Status } from '../models/common';

export class CategoryService {
  private static instance: CategoryService | null = null;
  private cache: Map<string, { data: CategoryTree[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): CategoryService {
    if (!this.instance) {
      this.instance = new CategoryService();
    }
    return this.instance;
  }

  /**
   * Get category tree from backend service
   */
  async getCategoryTree(options: Partial<CategoryTreeRequest> = {}): Promise<CategoryTree[]> {
    const cacheKey = JSON.stringify(options);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      console.log('Returning cached category tree');
      return cached.data;
    }

    try {
      console.log('Fetching category tree from backend service...');
      
      // Create request
      const request: CategoryTreeRequest = {
        ...ProtobufUtils.createDefaultRequest(),
        ...options
      };

      // Encode request
      const requestBuffer = await ProtobufUtils.encodeCategoryTreeRequest(request);

      // Send NATS request
      const subject = process.env.NATS_SUBJECT_CATALOG_TREE || 'catalog.get_category_tree';
      const responseBuffer = await natsClient.request(subject, requestBuffer, 10000);

      // Decode response
      const response = await ProtobufUtils.decodeCategoryTreeResponse(responseBuffer);

      // Check response status
      if (response.status.code !== 0) {
        throw new Error(`Backend service error: ${response.status.message}`);
      }

      // Transform to CategoryTree format
      const categoryTree = this.transformToCategories(response.tree);

      // Cache the result
      this.cache.set(cacheKey, {
        data: categoryTree,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${categoryTree.length} top-level categories`);
      return categoryTree;

    } catch (error) {
      console.error('Failed to fetch category tree from backend:', error);
      
      // Return cached data if available, even if expired
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.warn('Returning expired cached data due to backend error');
        return cached.data;
      }
      
      throw error;
    }
  }

  /**
   * Transform CategoryTreeNode[] to CategoryTree[]
   */
  private transformToCategories(nodes: CategoryTreeNode[]): CategoryTree[] {
    return nodes.map(node => this.transformNode(node));
  }

  /**
   * Transform a single CategoryTreeNode to CategoryTree
   */
  private transformNode(node: CategoryTreeNode): CategoryTree {
    return {
      id: node.id,
      name: node.name,
      slug: node.slug,
      level: Math.min(Math.max(node.level, 1), 3) as 1 | 2 | 3, // Ensure level is 1, 2, or 3
      path: this.buildPath(node),
      active: true, // Default to active since backend doesn't provide this
      order: 0, // Default order
      status: Status.ACTIVE,
      productCount: node.productCount,
      children: node.children ? this.transformToCategories(node.children) : undefined,
      
      // Default values for fields not provided by backend
      description: `Browse our ${node.name} collection`,
      imageUrl: `https://placehold.co/300x200/e5e7eb/6b7280?text=${encodeURIComponent(node.name)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      seoTitle: `${node.name} - Shop Collection`,
      seoDescription: `Browse our ${node.name} collection. Find the latest products.`
    };
  }

  /**
   * Build category path for breadcrumbs
   */
  private buildPath(node: CategoryTreeNode, ancestors: string[] = []): string {
    const currentPath = [...ancestors, node.name];
    return currentPath.join(' > ');
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Category cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Health check - test backend connectivity
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string; details?: any }> {
    try {
      // Try to connect to NATS
      await natsClient.connect();
      
      if (!natsClient.isConnected()) {
        return {
          healthy: false,
          message: 'NATS connection failed'
        };
      }

      // Try a minimal request
      const request = ProtobufUtils.createDefaultRequest();
      const requestBuffer = await ProtobufUtils.encodeCategoryTreeRequest(request);
      
      const subject = process.env.NATS_SUBJECT_CATALOG_TREE || 'catalog.get_category_tree';
      await natsClient.request(subject, requestBuffer, 5000);

      return {
        healthy: true,
        message: 'Backend service is healthy',
        details: natsClient.getStats()
      };

    } catch (error) {
      return {
        healthy: false,
        message: `Backend service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : error }
      };
    }
  }
}

// Export singleton instance
export const categoryService = CategoryService.getInstance();
