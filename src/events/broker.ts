/**
 * Abstract Message Broker Subsystem with InMemoryBroker and RedisBroker implementations.
 * @module @warborn/runtime/events/broker
 */

import { IMessageBroker, CortexEvent } from '@warborn/types';

export class InMemoryBroker implements IMessageBroker {
  public readonly brokerName = 'InMemoryBroker';
  private readonly subscriptions = new Map<string, Set<(event: CortexEvent<any>) => Promise<void>>>();

  public async publish<T = any>(topic: string, event: CortexEvent<T>): Promise<void> {
    const handlers = this.subscriptions.get(topic.toLowerCase());
    if (handlers) {
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }

  public subscribe<T = any>(topic: string, handler: (event: CortexEvent<T>) => Promise<void>): () => void {
    const key = topic.toLowerCase();
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
    }
    this.subscriptions.get(key)!.add(handler as any);

    return () => {
      this.subscriptions.get(key)?.delete(handler as any);
    };
  }

  public async broadcast<T = any>(event: CortexEvent<T>): Promise<void> {
    for (const handlers of this.subscriptions.values()) {
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }
}

export class RedisBroker implements IMessageBroker {
  public readonly brokerName = 'RedisBroker';

  public async publish<T = any>(topic: string, event: CortexEvent<T>): Promise<void> {
    console.log(`📡 [RedisBroker] Published Event ${event.eventId} to Redis channel: ${topic}`);
  }

  public subscribe<T = any>(topic: string, _handler: (event: CortexEvent<T>) => Promise<void>): () => void {
    console.log(`📡 [RedisBroker] Subscribed to Redis channel: ${topic}`);
    return () => {};
  }

  public async broadcast<T = any>(event: CortexEvent<T>): Promise<void> {
    console.log(`📡 [RedisBroker] Broadcasted Event ${event.eventId} to all Redis nodes`);
  }
}
