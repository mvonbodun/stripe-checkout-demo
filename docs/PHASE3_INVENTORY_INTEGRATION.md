# Phase 3: Inventory Integration Plan

## Overview
Integrate real-time inventory data from backend services to enhance product display pages (PDP) with accurate stock information and inventory-aware attribute selection.

## Current State
- ✅ Product data mapping utilities completed
- ✅ Base product and variants display working on `/p/[slug]` 
- ✅ Data flowing from backend via NATS/protobuf
- 🔄 Need: Real-time inventory data integration
- 🔄 Need: Enhanced AttributeSelector with inventory awareness

## Technical Specifications

### Backend Integration
- **Proto file**: `/proto/inventory/inventory.proto`
- **Request message**: `InventoryGetAllLocationsBySkuRequest`
- **Response message**: `InventoryGetAllLocationsBySkuResponse`
- **NATS subject**: `"inventory.get_all_locations_by_sku"`

### Data Flow
1. Product page loads with all variant SKUs
2. Single batch request to inventory service with all SKUs
3. Inventory data merged with product variant data
4. UI updates with stock status and inventory-aware selection

## Implementation Phases

### Phase 3A: Inventory Service Foundation
**Goal**: Create inventory service for batch SKU lookups

**Deliverables**:
- `InventoryService` class with batch SKU lookup
- Protobuf message handling for inventory requests/responses
- 5-minute caching layer for inventory data
- Error handling with graceful fallbacks

**Data Structures**:
```typescript
interface InventoryInfo {
  sku: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  inStock: boolean;
  locationCount: number;
}

type InventoryMap = Map<string, InventoryInfo>;
```

### Phase 3B: Product Integration  
**Goal**: Enhance product loading with inventory data

**Deliverables**:
- Enhanced `ProductService.getProductBySlug()` with inventory parameter
- Inventory data merged into product variants
- Updated product/variant interfaces
- Stock status calculation at product level

**Enhanced Interfaces**:
```typescript
interface ProductVariant {
  // ... existing fields
  inventory?: InventoryInfo;
}

interface Product {
  // ... existing fields
  hasStock: boolean; // true if any variant has stock
  totalInventory: number; // sum across all variants
}
```

### Phase 3C: AttributeSelector Enhancement
**Goal**: Make attribute selection inventory-aware

**Deliverables**:
- Enhanced selection logic considering inventory
- Visual indicators for out-of-stock attributes
- Inventory count display for selected variants
- Updated Add to Cart enablement logic

**Attribute States**:
- `selectable` - Valid combination with stock (normal styling)
- `disabled` - Invalid combination OR out of stock (greyed out, not selectable)

### Phase 3D: PDP UI Enhancements
**Goal**: Display inventory information to users

**Deliverables**:
- Stock status display below price
- Variant inventory count when unique SKU selected
- Enhanced Add to Cart button logic

**UI Elements**:
- **Stock Status**: "In Stock" (green) or "Out of Stock" (red) below price
- **Variant Inventory**: "22 in stock" below last attribute selector
- **Add to Cart**: Enabled only for complete selection + in stock

## Error Handling & Fallbacks

### Inventory Service Failures
- **Fallback**: Assume all variants in stock (current behavior)
- **User Experience**: Allow normal product interaction
- **Logging**: Log inventory service errors for monitoring

### Partial Data
- **Missing SKUs**: Mark as out of stock
- **Network Issues**: Graceful degradation to current behavior
- **Timeout**: 5-second timeout with fallback

## Performance Considerations

### Caching Strategy
- **Client-side**: 5-minute cache for inventory data
- **Batch Loading**: Single request for all product variants
- **Memory Management**: LRU cache with reasonable size limits

### Loading States
- **Initial Load**: Show skeleton loaders for inventory status
- **Attribute Selection**: Immediate visual feedback
- **Graceful Degradation**: Function without inventory if service unavailable

## Testing Strategy

### Test Cases
1. **Stock Status Display**: Verify "In Stock"/"Out of Stock" logic
2. **Attribute Selection**: Test inventory-aware selection with `izod-fitted-plaid-button-down-shirt-p000210587`
3. **Inventory Count**: Verify accurate count display for selected variants
4. **Add to Cart**: Test enablement logic with various stock scenarios
5. **Error Handling**: Test service failures and partial responses

### Example Product Testing
- **Product**: `izod-fitted-plaid-button-down-shirt-p000210587`
- **Variants**: 2 colors × 2 sizes = 4 SKUs
- **Test Scenarios**: 
  - All variants in stock
  - Some variants out of stock
  - All variants out of stock
  - Inventory service unavailable

## Future Enhancements (Not in Scope)
- Pre-fetch inventory for search results/category pages
- Real-time inventory updates via WebSocket
- Inventory integration in search index
- Location-specific inventory display

## Success Criteria
- [ ] Inventory service successfully fetches data for product variants
- [ ] Product pages show accurate stock status
- [ ] Attribute selection respects inventory availability
- [ ] Add to Cart is properly enabled/disabled based on stock
- [ ] System gracefully handles inventory service failures
- [ ] Performance remains acceptable with inventory integration

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: After Phase 3B completion
