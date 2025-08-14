/**
 * NATS Client Service
 * Manages NATS connections and request-response patterns
 */

import { connect, NatsConnection, StringCodec, RequestOptions } from 'nats';

export class NatsClient {
  private static instance: NatsClient | null = null;
  private connection: NatsConnection | null = null;
  private readonly codec = StringCodec();
  private isConnecting = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): NatsClient {
    if (!this.instance) {
      this.instance = new NatsClient();
    }
    return this.instance;
  }

  /**
   * Connect to NATS server
   */
  async connect(): Promise<void> {
    if (this.connection && !this.connection.isClosed()) {
      return; // Already connected
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      while (this.isConnecting && !this.connection) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isConnecting = true;

    try {
      const serverUrl = process.env.NATS_SERVER_URL || 'nats://0.0.0.0:4222';
      
      console.log(`Connecting to NATS server: ${serverUrl}`);
      
      this.connection = await connect({
        servers: [serverUrl],
        timeout: 5000, // 5 second connection timeout
        reconnectTimeWait: 2000, // 2 seconds between reconnect attempts
        maxReconnectAttempts: 5,
        pingInterval: 30000, // 30 seconds
        maxPingOut: 3
      });

      console.log('Successfully connected to NATS');

      // Handle connection events
      this.setupEventHandlers();

    } catch (error) {
      console.error('Failed to connect to NATS:', error);
      throw new Error(`NATS connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Setup connection event handlers
   */
  private setupEventHandlers(): void {
    if (!this.connection) return;

    (async () => {
      // Handle connection close
      for await (const status of this.connection!.status()) {
        console.log(`NATS connection status: ${status.type}`);
        
        if (status.type === 'disconnect') {
          console.warn('NATS connection lost');
        } else if (status.type === 'reconnect') {
          console.log('NATS connection restored');
        }
      }
    })();
  }

  /**
   * Send request and wait for response
   */
  async request(subject: string, data: Uint8Array, timeout: number = 10000): Promise<Uint8Array> {
    await this.connect();

    if (!this.connection || this.connection.isClosed()) {
      throw new Error('NATS connection is not available');
    }

    try {
      const options: RequestOptions = {
        timeout: timeout
      };

      console.log(`Sending NATS request to subject: ${subject}`);
      
      const response = await this.connection.request(subject, data, options);
      
      console.log(`Received NATS response from subject: ${subject}`);
      
      return response.data;
    } catch (error) {
      console.error(`NATS request failed for subject ${subject}:`, error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error(`Request timeout for subject: ${subject}`);
        } else if (error.message.includes('no responders')) {
          throw new Error(`No responders available for subject: ${subject}`);
        }
      }
      
      throw new Error(`NATS request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    if (this.connection && !this.connection.isClosed()) {
      console.log('Closing NATS connection');
      await this.connection.close();
      this.connection = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection !== null && !this.connection.isClosed();
  }

  /**
   * Get connection statistics
   */
  getStats(): { connected: boolean; stats?: unknown; pendingRequests?: number } {
    if (!this.connection) {
      return { connected: false };
    }

    return {
      connected: !this.connection.isClosed(),
      stats: this.connection.stats()
    };
  }
}

// Export singleton instance
export const natsClient = NatsClient.getInstance();
