# SearchSort Component Environment Configuration Update

## Summary
Updated the SearchSort component to use individual environment variables for each Algolia index instead of dynamically generated names.

## Changes Made

### **File**: `/app/components/search/SearchSort.tsx`

#### Before
```tsx
items={[
  { label: 'Featured', value: 'test_vtex_query_suggestions' },
  { label: 'Price: Low to High', value: 'test_vtex_query_suggestions_price_asc' },
  { label: 'Price: High to Low', value: 'test_vtex_query_suggestions_price_desc' },
  { label: 'Name: A to Z', value: 'test_vtex_query_suggestions_name_asc' },
  { label: 'Name: Z to A', value: 'test_vtex_query_suggestions_name_desc' },
  { label: 'Newest First', value: 'test_vtex_query_suggestions_created_desc' }
]}
```

#### After
```tsx
// Get individual index names from environment variables
const featuredIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index';
const priceAscIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC || 'stripe_demo_index_price_asc';
const priceDescIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC || 'stripe_demo_index_price_desc';
const nameAscIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC || 'stripe_demo_index_name_asc';
const nameDescIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC || 'stripe_demo_index_name_desc';
const createdDescIndex = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC || 'stripe_demo_index_created_desc';

items={[
  { label: 'Featured', value: featuredIndex },
  { label: 'Price: Low to High', value: priceAscIndex },
  { label: 'Price: High to Low', value: priceDescIndex },
  { label: 'Name: A to Z', value: nameAscIndex },
  { label: 'Name: Z to A', value: nameDescIndex },
  { label: 'Newest First', value: createdDescIndex }
]}
```

### **File**: `/.env.local`

#### Added Environment Variables
```bash
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=stripe_demo_index
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC=stripe_demo_index_price_asc
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC=stripe_demo_index_price_desc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC=stripe_demo_index_name_asc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC=stripe_demo_index_name_desc
NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC=stripe_demo_index_created_desc
```

## Benefits

### 1. Unique Environment Variables
- Each sort option has its own dedicated environment variable
- Allows for complete flexibility in index naming
- Prevents naming convention conflicts

### 2. Individual Control
- Each index can be configured independently
- Supports different naming schemes per environment
- Easy to disable specific sort options by changing the environment variable

### 3. Fallback Protection
- Each variable includes a sensible fallback value
- Prevents application crashes due to missing configuration
- Maintains functionality even with incomplete environment setup

### 4. Maximum Flexibility
- Can point to completely different index names if needed
- Supports complex index strategies (e.g., separate indices for different data sets)
- Easy to manage across multiple environments

## Current Index Names Configuration

Based on current environment variables:

| Sort Option | Environment Variable | Index Name |
|-------------|---------------------|------------|
| **Featured** | `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | `stripe_demo_index` |
| **Price: Low to High** | `NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC` | `stripe_demo_index_price_asc` |
| **Price: High to Low** | `NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC` | `stripe_demo_index_price_desc` |
| **Name: A to Z** | `NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC` | `stripe_demo_index_name_asc` |
| **Name: Z to A** | `NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC` | `stripe_demo_index_name_desc` |
| **Newest First** | `NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC` | `stripe_demo_index_created_desc` |

## Required Algolia Configuration

### Primary Index
- **Name**: `stripe_demo_index`
- **Purpose**: Main search index with default relevance sorting
- **Environment Variable**: `NEXT_PUBLIC_ALGOLIA_INDEX_NAME`

### Replica Indices (Need to be created)
These replica indices need to be created in Algolia for the sort functionality to work:

1. **`stripe_demo_index_price_asc`** - Sort by price ascending
   - Environment Variable: `NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC`
   - Ranking: `variants.price.amount` (ascending)

2. **`stripe_demo_index_price_desc`** - Sort by price descending  
   - Environment Variable: `NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC`
   - Ranking: `variants.price.amount` (descending)

3. **`stripe_demo_index_name_asc`** - Sort by name ascending
   - Environment Variable: `NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC`
   - Ranking: `name` (ascending)

4. **`stripe_demo_index_name_desc`** - Sort by name descending
   - Environment Variable: `NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC`
   - Ranking: `name` (descending)

5. **`stripe_demo_index_created_desc`** - Sort by creation date descending
   - Environment Variable: `NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC`
   - Ranking: `created_at` or timestamp field (descending)

## Next Steps

### 1. Create Replica Indices
Create the replica indices in Algolia dashboard or via API with appropriate sorting configurations.

### 2. Configure Sorting Attributes
Each replica index needs proper ranking criteria based on the table above.

### 3. Test Sort Functionality
Once replicas are created, test each sort option to ensure proper functionality.

## Environment Configuration Examples

### Current Setup (.env.local)
```bash
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=stripe_demo_index
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC=stripe_demo_index_price_asc
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC=stripe_demo_index_price_desc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC=stripe_demo_index_name_asc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC=stripe_demo_index_name_desc
NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC=stripe_demo_index_created_desc
```

### Development Environment Example
```bash
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=stripe_demo_index_dev
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC=stripe_demo_index_dev_price_asc
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC=stripe_demo_index_dev_price_desc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC=stripe_demo_index_dev_name_asc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC=stripe_demo_index_dev_name_desc
NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC=stripe_demo_index_dev_created_desc
```

### Production Environment Example
```bash
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=stripe_demo_index_prod
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_ASC=stripe_demo_index_prod_price_asc
NEXT_PUBLIC_ALGOLIA_INDEX_PRICE_DESC=stripe_demo_index_prod_price_desc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_ASC=stripe_demo_index_prod_name_asc
NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DESC=stripe_demo_index_prod_name_desc
NEXT_PUBLIC_ALGOLIA_INDEX_CREATED_DESC=stripe_demo_index_prod_created_desc
```

---
**Status: Complete** ✅
**Date: July 29, 2025**
**Impact**: Sort component now uses individual environment variables for maximum flexibility
