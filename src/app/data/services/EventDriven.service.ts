// ============================================================================
// UUID UTILITY (since you're using uuidv4)
// ============================================================================
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// YOUR MESSAGE CLASS (Fixed)
// ============================================================================
export class Message {
  id: string;
  properties: Record<string, any>;
  messageId: string;

  constructor(id: string) {
    this.id = id;
    this.properties = {};
    this.messageId = generateUUID();
  }

  addData(key: string, value: any): void {
    this.properties[key] = value;
  }

  getData(key: string): any {
    return this.properties[key];
  }

  initializeFromObject = (from: Record<string, any>): void => {
    this.properties = { ...this.properties, ...from };
  };

  copyAllPropertiesOf(from: Message): void {
    Object.entries(from.properties).forEach(([key, value]) => {
      this.addData(key, value);
    });
  }

  // Helper methods para el event system
  getType(): string {
    return this.getData('type') || 'unknown';
  }

  setType(type: string): void {
    this.addData('type', type);
  }

  getPayload(): any {
    return this.getData('payload');
  }

  setPayload(payload: any): void {
    this.addData('payload', payload);
  }

  getTimestamp(): number {
    return this.getData('timestamp') || Date.now();
  }

  setTimestamp(timestamp: number): void {
    this.addData('timestamp', timestamp);
  }
}

// ============================================================================
// FIXED INTERFACES (Compatible with your Message)
// ============================================================================
interface ISubscriber {
  readonly id: string;
  receive(from: string, message: Message): void | Promise<void>;
}

interface IChannel {
  readonly topic: string;
  readonly subscriberCount: number;
  subscribe(subscriber: ISubscriber): () => boolean;
  unsubscribe(subscriber: ISubscriber): boolean;
  publish(from: string, message: Message): Promise<void>;
  clear(): void;
}

interface IEventBus {
  subscribe(topic: string, subscriber: ISubscriber): () => boolean;
  publish(from: string, topic: string, message: Message): Promise<void>;
  unsubscribe(topic: string, subscriber: ISubscriber): boolean;
  getChannel(topic: string): IChannel | null;
  getAllChannels(): ReadonlyMap<string, IChannel>;
  destroy(): void;
}

// ============================================================================
// FIXED CHANNEL IMPLEMENTATION
// ============================================================================
export class EventChannel implements IChannel {
  private readonly _subscribers = new Set<ISubscriber>();
  private readonly _topic: string;
  private _isDestroyed = false;

  constructor(topic: string) {
    if (!topic?.trim()) {
      throw new Error('Channel topic cannot be empty');
    }
    this._topic = topic.trim();
  }

  get topic(): string {
    return this._topic;
  }

  get subscriberCount(): number {
    return this._subscribers.size;
  }

  subscribe(subscriber: ISubscriber): () => boolean {
    if (this._isDestroyed) {
      throw new Error(`Channel '${this._topic}' has been destroyed`);
    }

    if (!subscriber?.id || typeof subscriber.receive !== 'function') {
      throw new Error('Invalid subscriber: must have id and receive method');
    }

    this._subscribers.add(subscriber);

    // Return unsubscribe function that returns boolean
    return (): boolean => this.unsubscribe(subscriber);
  }

  unsubscribe(subscriber: ISubscriber): boolean {
    return this._subscribers.delete(subscriber);
  }

