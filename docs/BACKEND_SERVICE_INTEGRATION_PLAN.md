# Backend Service Integration for Category Tree

## Overview
Replace the mock category data with real category tree data from a backend service using NATS messaging and Protocol Buffers.

## Current State
- Categories are currently fetched from `/api/catalog-categories?tree=true`
- API route returns mock data from `app/models/category.ts`
- Frontend uses `categories-context.tsx` to manage state
- `HeaderCategoriesNavigation.tsx` renders the category tree

## Target Architecture
- NATS messaging for backend communication
- Protocol Buffers for message serialization
- Subject: `catalog.get_category_tree`
- Server: `0.0.0.0:4222`

## Implementation Plan

### Phase 1: Dependencies & Setup ✅

#### Install Required Packages
```bash
npm install nats protobufjs
npm install --save-dev @types/node
```

#### Environment Variables
Add to `.env.local`:
```env
NATS_SERVER_URL=nats://0.0.0.0:4222
NATS_SUBJECT_CATALOG_TREE=catalog.get_category_tree
```

### Phase 2: Protocol Buffer Setup ✅

#### Generate TypeScript Definitions
- Use `protobufjs` to generate TypeScript interfaces from existing `.proto` files
- Focus on `CategoryTreeRequest`, `CategoryTreeResponse`, and `CategoryTreeNode` messages
- Create utility functions for encoding/decoding protobuf messages

#### Type Mapping
Map protobuf types to existing TypeScript interfaces:
```typescript
// Protobuf: CategoryTreeNode
{
  id: string;
  name: string;
  slug: string;
  level: number;
  product_count: number;
  children: CategoryTreeNode[];
}

// Current: CategoryTree
{
  id: string;
  name: string;
  slug: string;
  level: 1 | 2 | 3;
  children?: CategoryTree[];
  // ... other fields
}
```

### Phase 3: NATS Client Implementation ✅

#### Create NATS Service
- Implement singleton NATS client service (`app/lib/nats-client.ts`)
- Handle connection management, reconnection logic
- Implement request-response pattern for category tree fetching
- Add proper error handling and timeouts

#### Category Service Layer
- Create `app/lib/category-service.ts` that wraps NATS communication
- Implement `getCategoryTree()` function that:
  - Creates `CategoryTreeRequest` protobuf message
  - Sends request via NATS to `catalog.get_category_tree` subject
  - Handles `CategoryTreeResponse` and maps to TypeScript interfaces
  - Implements caching strategy for performance

### Phase 4: API Route Updates ✅ COMPLETED

#### Update `/api/catalog-categories/route.ts` ✅
Replace line 38 area where `getCategoryTree()` is called:
- ✅ Remove dependency on mock data
- ✅ Integrate with new category service
- ✅ Handle the `tree=true` query parameter by calling backend service
- ✅ Map response to match existing API contract

#### Error Handling & Fallbacks ✅
- ✅ Implement graceful degradation if backend service is unavailable
- ✅ Add proper HTTP status codes and error messages
- ✅ Consider fallback to cached data or mock data during development

#### Health Check Endpoint ✅
- ✅ Added `/api/catalog-categories?health=true` endpoint for backend service monitoring
- ✅ Returns connection status and NATS statistics

#### Testing Results ✅
- ✅ Backend service successfully fetching data from NATS
- ✅ Protocol buffer encoding/decoding working correctly
- ✅ Data transformation from CategoryTreeNode to CategoryTree working
- ✅ Frontend HeaderCategoriesNavigation rendering backend data
- ✅ Caching mechanism operational (22ms response time after initial 902ms)
- ✅ Health check confirms NATS connectivity and statistics

### Phase 5: Data Structure Mapping (Pending Review)

#### Response Transformation
Transform `CategoryTreeResponse` to match current `CategoryTree[]` structure

#### Additional Field Handling
- Handle missing fields in protobuf response (description, imageUrl, etc.)
- Provide sensible defaults for fields not returned by backend
- Maintain backward compatibility with existing components

### Phase 6: Request Parameter Handling (Pending Review)

#### CategoryTreeRequest Configuration
Configure the protobuf request based on query parameters:
- `max_depth`: Default to 3 for full tree, configurable via query param
- `include_inactive`: Default to false, expose via query param if needed
- `rebuild_cache`: For admin/debug purposes, expose via query param

### Phase 7: Caching Strategy (Pending Review)

#### Server-Side Caching
- Implement Redis or in-memory caching for category tree responses
- Cache TTL configuration via environment variables
- Cache invalidation strategy

### Phase 8: Testing & Development (Pending Review)

#### Development Mode
- Provide environment flag to switch between backend service and mock data
- Ensure development continues to work without backend service running

## Technical Details

### NATS Configuration
- Server URL: `0.0.0.0:4222`
- Subject: `catalog.get_category_tree`
- Request-Response pattern with timeout

### Protocol Buffer Messages

#### CategoryTreeRequest
```protobuf
message CategoryTreeRequest {
    optional int32 max_depth = 1;
    optional bool include_inactive = 2;
    optional bool rebuild_cache = 3;
}
```

#### CategoryTreeResponse
```protobuf
message CategoryTreeResponse {
    repeated CategoryTreeNode tree = 1;
    Status status = 2;
}
```

#### CategoryTreeNode
```protobuf
message CategoryTreeNode {
    string id = 1;
    string name = 2;
    string slug = 3;
    int32 level = 4;
    int32 product_count = 5;
    repeated CategoryTreeNode children = 6;
}
```

### File Structure
```
app/
├── lib/
│   ├── nats-client.ts          # NATS connection management
│   ├── category-service.ts     # Category business logic
│   └── protobuf/              # Generated protobuf types
│       ├── category.ts
│       └── status.ts
├── api/
│   └── catalog-categories/
│       └── route.ts           # Updated API route
└── categories-context.tsx     # No changes needed
```

## Success Criteria
1. HeaderCategoriesNavigation component renders backend data
2. Graceful fallback when backend is unavailable
3. Performance comparable to mock data implementation
4. Proper error handling and logging
5. Backward compatibility maintained

## Dependencies
- `nats`: NATS client library
- `protobufjs`: Protocol Buffers for JavaScript
- Backend service running on `0.0.0.0:4222`

## Risk Mitigation
- Fallback to mock data if backend unavailable
- Timeout handling for NATS requests
- Caching to reduce backend load
- Environment flags for development mode
