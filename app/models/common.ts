// Common types and utilities shared across models

export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOFields {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface MediaItem {
  id: string;
  url: string;
  altText?: string;
  order: number;
  type: 'image' | 'video';
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'in' | 'cm' | 'mm';
}

export interface Weight {
  value: number;
  unit: 'lb' | 'kg' | 'g' | 'oz';
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
  DRAFT = 'draft'
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Specification {
  name: string;
  value: string;
  group?: string;
  order?: number;
}

// Utility functions
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Tax code utilities
export const DEFAULT_TAX_CODE = 'txcd_99999999';

/**
 * Validates and returns a safe tax code for Stripe
 * @param taxCode - The tax code to validate
 * @returns A valid Stripe tax code
 */
export function getValidTaxCode(taxCode?: string): string {
  // For now, we use the default tax code since we're using mock data
  // In a real implementation, you would validate against Stripe's tax category list
  // See: https://stripe.com/docs/tax/tax-categories
  return taxCode && taxCode.startsWith('txcd_') ? taxCode : DEFAULT_TAX_CODE;
}

/**
 * Common tax codes used in the application
 * These should match Stripe's official tax category codes
 */
export const TAX_CODES = {
  GENERAL: 'txcd_99999999', // General - Most physical goods
  DIGITAL: 'txcd_10000000', // Digital products and services (if needed)
  CLOTHING: 'txcd_99999999', // Using general for clothing
  ELECTRONICS: 'txcd_99999999', // Using general for electronics
} as const;
