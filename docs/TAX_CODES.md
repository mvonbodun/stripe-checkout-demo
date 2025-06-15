# Tax Code Configuration

## Overview
This document explains how tax codes are configured in the ecommerce catalog system for Stripe Tax integration.

## Current Setup
All products currently use the Stripe tax code `txcd_99999999` which is the general tax category for most physical goods.

## Tax Code Utilities
The system includes utilities in `app/models/common.ts` for handling tax codes:

- `DEFAULT_TAX_CODE`: The default tax code used across the application
- `getValidTaxCode(taxCode?: string)`: Validates and returns a safe tax code
- `TAX_CODES`: Object containing common tax code constants

## Product Integration
Products store their tax code in the `taxCode` field of the Product interface. When adding items to cart, the system uses `getValidTaxCode()` to ensure valid tax codes are used.

## Stripe Tax Categories
For production use, you should map your products to appropriate Stripe tax categories. See the official documentation:
https://stripe.com/docs/tax/tax-categories

## Common Tax Codes
- `txcd_99999999` - General (Most physical goods)
- `txcd_10000000` - Digital products and services

## Error Handling
The system gracefully handles invalid tax codes by falling back to the default general tax code, preventing checkout errors.

## Future Enhancements
Consider implementing:
1. Category-specific tax code mapping
2. Region-specific tax code handling
3. Tax code validation against Stripe's API
4. Admin interface for tax code management