  async publish(from: string, message: Message): Promise<void> {
    if (this._isDestroyed) {
      console.warn(`Attempting to publish to destroyed channel '${this._topic}'`);
      return;
    }

    if (this._subscribers.size === 0) {
      return; // No subscribers, early return
    }

    // Set timestamp if not set
    if (!message.getData('timestamp')) {
      message.setTimestamp(Date.now());
    }

    // Create array from Set for better performance in loops
    const subscribers = Array.from(this._subscribers);

    // Process all subscribers concurrently with error isolation
    const promises = subscribers.map(async subscriber => {
      try {
        await subscriber.receive(from, message);
      } catch (error) {
        // Log error but don't break other subscribers
        console.error(`Error in subscriber '${subscriber.id}' for topic '${this._topic}':`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  clear(): void {
    this._subscribers.clear();
  }

  destroy(): void {
    this.clear();
    this._isDestroyed = true;
  }
}

// ============================================================================
// FIXED EVENT BUS IMPLEMENTATION
// ============================================================================
export class EventBus implements IEventBus {
  private readonly _channels = new Map<string, EventChannel>();
  private readonly _metrics = {
    totalMessages: 0,
    totalSubscriptions: 0,
    errors: 0,
  };

  // Fixed: WeakMap with proper typing
  private readonly _subscriberRefs = new WeakMap<ISubscriber, Set<string>>();
  private _isDestroyed = false;

  /**
   * FIXED: Subscribe method with proper return type
   */
  subscribe(topic: string, subscriber: ISubscriber): () => boolean {
    if (this._isDestroyed) {
      throw new Error('EventBus has been destroyed');
    }

    const channel = this._getOrCreateChannel(topic);
    const unsubscribeFn = channel.subscribe(subscriber);

    // Track subscriber topics for batch cleanup
    if (!this._subscriberRefs.has(subscriber)) {
      this._subscriberRefs.set(subscriber, new Set<string>());
    }
    this._subscriberRefs.get(subscriber)!.add(topic);

    this._metrics.totalSubscriptions++;

    // Enhanced unsubscribe with cleanup - FIXED return type
    return (): boolean => {
      const success = unsubscribeFn();
      if (success) {
        const topics = this._subscriberRefs.get(subscriber);
        if (topics) {
          topics.delete(topic);
          if (topics.size === 0) {
            this._subscriberRefs.delete(subscriber);
          }
        }

        // Auto-cleanup empty channels
        if (channel.subscriberCount === 0) {
          this._cleanupChannel(topic);
        }
      }
      return success;
    };
  }

  /**
   * Publish message to topic with your Message class
   */
  async publish(from: string, topic: string, message: Message): Promise<void> {
    if (this._isDestroyed) {
      console.warn('Attempting to publish to destroyed EventBus');
      return;
    }

    const channel = this._channels.get(topic);
    if (!channel || channel.subscriberCount === 0) {
      return; // No channel or subscribers
    }

    try {
      await channel.publish(from, message);
      this._metrics.totalMessages++;
    } catch (error) {
      this._metrics.errors++;
      console.error(`Failed to publish message to topic '${topic}':`, error);
      throw error;
    }
  }

  /**
   * Manual unsubscribe (alternative to returned function)
   */
  unsubscribe(topic: string, subscriber: ISubscriber): boolean {
    const channel = this._channels.get(topic);
    if (!channel) return false;

    const success = channel.unsubscribe(subscriber);

    if (success) {
      const topics = this._subscriberRefs.get(subscriber);
      if (topics) {
        topics.delete(topic);
        if (topics.size === 0) {
          this._subscriberRefs.delete(subscriber);
        }
      }

      // Auto-cleanup empty channels
      if (channel.subscriberCount === 0) {
        this._cleanupChannel(topic);
      }
    }

    return success;
  }

  /**
   * Get specific channel (read-only access)
   */
  getChannel(topic: string): IChannel | null {
    return this._channels.get(topic) || null;
  }

  /**
   * Get all channels (read-only)
   */
  getAllChannels(): ReadonlyMap<string, IChannel> {
    return new Map(this._channels);
  }

  /**
   * Get bus metrics
   */
  getMetrics() {
    return {
      ...this._metrics,
      activeChannels: this._channels.size,
      totalSubscribers: Array.from(this._channels.values()).reduce(
        (sum, channel) => sum + channel.subscriberCount,
        0
      ),
    };
  }

  /**
   * Batch unsubscribe subscriber from all topics
   */
  unsubscribeAll(subscriber: ISubscriber): number {
    const topics = this._subscriberRefs.get(subscriber);
    if (!topics) return 0;

    let unsubscribed = 0;
    for (const topic of topics) {
      if (this.unsubscribe(topic, subscriber)) {
        unsubscribed++;
      }
    }

    return unsubscribed;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    for (const channel of this._channels.values()) {
      channel.destroy();
    }
    this._channels.clear();
    this._isDestroyed = true;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private _getOrCreateChannel(topic: string): EventChannel {
    if (!this._channels.has(topic)) {
      this._channels.set(topic, new EventChannel(topic));
    }
    return this._channels.get(topic)!;
  }

  private _cleanupChannel(topic: string): void {
    const channel = this._channels.get(topic);
    if (channel && channel.subscriberCount === 0) {
      channel.destroy();
      this._channels.delete(topic);
    }
  }
}

// ============================================================================
// FIXED SINGLETON IMPLEMENTATION
// ============================================================================
class GlobalEventBus extends EventBus {
  private static _instance: GlobalEventBus | null = null;

  // Namespace support for better organization
  private readonly _namespaces = new Map<string, EventBus>();

  static getInstance(): GlobalEventBus {
    if (!GlobalEventBus._instance) {
      GlobalEventBus._instance = new GlobalEventBus();
    }
    return GlobalEventBus._instance;
  }

  /**
   * Get or create namespaced event bus
   */
  namespace(name: string): EventBus {
    if (!this._namespaces.has(name)) {
      this._namespaces.set(name, new EventBus());
    }
    return this._namespaces.get(name)!;
  }

  /**
   * Destroy specific namespace
   */
  destroyNamespace(name: string): boolean {
    const ns = this._namespaces.get(name);
    if (ns) {
      ns.destroy();
      this._namespaces.delete(name);
      return true;
    }
    return false;
  }

  /**
   * Enhanced destroy with namespace cleanup
   */
  destroy(): void {
    for (const ns of this._namespaces.values()) {
      ns.destroy();
    }
    this._namespaces.clear();
    super.destroy();
    GlobalEventBus._instance = null;
  }
}

// ============================================================================
// FIXED DECORATOR (The main issue was here)
// ============================================================================
export function autoSubscribe(topics: string[]) {
  return function <T extends new (...args: any[]) => ISubscriber>(BaseClass: T) {
    return class extends BaseClass {
      private _unsubscribeFns: (() => boolean)[] = [];
      private _originalDestroy: (() => void) | undefined;

      constructor(...args: any[]) {
        super(...args);

        // Auto-suscripción
        this._unsubscribeFns = topics.map(topic => eventBus.subscribe(topic, this as ISubscriber));

        // Captura segura del destroy original (si existe)
        this._originalDestroy = (this as any).destroy?.bind(this);
      }
      destroy(): void {
        this._unsubscribeFns.forEach(fn => fn());
        this._unsubscribeFns = [];

        // Llamamos al destroy original solo si no es el nuestro
        if (this._originalDestroy && this._originalDestroy !== this.destroy) {
          this._originalDestroy();
        }
      }
    };
  };
}

// ============================================================================
// CONVENIENCE EXPORTS & UTILITIES
// ============================================================================

// Singleton instance
export const eventBus = GlobalEventBus.getInstance();

// Factory functions for your Message class
export const createMessage = (id: string, type?: string, payload?: any): Message => {
  const message = new Message(id);
  if (type) message.setType(type);
  if (payload !== undefined) message.setPayload(payload);
  return message;
};

// Helper for data messages
export const createDataMessage = (id: string, data: Record<string, any>): Message => {
  const message = new Message(id);
  message.initializeFromObject(data);
  return message;
};
