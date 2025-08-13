# Product Backend Service Integration Plan

## Overview
Replace hardcoded product data with backend service integration using NATS/Protocol Buffers, following the existing category service pattern.

## Current State
- **API Route**: `/api/products/slug/[slug]` uses hardcoded product models
- **Product Pages**: `/p/[slug]` with static generation using hardcoded data
- **Proto Support**: `ProductGetBySlugRequest` and `ProductGetBySlugResponse` available in catalog.proto
- **NATS Client**: Existing setup from category service integration

## Implementation Phases

### ✅ Phase 1: Service Layer & API Integration
**Status**: ✅ COMPLETED
**Target**: Create product service and update API route

**Tasks**:
- [x] Create `app/lib/product-service.ts` with NATS integration
- [x] Update `app/api/products/slug/[slug]/route.ts` to use backend service
- [x] Add error handling and fallback mechanisms
- [x] Test API endpoint with backend service

**Completed Components**:
```typescript
// app/lib/product-service.ts
- getProductBySlug(slug: string, includeVariants?: boolean) ✅
- Error handling with fallback to hardcoded data ✅
- NATS subject: "catalog.get_product_by_slug" ✅
- Data transformation from proto to frontend models ✅

// app/lib/protobuf-utils.ts
- Extended with product message encoding/decoding ✅
- ProductGetBySlugRequest/Response support ✅

// app/api/products/slug/[slug]/route.ts
- Updated to use productService instead of hardcoded models ✅
- Maintains backward compatibility ✅
```

**Testing Results**:
- ✅ API endpoint responds correctly: `GET /api/products/slug/samsung-oled-4k-smart-tv`
- ✅ Fallback to hardcoded data works when backend unavailable
- ✅ includeVariants parameter functions properly
- ✅ Error handling and logging implemented

### 🚧 Phase 2: Static Generation Migration
**Status**: 🚧 READY TO START
**Target**: Update product pages to use backend service

**Tasks**:
- [ ] Update `app/p/[slug]/layout.tsx` - metadata generation
- [ ] Update `app/p/[slug]/page.tsx` - product data fetching
- [ ] Migrate `generateStaticParams()` to use backend service
- [ ] Implement ISR (Incremental Static Regeneration) strategy
- [ ] Test static generation and revalidation

**Implementation Notes**:
- Need to handle async product service calls in generateStaticParams()
- Must maintain fallback strategy for build-time failures
- Consider caching strategy for static generation performance

### Phase 3: Data Mapping & Compatibility
**Status**: ⏳ PENDING
**Target**: Ensure seamless data transformation

**Tasks**:
- [ ] Create data mapping utilities for proto ↔ frontend models
- [ ] Handle missing fields and default values
- [ ] Validate variant data structure compatibility
- [ ] Update TypeScript types if needed
- [ ] Test with real backend data

### Phase 4: Performance & Caching
**Status**: ⏳ PENDING
**Target**: Optimize performance and caching strategies

**Tasks**:
- [ ] Implement proper caching strategies
- [ ] Add performance monitoring
- [ ] Optimize static generation timing
- [ ] Configure ISR revalidation intervals
- [ ] Load testing with backend service

### Phase 5: Production Readiness
**Status**: ⏳ PENDING
**Target**: Production deployment and monitoring

**Tasks**:
- [ ] Environment configuration management
- [ ] Error monitoring and alerting
- [ ] Gradual rollout strategy
- [ ] Remove hardcoded data dependencies
- [ ] Documentation updates

## Technical Architecture

### Service Communication
```
Frontend API Route → NATS Client → Backend Service
                                     ↓
                  Proto Messages (ProductGetBySlugRequest/Response)
```

### Static Generation Flow
```
Build Time → generateStaticParams() → Backend Service → Static Pages
Runtime → ISR Revalidation → Backend Service → Updated Pages
```

## Risk Mitigation
- **Fallback Strategy**: Maintain hardcoded data as fallback during transition
- **Gradual Migration**: Implement feature flags for controlled rollout
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: Monitor and optimize service call performance

## Success Criteria
- [ ] All product pages load correctly with backend data
- [ ] Static generation works reliably at build time
- [ ] API endpoints respond within acceptable time limits
- [ ] Error scenarios are handled gracefully
- [ ] No regression in site functionality

## Dependencies
- Backend product service must be available and stable
- NATS messaging system operational
- Protocol buffer definitions up to date
- Frontend models compatible with backend data structure

---

**Last Updated**: August 13, 2025
**Current Phase**: Phase 2 - Static Generation Migration
**Phase 1 Completion**: ✅ August 13, 2025
