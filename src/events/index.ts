/**
 * Decoupled In-Memory Event Bus & PubSub Adapter Engine.
 * @module @warborn/runtime/events
 */

import { EventEnvelope, EventId, EventTopic } from '@warborn/types/events';
import { ISO8601Timestamp } from '@warborn/types/common';

export type EventCallback<T = any> = (event: EventEnvelope<T>) => void | Promise<void>;

export class EventBus {
  private readonly listeners = new Map<string, Set<EventCallback>>();

  public subscribe<T = any>(topic: EventTopic, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)!.add(callback);

    return () => {
      this.listeners.get(topic)?.delete(callback);
    };
  }

  public async publish<T = any>(topic: EventTopic, payload: T, source = 'runtime'): Promise<EventEnvelope<T>> {
    const envelope: EventEnvelope<T> = {
      eventId: `evt_${Date.now()}` as EventId,
      topic,
      payload,
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      source,
    };

    const callbacks = this.listeners.get(topic);
    if (callbacks) {
      for (const cb of callbacks) {
        await cb(envelope);
      }
    }

    return envelope;
  }
}
