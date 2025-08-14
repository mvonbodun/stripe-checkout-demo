'use client';

import aa from 'search-insights';

// Initialize Algolia Insights
export function initializeAnalytics() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
  
  if (!appId || !apiKey) {
    console.warn('Algolia Analytics: Missing credentials, analytics disabled');
    return false;
  }
  
  try {
    aa('init', {
      appId,
      apiKey,
    });
    
    console.info('Algolia Analytics initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Algolia Analytics:', error);
    return false;
  }
}

// Generate unique user token for analytics
export function getUserToken(): string {
  // Check if user token exists in localStorage
  let userToken = localStorage.getItem('algolia_user_token');
  
  if (!userToken) {
    // Generate a new user token
    userToken = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('algolia_user_token', userToken);
  }
  
  return userToken;
}

// Analytics event types
export enum AnalyticsEventType {
  // Click events
  CLICK = 'click',
  
  // Conversion events  
  VIEW = 'view',
  CONVERSION = 'conversion',
  
  // Custom events
  ADD_TO_CART = 'addToCart',
  PURCHASE = 'purchase',
  SEARCH_NO_RESULTS = 'searchNoResults',
}

// Event data interfaces
export interface SearchClickEvent {
  objectID: string;
  position: number;
  queryID: string;
  eventName?: string;
}

export interface SearchConversionEvent {
  objectID: string;
  queryID: string;
  eventName?: string;
}

export interface SearchViewEvent {
  objectID: string;
  position: number;
  queryID?: string;
  eventName?: string;
}

export interface AddToCartEvent {
  objectID: string;
  queryID?: string;
  eventName?: string;
  value?: number;
  currency?: string;
  quantity?: number;
}

export interface PurchaseEvent {
  objectID: string;
  queryID?: string;
  eventName?: string;
  value?: number;
  currency?: string;
  quantity?: number;
}

// Analytics service class
export class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized: boolean = false;
  private userToken: string = '';

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public init(): boolean {
    if (this.initialized) return true;
    
    this.initialized = initializeAnalytics();
    if (this.initialized) {
      this.userToken = getUserToken();
      // Set user token for all subsequent events
      aa('setUserToken', this.userToken);
    }
    
    return this.initialized;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getUserToken(): string {
    return this.userToken;
  }

  // Click tracking
  public trackClick(event: SearchClickEvent): void {
    if (!this.initialized) {
      console.warn('Analytics not initialized, skipping click event');
      return;
    }

    try {
      aa('clickedObjectIDsAfterSearch', {
        userToken: this.userToken,
        index: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index',
        eventName: event.eventName || 'Product Clicked',
        queryID: event.queryID,
        objectIDs: [event.objectID],
        positions: [event.position],
      });
      
      console.debug('Click event tracked:', event);
    } catch (error) {
      console.error('Failed to track click event:', error);
    }
  }

  // View tracking
  public trackView(events: SearchViewEvent[]): void {
    if (!this.initialized) {
      console.warn('Analytics not initialized, skipping view event');
      return;
    }

    try {
      aa('viewedObjectIDs', {
        userToken: this.userToken,
        index: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index',
        eventName: 'Products Viewed',
        objectIDs: events.map(e => e.objectID),
      });
      
      console.debug('View events tracked:', events);
    } catch (error) {
      console.error('Failed to track view events:', error);
    }
  }

  // Conversion tracking
  public trackConversion(event: SearchConversionEvent): void {
    if (!this.initialized) {
      console.warn('Analytics not initialized, skipping conversion event');
      return;
    }

    try {
      aa('convertedObjectIDsAfterSearch', {
        userToken: this.userToken,
        index: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index',
        eventName: event.eventName || 'Product Converted',
        queryID: event.queryID,
        objectIDs: [event.objectID],
      });
      
      console.debug('Conversion event tracked:', event);
    } catch (error) {
      console.error('Failed to track conversion event:', error);
    }
  }

  // Add to cart tracking
  public trackAddToCart(event: AddToCartEvent): void {
    if (!this.initialized) {
      console.warn('Analytics not initialized, skipping add to cart event');
      return;
    }

    try {
      const eventData: Record<string, unknown> = {
        userToken: this.userToken,
        index: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index',
        eventName: event.eventName || 'Product Added to Cart',
        objectIDs: [event.objectID],
      };

      // Add query ID if available (for search-related add to cart)
      if (event.queryID) {
        eventData.queryID = event.queryID;
      }

      // Add value tracking if provided
      if (event.value !== undefined) {
        eventData.value = event.value;
        eventData.currency = event.currency || 'USD';
      }

      aa('convertedObjectIDs', eventData);
      
      console.debug('Add to cart event tracked:', event);
    } catch (error) {
      console.error('Failed to track add to cart event:', error);
    }
  }

  // Purchase tracking
  public trackPurchase(event: PurchaseEvent): void {
    if (!this.initialized) {
      console.warn('Analytics not initialized, skipping purchase event');
      return;
    }

    try {
      const eventData: Record<string, unknown> = {
        userToken: this.userToken,
        index: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index',
        eventName: event.eventName || 'Product Purchased',
        objectIDs: [event.objectID],
      };

      // Add query ID if available (for search-related purchases)
      if (event.queryID) {
        eventData.queryID = event.queryID;
      }

      // Add value tracking
      if (event.value !== undefined) {
        eventData.value = event.value;
        eventData.currency = event.currency || 'USD';
      }

      aa('convertedObjectIDs', eventData);
      
      console.debug('Purchase event tracked:', event);
    } catch (error) {
      console.error('Failed to track purchase event:', error);
    }
  }

  // Custom event tracking
  public trackCustomEvent(eventType: string, data: Record<string, unknown>): void {
    if (!this.initialized) {
      console.warn('Analytics not initialized, skipping custom event');
      return;
    }

    try {
      const eventData: Record<string, unknown> = {
        userToken: this.userToken,
        index: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'stripe_demo_index',
        eventName: eventType,
        ...data,
      };

      aa('sendEvents', [eventData as unknown as import('search-insights').InsightsEvent]);
      
      console.debug('Custom event tracked:', { eventType, data });
    } catch (error) {
      console.error('Failed to track custom event:', error);
    }
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
