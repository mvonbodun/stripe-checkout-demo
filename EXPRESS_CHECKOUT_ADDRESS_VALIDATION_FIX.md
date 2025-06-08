# Express Checkout Address Validation Fix

## Problem
The Express Checkout component was receiving shipping address change events from Stripe that contained incomplete address data, specifically missing the required `line1` field. This caused 400 errors when the tax calculation API was called because the API requires `line1` for all addresses.

## Root Cause
The original validation in `handleShippingAddressChange` only checked for `postal_code`:

```typescript
if (!shippingAddress || !shippingAddress.postal_code) {
  console.log('⚠️ Incomplete shipping address, skipping processing');
  return;
}
```

This didn't catch cases where `line1` or `country` were missing, which are required by the tax calculation API.

## Solution
Enhanced the address validation to check for all required fields before attempting tax calculation:

```typescript
// Check for required fields
const missingFields = [];
if (!shippingAddress.line1) missingFields.push('line1');
if (!shippingAddress.country) missingFields.push('country');

// For US addresses, postal code is required by Stripe Tax API
if (shippingAddress.country === 'US' && !shippingAddress.postal_code) {
  missingFields.push('postal_code');
}

if (missingFields.length > 0) {
  console.log(`⚠️ Incomplete shipping address, missing required fields: ${missingFields.join(', ')}. Skipping processing.`);
  console.log('📍 Received address:', shippingAddress);
  event.reject();
  return;
}
```

## Key Changes

### 1. Enhanced Validation
- Check for `line1` (required by tax API)
- Check for `country` (required by tax API)  
- Check for `postal_code` only for US addresses (Stripe requirement)
- Proper error messaging showing which fields are missing

### 2. Improved Error Handling
- Call `event.reject()` when validation fails to properly notify Stripe
- Added detailed logging of the received address data for debugging
- Enhanced catch block to identify tax calculation errors specifically

### 3. Better Debugging
- Log the complete address object received from Stripe
- Identify which specific fields are missing
- Distinguish between different types of errors

## Testing
The fix ensures that:
- ✅ Complete addresses pass validation and proceed to tax calculation
- ❌ Addresses missing `line1` are rejected before API call
- ❌ Addresses missing `country` are rejected before API call  
- ❌ US addresses missing `postal_code` are rejected before API call
- ✅ Non-US addresses without `postal_code` are allowed (not required)

This prevents the 400 "Address line 1 is required" error by catching incomplete addresses at the Express Checkout level before they reach the tax calculation API.
